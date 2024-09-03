import { TrioContext } from "../../context/TrioContextProvider";
import { useContext, useEffect, useState } from "react";
import { CardOneUser } from "../../components/CardOneUser/CardOneUser";
import axios from "axios";
import { GENDER } from "../../helpers/genderData";
import { Col, Container, Row, Form } from "react-bootstrap";
import "./allUsers.css";

export const AllUsers = () => {
  const { user, token, setToken, sports, setSports } = useContext(TrioContext);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteresUsers] = useState(allUsers);
  const [selectedSport, setSelectedSport] = useState("");
  const [age, setAge] = useState(null);
  const [selectedGender, setSelectedGender] = useState("");
  const [location, setLocation] = useState("");
  const [userMostrados, setUserMostrados] = useState(false);

  useEffect(() => {
    const peticionUserSports = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/users/getAllUsers",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAllUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    peticionUserSports();
  }, []);

  const handleChange = (e) => {
    if (isNaN(age)) {
      setAge("");
    } else {
      setAge(parseInt(e.target.value));
    }
  };

  const handleClick = () => {
    const normalizeString = (str) => {
      return str
          .normalize("NFD") 
          .replace(/[\u0300-\u036f]/g, "") 
          .toLowerCase(); 
  };
    const filtered = allUsers.filter((user) => {
      const normalizedLocation = normalizeString(user.user_city)
      const normalizedSearchLocation = normalizeString(location)
      return (
        (selectedSport ? user.sports.includes(selectedSport) : true) &&
        (age ? user.age === age : true) &&
        (selectedGender ? user.gender === selectedGender : true) &&
        (location
          ? normalizedLocation.includes(normalizedSearchLocation)
          : true)
      );
    });
    setUserMostrados(true);
    setFilteresUsers(filtered);
  };

  const handleReset = () => {
    setFilteresUsers(allUsers)
  }

  return (
    <Container>
      <Row className="d-flex justify-content-center align-items-center flex-wrap m-3 gap-4">        
          <Col className="d-flex justify-content-center">
            <Form.Group>
            <Form.Select
              id="deporte"
              title="Deporte"
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
              className="filter-select-allusers"
              >
                <option value="">Deportes</option>
              {sports.map((e) => {
                return (
                  <option key={e.sport_id} value={e.sport_name}>
                    {e.sport_name}
                  </option>
                );
              })}
            </Form.Select>
              </Form.Group>
          </Col>
          <Col className="d-flex justify-content-center">
            <input
              className="filter-input-allusers"
              type="text"
              placeholder="Edad"
              value={age ? age : ""}
              onChange={handleChange}
            />
          </Col>
          <Col className="d-flex justify-content-center">
          <Form.Group>
            <Form.Select
              id="sexo"
              title="Sexo"
              value={selectedGender}
              className="filter-select-allusers"
              onChange={(e) => setSelectedGender(e.target.value)}
              >
              <option value="">Sexo</option>
              {GENDER.map((e, index) => {
                return (
                  <option key={index} >
                    {e}
                  </option>
                );
              })}
            </Form.Select>
              </Form.Group>
          </Col>
          <Col className="d-flex justify-content-center">
            <input
              className="filter-input-allusers"
              type="text"
              placeholder="Ubicación"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Col>
          <Col className="d-flex justify-content-center">
            <button type="button" className="filter-button-allusers" onClick={handleClick}>
              Buscar
            </button>
          </Col>
          <Col className="d-flex justify-content-center">
          <button type="button" onClick={handleReset} className="filter-button-allusers">
            Mostrar todo
          </button>
          </Col>        
      </Row>
      <div className="custom-divider"></div>
      <Row>
        <Col>
          <div className="d-flex justify-content-center flex-wrap gap-3">            
          {(userMostrados ? filteredUsers.length > 0 : allUsers.length > 0) ? (
            userMostrados
              ? filteredUsers.map((e, index) => (
                  <CardOneUser key={index} data={e} />
                ))
              : allUsers.map((e, index) => (
                  <CardOneUser key={index} data={e} />
                ))
          ) : (
            <p className="msg-allusers">No hay usuarios que mostrar</p>
          )}

          </div>
        </Col>
      </Row>
    </Container>
  );
};
