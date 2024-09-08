const nodemailer = require('nodemailer')
//connect()

exports.sendAttendanceQrcode = async (req, res) => {
   try{  
     const {email, src}= req.body;
    console.log(email,src);
   //send verification mail
   
    const transporter = nodemailer.createTransport({
            service:"gmail",
            secure:true,
            port:465,
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_EMAIL_PASS
              },
          
          });
           
        console.log(email);
        console.log(src);
       const reciver = {
        from: process.env.NODEMAILER_EMAIL, // sender address
        to: email, // list of receivers
        subject: 'attendance qr code ', // Subject line
        text: "registered for event and this is your qr code", // plain text body
        html: `<p>Click 
               <br>
                <img src="${email}" alt="QR Code" />
                <h2>${email} </h2>
            </p>
            `, // html body
        attachments: [
                {
                  filename: 'qr-code.png ',
                  content: src.split('base64,')[1],
                  encoding: 'base64',
                },
            ],     
       }
       const info = await transporter.sendMail(reciver);
       return res.json({
        message:"email send success",
        success : true ,
        
       });
   }
   catch(error){
    return res.json({errors: error.message},{status: 500})

   }
}

