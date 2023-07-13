import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function About() {
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
          <h3>About Us</h3>
        </div>
      </Row>
      <Row>
  <div className="about-jumbotron jumbotron-fluid">
    <Container>
      <Row className="justify-content-sm-center justify-content-md-end">
        <Col className="jumbotron-content" xs={12} md={8} lg={6}>
          <div className='text-container'>
          <p className="jumbotron-text">
            We are a chocolate company with a mission to make a positive impact
            on the environment and promote sustainability. Our passion for
            creating delicious chocolate treats goes hand in hand with our
            commitment to creating a brighter and greener future. With every
            bite of our chocolates, you not only indulge in heavenly flavors
            but also contribute to the well-being of our planet. A portion of
            our proceeds is donated to environmental and sustainability
            charities, supporting their important work in preserving our natural
            resources and promoting a sustainable lifestyle. Join us on this
            sweet journey and indulge in guilt-free chocolate that truly makes
            a difference.
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
                Our mission transcends the realm of chocolate. A portion of our
                profits is dedicated to environmental and sustainability
                charities, enabling us to give back and create a positive
                impact. By indulging in our chocolates, you are directly
                contributing to the vital work of these organizations, fostering
                a virtuous cycle that benefits our planet and future
                generations.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="about-column">
              <h4>Our Vision</h4>
              <p>
                Through our visionary approach, we aim to inspire change in the
                industry and encourage other companies to adopt sustainable
                practices. We envision a world where indulging in delicious
                chocolate goes hand in hand with caring for the planet. By
                setting new standards and continuously innovating, we aspire to
                be a catalyst for positive change in the chocolate industry and
                a driving force in creating a greener and more sustainable
                future.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="about-column">
              <h4>Our Values</h4>
              <p>
                At Chocotonic, our values define who we are and drive everything
                we do. Sustainability is at the core of our operations, from
                responsibly sourcing ingredients to using eco-friendly
                packaging. We operate with integrity, maintaining transparency
                and upholding high standards of quality and ethical practices.
                We are committed to social responsibility, actively supporting
                environmental charities and making a positive impact through our
                chocolate creations. These values guide us as we strive to
                create delicious treats while promoting a greener and more
                sustainable future.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default About;
