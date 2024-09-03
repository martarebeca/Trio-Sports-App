import axios from 'axios';
import React, { useState } from 'react'
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import './editPassword.css'
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const EditPassword = () => {
  const initialValue = {
    text: "",
    show: false
  }

  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState(initialValue)
  const url = `${location.pathname}`
  const partes = url.split('/')
  const validationToken = partes[2]
  const navigate = useNavigate()
  

  const onSubmit = async () => {
    if(!password){
      setMsg({text: "El campo no puede estar vacío.", show: true})
      return;
    }else if(!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/.test(
      password
    )) {
      setMsg({text: "Contraseña no segura", show: true})
      return;
    }else{
      setMsg({show: false})      
    }
    try {
      const res = await axios.put("http://localhost:4000/api/users/editPassword", {password, validationToken})      
      navigate("/login")
    }catch(err){
      console.log(err);      
    }
  }

  const handleChange = (e) => {
    const password = e.target.value;
    setPassword(password)
  }

  return (
    <Container fluid="xl" className="my-3 d-flex flex-column justify-content-center align-items-center ">
      <Form className="my-5 d-flex flex-column text-center align-items-center">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className='fs-2'>Cambia la contraseña</Form.Label>
          <Form.Control
            className='edit-input m-4'
            type="password"
            placeholder="Nueva contraseña"
            name="password"
            value={password}
            onChange={handleChange}
          />
          {msg.show && <p>{msg.text}</p>}
          <Form.Text>
            Introduce una nueva contraseña
          </Form.Text>
        </Form.Group>
        <button type="button" className='trio-btn edit-input button-edit' onClick={onSubmit}>
          Cambiar
        </button>
      </Form>
    </Container>
  )
}
