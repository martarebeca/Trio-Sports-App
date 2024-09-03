import { useState } from "react";
import { Modal, Form, Alert } from "react-bootstrap";

const ModalCreateComment = ({ show, handleClose, handleCommentSubmit }) => {
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    // longitud del comentario
    if (comment.trim() === "") {
      setError("El comentario no puede estar vacío.");
      return;
    }
    // Si pasa las validaciones, envía el comentario
    handleCommentSubmit(comment);
    setComment(""); 
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Añadir comentario</Modal.Title>
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
              value={comment}
              maxLength={255} 
              className="form-input" 
              onChange={(e) => {
                setComment(e.target.value);
                if (e.target.value.length <= 255) setError("");  
              }}
            />
            <Form.Text className="text-muted">
              {`${comment.length}/255 caracteres`}
            </Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="trio-cancel-btn me-2" onClick={handleClose}>
          Cancelar
        </button>
        <button type="submit" className="trio-btn" onClick={handleSubmit}>
          Aceptar
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCreateComment;



