const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const Event = require("../models/Event");

// exports.createNotice = async (req, res) => {
//   try {
//     const { eventNotice } = req.body;
//     const eventId = req.params.eventId;
//     //get event information
//     const event = await Event.getAEvent(eventId);
//     console.log(event);

//     //generate a notice based on the data
//     const data = {
//       date: event[0].date.toLocaleDateString("en-GB"),
//       eventName: event[0].eventName,
//       eventNotice: eventNotice,
//     };

//     const isGenerated = await this.createPDF(data);
//     if (!isGenerated) {
//       console.log("Error generating notice");
//       req.body.notice = null;
//     } else {
//       console.log("notice generated successfully");
//       req.body.notice = isGenerated;
//     }

//     const notice = isGenerated;

//     const isStored = await Event.storeNotice(notice, eventId);
//     res.status(201).json({ message: "Notice created successfully", isStored });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// //update the notice
// exports.updateNotice = async (req, res) => {
//   try {
//     const eventId = req.params.eventId;
//     const { eventNotice } = req.body;

//     //getting the previous filename from the db if present
//     const event = await Event.getAEvent(eventId);
//     const notice = event[0].notice;
//     //   console.log(notice)
//     //if notice is present previously, delete it
//     if (notice) {
//       console.log("Deleting Previous notice: ", notice);

//       const prevPath = path.join(__dirname, "../public", notice);

//       // ------------------------ Cautious code begins ---------------------------------------
//       fs.unlink(prevPath, (err) => {
//         if (err) {
//           console.error("Error deleting the notice:", err);
//         } else {
//           console.log("notice deleted successfully!");
//         }
//       });
//       // ------------------------ Cautious code ends ---------------------------------------
//     } else {
//       console.log("there was no notice to delete");
//     }

//     //generate a notice based on the data
//     const data = {
//       date: event[0].date.toLocaleDateString("en-GB"),
//       eventName: event[0].eventName,
//       eventNotice: eventNotice,
//     };

//     const isGenerated = await this.createPDF(data);
//     if (!isGenerated) {
//       console.log("Error generating updated notice");
//       req.body.notice = null;
//     } else {
//       console.log("notice updated successfully");
//       req.body.notice = isGenerated;
//     }
//     const updatedNotice = await req.body.notice;

//     const result = await Event.storeNotice(updatedNotice, eventId);

//     res.status(200).json({ message: "Notice Updated Successfully", result });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// //delete the notice
// exports.deleteNotice = async (req, res) => {
//   try {
//     const id = req.params.eventId;

//     //deleting the previous file

//     //getting the previous filename from the db if present
//     const event = await Event.getAEvent(id);
//     const prevNotice = event[0].notice;
//     if (prevNotice) {
//       // checks if the previous file is present to perform the deletion
//       console.log("Deleting Previous notice: ", prevNotice);

//       const prevPath = path.join(__dirname, "../public", prevNotice);
//       // console.log(prevPath)

//       // ------------------------ Cautious code begins ---------------------------------------
//       fs.unlink(prevPath, (err) => {
//         if (err) {
//           console.error("Error deleting the file:", err);
//         } else {
//           console.log("File deleted successfully!");
//         }
//       });
//       // ------------------------ Cautious code ends ---------------------------------------
//     } else {
//       console.log("No previous notice to delete");
//     }

    // const result = await Event.deleteNotice(id);
//     res.status(200).json({ message: "Notice Deleted Successfully", result });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

//the main function to create the pdf using the handlebar template under views directory
exports.createPDF = async (data) => {
  try {
    // Read and compile the template
    const templateHtml = fs.readFileSync(
      path.join(process.cwd(), "views", "notice.hbs"),
      "utf8"
    );
    const template = handlebars.compile(templateHtml);
    const html = template(data);

    // Create the PDF directory if it doesn't exist
    const pdfDir = path.join(process.cwd(), "public", "assets", "notice");
    console.log("notice specified directory: " + pdfDir);

    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir);
    }

    // Generate a unique filename with a timestamp
    const timestamp = Date.now();
    const pdfPath = path.join(pdfDir, `Notice-${timestamp}.pdf`);
    const pdfName = `Notice-${timestamp}.pdf`;
    console.log("Notice Name: " + pdfName);

    // Puppeteer options
    const options = {
      path: pdfPath,
      format: "A4", // Set page format to A4
      printBackground: true,
      displayHeaderFooter: false,
      margin: {
        top: "10mm",
        bottom: "30mm",
        left: "15mm",
        right: "15mm",
      },
      //   headerTemplate: `<img src="http://localhost:3000/letterhead.jpg" style="width: 100%;"/>`,
      //   footerTemplate: "<p></p>",
    };

    // Launch Puppeteer and generate the PDF
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      headless: true,
    });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.pdf(options);

    // Debugging output
    page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
    page.on("error", (error) => console.error("PAGE ERROR:", error));

    // Clean up and respond
    await browser.close();

    noticePath = path.join("assets", "notice", pdfName);
    return noticePath;
  } catch (error) {
    console.error("Error generating notice:", error);
    return false;
  }
};
