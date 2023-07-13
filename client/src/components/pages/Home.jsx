import React, { useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import UserContext from "../../context/UserContext";

function Home() {
  const { user } = useContext(UserContext);

  return (
    <div>
      <Row>
        <div className="home-jumbotron jumbotron-fluid">
          <Container>
            <Row className="justify-content-start">
              <Col xs={12} md={6}>
                <h2 className="arvo-bold">Deliciously Sustainable</h2>
                <h2 className="arvo">Indulge in Chocolate that </h2>
                <h2 className="arvo-bold">Makes a Difference</h2>
                {user ? (
                  <Button className="custom-btn-primary" as={Link} to="/shop">
                    Get Started
                  </Button>
                ) : (
                  <Button className="custom-btn-primary" as={Link} to="/signup">
                    Get Started
                  </Button>
                )}
              </Col>
            </Row>
          </Container>
        </div>
      </Row>
      <Container>
        <div className="separation">
          <h4>Shop By Category</h4>
          <Row className="home-row">
            <Card className="text-white col-sm-3" as={Link} to={"/shop"}>
              <Card.Img
                src="https://raw.githubusercontent.com/Evan-Roberts-808/Chocotonic/main/.github/images/site-images/shop-all.png"
                alt="Card image"
                className="card-image"
              />

              <Card.ImgOverlay className="custom-overlay">
                <Card.Title>Shop All</Card.Title>
              </Card.ImgOverlay>
            </Card>
            <Card
              className="text-white col-sm-3offset-sm-0 col-md-3 offset-md-1"
              as={Link}
              to={"/shop/6"}
            >
              <Card.Img
                src="https://raw.githubusercontent.com/Evan-Roberts-808/Chocotonic/main/.github/images/site-images/chocolate-truffles.png"
                alt="Card image"
                className="card-image"
              />
              <Card.ImgOverlay className="custom-overlay">
                <Card.Title>Chocolate Truffles</Card.Title>
              </Card.ImgOverlay>
            </Card>
            <Card
              className="text-white col-sm-3offset-sm-0 col-md-3 offset-md-1"
              as={Link}
              to={"/shop/5"}
            >
              <Card.Img
                src="https://raw.githubusercontent.com/Evan-Roberts-808/Chocotonic/main/.github/images/site-images/hot-chocolate.png"
                alt="Card image"
                className="card-image"
              />
              <Card.ImgOverlay className="custom-overlay">
                <Card.Title>Hot Chocolate</Card.Title>
              </Card.ImgOverlay>
            </Card>
          </Row>
        </div>
        <div className="separation">
          <h4>Discover More</h4>
          <Row className="home-row">
            <Card className="text-white col-sm-3" as={Link} to={"/about"}>
              <Card.Img
                src="https://raw.githubusercontent.com/Evan-Roberts-808/Chocotonic/main/.github/images/site-images/about-us-thumb.png"
                alt="Card image"
                className="card-image"
              />
              <Card.ImgOverlay className="custom-overlay">
                <Card.Title>About Us</Card.Title>
              </Card.ImgOverlay>
            </Card>
            <Card
              className="text-white col-sm-3offset-sm-0 col-md-3 offset-md-1"
              as={Link}
              to={"/sustainability"}
            >
              <Card.Img
                src="https://raw.githubusercontent.com/Evan-Roberts-808/Chocotonic/main/.github/images/site-images/sustainability-thumb.png"
                alt="Card image"
                className="card-image"
              />
              <Card.ImgOverlay className="custom-overlay">
                <Card.Title>Sustainability</Card.Title>
              </Card.ImgOverlay>
            </Card>
            <Card
              className="text-white col-sm-3offset-sm-0 col-md-3 offset-md-1"
              as={Link}
              to={"/causes"}
            >
              <Card.Img
                src="https://raw.githubusercontent.com/Evan-Roberts-808/Chocotonic/main/.github/images/site-images/causes-thumb.png"
                alt="Card image"
                className="card-image"
              />
              <Card.ImgOverlay className="custom-overlay">
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
