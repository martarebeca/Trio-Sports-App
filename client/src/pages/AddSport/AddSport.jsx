import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TrioContext } from "../../context/TrioContextProvider";
import { Container, Form, Row, Col } from "react-bootstrap";

export const AddSport = () => {
  const { token, setSports } = useContext(TrioContext);
  const [sportName, setSportName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSportName(e.target.value);
  };

  const handleCancel = () => {
    navigate("/allActivities");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:4000/api/sports/createSport",
        { sport_name: sportName },
        {
          headers: { Authorization: `Bearer ${token}` }, // token
        }
      );

      if (response.status === 201) {
        setSuccess("Deporte creado con éxito");

        // Se obtiene el nuevo deporte desde la respuesta del servidor
        const newSport = response.data;

        // Se actualiza el estado global con los deportes ordenados alfabéticamente por nombre
        setSports((prevSports) => {
          const updatedSports = [...prevSports, newSport];
          return updatedSports.sort((a, b) =>
            a.sport_name.localeCompare(b.sport_name, "es", {
              sensitivity: "base",
            })
          );
        });

        //Se redirige al formulario de creación de una  actividad después de un breve retraso
        setTimeout(() => {
          navigate("/addActivity");
        }, 2000);
      }
    } catch (error) {
      console.log("Error en la solicitud:", error.response || error);

      if (error.response && error.response.data) {
        setError(
          error.response.data.error ||
            "El deporte ya existe. Cree una actividad para dicho deporte o introduzca otro deporte."
        );
      } else {
        setError("Error al crear el deporte. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <Container
      fluid="xxl"
      className="d-flex justify-content-center align-items-start"
      style={{ marginTop: "100px" }}
    >
      <div
        className="w-100 container-add-activity"
        style={{ maxWidth: "600px", padding: "20px" }}
      >
        <h4 className="text-center mb-2">
          Formulario de creación de un deporte
        </h4>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {success && <div style={{ color: "green" }}>{success}</div>}

        <div className="add-activity-custom-divider mt-2 mb-2"></div>

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group controlId="formText" className="mb-2">
                <Form.Label>Nombre del deporte</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Introduce el nombre del deporte"
                  value={sportName}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="add-activity-custom-divider mt-2 mb-3"></div>

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="trio-cancel-btn me-2"
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <button type="submit" className="trio-btn">
              Aceptar
            </button>
          </div>
        </Form>
      </div>
    </Container>
  );
};
