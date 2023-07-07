import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <div className="jumbotron jumbotron-fluid"></div>
      <Container>
        <div>
          <h4>Shop By Category</h4>
          <Row>
            <Card className="bg-dark text-white col-sm-3" as={Link} to={'/shop'}>
              <Card.Img
                src="https://dummyimage.com/750x500/bababa/000000.png&text=shop+all"
                alt="Card image"
              />
              <Card.ImgOverlay>
                <Card.Title>Shop All</Card.Title>
              </Card.ImgOverlay>
            </Card>
            <Card className="bg-dark text-white col-sm-3 offset-1" as={Link} to={'/shop/6'}>
              <Card.Img
                src="https://dummyimage.com/750x500/bababa/000000.png&text=chocolate+truffles"
                alt="Card image"
              />
              <Card.ImgOverlay>
                <Card.Title>Chocolate Truffles</Card.Title>
              </Card.ImgOverlay>
            </Card>
            <Card className="bg-dark text-white col-sm-3 offset-1" as={Link} to={'/shop/5'}>
              <Card.Img
                src="https://dummyimage.com/750x500/bababa/000000.png&text=hot+chocolate"
                alt="Card image"
              />
              <Card.ImgOverlay>
                <Card.Title>Hot Chocolate</Card.Title>
              </Card.ImgOverlay>
            </Card>
          </Row>
        </div>
        <div>
          <h4>Discover More</h4>
          <Row>
            <Card className="bg-dark text-white col-sm-3" as={Link} to={'/about'}>
              <Card.Img
                src="https://dummyimage.com/750x500/bababa/000000.png&text=about+us"
                alt="Card image"
              />
              <Card.ImgOverlay>
                <Card.Title>About Us</Card.Title>
              </Card.ImgOverlay>
            </Card>
            <Card className="bg-dark text-white col-sm-3 offset-1"  as={Link} to={'/sustainability'}>
              <Card.Img
                src="https://dummyimage.com/750x500/bababa/000000.png&text=sustainability"
                alt="Card image"
              />
              <Card.ImgOverlay>
                <Card.Title>Sustainability</Card.Title>
              </Card.ImgOverlay>
            </Card>
            <Card className="bg-dark text-white col-sm-3 offset-1"  as={Link} to={'/causes'}>
              <Card.Img
                src="https://dummyimage.com/750x500/bababa/000000.png&text=causes"
                alt="Card image"
              />
              <Card.ImgOverlay>
                <Card.Title>Causes</Card.Title>
              </Card.ImgOverlay>
            </Card>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default Home;
