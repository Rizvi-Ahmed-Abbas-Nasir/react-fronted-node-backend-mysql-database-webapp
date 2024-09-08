const User = require("../models/User");
const Event = require("../models/Event");
//just register for event
exports.registerForEvent = async (req, res) => {
  try {
    //get event id from params
    const event_id = req.params.event_id;
    //thinking about should we pass student_id through session here instead
    const { student_id , transaction_id} = req.body;

    //register the student for the event
    const result = await User.registerForEvent(event_id, student_id, transaction_id);

    res
      .status(201)
      .json({ message: "You have registered successfully", result: result });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

