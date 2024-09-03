const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "triosports.oficial@gmail.com",
    pass: "qtecywagqzsjlmuu",
  },
});

const recuperarPassword = (email,  token) => {
  let mensajeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>Recupera tu cuenta</h1>
  <p>Para recupear tu cuenta pulsa en el siguiente enlace</p>
  <a href="http://localhost:5173/editPassword/${token}">http://localhost:5173/editPassword/${token}</a>"
</body>
</html>`;

const info = transporter.sendMail({
  from: '"trio" <triosports.oficial@gmail.com>',
  to: email,
  subject: "Recupera tu contraseña",
  html: mensajeHtml 
})
info
      .then(res=>console.log(res))
      .catch(err=>console.log(err))
}

module.exports = recuperarPassword