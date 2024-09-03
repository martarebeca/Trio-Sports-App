import Card from "react-bootstrap/Card";
import { format } from "date-fns";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import './cardOneUser.css'

export const CardOneUser = ({ data }) => {
  let userBirthDate = parseInt(data.birth_date);
  let today = parseInt(format(new Date(), "yyyy-MM-dd"));
  let age = today - userBirthDate;  
  

  return (    
      <Card className=" rounded-4" style={{ width: "830px" }}>        
        <Link to={`/oneUser/${data.user_id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <Row>
        <Col md={4} >
          <Card.Img className="h-100"   src={`http://localhost:4000/images/users/${data.user_img}`} />
        </Col>
        <Col md={8}>
          <Card.Body>
            <Card.Title>
              <h2>{data?.user_name} {data?.last_name}</h2>
            </Card.Title>
            <Card.Text as={"h3"}>
              {age} años - {data?.gender}
            </Card.Text>
            <Card.Text as={"h4"}>{data?.user_city}</Card.Text>
            <Card.Text as={"h4"}>{data?.sports}</Card.Text>
            <Card.Text  as={"h4"}>{data.practice}</Card.Text>
            <Card.Text  as={"h4"}>{data?.description}</Card.Text>
          </Card.Body>                 
        </Col>
      </Row>
        </Link>
      </Card>    
  );
};
