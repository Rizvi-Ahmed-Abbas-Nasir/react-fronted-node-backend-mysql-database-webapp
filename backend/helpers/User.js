const { connection } = require("../dbConfig");


exports.registerForEvent = async (event_id, student_id,transaction_id) => {
  try {
    const [result] = await connection.query(
      "INSERT INTO tpo_event_registrations (event_id, student_id, transaction_id) VALUES (?, ?,?)",
      [event_id, student_id, transaction_id]
    );
    return result;
  } catch (error) {
    throw new Error(
      "Error registering student for the event: " + error.message
    );
  }
};


exports.checkIfRegistered = async (event_id, student_id) => {
  try {
    const [result] = await connection.query(
      "SELECT * from tpo_event_registrations WHERE event_id = ? AND student_id = ?",
      [event_id, student_id]
    );
    // console.log(result);
    return result;
  } catch (error) {
    throw new Error(
      "Error checking if student has already registered for the event: " + error.message
    );
  }
}

