const Event = require('../models/Event')
const path = require('path')
//runs after middleware data cleaning
exports.createEvent = async (req, res) => {
  try {
    
    if (req.files.banner) {
      console.log("Flie received, saving");
      let file = req.files.banner;
      let fileName = new Date().getTime().toString() + "-" + file.name;
      const savePath = path.join(
        __dirname,
        "../public/assets/",
        "banner",
        fileName
      );
      await file.mv(savePath);
      fileName = "assets/banner/"+fileName
      req.body.banner = fileName;
    }
    const { eventName, nameOfSpeaker, date,category, time, department, eligibleYear, isPaid, cost, banner} = req.body;
    const result = await Event.createEvent(eventName, nameOfSpeaker, date,category, time, department, eligibleYear, isPaid, cost, banner);
    res.status(201).json({ message: 'Event created successfully', result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.getAllEvents();
        if (events.length === 0) {
            res.status(200).json({ message: 'No Events yet' });
        } else {
            res.status(200).json(events);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
      const id = req.params.id;
      const {
        eventName,
        nameOfSpeaker,
        date,
        category,
        time,
        department,
        eligibleYear,
        isPaid,
        cost,
        banner
      } = req.body;
  
      const result = await Event.updateEvent(
        id,
        eventName,
        nameOfSpeaker,
        date,
        category,
        time,
        department,
        eligibleYear,
        isPaid,
        cost,
        banner
      );
      res.status(200).json({ message: "Event Updated Successfully", result });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  
  exports.deleteEvent = async (req, res) => {
    try {
      const id = req.params.id;
  
      const result = await Event.deleteEvent(id);
      res.status(200).json({ message: "Event Deleted Successfully", result });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  