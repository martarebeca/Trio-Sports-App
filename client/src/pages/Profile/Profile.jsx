import { Button, Col, Container, Row } from "react-bootstrap";
import { Outlet, useNavigate } from "react-router-dom";
import { TrioContext } from "../../context/TrioContextProvider";
import { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import "./profile.css";
import ModalEditUser from "../../components/ModalEditUser/ModalEditUser";
import axios from "axios";

export const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser, token } = useContext(TrioContext);
  const userBirthDate = parseInt(user?.birth_date);
  const today = parseInt(format(new Date(), "yyyy-MM-dd"));
  const age = today - userBirthDate;
  const [showModal, setShowModal] = useState(false)
  const [practiceSports, setPracticeSports] = useState([])
  const [selectedButton, setSetselectedButton] = useState(true)

  const handleOpen = () => {
    setShowModal(true)
  }

  useEffect(()=>{
    axios
        .get(`http://localhost:4000/api/users/getPracticeSports`,{headers:{Authorization: `Bearer ${token}`}})
        .then(res=>{
          setPracticeSports(res.data)
        })
        .catch(err=>{console.log(err)})
  },[user])

  return (
    <Container fluid="xxl">
      <Row className="my-3">
        <Col className="profile-data" xs="12" md="4" lg="3">
          <img
            className="profile-pic"
            src={
              user?.user_img
                ? `http://localhost:4000/images/users/${user?.user_img}`
                : `../../src/assets/images/default_user_img.png`
            }
            alt="profile picture"
          />
        </Col>
        <Col className="profile-data" xs="12" md="4" lg="4">
          <h3>
            {user?.user_name} {user?.last_name}
          </h3>
          <h4>
            {age} años, {user?.gender === "Prefiero no contestar" ? null : user.gender}
          </h4>
          <h4>{user?.user_city}</h4>
          {!Array.isArray(practiceSports) ? <p>No hay deportes seleccionados</p> : practiceSports?.map((e, idx)=><h4 key={idx}>{e.sport_name}</h4>)}
        </Col>
        <Col className="profile-data" xs="12" md="4" lg="5">
          <h4>{user?.description}</h4>
          <button type="button" className="trio-btn" onClick={handleOpen}>Editar perfil</button>
        </Col>
      </Row>
      <div className="custom-divider"></div>
      <Row className="my-3">
        <Col xxl="12" className="d-flex justify-content-center gap-3 mb-3">
          <button type="button" className={`activity-button ${selectedButton && 'activity-button-selected'}`} onClick={() => {navigate("/profile"); setSetselectedButton(true)}}>Mis Actividades</button>
          <button type="button" className={`activity-button ${!selectedButton && 'activity-button-selected'}`} onClick={() => {navigate("/profile/1");setSetselectedButton(false)}}>Participado</button>
        </Col>
        <Col>
          <Outlet />
        </Col>
      </Row>
      <ModalEditUser show={showModal} setShowModal={setShowModal} data={user} token={token}/>
    </Container>
  );
};
