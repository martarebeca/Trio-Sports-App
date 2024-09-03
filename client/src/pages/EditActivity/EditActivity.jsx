import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Container, Alert, Row, Col } from "react-bootstrap";
import { BsCalendar3 } from "react-icons/bs";
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";
import { TrioContext } from "../../context/TrioContextProvider";

import "../AddActivity/addActivityStyle.css";

registerLocale("es", es);

export const EditActivity = () => {
  const { token } = useContext(TrioContext);
  const { activity_id } = useParams();
  const [dateTimeActivity, setDateTimeActivity] = useState(null);
  const [limitUsers, setLimitUsers] = useState("");
  const [title, setTitle] = useState("");
  const [activityCity, setActivityCity] = useState("");
  const [activityAddress, setActivityAddress] = useState("");
  const [details, setDetails] = useState("");
  const [mapsLink, setMapsLink] = useState("");
  const [sportName, setSportName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // Cargar los datos de la actividad existente
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/activity/getOneActivity/${activity_id}`,
          {
            headers: { Authorization: `Bearer ${token}` }, // token
          }
        );
        const activity = response.data;
        setTitle(activity.title);
        setLimitUsers(activity.limit_users);
        setActivityCity(activity.activity_city);
        setActivityAddress(activity.activity_address);
        setDetails(activity.details);
        setMapsLink(activity.maps_link);
        setDateTimeActivity(new Date(activity.date_time_activity));
        setSportName(activity.sport_name);
      } catch (error) {
        console.error("Error al cargar la actividad:", error);
      }
    };
    fetchActivity();
  }, [activity_id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const year = dateTimeActivity.getFullYear();
      const month = String(dateTimeActivity.getMonth() + 1).padStart(2, "0");
      const day = String(dateTimeActivity.getDate()).padStart(2, "0");
      const hours = String(dateTimeActivity.getHours()).padStart(2, "0");
      const minutes = String(dateTimeActivity.getMinutes()).padStart(2, "0");
      const seconds = "00";

      const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      const response = await axios.put(
        `http://localhost:4000/api/activity/editActivity/${activity_id}`,
        {
          date_time_activity: formattedDateTime,
          limit_users: limitUsers || null,
          title,
          activity_city: activityCity,
          activity_address: activityAddress,
          details,
          maps_link: mapsLink || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // token
        }
      );

      if (response.status === 200) {
        setSuccess("Actividad actualizada con éxito");
        setTimeout(() => {
          navigate("/profile"); // Se redirige a la vista de perfil actualizada
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error);
      } else {
        setError("Error al actualizar la actividad. Inténtalo de nuevo.");
      }
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/activity/deleteActivity/${activity_id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }, // token
        }
      );

      setSuccess("Actividad eliminada correctamente.");

      setTimeout(() => {
        navigate("/profile"); // Redirigir a la vista de perfil actualizada después de eliminar
      }, 2000);
    } catch (error) {
      console.error("Error al eliminar la actividad:", error);
      setError("Error al eliminar la actividad. Inténtalo de nuevo.");
    }
  };

  const handleCancel = () => {
    navigate("/profile"); // Redirigir a la vista de perfil actualizada
  };

  return (
    <Container
      fluid="xxl"
      className="d-flex justify-content-center align-items-start m-auto"
    >
      <div
        className="w-100 container-add-activity"
        style={{ maxWidth: "600px", padding: "10px 20px", margin: "5px" }}
      >
        <h4 className="text-center mt-0">
          Formulario de edición de una actividad
        </h4>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <div className="add-activity-custom-divider mt-2 mb-2"></div>

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTitle" className="mb-1">
            <Form.Label>Título</Form.Label>
            <Form.Control
              type="text"
              placeholder="Introduce el título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
            />
          </Form.Group>

          <Row className="mb-2 d-flex flex-wrap">
            <Col xs="12" sm="6" md="6" lg="6" xl="6" xxl="6">
              <Form.Group controlId="formLimitUsers">
                <Form.Label>Número de Participantes</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Sin límite"
                  value={limitUsers}
                  onChange={(e) =>
                    setLimitUsers(e.target.value < 0 ? 0 : e.target.value)
                  }
                  className="form-input"
                />
              </Form.Group>
            </Col>
            <Col xs="12" sm="6" md="6" lg="6" xl="6" xxl="6">
              <Form.Group controlId="formSportName">
                <Form.Label>Deporte</Form.Label>
                <Form.Control
                  type="text"
                  value={sportName}
                  disabled
                  className="form-input"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="formDateTimeActivity" className="mb-1">
            <Form.Label>Día y Hora</Form.Label>
            <div className="add-activity-datepicker-container">
              <DatePicker
                selected={dateTimeActivity}
                onChange={(date) => setDateTimeActivity(date)}
                showTimeSelect
                timeCaption="Hora"
                minDate={new Date()}
                dateFormat="Pp"
                locale="es"
                placeholderText="Selecciona día y hora"
                className="form-control add-activity-datepicker form-datepicker"
                required
              />
              <BsCalendar3 className="add-activity-calendar-icon" />
            </div>
          </Form.Group>

          <Form.Group controlId="formActivityCity" className="mb-1">
            <Form.Label>Ciudad</Form.Label>
            <Form.Control
              type="text"
              placeholder="Introduce la ciudad"
              value={activityCity}
              onChange={(e) => setActivityCity(e.target.value)}
              required
              className="form-input"
            />
          </Form.Group>

          <Form.Group controlId="formActivityAddress" className="mb-1">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              placeholder="Introduce la dirección"
              value={activityAddress}
              onChange={(e) => setActivityAddress(e.target.value)}
              required
              className="form-input"
            />
          </Form.Group>

          <Form.Group controlId="formMapsLink" className="mb-1">
            <Form.Label>Google Maps Link</Form.Label>
            <Form.Control
              type="url"
              placeholder="Introduce el enlace de Google Maps"
              value={mapsLink}
              onChange={(e) => setMapsLink(e.target.value)}
              className="form-input"
            />
          </Form.Group>

          <Form.Group controlId="formDetails" className="mb-1">
            <Form.Label>Descripción Breve</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Introduce una breve descripción"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              maxLength={255}
              className="form-input"
            />
            <Form.Text className="text-muted">
              {`${details.length}/255 caracteres`}
            </Form.Text>
          </Form.Group>
          <div className="add-activity-custom-divider mt-1 mb-1"></div>
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="trio-cancel-btn mt-3 me-2"
              onClick={handleCancel}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="trio-btn mt-3 me-3"
              onClick={handleDelete}
            >
              Borrar actividad
            </button>

            <button type="submit" className="trio-btn mt-3">
              Aceptar
            </button>
          </div>
        </Form>
      </div>
    </Container>
  );
};
