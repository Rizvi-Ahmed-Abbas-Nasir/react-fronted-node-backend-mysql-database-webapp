const connection = require("../db");

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
}

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

}


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
}

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

    return rows,rows1;

  } catch (error) {
    throw new Error("Error marking attendance of the student: " + error.message);
  }
}

exports.deleteRegistration = async (eventId, student_id) => {
  try {
    const [rows] = await connection.query(
      `DELETE from tpo_event_registrations WHERE event_id = ? AND student_id= ?;`,
      [eventId, student_id]
    );
    return rows;
  } catch (error) {
    throw new Error(
      "Error deleting student registration: " + error.message
    );
  }
}