import { useState } from "react";
import { Modal, Form, Alert } from "react-bootstrap";
import axios from "axios";

export const ModalCreateSport = ({
  show,
  closeModal,
  onSportCreated,
  existingSports,
}) => {
  const [sportName, setSportName] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setSportName(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Verificamos si el deporte ya existe en la lista
    const sportExists = existingSports.some(
      (sport) => sport.sport_name.toLowerCase() === sportName.toLowerCase()
    );

    if (sportExists) {
      setError("El deporte ya existe");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/sports/createSport",
        { sport_name: sportName }
      );

      if (response.status === 201) {
        onSportCreated(response.data);
        setSportName("");
        closeModal();
      }
    } catch (error) {
      console.log("Error en la solicitud:", error.response || error);

      if (error.response && error.response.data) {
        setError(
          error.response.data.error ||
            "No se puede crear el deporte. Inténtalo de nuevo con otro deporte o elija un deporte de la lista."
        );
      } else {
        setError("Error al crear el deporte. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <Modal show={show} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Formulario de creación de nuevo deporte</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="sportName">
            <Form.Control
              type="text"
              name="sportName"
              placeholder="Nombre del nuevo deporte"
              value={sportName}
              onChange={handleChange}
              required
              className="form-input"
            />
            {/* Mostrar el mensaje de error  debajo del input */}
            {error && (
              <Alert variant="danger" className="mt-2">
                {error}
              </Alert>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <button
          type="button"
          className="trio-cancel-btn me-2"
          onClick={closeModal}
        >
          Cancelar
        </button>
        <button type="button" className="trio-btn" onClick={handleSubmit}>
          Aceptar
        </button>
      </Modal.Footer>
    </Modal>
  );
};
