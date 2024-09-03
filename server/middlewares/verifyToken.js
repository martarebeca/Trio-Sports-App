const jwt = require('jsonwebtoken');
require ('dotenv').config();
const verifyToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if(!auth){
    console.log("hola1")
    return res.status(401).json({status:401, message:"1No autorizado"})
  }
  const token = auth.split(" ")[1];
  if(!token){
    console.log("Hola 2")
    return res.status(401).json({status:401, message:"2No autorizado"})
  }
  jwt.verify(token, process.env.SECRET_KEY, (error)=>{
    if(error){
      console.log("hola3")
      return res.status(401).json({status:401, message:"3No autorizado"})
    }else{next()}
  })
}

module.exports = verifyToken;