const User = require("../models/User");
const Event = require("../models/Event");
//just register for event
exports.registerForEvent = async (req, res) => {
  try {
    //get event id from params
    const event_id = req.params.event_id;
    //thinking about should we pass student_id through session here instead
    const { student_id , transaction_id} = req.body;

    //check if student exists already ----------------------
    const isRegistered = await User.checkIfRegistered(event_id, student_id);
    if (isRegistered.length !== 0) {
      console.log("User already registered")
      res.status(200).json({ message: "You have already Registered" });
    } else {
      const result = await User.registerForEvent(event_id, student_id, transaction_id);
  
      res
        .status(201)
        .json({ message: "You have registered successfully", result: result });

    }

    //register the student for the event
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// exports.checkIfRegistered = async (req, res) => {
//   try {
//     const isRegistered = await User.checkIfRegistered();
//     if (isRegistered.length === 0) {
//       res.status(200).json({ message: "Not yet Registered" });
//     } else {
//       res.status(200).json({ message: "Already Registered" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

