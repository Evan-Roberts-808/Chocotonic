import React from 'react'
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
<div className="about-jumbotron jumbotron-fluid">
  <Container>
    <div className="jumbotron-content">
      <p className="jumbotron-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id ante vel eros scelerisque tempus eget sed justo.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id ante vel eros scelerisque tempus eget sed justo.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id ante vel eros scelerisque tempus eget sed justo.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id ante vel eros scelerisque tempus eget sed justo.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id ante vel eros scelerisque tempus eget sed justo.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id ante vel eros scelerisque tempus eget sed justo.
      </p>
    </div>
  </Container>
</div>
</Row>
    <Container>
      <Row>
        <Col md={4}>
          <div className="about-column">
            <h4>Our Mission</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              id ante vel eros scelerisque tempus eget sed justo.
            </p>
          </div>
        </Col>
        <Col md={4}>
          <div className="about-column">
            <h4>Causes We Support</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              id ante vel eros scelerisque tempus eget sed justo.
            </p>
          </div>
        </Col>
        <Col md={4}>
          <div className="about-column">
            <h4>How You Can Help</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              id ante vel eros scelerisque tempus eget sed justo.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  </>
  )
}

export default Causes