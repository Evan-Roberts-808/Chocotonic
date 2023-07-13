import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function Causes() {
  return (
    <>
      <Row>
        <div className="horizontal-line-container">
          <div className="horizontal-line"></div>
          <img
            className="emblem"
            src="https://raw.githubusercontent.com/Evan-Roberts-808/Capstone/9f264e240c57cfadce2104eccd29fd14b0422090/.github/images/site-images/illustration.svg"
          />
          <div className="horizontal-line"></div>
        </div>
      </Row>
      <Row>
        <div className="d-flex justify-content-center">
          <h3>Causes</h3>
        </div>
      </Row>
      <Row>
        <div className="causes-jumbotron jumbotron-fluid">
          <Container>
            <Row className="justify-content-sm-center justify-content-md-end">
              <Col className="jumbotron-content" xs={12} md={8} lg={6}>
                <div className="text-container">
                  <p className="jumbotron-text">
                    We are dedicated to making a positive impact through our
                    commitment to various causes. Our passion for social
                    responsibility drives us to support meaningful initiatives
                    that address pressing social issues. Through our
                    partnerships with charitable organizations, we strive to
                    create positive change and uplift communities in need. By
                    aligning our values with causes that promote education,
                    healthcare, poverty alleviation, and social equality, we aim
                    to make a difference in the lives of individuals and
                    contribute to a better world. Together, we can build a
                    brighter future and empower those who need it most.
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </Row>
      <Container>
        <Row>
          <Col md={4}>
            <div className="about-column">
              <h4>Our Mission</h4>
              <p>
                Our mission is to use the power of chocolate to drive social
                change and improve lives. We believe that everyone deserves
                access to basic necessities, education, and opportunities for
                growth. Through our philanthropic efforts, we strive to create a
                more equitable society where every individual has a chance to
                thrive. By supporting causes that align with our values, we work
                towards breaking down barriers and creating a world where
                everyone's potential can be realized. Together, let's make a
                difference, one chocolate at a time.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="about-column">
              <h4>Causes We Support</h4>
              <p>
                We are deeply committed to environmental conservation and
                sustainability. We believe in the urgent need to protect and
                preserve our planet for future generations. Through our
                dedicated efforts, we support causes that promote ecological
                balance, combat climate change, and foster sustainable
                practices. Our partnerships with environmental organizations
                allow us to actively contribute to reforestation initiatives,
                wildlife conservation, and the reduction of carbon footprint. By
                supporting these causes, we aim to make a tangible impact in
                safeguarding our natural resources and creating a greener, more
                sustainable world.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="about-column">
              <h4>How You Can Help</h4>
              <p>
                You can join us in making a difference. There are many ways you
                can support our causes and contribute to positive change. By
                purchasing our delicious chocolate treats, you are directly
                supporting our philanthropic efforts, as a portion of our
                proceeds is dedicated to charitable initiatives. Additionally,
                you can spread the word about our mission and causes by sharing
                our story with your friends and family. Together, we can raise
                awareness, inspire others to get involved, and create a ripple
                effect of positive change. Every small action counts, and
                together, we can create a better world for all.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Causes;
