const Admin = require("../models/Admin");
const Event = require("../models/Event");
const Attendance = require("../models/Attendance");
//get all the registered students for a particular event (even not attended)

exports.getAllRegistrations = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const result = await Admin.getAllRegistrations(eventId);
    if (result.length === 0) {
      res.status(200).json({ message: "No registrations for this event yet" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

//get only approved registrations
exports.getApprovedRegistrations = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const result = await Admin.getApprovedRegistrations(eventId);
    if (result.length === 0) {
      res
        .status(200)
        .json({ message: "No approved registrations for this event yet" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const result = await Admin.getAttendance(eventId);
    if (result.length === 0) {
      res.status(200).json({ message: "No attendance record" });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

//approve student for the event, whenever admin clicks
exports.approveStudent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { student_id } = req.body;

    //check if the student is already approved
    const isApproved = await Admin.isApproved(eventId, student_id);
    if (!isApproved) {
      const result = await Admin.approveStudent(eventId, student_id);
      res.status(200).json({
        message: "Successfully approved student for the event",
        result,
      });
    } else {
      res.status(200).json({ message: "Student is already approved" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.markAsAttended = async (req, res) => {
  try {
    //---------------------- details fetched through json ----------------
    const { student_id, event_id } = req.body;

    //check if the student is already attended
    const isAttended = await Admin.isAttended(event_id, student_id);
    if (!isAttended) {
      const result = await Admin.markAsAttended(event_id, student_id);
      res.status(200).json({
        message: "Successfully marked student as attended for the event",
        result,
      });
    } else {
      res.status(200).json({ message: "Student has already attended" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteRegistration = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { student_id } = req.body;
    const result = await Admin.deleteRegistration(eventId, student_id);
    res.status(200).json({ message: "Successfully deleted ", result: result });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

exports.getAllAttendance = async (req, res) => {
  try {
    const data = await Admin.getAllAttendance();
    res.status(200).json({ result: data });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

exports.getStatus = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const event = await Event.getAEvent(eventId);
    const status = [];
    let statusCode = 1; // Default status code

    if (event[0].banner != null) {
      status.push("Banner is uploaded");
      statusCode = Math.max(statusCode, 2); // Update statusCode to 2
    }

    if (event[0].attendanceFlag == true) {
      status.push("Minimum attendance achieved");
      statusCode = Math.max(statusCode, 3); // Update statusCode to 3
    }

    if (event[0].photosUploaded == true) {
      status.push("Event photos are uploaded");
      statusCode = Math.max(statusCode, 4); // Update statusCode to 4
    }

    // If no status is updated, it means only event is created
    if (status.length === 0) {
      status.push("Event is created");
    }

    res.status(200).json({ status: statusCode, message: status.join(", ") });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

