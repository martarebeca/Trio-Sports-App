import { format, getMonth, getYear, isValid, parse, subYears } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { TrioContext } from "../../context/TrioContextProvider";
import DatePicker from "react-datepicker";
import { ModalCreateSport } from "../ModalCreateSport/ModalCreateSport";
import axios from "axios";
import * as formik from "formik";
import * as yup from "yup";
import "./modalEditUser.css";
import { GENDER } from "../../helpers/genderData"
import { BsCalendar3 } from "react-icons/bs";

function ModalEditUser({ show, setShowModal, data }) {
  const [editUser, setEditUser] = useState(data);
  const [sportId, setSportId] = useState("");
  const [file, setFile] = useState();
  const { setUser, sports, setSports, token } = useContext(TrioContext);

  const handleClose = () => {
    setShowModal(false);
  };

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const range = (start, end, step = 1) => {
    let output = [];
    for (let i = start; i < end; i += step) {
      output.push(i);
    }
    return output;
  };

  const [startDate, setStartDate] = useState(editUser?.birth_date);
  const maxDate = subYears(new Date(), 18);
  const years = range(1990, getYear(new Date()) + 1, 1);
  const [errorDate, setErrorDate] = useState("");
  const [errorSports, setErrorSports] = useState("");

  /* VALIDATION */
  const { Formik } = formik;

  const schema = yup.object().shape({
    user_name: yup
      .string()
      .required("El Nombre es obligatorio")
      .matches(
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,15}$/,
        "El nombre ingresado no es válido. Por favor, asegúrate de que solo contenga letras, espacios, y no supere los 15 caracteres."
      ),
    last_name: yup
      .string()
      .required("Los Apellidos son obligatorios")
      .matches(
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,15}$/,
        "El apellido ingresado no es válido. Por favor, asegúrate de que solo contenga letras, espacios, y no supere los 15 caracteres."
      ),
    user_city: yup
      .string()
      .required("La ciudad es obligatorio")
      .matches(
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,200}$/,
        "La ciudad ingresada no es válido. Por favor, asegúrate de que solo contenga letras, espacios, y no supere los 200 caracteres."
      ),
  });

  const handleOnBlur = ({ target: { value } }) => {
    const date = parse(value, "dd/MM/yyyy", new Date());
    if (isValid(date)) {
      setErrorDate("");
    } else {
      setErrorDate("La fecha de nacimiento es un campo obligatorio ");
    }
  };

  /* GENERO */

  const [noBinario, setNoBinario] = useState(false);
  const selectNobinario = () => setNoBinario(!noBinario);

  const gender = (genero) => {
    setEditUser({ ...editUser, gender: genero });
  };

  /* SPORTS */

  const [modalAddSports, setModalAddSports] = useState(false);
  const addSportStatus = () => setModalAddSports(!modalAddSports);
  const [selectedSport, setSelectedSport] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/users/getPracticeSports`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setSelectedSport(res.data?.map((sports) => sports.sport_id));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const addSports = (e) => {
    if (selectedSport.length < 5) {
      setSelectedSport([...selectedSport, e]);
      setErrorSports("");
    } else {
      setErrorSports("Máximo 5 deportes");
    }
  };

  const removeSports = (e) => {
    if (selectedSport.length <= 1) {
      setErrorSports("Mínimo 1 deporte");
    } else {
      setSelectedSport(selectedSport.filter((sport) => sport !== e));
      setErrorSports("");
    }
  };

  const handleCheckboxChange = (sportId) => {
    selectedSport.includes(sportId)
      ? removeSports(sportId)
      : addSports(sportId);
  };

  const handleSportCreated = (newSport) => {
    setSports((prevSports) => [...prevSports, newSport]);
    setSportId(newSport.sport_id); //Selecciona automáticamente el nuevo deporte
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const onEditSubmit = (values) => {
    const date = format(startDate, "yyyy/MM/dd");
    const updatedEditUser = {
      ...editUser,
      ...values,
      birth_date: date,
      sports: selectedSport,
    };
    setEditUser(updatedEditUser);

    const newFormData = new FormData();
    newFormData.append("editUser", JSON.stringify(updatedEditUser));
    newFormData.append("file", file);

    axios
      .put("http://localhost:4000/api/users/editUser", newFormData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {

        if(res.data.img){
          setUser({...updatedEditUser, user_img: res.data.img});
          handleClose();
        } else {
          setUser(updatedEditUser);
          handleClose();
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Formik
      validationSchema={schema}
      onSubmit={onEditSubmit}
      validateOnMount={true}
      initialValues={{
        email: editUser.email,
        user_name: editUser.user_name,
        last_name: editUser.last_name,
        user_city: editUser.user_city,
        description: editUser.description,
      }}
    >
      {({ handleSubmit, handleChange, values, errors, isValid }) => (
        <>
          <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* EMAIL */}

              <Form noValidate onSubmit={handleSubmit}>
                {/* EMAIL */}

                <>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      name="email"
                      value={values.email}
                      disabled
                      className="form-input"
                    />
                    <Form.Text className="text-muted"></Form.Text>
                  </Form.Group>
                </>

                {/* NOMBRE */}

                <>
                  <Form.Group className="mb-3" controlId="user_name">
                    <Form.Label>NOMBRE</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      name="user_name"
                      onChange={handleChange}
                      value={values.user_name}
                      isInvalid={!!errors.user_name}
                      className="form-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.user_name}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted"></Form.Text>{" "}
                  </Form.Group>
                </>

                {/* APELLIDOS */}

                <>
                  <Form.Group className="mb-3" controlId="user_name">
                    <Form.Text className="text-muted"></Form.Text>
                    <Form.Group className="mb-3" controlId="last_name">
                      <Form.Label>APELLIDOS</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter last name"
                        name="last_name"
                        onChange={handleChange}
                        value={values.last_name}
                        isInvalid={!!errors.last_name}
                        className="form-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.last_name}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Text className="text-muted"></Form.Text>{" "}
                  </Form.Group>
                </>

                {/* CUMPLEAÑOS */}
                <div className="add-activity-datepicker-container">
                  <DatePicker
                    className="filter-datepicker"
                    dateFormat="dd/MM/yyyy"
                    locale="es"
                    maxDate={maxDate}
                    renderCustomHeader={({
                      date,
                      changeYear,
                      changeMonth,
                      decreaseMonth,
                      increaseMonth,
                      prevMonthButtonDisabled,
                      nextMonthButtonDisabled,
                    }) => {
                      const currentYear = getYear(date);
                      const currentMonth = months[getMonth(date)];

                      return (
                        <div
                          style={{
                            margin: 10,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            type="button"
                            onClick={decreaseMonth}
                            disabled={prevMonthButtonDisabled}
                          >
                            {"<"}
                          </button>
                          <select
                            value={
                              months.includes(currentMonth)
                                ? currentMonth
                                : months[0]
                            }
                            onChange={({ target: { value } }) =>
                              changeMonth(months.indexOf(value))
                            }
                          >
                            {months.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>

                          <select
                            value={
                              years.includes(currentYear)
                                ? currentYear
                                : years[0]
                            }
                            onChange={({ target: { value } }) =>
                              changeYear(Number(value))
                            }
                          >
                            {years.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={increaseMonth}
                            disabled={nextMonthButtonDisabled}
                          >
                            {">"}
                          </button>
                        </div>
                      );
                    }}
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    onBlur={handleOnBlur}
                    placeholderText="Introduce tu fecha de nacimiento"
                  />
                  <BsCalendar3 className="add-activity-calendar-icon" />
                  {errorDate ? <span>{errorDate}</span> : null}
                </div>

                {/* CIUDAD */}
                <>
                  <Form.Group className="mb-3" controlId="user_city">
                    <Form.Label>CUAL ES TU CIUDAD</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="cual es tu ciudad"
                      name="user_city"
                      onChange={handleChange}
                      value={values.user_city}
                      isInvalid={!!errors.user_city}
                      className="form-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.user_city}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted"></Form.Text>
                  </Form.Group>
                </>

                {/* GENERO */}

                <>
                  <Form.Label className="mb-3">GENERO</Form.Label>
                  <Form.Group controlId="formGenderId">
                    <Form.Select
                      className="form-select"
                      onChange={(e) => gender(e.target.value)}
                      value={editUser.gender}
                    >
                      {GENDER.map((e, idx) => (
                        <option key={idx} value={e}>
                          {e}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </>

                {/* SPORTS */}

                <>
                  <Form.Group controlId="formSportId">
                    <Form.Label className="my-3">DEPORTES</Form.Label>
                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                      {sports.map((e, idx) => (
                        <Form.Check
                          key={idx}
                          type="checkbox"
                          label={e.sport_name}
                          checked={selectedSport.includes(e.sport_id)}
                          onChange={() => handleCheckboxChange(e.sport_id)}
                          className="form-checkbox"
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      className="trio-btn mt-3"
                      onClick={addSportStatus}
                    >
                      Añadir deporte
                    </button>
                  </Form.Group>
                  <ModalCreateSport
                    show={modalAddSports}
                    closeModal={addSportStatus}
                    onSportCreated={handleSportCreated}
                    existingSports={sports}
                  />
                  {errorSports ? <span>{errorSports}</span> : null}
                </>

                {/* DESCRIPTION */}

                <>
                  <Form.Group className="my-3" controlId="user_city">
                    <Form.Label>DESCRIPCIÓN</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Cuentanos más sobre ti..."
                      name="description"
                      onChange={handleChange}
                      value={values.description}
                      className="form-input"
                      maxLength={255}
                    />
                    <Form.Text className="text-muted"></Form.Text>
                    <Form.Text className="text-muted">
                    {`${values.description.length}/255 caracteres`}
                    </Form.Text>
                  </Form.Group>
                </>
                {/* IMAGEN */}

                <>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="file" className="trio-btn text-center">
                      Editar foto de perfil
                    </Form.Label>
                    <Form.Control
                      id="file"
                      type="file"
                      hidden
                      onChange={handleFile}
                    />
                  </Form.Group>
                </>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={handleClose}
                className="trio-cancel-btn"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isValid || errorDate}
                className="trio-btn"
              >
                Guardar Cambios
              </button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </Formik>
  );
}

export default ModalEditUser;
