const nodemailer = require("nodemailer");
require ('dotenv').config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "triosports.oficial@gmail.com",
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = (email, name,token) => {
  let mensajeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>Bienvenido/a ${name}</h1>
  <a href="http://localhost:5173/validation/${token}">http://localhost:5173/validation/${token}</a>
</body>
</html>`;
  
  const info = transporter.sendMail({
    from: '"trio" <triosports.oficial@gmail.com>',
    to: email,
    subject: "bienvenido a trio",
    html: mensajeHtml
  })
  info
      .then(res=>console.log(res))
      .catch(err=>console.log(err))
};

module.exports = sendMail
