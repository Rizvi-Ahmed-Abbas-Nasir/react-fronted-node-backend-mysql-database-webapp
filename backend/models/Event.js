const connection = require("../db");

//creates an event
exports.createEvent = async (
  eventName,
  nameOfSpeaker,
  date,
  category,
  time,
  department,
  eligibleYear,
  isPaid,
  cost
) => {
  try {
    const [result] = await connection.query(
      "INSERT INTO tpo_events (eventName, nameOfSpeaker, date, category, time, department, eligibleYear, isPaid, cost) VALUES (?, ?, ?, ?, ?, ?, ?,?,?)",
      [
        eventName,
        nameOfSpeaker,
        date,
        category,
        time,
        department,
        eligibleYear,
        isPaid,
        cost,
      ]
    );
    return result;
  } catch (error) {
    throw new Error("Error creating Event: " + error.message);
  }
};

exports.getAllEvents = async () => {
  try {
    const [result] = await connection.query(
      "SELECT * FROM tpo_events ORDER BY date DESC"
    );
    return result;
  } catch (error) {
    throw new Error("Error getting Events: " + error.message);
  }
};

exports.updateEvent = async (
  id,
  eventName,
  nameOfSpeaker,
  date,
  category,
  time,
  department,
  eligibleYear,
  isPaid,
  cost
) => {
  try {
    const [rows] = await connection.query(
      `UPDATE tpo_events SET eventName = ?, nameOfSpeaker = ?, date = ?, category = ?, time = ?, department = ?, eligibleYear = ?, isPaid = ?, cost = ? WHERE eventId = ?;`,
      [
        eventName,
        nameOfSpeaker,
        date,
        category,
        time,
        department,
        eligibleYear,
        isPaid,
        cost,
        id,
      ]
    );

    return rows;
  } catch (error) {
    throw new Error("Error updating event: " + error.message);
  }
};


exports.deleteEvent = async (id)=> {
    try {
        const [rows] = await connection.query(
          `DELETE from tpo_events WHERE eventId = ?;`,
          [id]
        );
    
        return rows
      } catch (error) {
        throw new Error("Error Deleting event: " + error.message);
      }
}

exports.isPaid = async (id)=> {
  try {
    const [rows] = await connection.query(
      `SELECT isPaid from tpo_events WHERE eventId = ?;`,
      [id]

    );
    return rows[0].isPaid === 1

  } catch (error) {
    throw new Error("Error checking if event is paid: " + error.message);
    
  } 
}