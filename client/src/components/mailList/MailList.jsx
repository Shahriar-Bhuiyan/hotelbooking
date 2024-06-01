import "./mailList.css";

import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Zami from "../../assets/Zami.jpeg";
import Sumit from "../../assets/Sumit.jpeg";
import Towhid from "../../assets/Towhid.jpeg";


const MailList = () => {
  return (
    <div className="mail">
      <Container>
        <h1>Developed By</h1>
        <Row>
          <Col>
            <Card style={{ width: "18rem",height:"30rem",overflow:'hidden' }}>
              <Card.Img variant="top" src={Zami} style={{maxHeight:'40rem'}}/>
              <Card.Body>
                <Card.Title>Zami Ul Haque</Card.Title>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card style={{ width: "18rem",height:"30rem",overflow:'hidden' }}>
              <Card.Img variant="top" src={Sumit} style={{height:'24rem',objectFit:'cover'}}/>
              <Card.Body>
                <Card.Title>Sumit Bosu </Card.Title>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card style={{ width: "18rem",height:"30rem",overflow:'hidden' }}>
              <Card.Img variant="top" src={Towhid} style={{height:'24rem',objectFit:'cover'}}/>
              <Card.Body>
                <Card.Title>Abdullah Al Towhid</Card.Title>
              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Container>
    </div>
  );
};

export default MailList;
