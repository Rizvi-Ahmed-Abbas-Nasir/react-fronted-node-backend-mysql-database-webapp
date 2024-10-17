const nodemailer = require('nodemailer');

exports.sendAttendanceQrcode = async (req, res) => {
  try {
    const { email, src, isOnline } = req.body;
    // console.log(email, src);

    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host : 'smtp.gmail.com',
      secure: true,
      port: 465,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_EMAIL_PASS
      }
    });

    let mailOptions = {}

    if (isOnline) {
      mailOptions = {
        from: process.env.NODEMAILER_EMAIL, // Sender address
        to: email, // Receiver
        subject: 'Attendance QR Code', // Subject line
        text: 'You are registered for an online event', // Plain text body
        html: `<p>You are registered for an online event. Here is the event link</p>
               <a href=${src}>Meeting Link</a>
               <p>[${src}]</p>
               `, // HTML body
      };
    } else {
      
      mailOptions = {
       from: process.env.NODEMAILER_EMAIL, // Sender address
       to: email, // Receiver
       subject: 'Attendance QR Code', // Subject line
       text: 'You are registered for the event, and this is your QR code.', // Plain text body
       html: `<p>You are registered for the event. Here is your QR code:</p>
              <img src="${src}" alt="QR Code" />`, // HTML body
       attachments: [
         {
           filename: 'qr-code.png',
           content: src.split('base64,')[1],
           encoding: 'base64'
         }
       ]
     };
    }


    // Send the email
    await transporter.sendMail(mailOptions);

    // Send a successful response
    return res.status(200).json({
      message: 'Email sent successfully',
      success: true
    });
  } catch (error) {
    console.error('Error sending email:', error.message);
    return res.status(500).json({
      errors: error.message
    });
  }
};
