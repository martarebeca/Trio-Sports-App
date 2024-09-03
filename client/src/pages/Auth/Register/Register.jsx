import { useContext, useState } from "react";
import Form from "react-bootstrap/Form";
import { Button, Container } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
import "./register.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getMonth, getYear, format, subYears } from "date-fns";
import { setDefaultLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import { useNavigate } from "react-router-dom";
import { ModalCreateSport } from "../../../components/ModalCreateSport/ModalCreateSport";
import { TrioContext } from "../../../context/TrioContextProvider";
setDefaultLocale("es");
import ProgressBar from "react-bootstrap/ProgressBar";
import { BsCalendar3 } from "react-icons/bs";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"; 

const initialValue = {
  email: "",
  password: "",
  user_name: "",
  last_name: "",
}

export const Register = () => {
  const [userRegister, setUserRegister] = useState(initialValue);
  const [page, setpage] = useState(0);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [sportId, setSportId] = useState("");
  //manejo de errores nuevo
  const [formErrors, setFormErrors] = useState({});
  const [validateEmail, setValidateEmail] = useState(false);
  const [validatePassword, setValidatePassword] = useState(false);
  const { sports, setSports } = useContext(TrioContext);
  const [contador, setContador] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const handleRegister = (e) => {
    const { name, value } = e.target;
    setUserRegister({ ...userRegister, [name]: value });
    if (name == "description") {
      setContador(value);
    }
  };

  //validación de campos
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "user_name":
        if (value === "") {
          error = "El nombre es obligatorio";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,15}$/.test(value)) {
          error =
            "El nombre ingresado no es válido. Por favor, asegúrate de que solo contenga letras, espacios, y no supere los 15 caracteres.";
        } else {
          error = "";
        }
        break;
      case "last_name":
        if (!value) {
          error = "El apellido es obligatorio";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,15}$/.test(value)) {
          error =
            "El apellido ingresado no es válido. Por favor, asegúrate de que solo contenga letras, espacios, y no supere los 15 caracteres.";
        } else {
          error = "";
        }
        break;
      case "user_city":
        if (!value) {
          error = "La ciudad es un campo obligatorio";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{1,200}$/.test(value)) {
          error =
            "La ciudad ingresada no es válido. Por favor, asegúrate de que solo contenga letras, espacios, y no supere los 200 caracteres.";
        } else {
          error = "";
        }
        break;

      default:
        break;
    }

    setFormErrors({ ...formErrors, [name]: error });

    // Retorna true si no hay errores
    return error === "";
  };

  const continuarEmail = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/users/emailValidator",
        userRegister
      );

      let emailIsValid = false;
      let passwordIsValid = false;
      let emailError = "";
      let passwordError = "";

      if (
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
          userRegister.email
        )
      ) {
        emailError = "Formato de email incorrecto";
      } else if (res.data[0]) {
        emailError = "Este email ya esta en uso";
      } else {
        emailIsValid = true;
      }

      if (!userRegister.password) {
        passwordError = "La contraseña es obligatoria";
      } else if (
        !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/.test(
          userRegister.password
        )
      ) {
        passwordError = "Contaseña no segura";
      } else {
        passwordIsValid = true;
      }

      setFormErrors({
        ...formErrors,
        ["email"]: emailError,
        ["password"]: passwordError,
      });

      setValidateEmail(emailIsValid);
      setValidatePassword(passwordIsValid);

      if (emailIsValid && passwordIsValid) {
        setpage(page + 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const continuar = () => {
    const isValid = Object.keys(userRegister).every((key) =>
      validateField(key, userRegister[key])
    );

    if (isValid) {
      if(page === 1){
        setUserRegister({...userRegister, user_city: ""})
        setpage(page + 1);
        setFormErrors({});
      }else{
        setpage(page + 1);
        setFormErrors({});
      }
    }
  };

  const volver = () => {
    setpage(page - 1);
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
  const [defaultDate, setDefaultDate] = useState(subYears(new Date(), 18));
  const [startDate, setStartDate] = useState(null);
  const maxDate = subYears(new Date(), 18);
  const years = range(1900, getYear(new Date()) + 1, 1);
  const lastLogDate = startDate ? format(startDate, `yyyy-MM-dd HH-mm-ss`) : "";
  const continuarBirthDate = () => {
    setpage(page + 1);
    const Date = format(startDate, `yyyy-MM-dd`);
    setUserRegister({ ...userRegister, birth_date: Date });
  };

  /* GENERO */

  const [noBinario, setNoBinario] = useState(false);
  const selectNobinario = () => setNoBinario(!noBinario);
  const generos = [
    "Hombre trans",
    "Mujer trans",
    "Género Fluido",
    "No binario",
    "Pangénero",
  ];
  const gender = (genero) => {
    setUserRegister({ ...userRegister, gender: genero });
  };

  /* SPORTS */

  const [modalAddSports, setModalAddSports] = useState(false);
  const addSportStatus = () => setModalAddSports(!modalAddSports);
  const [selectedSport, setSelectedSport] = useState([]);

  const addSports = (e) => {
    setSelectedSport([...selectedSport, e]);
  };

  const removeSports = (e) => {
    setSelectedSport(selectedSport.filter((sport) => sport !== e));
  };
  const addUserSportsContinuar = (array) => {
    setpage(page + 1);
    setUserRegister({ ...userRegister, sports: array });
  };

  const handleSportCreated = (newSport) => {
    setSports((prevSports) => [...prevSports, newSport]);
    setSportId(newSport.sport_id); //Selecciona automáticamente el nuevo deporte
  };
  /* ENVIAR DATOS REGISTER */
  const [file, setFile] = useState();
  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = () => {
    const newFormData = new FormData();
    newFormData.append("userRegister", JSON.stringify(userRegister));
    newFormData.append("last_log_date", lastLogDate);
    newFormData.append("sports", selectedSport);

    if (file) {
      newFormData.append("file", file);
    }

    axios
      .post("http://localhost:4000/api/users/createUser", newFormData)
      .then((res) => {
        setpage(page+1)
      })
      .catch((err) => console.log(err));
  };

  const toLogin = ()=>{
    navigate("/login")
  }

  return (    <Container className="body-register">
    <Form action="">
      {page === 0 ? (
        <div className="email-password">
          <ProgressBar animated now={11.11} className="custom-progress" />
          <h2 className="register-text">Correo y Contraseña</h2>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label></Form.Label>
            <Form.Control
              type="email"
              placeholder="Escribe email"
              name="email"
              onChange={handleRegister}
              value={userRegister?.email}
              className="trio-input trio-input:focus"
            />
            {formErrors.email ? (
              <span className="error-msg">{formErrors.email}</span>
            ) : null}
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <div style={{ position: "relative" }}>
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Escribe tu contraseña"
                name="password"
                onChange={handleRegister}
                value={userRegister?.password}
                className="trio-input trio-input:focus"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#999",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
            {formErrors.password ? (
              <span className="error-msg">{formErrors.password}</span>
            ) : null}
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>
          <div className="buttons-email">
            {!userRegister.email || !userRegister.password ? (
              <button className="trio-cancel-btn" type="button">
                Continuar
              </button>
            ) : (
              <button
                className="trio-btn"
                type="button"
                onClick={continuarEmail}
              >
                Continuar
              </button>
            )}
          </div>
        </div>
      ) : null}
        {/* NOMBRE Y APELLIDOS*/}

        {page == 1 ? (
          <div className="name">
            <ProgressBar animated now={22.22} className="custom-progress" />
            <h2 className="register-text">¿Cómo te llamas?</h2>
            <Form.Group className="mb-3 input-form" controlId="user_name">
              <Form.Label></Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                name="user_name"
                onChange={handleRegister}
                value={userRegister?.user_name}
                className="trio-input trio-input:focus"
              />
              {formErrors.user_name ? (
                <span className="error-msg">{formErrors.user_name}</span>
              ) : null}
              <Form.Text className="text-muted"></Form.Text>{" "}
            </Form.Group>
            <Form.Group className="mb-3 input-form" controlId="last_name">
              <Form.Label></Form.Label>
              <Form.Control
                type="text"
                placeholder="Apellidos"
                name="last_name"
                onChange={handleRegister}
                value={userRegister?.last_name}
                className="trio-input trio-input:focus"
              />
              {formErrors.last_name ? (
                <span className="error-msg">{formErrors.last_name}</span>
              ) : null}
            </Form.Group>

            <div className="buttons-general">
              <button onClick={volver} className="trio-btn" type="button">
                Volver
              </button>
              {!userRegister.user_name ? (
                <button className="trio-cancel-btn " type="button">
                  Continuar
                </button>
              ) : (
                <button onClick={continuar} className="trio-btn" type="button">
                  Continuar
                </button>
              )}
            </div>
          </div>
        ) : null}

        {/* CUMPLEAÑOS */}
        {page === 2 ? (
          <div className="birthDate">
            <ProgressBar animated now={33.33} className="custom-progress" />
            <h2 className="register-text">¿Cuándo es tu cumpleaños?</h2>
            <div className="container1 add-activity-datepicker-container">
              <DatePicker
                className="trio-input trio-input:focus"
                isClearable
                locale={es}
                maxDate={maxDate}
                renderCustomHeader={({
                  date,
                  changeYear,
                  changeMonth,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => (
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
                      value={getYear(date)}
                      onChange={({ target: { value } }) => changeYear(value)}
                    >
                      {years.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <select
                      value={months[getMonth(date)]}
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

                    <button
                      type="button"
                      onClick={increaseMonth}
                      disabled={nextMonthButtonDisabled}
                    >
                      {">"}
                    </button>
                  </div>
                )}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
              <BsCalendar3 className="add-activity-calendar-icon" />
            </div>
            <div className="buttons-general">
              <button onClick={volver} type="button" className="trio-btn">
                Volver
              </button>
              {startDate ? (
                <button
                  onClick={continuarBirthDate}
                  type="button"
                  className="trio-btn"
                >
                  Continuar
                </button>
              ) : (
                <button className="trio-cancel-btn " type="button">
                  Continuar
                </button>
              )}
            </div>
          </div>
        ) : null}

        {/* CIUDAD */}
        {page == 3 ? (
          <div className="city">
            <ProgressBar animated now={44.44} className="custom-progress" />
            <h2 className="register-text">¿Dónde vives?</h2>
            <div className="container1">
              <Form.Group className="mb-3" controlId="user_city">
                <Form.Control
                  type="text"
                  placeholder="Cuál es tu ciudad"
                  name="user_city"
                  onChange={handleRegister}
                  value={userRegister?.user_city}
                  className="trio-input trio-input:focus"
                />
                {formErrors.user_city ? (
                  <span className="error-msg">{formErrors.user_city}</span>
                ) : null}
              </Form.Group>
            </div>
            <div className="buttons-general">
              <button onClick={volver} className="trio-btn">
                Volver
              </button>
              {!userRegister.user_city ? (
                <button className="trio-cancel-btn ">Continuar</button>
              ) : (
                <button onClick={continuar} className="trio-btn ">
                  Continuar
                </button>
              )}
            </div>
          </div>
        ) : null}

        {/* GENERO */}
        {page == 4 ? (
          <div className="gender">
            <ProgressBar animated now={55.55} className="custom-progress" />
            <h2 className="register-text-block">¿Cuál es tu género?</h2>
            {noBinario ? (
              <div className="list-genders">
                <ListGroup as="ul" className="all_genders custom-active">
                  {generos.map((e, idx) => (
                    <ListGroup.Item
                      as="li"
                      key={idx}
                      onClick={() => gender(e)}
                      className={e === userRegister?.gender ? "active" : ""}
                    >
                      {e}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
                <button
                  type="button"
                  onClick={() => setNoBinario(false)}
                  className="trio-btn"
                >
                  Atras
                </button>
              </div>
            ) : (
              <div className="list-genders">
                <button
                  type="button"
                  className="trio-btn"
                  onClick={() => gender("Hombre")}
                >
                  Hombre
                </button>
                <button
                  type="button"
                  className="trio-btn"
                  onClick={() => gender("Mujer")}
                >
                  Mujer
                </button>
                <button
                  type="button"
                  className="trio-btn"
                  onClick={selectNobinario}
                >
                  No Binario
                </button>
              </div>
            )}
            <div className="buttons-general-block">
              <button type="button" onClick={volver} className="trio-btn">
                Volver
              </button>
              {!userRegister.gender ? (
                <button className="trio-cancel-btn">Continuar</button>
              ) : (
                <button type="button" className="trio-btn " onClick={continuar}>
                  Continuar
                </button>
              )}
            </div>
          </div>
        ) : null}
        {/* SPORTS */}
        {page == 5 ? (
          <div className="sports">
            <ProgressBar animated now={66.66} className="custom-progress" />
            <h2 className="register-text-block">
              Elige tus deportes preferidos
            </h2>
            <div className="list-sports">
              {" "}
              <Form.Group controlId="formSportId" className="tittle">
                <Form.Label>
                  <h3>Deportes</h3>
                </Form.Label>
                <ListGroup as="ul" className="all_sports">
                  {sports.map((e, idx) => {
                    return (
                      <div  key={idx}>
                        {selectedSport.includes(e.sport_id) ? (
                          <ListGroup.Item
                            as="li"
                            onClick={() => removeSports(e.sport_id)}
                            active
                          >
                            {e.sport_name}
                          </ListGroup.Item>
                        ) : (
                          <ListGroup.Item
                            as="li"
                            onClick={() => addSports(e.sport_id)}
                          >
                            {e.sport_name}
                          </ListGroup.Item>
                        )}
                      </div>
                    );
                  })}
                  <ListGroup.Item onClick={addSportStatus}>
                    Añadir Deporte
                  </ListGroup.Item>
                </ListGroup>
                <p>Debes elegir entre 1 y 5 deportes</p>
              </Form.Group>
            </div>
            <ModalCreateSport
              show={modalAddSports}
              closeModal={addSportStatus}
              onSportCreated={handleSportCreated}
              existingSports={sports}
            />
            <div className="buttons-general-block">
              <button onClick={volver} className="trio-btn">
                Volver
              </button>
              {selectedSport.length > 5 || selectedSport.length < 1 ? (
                <button className="trio-cancel-btn" type="button">
                  Continuar
                </button>
              ) : (
                <button
                  onClick={() => addUserSportsContinuar(selectedSport)}
                  className="trio-btn"
                  type="button"
                >
                  Continuar
                </button>
              )}
            </div>
          </div>
        ) : null}
        {/* DESCRIPCION */}
        {page == 6 ? (
          <div className="description">
            <ProgressBar animated now={77.77} className="custom-progress" />
            <h2 className="register-text-block">Cuéntanos más sobre ti</h2>
            <div className="block">
              <Form.Group className="mb-1">
                <Form.Control
                  as="textarea"
                  rows={7}
                  placeholder="Descríbete en pocas palabras"
                  onChange={handleRegister}
                  name="description"
                  maxLength="255"
                  className="description-text"
                />
              </Form.Group>
              <p>{contador.length}/255</p>
            </div>
            <div className="buttons-general-block">
              <button onClick={volver} type="button" className="trio-btn">
                Volver
              </button>
              {userRegister?.description ? (
                <button onClick={continuar} type="button" className="trio-btn">
                  Continuar
                </button>
              ) : (
                <button className="trio-cancel-btn" type="button">
                  Continuar
                </button>
              )}
            </div>
          </div>
        ) : null}
        {/* FOTO */}
        {page == 7 ? (
          <div className="photo">
            <ProgressBar animated now={88.88} className="custom-progress" />
            <h2 className="register-text-block">Elige una foto para ti</h2>
            <div className="block">
              <img
                src="../../src/assets/images/default_user_img.png"
                alt=""
                className="mb-3"
              />
              <Form.Group>
                <Form.Label htmlFor="file" className="trio-btn foto">
                  Sube una foto
                </Form.Label>
                <Form.Control
                  id="file"
                  type="file"
                  name="user_img"
                  placeholder="Enter city"
                  hidden
                  onChange={handleFile}
                />
              </Form.Group>
            </div>
            <div className="buttons-general-block">
              <button onClick={volver} type="button" className="trio-btn">
                Volver
              </button>
              {file ? (
                <button onClick={onSubmit} type="button" className="trio-btn">
                  Continuar
                </button>
              ) : (
                <button type="button" className="trio-cancel-btn">
                  Continuar
                </button>
              )}
            </div>
          </div>
        ) : null}
          {page == 8 ? (
          <div className="auth">
            <ProgressBar animated now={100} className="custom-progress" />
            <h2 className="register-text-block text-center">Se te ha enviado un correo de autenticación</h2>
            <div className="block">
              <h3 className="mb-3 text-center">Muchas gracias por registrarte</h3>
                <button className="trio-btn" type="button" onClick={toLogin}>Ir a Login</button>
            </div>
          </div>
        ) : null}
      </Form>
      <ModalCreateSport
        addSports={addSports}
        show={showModal}
        closeModal={() => setShowModal(false)}
        onSportCreated={handleSportCreated}
        existingSports={sports}
      />
    </Container>
  );
};
