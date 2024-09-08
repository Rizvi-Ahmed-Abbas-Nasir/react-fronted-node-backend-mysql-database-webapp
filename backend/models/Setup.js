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
      cost int DEFAULT NULL,
      banner text
      );

      CREATE TABLE IF NOT EXISTS tpo_student_details (
      student_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
      email_id varchar(255) NOT NULL,
      first_name varchar(45) DEFAULT NULL,
      middle_name varchar(45) DEFAULT NULL,
      last_name varchar(45) DEFAULT NULL,
      clg_id varchar(45) DEFAULT NULL,
      UNIQUE KEY email_id (email_id),
      UNIQUE KEY clg_id (clg_id)
      );

      CREATE TABLE tpo_event_registrations (
      reg_id INT PRIMARY KEY AUTO_INCREMENT,
      student_id INT,
      event_id INT,
      isApproved BOOLEAN DEFAULT false,
      transaction_id varchar(255) DEFAULT NULL,
      attended BOOLEAN DEFAULT false,
      timeOfAttendance DATETIME DEFAULT NULL,
      FOREIGN KEY (event_id) REFERENCES tpo_events(eventId),
      FOREIGN KEY (student_id) REFERENCES tpo_student_details(student_id)
      );
      
      `
    );
    return result;
  } catch (error) {
    console.log(error);
  }
};


exports.createStudent = async (
  email_id,
  first_name,
  middle_name,
  last_name,
  clg_id
) => {
  try {
    const [result] = await connection.query(
      "INSERT INTO tpo_student_details (email_id, first_name, middle_name, last_name, clg_id) VALUES (?, ?, ?, ?, ?)",
      [
        email_id,
        first_name,
        middle_name,
        last_name,
        clg_id
      ]
    );
    return result;
  } catch (error) {
    throw new Error("Error creating Student: " + error.message);
  }
};

