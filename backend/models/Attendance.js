const connection = require("../db");
const Event = require("./Event");

// get all attendance
exports.getAllAttendance = async () => {
  try {
    const events = await Event.getAllEvents();

    // Dynamically create the SELECT columns for each event
    let selectColumns = events
      .map(
        (e) =>
          `MAX(CASE WHEN e.eventId = ${e.eventId} THEN r.attended ELSE NULL END) AS \`${e.eventName +"("+e.eventId+")" }\``
      )
      .join(", ");

    // Query to get attendance information
    let query = `
      SELECT 
        s.student_id, 
        s.clg_id,
        s.first_name,
        s.middle_name,
        s.last_name,
        ${selectColumns}
      FROM tpo_event_registrations r
      JOIN tpo_student_details s ON r.student_id = s.student_id
      JOIN tpo_events e ON r.event_id = e.eventId
      GROUP BY s.student_id, s.clg_id;
    `;

    const [result] = await connection.query(query);

    // Insert or update attendance records in attendance_records table
    for (const student of result) {
      const {
        student_id,
        clg_id,
        first_name,
        middle_name,
        last_name,
        ...events
      } = student;

      // Add event columns dynamically if not exist
      for (const eventName in events) {
        await addEventColumnIfNotExists(eventName);
      }

      // Check if student already exists in attendance_records
      const checkQuery = `
        SELECT COUNT(*) AS count FROM attendance_records WHERE student_id = ?;
      `;
      const [checkResult] = await connection.query(checkQuery, [student_id]);

      // Prepare the dynamic event columns and values
      const eventColumns = Object.keys(events).map((event) => `\`${event}\``).join(", ");
      const eventValues = Object.values(events);

      if (checkResult[0].count > 0) {
        // Prepare event columns and values for the SET clause
        const eventSetClause = Object.keys(events).map(event => `\`${event}\` = ?`).join(", ");

        // Update existing record
        const updateQuery = `
          UPDATE attendance_records
          SET clg_id = ?, first_name = ?, middle_name = ?, last_name = ?, ${eventSetClause}
          WHERE student_id = ?;
        `;
        await connection.query(updateQuery, [
          clg_id,
          first_name,
          middle_name,
          last_name,
          ...eventValues,
          student_id,
        ]);
      } else {
        // Insert new record
        const insertQuery = `
          INSERT INTO attendance_records (student_id, clg_id, first_name, middle_name, last_name, ${eventColumns})
          VALUES (?, ?, ?, ?, ?, ${new Array(eventValues.length).fill("?").join(", ")});
        `;
        await connection.query(insertQuery, [
          student_id,
          clg_id,
          first_name,
          middle_name,
          last_name,
          ...eventValues,
        ]);
      }
    }

    const [newResult] = await connection.query("SELECT * FROM attendance_records")
    // console.log(newResult);
    // Transform the result for returning
    const formattedResult = newResult.map((student) => {
      const {
        student_id,
        clg_id,
        first_name,
        middle_name,
        last_name,
        ...events
      } = student;

      return {
        student_id,
        clg_id,
        first_name,
        middle_name,
        last_name,
        events: events,
      };
    });

    return formattedResult;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Helper function to add event column dynamically if it doesn't exist
async function addEventColumnIfNotExists(eventName) {
  try {
    const columnExistsQuery = `
      SELECT COUNT(*) AS count
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'attendance_records' 
      AND COLUMN_NAME = ?;
    `;
    const [columnExists] = await connection.query(columnExistsQuery, [eventName]);

    if (columnExists[0].count === 0) {
      // Add the column for the new event
      const addColumnQuery = `
        ALTER TABLE attendance_records
        ADD COLUMN \`${eventName}\` BOOLEAN DEFAULT NULL;
      `;
      await connection.query(addColumnQuery);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
