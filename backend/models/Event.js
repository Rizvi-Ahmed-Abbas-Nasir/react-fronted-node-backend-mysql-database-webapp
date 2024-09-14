const connection = require("../db");

//creates an event
exports.createEvent = async (
  eventName,
  eventDescription,
  nameOfSpeaker,
  organizationOfSpeaker,
  locationOfSpeaker,
  date,
  category,
  time,
  department,
  eligibleYear,
  isPaid,
  cost,
  banner,
  loaOfSpeaker,
  notice,
  eventDeadline
) => {
  try {
    const [result] = await connection.query(
      "INSERT INTO tpo_events (eventName, eventDescription, nameOfSpeaker, organizationOfSpeaker,locationOfSpeaker, date, category, time, department, eligibleYear, isPaid, cost, banner, loaOfSpeaker, notice, eventDeadline) VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?, ?,?,?,?,?,?)",
      [
        eventName,
        eventDescription,
        nameOfSpeaker,
        organizationOfSpeaker,
        locationOfSpeaker,
        date,
        category,
        time,
        department,
        eligibleYear,
        isPaid,
        cost,
        banner,
        loaOfSpeaker,
        notice,
        eventDeadline
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

exports.getAEvent = async (eventId) => {
  try {
    const [result] = await connection.query(
      "SELECT * FROM tpo_events WHERE eventId = ?",
      [eventId]
    );
    return result;
  } catch (error) {
    throw new Error("Error getting the event: " + error.message);
  }
};

exports.updateEvent = async (
  id,
  eventName,
  eventDescription,
  nameOfSpeaker,
  organizationOfSpeaker,
  locationOfSpeaker,
  date,
  category,
  time,
  department,
  eligibleYear,
  isPaid,
  cost,
  banner,
  loaOfSpeaker,
  notice,
  eventDeadline
) => {
  try {
    const [rows] = await connection.query(
      `UPDATE tpo_events SET eventName = ?,eventDescription = ?, nameOfSpeaker = ?,organizationOfSpeaker = ?,locationOfSpeaker =?, date = ?, category = ?, time = ?, department = ?, eligibleYear = ?, isPaid = ?, cost = ?, banner = ?, loaOfSpeaker = ?, notice = ?, eventDeadline = ? WHERE eventId = ?;`,
      [
        eventName,
        eventDescription,
        nameOfSpeaker,
        organizationOfSpeaker,
        locationOfSpeaker,
        date,
        category,
        time,
        department,
        eligibleYear,
        isPaid,
        cost,
        banner,
        loaOfSpeaker,
        notice,
        eventDeadline,
        id,
      ]
    );

    return rows;
  } catch (error) {
    throw new Error("Error updating event: " + error.message);
  }
};

exports.deleteEvent = async (id) => {
  try {
    const [rows] = await connection.query(
      `DELETE from tpo_events WHERE eventId = ?;`,
      [id]
    );

    return rows;
  } catch (error) {
    throw new Error("Error Deleting event: " + error.message);
  }
};

exports.isPaid = async (id) => {
  try {
    const [rows] = await connection.query(
      `SELECT isPaid from tpo_events WHERE eventId = ?;`,
      [id]
    );
    return rows[0].isPaid === 1;
  } catch (error) {
    throw new Error("Error checking if event is paid: " + error.message);
  }
};

exports.flagEventAsDeleted = async (id) => {
  try {
    const result = await connection.query(
      `UPDATE tpo_events
      SET isDeleted = true
      WHERE eventId = ?;
    `,
      [id]
    );
    return result;
  } catch (error) {
    throw new Error("Error flagging event as deleted: " + error.message);
  }
};

exports.flagEventAsNotDeleted = async (id) => {
  try {
    const result = await connection.query(
      `UPDATE tpo_events
      SET isDeleted = false
      WHERE eventId = ?;
    `,
      [id]
    );
    return result;
  } catch (error) {
    throw new Error("Error flagging event as not deleted: " + error.message);
  }
};

exports.storeNotice = async (notice, eventId) => {
  try {
    console.log("EventId:", eventId, " and Notice: ", notice)
    const result = await connection.query(`UPDATE tpo_events SET notice = ? WHERE eventId = ?`,
      [notice, eventId]
    )
    return result
    
  } catch (error) {
    throw new Error("Error storing notice: " + error.message);
  }
}

exports.deleteNotice = async (id)=> {
  try {

    const result = await connection.query(`UPDATE tpo_events SET notice = null WHERE eventId = ?`,
      [id]
    )
    return result
  } catch (error) {
    throw new Error("Error deleting notice: " + error.message);    
  }
}

exports.deleteBanner = async (id)=> {
  try {

    const result = await connection.query(`UPDATE tpo_events SET banner = null WHERE eventId = ?`,
      [id]
    )
    return result
  } catch (error) {
    throw new Error("Error making banner null: " + error.message);    
  }
}

//handle event deadlines, remove the event if deadline is met
exports.handleDeadline = async (eventId) => {
  try {

    
  } catch (error) {
  }
}