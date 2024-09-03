import { Button, Col, Container, Row } from "react-bootstrap";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { TrioContext } from "../../context/TrioContextProvider";
import { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import "./oneUser.css";
import axios from "axios";
import { ModalCreateMessage } from "../../components/ModalCreateMessage/ModalCreateMessage";

export const OneUser = () => {

  const navigate = useNavigate();
  const { user, token } = useContext(TrioContext);
  const {id} = useParams()
  const [oneUser, setOneUser] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [selectedButton, setSetselectedButton] = useState(true)


  const handleOpen = () => {
    setShowModal(true)
  }


  useEffect(()=>{
    const oneUser = async () => {
      try{
        const res = await axios.get(`http://localhost:4000/api/users/getOneUser/${id}`, {headers: {Authorization: `Bearer ${token}`}});
        setOneUser(res.data[0])        
      }catch(err){
        console.log(err);        
      }
    }
    if(token){
      oneUser()
    }
  },[token])

  return (
    <Container fluid="xxl">
      <Row className="my-3">
        <Col className="profile-data-oneuser" xs="12" md="4" lg="3">
          <img
            className="profile-pic-oneuser"
            src={
              oneUser?.user_img
                ? `http://localhost:4000/images/users/${oneUser?.user_img}`
                : `../../src/assets/images/default_user_img.png`
            }
            alt="profile picture"
          />
        </Col>
        <Col className="profile-data-oneuser" xs="12" md="4" lg="4">
          <h3>
            {oneUser?.user_name} {oneUser?.last_name}
          </h3>
          <h4>
            {oneUser.age} años, {oneUser?.gender}
          </h4>
          <h4>{oneUser?.user_city}</h4>
          <h4>{oneUser.sports ? oneUser.sports : <p>No hay deportes seleccionados</p>}</h4>
        </Col>
        <Col className="profile-data-oneuser" xs="12" md="4" lg="5">
          <h4>{oneUser?.description}</h4>
          <button type="button" className="trio-btn" onClick={handleOpen}>Enviar mensaje</button>
        </Col>
      </Row>
      <div className="custom-divider"></div>
      <Row className="my-3">
        <Col xxl="12" className="d-flex justify-content-center gap-3 mb-3">
          <button className={`activity-button ${selectedButton && 'activity-button-selected'}`} onClick={() => {navigate(`/oneUser/${id}`); setSetselectedButton(true)}}>Actividades creadas</button>
          <button className={`activity-button ${!selectedButton && 'activity-button-selected'}`} onClick={() => {navigate(`/oneUser/${id}/1`); setSetselectedButton(false)}}>Participado</button>
        </Col>
        <Col>
          <Outlet />
        </Col>
      </Row>
      <ModalCreateMessage oneUser={oneUser} show={showModal} setShowModal={setShowModal} token={token}/>
    </Container>
  )
}
