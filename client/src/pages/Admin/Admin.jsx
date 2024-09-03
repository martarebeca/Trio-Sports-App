import { useContext, useState } from 'react'
import { TrioContext } from "../../context/TrioContextProvider";
import { Outlet, useNavigate } from 'react-router-dom';
import { Button, Col, Container, Row } from "react-bootstrap";
import "./Admin.css"

export const Admin = () => {
  const { user, token } = useContext(TrioContext);
  const [selectedButton, setSetselectedButton] = useState(true)
  const navigate = useNavigate();

  return (
    <Container fluid="xl">
      <Row className="my-3">
        <Col xs="12" className="d-flex gap-3 mb-3 justify-content-center">
          <button type='button' className={`admin-button ${selectedButton && 'admin-button-selected'}`} onClick={() => {navigate("/admin"), setSetselectedButton(true)}}>Todos los Usuarios</button>
          <button type='button' className={`admin-button ${!selectedButton && 'admin-button-selected'}`} onClick={() => {navigate("/admin/1"), setSetselectedButton(false)}}>Todos los Deportes</button>
        </Col>
        <Col className='d-flex justify-content-center'>
          <Outlet />
        </Col>
      </Row>
    </Container>
  )
}
