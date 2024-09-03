import { Col, Container, Row } from "react-bootstrap"
import './error.css'
import { useNavigate } from "react-router-dom"

export const ErrorPage = () => {

  const navigate = useNavigate();
  return (
    <Container>
      <Row>
        <Col className="d-flex justify-content-center my-5 col-1-error">
        <div><span className="span-error">4</span></div>
        <div className="d-flex align-items-center img-error"><img src="/public/favicon.png" alt="logo" /></div>
        <div><span className="span-error">4</span></div>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-center">
        <h1 className="h1-error p-error">La página no se encuentra en el servidor (Error 404)</h1>
        </Col>
        <Row>
          <Col className="d-flex justify-content-center m-5">
          <button onClick={()=>navigate('/')} className="trio-error-btn">Volver a Home</button>
          </Col>
        </Row>
      </Row>
    </Container>
  )
}
