import Form from "react-bootstrap/Form";
import { TrioContext } from "../../../context/TrioContextProvider";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"; 
import './login.css';

//valor inicial login
const initialValue = {
  email: "",
  password: "",
};

//valor inicial mensaje
const initialValueMsg = {
  text: "",
  show: false,
};

export const Login = () => {
  const { setUser , setToken} = useContext(TrioContext);
  const [login, setLogin] = useState(initialValue);
  const [msg, setMsg] = useState(initialValueMsg);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const onSubmit = async () => {
    if (!login.email || !login.password) {
      setMsg({ text: "Debes cumplimentar todos los campos", show: true });
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/api/users/login",
        login
      );
      let token = res.data;

      localStorage.setItem("token", token);

      const response = await axios.get("http://localhost:4000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(response.data);
      setToken(token);

      if (response.data.type === 2) {
        navigate("/allActivities");
      } else if (response.data.type === 1) {
        navigate("/admin");
      }
    } catch (err) {
      console.log(err);

      if (err.response.status === 401) {
        setMsg({
          show: true,
          text: err.response.data,
        });
      }
    }
  };

  return (    
    <Row className="bg-photo">
      <Col className="d-flex flex-column justify-content-center align-items-center">
        <img className="logo-login" src="/src/assets/images/logo.png" alt="" />
        <Form className="my-5 d-flex flex-column">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              className="login-input"
              type="email"
              placeholder="Correo electrónico"
              name="email"
              value={login.email}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <div style={{ position: 'relative' }}>
              <Form.Control
                className="login-input"
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                name="password"
                value={login.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#999',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
          </Form.Group>
          {msg.show && <p className="d-flex justify-content-center validation-color">{msg.text}</p>}
          <button type="button" className="login-input button-login trio-btn" onClick={onSubmit}>
            Iniciar sesión
          </button>
        </Form>
        <p className="d-flex justify-content-center"><Link to='/recoverPassword'>¿Has olvidado la contraseña?</Link></p>
        <hr />
        <button type="button" className="login-input button-login trio-btn"
          onClick={() => navigate("/register")}
        >Crear cuenta nueva</button>
        <p className="d-flex justify-content-center m-5 frase-login">Conectando a través del deporte</p>
      </Col>
    </Row>
  );
};
