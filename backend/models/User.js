const connection = require("../db");

exports.registerForEvent = async (event_id, student_id) => {
  try {
    const [result] = await connection.query(
      "INSERT INTO tpo_event_registrations (event_id, student_id) VALUES (?, ?)",
      [event_id, student_id]
    );
    return result;
  } catch (error) {
    throw new Error(
      "Error registering student for the event: " + error.message
    );
  }
};




