const Event = require("../helpers/Event");
const path = require("path");
const fs = require("fs");
const loaController = require("../controllers/loaController");
const noticeController = require("../controllers/noticeController");

exports.viewEventDoc = (req, res) => {
  console.log("called");
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, "../../public/assets/files", fileName);
  console.log(filePath);
  res.sendFile(filePath);
};

//runs after middleware data cleaning
exports.createEvent = async (req, res) => {
  try {
    //banner
    if (req.files && req.files.banner) {
      // console.log("Flie received, saving");
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

    //payment qr

    if (req.files && req.files.paymentQR) {
      // console.log("paymentQR received, saving");
      let file = req.files.paymentQR;
      let fileName = new Date().getTime().toString() + "-" + file.name;
      const savePath = path.join(
        __dirname,
        "../public/assets/",
        "PaymentQR",
        fileName
      );
      await file.mv(savePath);
      fileName = "assets/PaymentQR/" + fileName;
      req.body.paymentQR = fileName;
    }
    const paymentQR = req.body.paymentQR;

    let {
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
      isOnline,
      eventLink,
      banner,
      eventNotice,
      eventDeadline,
    } = req.body;

    isOnline = isOnline === "true";
    if (!isOnline && eventLink !== null) {
      eventLink = null;
    }

    //-------------------------------------------------notice-------------------------------
    if (eventNotice && eventNotice.trim() !== "") {
      //generate a notice based on the data
      const noticeData = {
        date: date,
        eventName: eventName,
        eventNotice: eventNotice,
      };

      const isNoticeGenerated = await noticeController.createPDF(noticeData);
      if (!isNoticeGenerated) {
        // console.log("Error generating notice");
        req.body.notice = null;
      } else {
        // console.log("notice generated successfully");
        req.body.notice = isNoticeGenerated;
      }
    }
    const notice = await req.body.notice;

    // ------------------------------------------------------------------loa--------------------------------------
    const data = {
      date: date,
      recipientName: nameOfSpeaker,
      recipientOrganization: organizationOfSpeaker,
      recipientLocation: locationOfSpeaker,
      subject: eventName,
      activity: eventDescription,
      serverUrl: process.env.NODE_APP_URL,
    };
    // console.log("serverUrl: ", data.serverUrl)

    const isGenerated = await loaController.createPDF(data);
    if (!isGenerated) {
      // console.log("Error generating loa");
      req.body.loaOfSpeaker = null;
    } else {
      // console.log("Loa generated successfully");
      req.body.loaOfSpeaker = isGenerated;
    }

    const loaOfSpeaker = await req.body.loaOfSpeaker;
    const currentBatch = await Event.getCurrentBatch();
    // console.log(currentBatch)
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
      eligible_degree_year,
      currentBatch,
      isPaid,
      cost,
      isOnline,
      eventLink,
      paymentQR,
      banner,
      loaOfSpeaker,
      notice,
      eventDeadline
    );

    res.status(201).json({ message: "Event created successfully", result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get all events whose deadline is not met
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.getAllEvents();
    if (events.length === 0) {
      res.status(200).json({ message: "No Events yet" });
    } else {
      // const eventPromises = events.map(async (event) => {
      //   const isDead = await Event.handleDeadline(event.eventDeadline);
      //   if (isDead) {
      //     // console.log(event.eventName, ": has met the deadline, removing event")
      //     //make isDeadlineMet = true here:
      //     const isSet = await Event.changeDeadStatus(event.eventId, true)
      //     await removeEventById(event.eventId); //removes the event
      //     //make default 3000
      //     const makeDefault = Event.makeDefault(event.eventId)
      //   } else {
      //     // console.log(event.eventId, ": has not met the deadline, moving on")
      //     const isSet = await Event.changeDeadStatus(event.eventId, false)
      //   }
      // })

      res.status(200).json(events);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get all events
exports.getEventHistory = async (req, res) => {
  try {
    const events = await Event.getEventHistory();
    if (events.length === 0) {
      res.status(200).json({ message: "No Events yet" });
    } else {
      res.status(200).json(events);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get all events
exports.getDeadEvents = async (req, res) => {
  try {
    const events = await Event.getDeadEvents();
    if (events.length === 0) {
      res.status(200).json({ message: "No Dead Events yet" });
    } else {
      res.status(200).json(events);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get user's eligible events only:
exports.getEligibleEvents = async (req, res) => {
  try {
    const student_id = req.params.student_id;

    const result = await Event.getEligibleEvents(student_id);

    if (result.length > 0) {
      res.status(200).json({ result: result });
    } else {
      res.status(200).json({ result: result });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const id = req.params.eventId;
    //getting the previous filename from the db if present
    const event = await Event.getAEvent(id);
    const loa = event[0].loaOfSpeaker;
    const eNotice = await event[0].notice;
    const prevQR = await event[0].paymentQR;

    // -----------------------------------------banner --------------------------------------------
    if (req.files && req.files.banner) {
      // console.log("Flie received, saving");
      let file = req.files.banner;
      let fileName = new Date().getTime().toString() + "-" + file.name;
      const savePath = path.join(
        __dirname,
        "../public/assets/",
        "banner",
        fileName
      );
      await file.mv(savePath);
      // console.log("file saved in the server");
      fileName = "assets/banner/" + fileName;
      req.body.banner = fileName;

      // deleting prev banner
      const prevFile = event[0].banner;
      if (prevFile) {
        // console.log("Deleting Previous file: ", prevFile);

        const prevPath = path.join(__dirname, "../public", prevFile);
        // console.log(prevPath)

        // ------------------------ Cautious code begins ---------------------------------------
        fs.unlink(prevPath, (err) => {
          if (err) {
            // console.error("Error deleting the file:", err);
          } else {
            // console.log("File deleted successfully!");
          }
        });
        // ------------------------ Cautious code ends ---------------------------------------
      } else {
        // console.log("there was no previous file to delete");
      }
    } else {
      // console.log("no new file specified");
      if (!req.body.banner) {
        // console.log("no new banner specified");

        //getting the previous filename from the db if present
        const event = await Event.getAEvent(id);
        const prevFile = event[0].banner;

        if (prevFile) {
          req.body.banner = prevFile;
        } else {
          req.body.banner = null;
        }
      }
      // console.log("keeping the previous banner: ", req.body.banner);
    }

    let {
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
      isOnline,
      eventLink,
      banner,
      eventNotice,
      eventDeadline,
    } = await req.body;

    isOnline = isOnline === "true";
    if (!isOnline && eventLink !== null) {
      eventLink = null;
    }

    //if notice is modified, update it, and delete the previous in the process
    // console.log("Event Notice: "+ eventNotice);
    // console.log("Previous notice: "+ eNotice);

    // ------------------------------------NOTICE------------------------------------------------------
    //notice here
    if (eventNotice && eventNotice.trim() !== "") {
      //if notice is present previously, delete it
      if (eNotice != null) {
        // console.log("Deleting Previous notice: ", eNotice);

        const prevPath = path.join(__dirname, "../public", eNotice);

        // ------------------------ Cautious code begins ---------------------------------------
        fs.unlink(prevPath, (err) => {
          if (err) {
            // console.error("Error deleting the notice:", err);
          } else {
            // console.log("notice deleted successfully!");
          }
        });
        // ------------------------ Cautious code ends ---------------------------------------
      } else {
        // console.log("there was no notice to delete");
      }

      //generate a notice based on the data
      const noticeData = {
        date: date,
        eventName: eventName,
        eventNotice: eventNotice,
        serverUrl: process.env.NODE_APP_URL,
      };

      const isNoticeGenerated = await noticeController.createPDF(noticeData);
      if (!isNoticeGenerated) {
        // console.log("Error generating notice");
        req.body.notice = null;
      } else {
        // console.log("notice generated successfully");
        req.body.notice = isNoticeGenerated;
      }
    } else {
      // console.log("No notice defined");
      req.body.notice = eNotice;
    }
    const notice = await req.body.notice;

    // -------------------------------------------LOA--------------------------------------------------

    //if loa is present previously, delete it
    if (loa) {
      // console.log("Deleting Previous loa: ", loa);

      const prevPath = path.join(__dirname, "../public", loa);

      // ------------------------ Cautious code begins ---------------------------------------
      fs.unlink(prevPath, (err) => {
        if (err) {
          // console.error("Error deleting the loa:", err);
        } else {
          // console.log("loa deleted successfully!");
        }
      });
      // ------------------------ Cautious code ends ---------------------------------------
    } else {
      // console.log("there was no loa to delete");
    }

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
      // console.log("Error generating loa");
      req.body.loaOfSpeaker = null;
    } else {
      // console.log("Loa generated successfully");
      req.body.loaOfSpeaker = isGenerated;
    }
    const loaOfSpeaker = await req.body.loaOfSpeaker;

    // ------------------------------------------------------- Payment QR -----------------------------------------------

    //checking if file is selected
    if (req.files && req.files.paymentQR) {
      //first delete the previous file
      if (prevQR) {
        //delete code
        // console.log("Deleting Previous file: ", prevQR);

        const prevPath = path.join(__dirname, "../public", prevQR);
        // console.log(prevPath)

        // ------------------------ Cautious code begins ---------------------------------------
        fs.unlink(prevPath, (err) => {
          if (err) {
            // console.error("Error deleting the payment QR:", err);
          } else {
            // console.log("payment QR deleted successfully!");
          }
        });
      } else {
        // console.log("No paymentQR file to delete")
      }

      //saving the file code
      let file = req.files.paymentQR;
      let fileName = new Date().getTime().toString() + "-" + file.name;
      const savePath = path.join(
        __dirname,
        "../public/assets/",
        "PaymentQR",
        fileName
      );
      await file.mv(savePath);
      // console.log("file saved in the server");
      fileName = "assets/PaymentQR/" + fileName;
      req.body.paymentQR = fileName;
    } else {
      //no payment qr file specified, keeping the prev one
      req.body.paymentQR = prevQR;
    }

    const paymentQR = req.body.paymentQR;

    // --------------------------------------------------Actual UPDATE QUERY -----------------------------------------
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
      eligible_degree_year,
      isPaid,
      cost,
      isOnline,
      eventLink,
      paymentQR,
      banner,
      loaOfSpeaker,
      notice,
      eventDeadline
    );

    res.status(200).json({ message: "Event Updated Successfully", result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//this controller flags the event as deleted, to not show in the admin UI, and removing the banner in the process for reducing server load
// Helper function to remove an event by ID
const removeEventById = async (eventId) => {
  try {
    const event = await Event.getAEvent(eventId);
    const prevNotice = event[0].notice;

    // Deleting the previous notice:
    if (prevNotice) {
      // console.log("Deleting Previous notice: ", prevNotice);
      const prevPath = path.join(__dirname, "../public", prevNotice);
      fs.unlink(prevPath, (err) => {
        if (err) {
          // console.error("Error deleting the notice:", err);
        } else {
          // console.log("Notice deleted successfully!");
        }
      });
    } else {
      // console.log("No previous notice to delete");
    }

    // Remove the notice from the event
    await Event.deleteNotice(eventId);

    // Deleting the banner file:
    const prevFile = event[0].banner;
    if (prevFile) {
      // console.log("Deleting Previous file: ", prevFile);
      const prevPath = path.join(__dirname, "../public", prevFile);
      fs.unlink(prevPath, (err) => {
        if (err) {
          // console.error("Error deleting the file:", err);
        } else {
          // console.log("File deleted successfully!");
        }
      });
      await Event.deleteBanner(eventId);
    }

    // Flag the event as deleted
    const result = await Event.flagEventAsDeleted(eventId);
    // console.log("Event removed successfully, result:", result);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Original removeEvent function (now simplified)
exports.removeEvent = async (req, res) => {
  try {
    const id = req.params.eventId;
    await removeEventById(id);
    res.status(200).json({
      message: "Event removed successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.undoEvent = async (req, res) => {
  try {
    const id = req.params.eventId;

    const result = await Event.flagEventAsNotDeleted(id);
    // const isSet = await Event.changeDeadStatus(id, false)

    //make the deadline default to 3000
    await Event.makeDefault(id);

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
    const sLOA = event[0].signedLOA;
    const aR = event[0].attendanceReport; 
    if (prevFile) {
      // checks if the previous file is present to perform the deletion
      // console.log("Deleting Previous file: ", prevFile);

      const prevPath = path.join(__dirname, "../public", prevFile);
      // console.log(prevPath)

      // ------------------------ Cautious code begins ---------------------------------------
      fs.unlink(prevPath, (err) => {
        if (err) {
          // console.error("Error deleting the file:", err);
        } else {
          // console.log("File deleted successfully!");
        }
      });
      // ------------------------ Cautious code ends ---------------------------------------

      //make the banner null here
      const result = await Event.deleteBanner(id);
    } else {
      // console.log("No previous banner to delete");
    }

    //if loa is present previously, delete it
    if (loa) {
      // console.log("Deleting Previous loa: ", loa);

      const prevPath = path.join(__dirname, "../public", loa);

      // ------------------------ Cautious code begins ---------------------------------------
      fs.unlink(prevPath, (err) => {
        if (err) {
          // console.error("Error deleting the loa:", err);
        } else {
          // console.log("loa deleted successfully!");
        }
      });
      // ------------------------ Cautious code ends ---------------------------------------
    } else {
      // console.log("there was no loa to delete");
    }

    //delete notice

    const prevNotice = event[0].notice;
    if (prevNotice) {
      // checks if the previous file is present to perform the deletion
      // console.log("Deleting Previous notice: ", prevNotice);

      const prevPath = path.join(__dirname, "../public", prevNotice);
      // console.log(prevPath)

      // ------------------------ Cautious code begins ---------------------------------------
      fs.unlink(prevPath, (err) => {
        if (err) {
          // console.error("Error deleting the file:", err);
        } else {
          // console.log("File deleted successfully!");
        }
      });
      // ------------------------ Cautious code ends ---------------------------------------
      const result = await Event.deleteNotice(id);
    } else {
      // console.log("No previous notice to delete");
    }

    //delete the signed loa if present:
    if (sLOA){
      const prevPath = path.join(__dirname, "../public", "assets", "files", sLOA);
      // console.log(prevPath)

      // ------------------------ Cautious code begins ---------------------------------------
      fs.unlink(prevPath, (err) => {
        if (err) {
          console.log("Error deleting the file:", err);
        } else {
          console.log("File deleted successfully!");
        }
      });
      // ------------------------ Cautious code ends ---------------------------------------
      const result = await Event.deleteSLOA(id);

    } else {

    }

    //delete the attendance report as well:
    if (aR){
      const prevPath = path.join(__dirname, "../public", "assets", "files", aR);
      // console.log(prevPath)

      // ------------------------ Cautious code begins ---------------------------------------
      fs.unlink(prevPath, (err) => {
        if (err) {
          console.log("Error deleting the file:", err);
        } else {
          console.log("File deleted successfully!");
        }
      });
      // ------------------------ Cautious code ends ---------------------------------------
      const result = await Event.deleteAR(id);

    } else {

    }

    const result = await Event.deleteEvent(id);

    //deleting the event photos if they exist
    const prevZipFile = await event[0].eventPhotos;

    if (prevZipFile) {
      //previous file exists, delete it
      // console.log("Deleting Previous file: ", prevZipFile);
      const prevPath = path.join(__dirname, "../public", prevZipFile);
      fs.unlink(prevPath, (err) => {
        if (err) {
          // console.error("Error deleting previous event photos:", err);
        } else {
          // console.log("Previous photos deleted successfully!");
        }
      });
    } else {
      // console.log("No previous photos to delete")
    }

    res.status(200).json({ message: "Event Deleted Successfully", result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//upload event photos:
exports.uploadEventPhotos = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    //check if previous file exists
    const event = await Event.getAEvent(eventId);
    const prevFile = await event[0].eventPhotos;

    if (prevFile) {
      //previous file exists, delete it
      // console.log("Deleting Previous file: ", prevFile);
      const prevPath = path.join(__dirname, "../public", prevFile);
      fs.unlink(prevPath, (err) => {
        if (err) {
          // console.error("Error deleting previous event photos:", err);
        } else {
          // console.log("Previous photos deleted successfully!");
        }
      });
    } else {
      // console.log("No previous photos to delete")
    }

    if (req.files && req.files.photos) {
      // console.log("Zip File Received, saving");

      let file = req.files.photos;
      let fileName = new Date().getTime().toString() + "-" + file.name;
      const savePath = path.join(
        __dirname,
        "../public/assets/",
        "uploads",
        fileName
      );
      await file.mv(savePath);
      fileName = "assets/uploads/" + fileName;
      req.body.photos = fileName;

      const result = await Event.storePhoto(eventId, req.body.photos);
      const isStored = await Event.changePhotosUploadStatus(eventId);
      res
        .status(200)
        .json({
          message: "Successfully stored the event photos",
          result: result,
        });
    } else {
      // console.log("no file received")
      res.status(400).json({ message: "No file received" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//upload signedLOA:
exports.uploadSignedLOA = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    //check if previous file exists
    const event = await Event.getAEvent(eventId);
    const prevFile = await event[0].signedLOA;

    if (prevFile) {
      //previous file exists, delete it
      // console.log("Deleting Previous file: ", prevFile);
      const prevPath = path.join(__dirname, "../public", "assets", "files", prevFile);
      fs.unlink(prevPath, (err) => {
        if (err) {
          console.log("Error deleting previous Signed LOA:", err);
        } else {
          console.log("Previous Signed LOA deleted successfully!");
        }
      });
    } else {
      console.log("No previous signed LOA to delete");
    }
    // console.log(req.files);
    if (req.files && req.files.signedLOA) {
      console.log("Signed LOA Received, saving");

      let file = req.files.signedLOA;
      let fileName = "sLOA" + new Date().getTime().toString() + "-" + file.name;
      const savePath = path.join(
        __dirname,
        "../public/assets/",
        "files",
        fileName
      );
      await file.mv(savePath);
      req.body.signedLOA = fileName;

      const result = await Event.storeSignedLOA(eventId, req.body.signedLOA);
      res.status(200).json({ message: "Successfully stored signed LOA" });
    } else {
      console.log("no file received");
      res.status(400).json({ message: "No file received" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSignedLOA = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const event = await Event.getAEvent(eventId);
    const prevFile = await event[0].signedLOA;

    if (prevFile) {
      //previous file exists, delete it
      // console.log("Deleting Previous file: ", prevFile);
      const prevPath = path.join(__dirname, "../public", "assets", "files", prevFile);
      fs.unlink(prevPath, (err) => {
        if (err) {
          console.log("Error deleting previous Signed LOA:", err);
          res.status(500).json({message: "Error deleting previous Signed LOA:", error: err})

        } else {
          console.log("Previous Signed LOA deleted successfully!");
          res.status(200).json({message: "Previous Signed LOA deleted successfully!"})
        }
      });
      
      await Event.deleteSLOA(eventId) 
    } else {
      console.log("No previous signed LOA to delete");
      res.status(200).json({message: "No previous signed LOA to delete"})

    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//upload attendance report
exports.uploadAttendanceReport = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    //check if previous file exists
    const event = await Event.getAEvent(eventId);
    const prevFile = await event[0].attendanceReport;

    if (prevFile) {
      //previous file exists, delete it
      // console.log("Deleting Previous file: ", prevFile);
      const prevPath = path.join(__dirname, "../public", "assets", "files", prevFile);
      fs.unlink(prevPath, (err) => {
        if (err) {
          console.log("Error deleting previous attendance report:", err);
        } else {
          console.log("Previous Signed attendance report deleted successfully!");
        }
      });
    } else {
      console.log("No previous attendance report to delete");
    }
    // console.log(req.files);
    if (req.files && req.files.attendanceReport) {
      console.log("attendance report Received, saving");

      let file = req.files.attendanceReport;
      let fileName = "AR_" + new Date().getTime().toString() + "-" + file.name;
      const savePath = path.join(
        __dirname,
        "../public/assets/",
        "files",
        fileName
      );
      await file.mv(savePath);
      req.body.attendanceReport = fileName;

      const result = await Event.storeAttendanceR(eventId, req.body.attendanceReport);
      res.status(200).json({ message: "Successfully saved attendance report" });
    } else {
      console.log("no file received");
      res.status(400).json({ message: "No file received" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAttendanceReport = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const event = await Event.getAEvent(eventId);
    const prevFile = await event[0].attendanceReport

    if (prevFile) {
      //previous file exists, delete it
      // console.log("Deleting Previous file: ", prevFile);
      const prevPath = path.join(__dirname, "../public", "assets", "files", prevFile);
      fs.unlink(prevPath, (err) => {
        if (err) {
          console.log("Error deleting previous AR:", err);
          res.status(500).json({message: "Error deleting previous attendanc report for this event:", error: err})

        } else {
          console.log("Previous AR successfully!");
          res.status(200).json({message: "Previous Attendance Report deleted successfully!"})
        }
      });
      
      await Event.deleteAR(eventId) 
    } else {
      console.log("No previous AR to delete");
      res.status(200).json({message: "No previous Attendance report to delete"})

    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

