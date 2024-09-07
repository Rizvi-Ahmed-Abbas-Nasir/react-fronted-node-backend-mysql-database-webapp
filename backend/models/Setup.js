const connection = require("../db");

exports.createTables = async () => {
  try {
    const result = await connection.query(
      `CREATE TABLE IF NOT EXISTS tpo_events (
      eventId int auto_increment primary key, 
      eventName varchar(255),
      nameOfSpeaker varchar(255), 
      date date, 
      category varchar(255), 
      time time, 
      department varchar(45), 
      eligibleYear varchar(45), 
      isPaid bool DEFAULT NULL, 
      cost int DEFAULT NULL
      );`
    );
    return result;
  } catch (error) {
    console.log(error);
  }
};
