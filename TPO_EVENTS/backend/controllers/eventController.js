const Event = require('../models/Event')

//runs after middleware data cleaning
exports.createEvent = async (req, res) => {
    const { eventName, nameOfSpeaker, date,category, time, department, eligibleYear, isPaid, cost} = req.body;
    try {
        const result = await Event.createEvent(eventName, nameOfSpeaker, date,category, time, department, eligibleYear, isPaid, cost);
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
        cost
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
  