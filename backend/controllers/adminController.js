const Admin = require("../models/Admin");
const Event = require("../models/Event");

//get all the registered students for a particular event (even not attended)

exports.getAllRegistrations = async (req, res) => {
  try {
    const eventId = req.params.id;
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
    const eventId = req.params.id;
    const result = await Admin.getApprovedRegistrations(eventId);
    if (result.length === 0) {
      res.status(200).json({ message: "No approved registrations for this event yet" });
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
    const eventId = req.params.id;
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
}

//approve student for the event, whenever admin clicks
exports.approveStudent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { student_id } = req.body;

    //check if the student is already approved
    const isApproved = await Admin.isApproved(eventId, student_id);
    if (!isApproved) {
      const result = await Admin.approveStudent(eventId, student_id);
      res
        .status(200)
        .json({
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
      res
        .status(200)
        .json({
          message: "Successfully marked student as attended for the event",
          result,
        });
    } else {
      res.status(200).json({ message: "Student has already attended" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}