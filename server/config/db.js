const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  dateStrings: true //esto hace que no devuelva la fecha como object DATE sino como string
})

connection.connect((err)=>{
  if(err){
    throw err;
  }else{
    console.log("Conexion a db correcta")
  }
})

module.exports = connection;