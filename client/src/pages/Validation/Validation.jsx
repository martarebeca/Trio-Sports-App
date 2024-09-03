import React, { useEffect } from 'react'
import axios from 'axios'
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const Validation = () => {
  const url = `${location.pathname}`
  const partes = url.split('/')
  const validationToken = partes[2]
  const navigate = useNavigate();
  useEffect(()=>{
    if(validationToken){
      axios.put(`http://localhost:4000/api/users/validation/${validationToken}`)
      .then(res=>{
        console.log(res)
      })
      .catch(error=>{
        console.log(error)
      })
    }
  },[])
  return (
    <div>Correo validado
      <Button onClick={()=>navigate("/login")}>Ir a Login</Button>
    </div>
  )
}
