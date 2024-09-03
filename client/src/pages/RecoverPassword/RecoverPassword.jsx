import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import './recoverPassword.css'
import { Container } from "react-bootstrap";

export const RecoverPassword = () => {
  const initialValue = {
    text: "",
    show: false,
  };

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(initialValue);

  const handleChange = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onSubmit = async () => {
    if (!email) {
      setMsg({ text: "El campo no puede estar vacío", show: true });      
    }else if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)){
      setMsg({text: "Formato de email incorrecto", show:true})
    } else{
      setMsg({text: "Revisa tu correo electrónico.", show:true})
    }
    try {
      const res = await axios.post(
        "http://localhost:4000/api/users/recoverPassword",
        {id: email}
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container fluid="xl" className="my-3 d-flex flex-column justify-content-center align-items-center ">
      <Form className="my-5 d-flex flex-column text-center align-items-center">
        <Form.Group className="mb-3 d-flex flex-column align-items-center" controlId="formBasicEmail">
          <Form.Label className="fs-2">¿Problemas con la contraseña?</Form.Label>
          <Form.Control
            className="recover-input m-4"
            type="email"
            placeholder="Introduce tu email"
            name="email"
            value={email}
            onChange={handleChange}
          />
          {msg.show && <p>{msg.text}</p>}
          <Form.Text>
            Introduce la dirección de correo electrónico que utilizas en tu
            cuenta. Te enviaremos instrucciones para reestablecer la contraseña.
          </Form.Text>
        </Form.Group>
        <button type="button" className="trio-btn recover-input button-recover" onClick={onSubmit}>
          Enviar
        </button>
      </Form>
    </Container>
  );
};
