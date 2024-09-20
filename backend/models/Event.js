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
  eligible_degree_year,
  batch,
  isPaid,
  cost,
  paymentQR,
  banner,
  loaOfSpeaker,
  notice,
  eventDeadline
) => {
  try {
    const [result] = await connection.query(
      "INSERT INTO tpo_events (eventName, eventDescription, nameOfSpeaker, organizationOfSpeaker,locationOfSpeaker, date, category, time, department, eligible_degree_year, batch, isPaid, cost,paymentQR, banner, loaOfSpeaker, notice, eventDeadline) VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?, ?,?,?,?,?,?,?,?)",
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
        eligible_degree_year,
        batch,
        isPaid,
        cost,
        paymentQR,
        banner,
        loaOfSpeaker,
        notice,
        eventDeadline,
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
  eligible_degree_year,
  isPaid,
  cost,
  paymentQR,
  banner,
  loaOfSpeaker,
  notice,
  eventDeadline
) => {
  try {
    const [rows] = await connection.query(
      `UPDATE tpo_events SET eventName = ?,eventDescription = ?, nameOfSpeaker = ?,organizationOfSpeaker = ?,locationOfSpeaker =?, date = ?, category = ?, time = ?, department = ?, eligible_degree_year = ?, isPaid = ?, cost = ?,paymentQR = ?, banner = ?, loaOfSpeaker = ?, notice = ?, eventDeadline = ? WHERE eventId = ?;`,
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
        eligible_degree_year,
        isPaid,
        cost,
        paymentQR,
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
    console.log("EventId:", eventId, " and Notice: ", notice);
    const result = await connection.query(
      `UPDATE tpo_events SET notice = ? WHERE eventId = ?`,
      [notice, eventId]
    );
    return result;
  } catch (error) {
    throw new Error("Error storing notice: " + error.message);
  }
};

exports.deleteNotice = async (id) => {
  try {
    const result = await connection.query(
      `UPDATE tpo_events SET notice = null WHERE eventId = ?`,
      [id]
    );
    return result;
  } catch (error) {
    throw new Error("Error deleting notice: " + error.message);
  }
};

exports.deleteBanner = async (id) => {
  try {
    const result = await connection.query(
      `UPDATE tpo_events SET banner = null WHERE eventId = ?`,
      [id]
    );
    return result;
  } catch (error) {
    throw new Error("Error making banner null: " + error.message);
  }
};

// Handle event deadlines, remove the event if the deadline is met
exports.handleDeadline = async (eventDeadline) => {
  try {
    const now = new Date();

    // Convert the eventDeadline to a Date object
    const deadlineDate = new Date(eventDeadline);

    // Normalize both dates by setting the time to 00:00:00
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDay = new Date(
      deadlineDate.getFullYear(),
      deadlineDate.getMonth(),
      deadlineDate.getDate()
    );

    // console.log("The Event Deadline: ", eventDay);
    // console.log("Today's date to compare: ", today);
    // Check if the current date is past the eventDeadline date
    if (today > eventDay) {
      // If the deadline has passed, remove the event from the database

      return true;
    } else {
      // If the deadline hasn't passed, no action is needed
      return false;
    }
  } catch (error) {
    throw new Error("Error checking deadline: " + error.message);
  }
};

exports.changeDeadStatus = async (eventId, value) => {
  try {
    if (value) {
      //runs when setting true
      const result = await connection.query(
        `UPDATE tpo_events SET isDead = true WHERE eventId = ?`,
        [eventId]
      );
      return result;
    } else {
      //runs when setting false

      const result = await connection.query(
        `UPDATE tpo_events SET isDead = false WHERE eventId = ?`,
        [eventId]
      );
      return result;
    }
  } catch (error) {
    throw new Error("Error updating isDead status: " + error.message);
  }
};

exports.makeDefault = async (eventId) => {
  try {
    const result = await connection.query(
      `UPDATE tpo_events SET eventDeadline = '3000-01-01' WHERE eventId = ?`,
      [eventId]
    );
  } catch (error) {
    throw new Error("Error making deadline default: " + error.message);
  }
};

exports.storePhoto = async (eventId, path) => {
  try {
    const result = await connection.query(
      `UPDATE tpo_events SET eventPhotos = ? WHERE eventId = ?`,
      [path, eventId]
    );

    return result;
  } catch (error) {
    throw new Error("Error storing event photos: " + error.message);
  }
};

exports.changePhotosUploadStatus = async (eventId) => {
  try {
    const result = await connection.query(
      `UPDATE tpo_events SET photosUploaded = true WHERE eventId = ?`,
      [eventId]
    );

    return result;
  } catch (error) {
    throw new Error("Error storing event photos: " + error.message);
  }
};

exports.getCurrentBatch = async () => {
  try {
    const [row] = await connection.query(
      `SELECT * FROM current_batch WHERE batch_id = 1`,
    );

    return row[0].batch;
  } catch (error) {
    throw new Error("Error checking current batch" + error.message);
  } 
}
