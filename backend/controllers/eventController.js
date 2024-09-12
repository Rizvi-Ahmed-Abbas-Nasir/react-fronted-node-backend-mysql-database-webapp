const Event = require("../models/Event");
const path = require("path");
const fs = require("fs");
const loaController = require("../controllers/loaController");
//runs after middleware data cleaning
exports.createEvent = async (req, res) => {
  try {
    if (req.files && req.files.banner) {
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
      fileName = "assets/banner/" + fileName;
      req.body.banner = fileName;
    }
    const {
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
    } = req.body;

    //generate a loa based on the data
    const data = {
      date: date,
      recipientName: nameOfSpeaker,
      recipientOrganization: organizationOfSpeaker,
      recipientLocation: locationOfSpeaker,
      subject: eventName,
      activity: eventDescription,
    };

    const isGenerated = await loaController.createPDF(data);
    if (!isGenerated) {
      console.log("Error generating loa");
      req.body.loaOfSpeaker = null;
    } else {
      console.log("Loa generated successfully");
      req.body.loaOfSpeaker = isGenerated;
    }

    const loaOfSpeaker = await req.body.loaOfSpeaker;
    const result = await Event.createEvent(
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
      loaOfSpeaker
    );

    res.status(201).json({ message: "Event created successfully", result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.getAllEvents();
    if (events.length === 0) {
      res.status(200).json({ message: "No Events yet" });
    } else {
      res.status(200).json(events);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const id = req.params.eventId;
    //getting the previous filename from the db if present
    const event = await Event.getAEvent(id);
    const loa = event[0].loaOfSpeaker;
    console.log(loa)
    //if loa is present previously, delete it
    if (loa) {
      console.log("Deleting Previous loa: ", loa);

      const prevPath = path.join(__dirname, "../public", loa);

      // ------------------------ Cautious code begins ---------------------------------------
      fs.unlink(prevPath, (err) => {
        if (err) {
          console.error("Error deleting the loa:", err);
        } else {
          console.log("loa deleted successfully!");
        }
      });
      // ------------------------ Cautious code ends ---------------------------------------
    } else {
      console.log("there was no loa to delete");
    }
    //if a new banner is chosen
    if (req.files && req.files.banner) {
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
      console.log("file saved in the server");
      fileName = "assets/banner/" + fileName;
      req.body.banner = fileName;

      //deleting the previous file

      //getting the previous filename from the db if present
      const event = await Event.getAEvent(id);
      const prevFile = event[0].banner;
      if (prevFile) {
        console.log("Deleting Previous file: ", prevFile);

        const prevPath = path.join(__dirname, "../public", prevFile);
        // console.log(prevPath)

        // ------------------------ Cautious code begins ---------------------------------------
        fs.unlink(prevPath, (err) => {
          if (err) {
            console.error("Error deleting the file:", err);
          } else {
            console.log("File deleted successfully!");
          }
        });
        // ------------------------ Cautious code ends ---------------------------------------
      } else {
        console.log("there was no previous file to delete");
      }

      
    } else {
      console.log("no new file specified");
      if (!req.body.banner) {
        console.log("no new banner specified");

        //getting the previous filename from the db if present
        const event = await Event.getAEvent(id);
        const prevFile = event[0].banner;

        if (prevFile) {
          req.body.banner = prevFile;
        } else {
          req.body.banner = null;
        }
      }
      console.log("keeping the previous banner: ", req.body.banner);
    }

    const {
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
    } = req.body;

    //generate a new loa based on the data
    const data = {
      date: date,
      recipientName: nameOfSpeaker,
      recipientOrganization: organizationOfSpeaker,
      recipientLocation: locationOfSpeaker,
      subject: eventName,
      activity: eventDescription,
    };

    const isGenerated = await loaController.createPDF(data);
    if (!isGenerated) {
      console.log("Error generating loa");
      req.body.loaOfSpeaker = null;
    } else {
      console.log("Loa generated successfully");
      req.body.loaOfSpeaker = isGenerated;
    }
    const loaOfSpeaker = await req.body.loaOfSpeaker;

    const result = await Event.updateEvent(
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
      loaOfSpeaker
    );

    res.status(200).json({ message: "Event Updated Successfully", result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//this controller flags the event as deleted, to not show in the admin UI, and removing the banner in the process for reducing server load
exports.removeEvent = async (req, res) => {
  try {
    const id = req.params.eventId;

    //deleting the previous file

    //getting the previous filename from the db if present
    const event = await Event.getAEvent(id);
    const prevFile = event[0].banner;
    if (prevFile) {
      console.log("Deleting Previous file: ", prevFile);

      const prevPath = path.join(__dirname, "../public", prevFile);
      // console.log(prevPath)

      // ------------------------ Cautious code begins ---------------------------------------
      fs.unlink(prevPath, (err) => {
        if (err) {
          console.error("Error deleting the file:", err);
        } else {
          console.log("File deleted successfully!");
        }
      });
      // ------------------------ Cautious code ends ---------------------------------------
    }

    const result = await Event.flagEventAsDeleted(id);
    res.status(200).json({
      message:
        "Event removed Successfully, you can undo this process but will have to include the banner again",
      result,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.undoEvent = async (req, res) => {
  try {
    const id = req.params.eventId;

    const result = await Event.flagEventAsNotDeleted(id);
    res
      .status(200)
      .json({ message: "Successful undo of event details", result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//this deletes the whole event, its related registration records, the attendance and the banner
exports.deleteEvent = async (req, res) => {
  try {
    const id = req.params.eventId;

    //deleting the previous file

    //getting the previous filename from the db if present
    const event = await Event.getAEvent(id);
    const prevFile = event[0].banner;
    const loa = event[0].loaOfSpeaker;
    if (prevFile) {
      // checks if the previous file is present to perform the deletion
      console.log("Deleting Previous file: ", prevFile);

      const prevPath = path.join(__dirname, "../public", prevFile);
      // console.log(prevPath)

      // ------------------------ Cautious code begins ---------------------------------------
      fs.unlink(prevPath, (err) => {
        if (err) {
          console.error("Error deleting the file:", err);
        } else {
          console.log("File deleted successfully!");
        }
      });
      // ------------------------ Cautious code ends ---------------------------------------
    } else {
      console.log("No previous banner to delete")
    }

    //if loa is present previously, delete it
    if (loa) {
      console.log("Deleting Previous loa: ", loa);

      const prevPath = path.join(__dirname, "../public", loa);

      // ------------------------ Cautious code begins ---------------------------------------
      fs.unlink(prevPath, (err) => {
        if (err) {
          console.error("Error deleting the loa:", err);
        } else {
          console.log("loa deleted successfully!");
        }
      });
      // ------------------------ Cautious code ends ---------------------------------------

    } else {
      console.log("there was no loa to delete")
    }

    const result = await Event.deleteEvent(id);
    res.status(200).json({ message: "Event Deleted Successfully", result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
