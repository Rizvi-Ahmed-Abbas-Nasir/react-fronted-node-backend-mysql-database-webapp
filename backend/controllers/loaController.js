const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");

//the main function to create the pdf using the handlebar template under views directory
exports.createPDF = async (data) => {
  try {
    // const data = {
    //   date: "10/09/2024",
    //   recipientName: "Satyam Bhambid",
    //   recipientOrganization: "Consultancy",
    //   recipientLocation: "Mumbai",
    //   subject: "API 101 Session Success",
    //   activity: "a workshop on improving employability skills for students",
    // };

    // Read and compile the template
    const templateHtml = fs.readFileSync(
      path.join(process.cwd(), "views", "template.hbs"),
      "utf8"
    );
    const template = handlebars.compile(templateHtml);
    const html = template(data);

    // Create the PDF directory if it doesn't exist
    const pdfDir = path.join(process.cwd(), "public", "assets", "loa");
    console.log("pdf specified directory: "+pdfDir)

    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir);
    }

    // Generate a unique filename with a timestamp
    const timestamp = Date.now();
    const pdfPath = path.join(
      pdfDir,
      `LOA-${data.recipientName}-${timestamp}.pdf`
    );
    const pdfName = `LOA-${data.recipientName}-${timestamp}.pdf`
    console.log("pdf Name: "+pdfName)

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

    loaPath = path.join("assets", "loa", pdfName)
    return loaPath;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};
