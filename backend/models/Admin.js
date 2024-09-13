const connection = require("../db");
const Event = require("./Event");
exports.getAllRegistrations = async (eventId) => {
  try {
    const [result] = await connection.query(
      `SELECT
      er.reg_id,
      sd.student_id,
      sd.clg_id,
      sd.email_id,
      sd.first_name,
      sd.middle_name,
      sd.last_name,
      er.isApproved,
      er.attended,
      er.timeOfAttendance,
      er.transaction_id
      FROM
      tpo_event_registrations er
      JOIN
      tpo_student_details sd
      ON
      er.student_id = sd.student_id
      WHERE
      er.event_id = ${eventId};`
    );
    return result;
  } catch (error) {
    throw new Error(
      "Error fetching registered students of the event: " + error.message
    );
  }
};

exports.getApprovedRegistrations = async (eventId) => {
  try {
    const [result] = await connection.query(
      `SELECT
      er.reg_id,
      sd.student_id,
      er.event_id,
      sd.clg_id,
      sd.email_id,
      sd.first_name,
      sd.middle_name,
      sd.last_name,
      er.isApproved,
      er.attended,
      er.timeOfAttendance,
      er.transaction_id
      FROM
      tpo_event_registrations er
      JOIN
      tpo_student_details sd
      ON
      er.student_id = sd.student_id
      WHERE
      er.event_id = ${eventId}
      AND er.isApproved = true;`
    );
    return result;
  } catch (error) {
    throw new Error(
      "Error fetching registered students of the event: " + error.message
    );
  }
};

exports.getAttendance = async (eventId) => {
  try {
    const [result] = await connection.query(
      `SELECT
      er.reg_id,
      er.event_id,
      sd.clg_id,
      sd.student_id,
      sd.email_id,
      sd.first_name,
      sd.middle_name,
      sd.last_name,
      er.isApproved,
      er.attended,
      er.timeOfAttendance,
      er.transaction_id
      FROM
      tpo_event_registrations er
      JOIN
      tpo_student_details sd
      ON
      er.student_id = sd.student_id
      WHERE
      er.event_id = ${eventId}
      AND er.attended = true;`
    );
    return result;
  } catch (error) {
    throw new Error(
      "Error fetching attendance records of the event: " + error.message
    );
  }
};

exports.isApproved = async (eventId, studentId) => {
  try {
    const [rows] = await connection.query(
      `SELECT isApproved from tpo_event_registrations WHERE event_id = ? and student_id = ?;`,
      [eventId, studentId]
    );
    return rows[0].isApproved === 1;
  } catch (error) {
    throw new Error(
      "Error checking if the student is approved: " + error.message
    );
  }
};

exports.approveStudent = async (eventId, studentId) => {
  try {
    const [rows] = await connection.query(
      `UPDATE tpo_event_registrations SET isApproved = true WHERE event_id = ? AND student_id = ? ;`,
      [eventId, studentId]
    );
    return rows;
  } catch (error) {
    throw new Error("Error approving student: " + error.message);
  }
};

exports.isAttended = async (eventId, studentId) => {
  try {
    const [rows] = await connection.query(
      `SELECT attended from tpo_event_registrations WHERE event_id = ? and student_id = ?;`,
      [eventId, studentId]
    );
    return rows[0].attended === 1;
  } catch (error) {
    throw new Error(
      "Error checking if the student has attended: " + error.message
    );
  }
};

exports.markAsAttended = async (eventId, studentId) => {
  try {
    //update the attended column
    const [rows] = await connection.query(
      `UPDATE tpo_event_registrations SET attended = true WHERE event_id = ? AND student_id = ? ;`,
      [eventId, studentId]
    );

    //update the timeOfAttendance column
    const [rows1] = await connection.query(
      `UPDATE tpo_event_registrations SET timeOfAttendance = NOW() WHERE event_id = ? AND student_id = ? ;`,
      [eventId, studentId]
    );

    const result = await this.changeAttendanceFlag(eventId)

    return rows, rows1, result;
  } catch (error) {
    throw new Error(
      "Error marking attendance of the student: " + error.message
    );
  }
};

exports.deleteRegistration = async (eventId, student_id) => {
  try {
    const [rows] = await connection.query(
      `DELETE from tpo_event_registrations WHERE event_id = ? AND student_id= ?;`,
      [eventId, student_id]
    );
    return rows;
  } catch (error) {
    throw new Error("Error deleting student registration: " + error.message);
  }
};

//get all attendance
exports.getAllAttendance = async () => {
  try {
    const events = await Event.getAllEvents();
    // console.log(events)

    let selectColumns = events
      .map(
        (e) =>
          `MAX(CASE WHEN e.eventId = ${e.eventId} THEN r.attended ELSE NULL END) AS \`${e.eventName}\``
      )
      .join(", ");

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

    const result = await connection.query(query);

    // getting all the events in a events object for easy retrieval
    // Transform the result to group event data under an "Events" key
    const formattedResult = result[0].map((student) => {
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
  }
};

exports.changeAttendanceFlag = async (eventId) => {

  try {
    
    const [result] = await connection.query(
      `SELECT * FROM tpo_event_registrations WHERE event_id=? AND attended = true;`,
      [eventId]
    );
  
    if (result.length === 0) {
      //keep the flag false
      const isUpdated = await connection.query(
        `UPDATE tpo_events SET attendanceFlag = false WHERE eventId = ?;`,
        [eventId]
      );
      return isUpdated;
    } else {
      //update the flag to true
      const isUpdated = await connection.query(
        `UPDATE tpo_events SET attendanceFlag = true WHERE eventId = ?;`,
        [eventId]
      );
      return isUpdated
    }
  } catch (error) {
    console.log(error)
  }
};
