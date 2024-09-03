import React, { useContext, useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { TrioContext } from "../../context/TrioContextProvider";
import axios from "axios";
import { format } from "date-fns";

export const ModalCreateMessage = ({show, setShowModal, oneUser}) => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const {user} = useContext(TrioContext)

  const handleSubmit = () => {
    // longitud del comentario
    if (message.trim() === "") {
      setError("El comentario no puede estar vacío.");
      return;
    }

    // Si pasa las validaciones, envía el comentario
    const sendMessage = async () => {
      let date = format(new Date(), "yyyy-MM-dd HH-mm-ss")
      let receiver = oneUser?.user_id
      let userID = user?.user_id
      try{
        const res = await axios.post('http://localhost:4000/api/users/sendMessage', {message, date, receiver, userID } )     
        setMessage(""); 
        handleClose();
      }catch(err){
        console.log(err);        
      }
    }
    sendMessage()
  };

  const handleClose = () => {
    setShowModal(false)
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Enviar mensaje a {oneUser.user_name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group controlId="commentText">
            <Form.Label></Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Escribe aquí tu comentario..."
              value={message}
              maxLength={255}  
              onChange={(e) => {
                setMessage(e.target.value);
                if (e.target.value.length <= 255) setError("");  
              }}
            />
            <Form.Text className="text-muted">
              {`${message.length}/255 caracteres`}
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="trio-cancel-btn" onClick={handleClose}>
          Cancelar
        </button>
        <button type="button" className="trio-btn"  onClick={handleSubmit}>
          Aceptar
        </button>
      </Modal.Footer>
    </Modal>
  )
}
