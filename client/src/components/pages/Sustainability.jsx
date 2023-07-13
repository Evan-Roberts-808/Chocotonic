import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function Sustainability() {
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
          <h3>Sustainability</h3>
        </div>
      </Row>
      <Row>
        <div className="sustainability-jumbotron jumbotron-fluid">
          <Container>
            <Row className="justify-content-sm-center justify-content-md-end">
              <Col className="jumbotron-content" xs={12} md={8} lg={6}>
                <div className="text-container">
                  <p className="jumbotron-text">
                    We are deeply committed to sustainability and environmental
                    stewardship. We recognize the importance of preserving our
                    planet for future generations and take proactive steps to
                    minimize our ecological footprint. From sourcing ethically
                    produced ingredients to implementing eco-friendly packaging
                    solutions, we prioritize sustainable practices throughout
                    our operations. We continuously strive to reduce waste,
                    conserve energy, and support initiatives that promote
                    environmental well-being. By choosing Chocotonic, you can
                    indulge in our delectable chocolate treats while supporting
                    a brand that is dedicated to creating a greener and more
                    sustainable world.
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
              <h4>Our Commitment to Sustainability</h4>
              <p>
                At Chocotonic, sustainability is at the heart of everything we
                do. We are committed to making a positive impact on the
                environment through our responsible practices and conscious
                decision-making. From carefully selecting sustainable suppliers
                to implementing energy-efficient processes in our production
                facilities, we prioritize reducing our ecological footprint. We
                are dedicated to minimizing waste, conserving resources, and
                promoting biodiversity. Through continuous research and
                development, we strive to find innovative solutions that align
                with our commitment to sustainability. Our goal is not only to
                create delicious chocolates but also to contribute to a greener
                and more sustainable future for generations to come.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="about-column">
              <h4>Sustainable Initiatives</h4>
              <p>
                At Chocotonic, we are actively involved in a range of
                sustainable initiatives that contribute to a healthier planet.
                We work closely with local communities to source our ingredients
                ethically and support sustainable farming practices.
                Additionally, we prioritize recycling and waste reduction by
                implementing efficient manufacturing processes and utilizing
                eco-friendly packaging materials. We continuously explore
                innovative ways to minimize our environmental impact, such as
                investing in renewable energy sources and participating in
                reforestation projects. By engaging in these sustainable
                initiatives, we strive to create a positive change and inspire
                others to join us in building a more sustainable future for all.
              </p>
            </div>
          </Col>
          <Col md={4}>
            <div className="about-column">
              <h4>Environmental Protection and Regeneration</h4>
              <p>
                We are deeply committed to environmental protection and
                regeneration. We believe in the power of conscious actions to
                heal and restore our planet. That's why we actively participate
                in environmental initiatives and support projects that focus on
                restoring ecosystems, conserving natural resources, and
                promoting biodiversity. Through our partnerships with
                environmental organizations, we contribute to reforestation
                efforts, wildlife conservation, and sustainable farming
                practices. We believe that by taking responsibility for our
                environmental impact, we can play a vital role in preserving the
                Earth's beauty and ensuring a sustainable future for all.
                Together, we can make a difference and create a greener,
                healthier planet for generations to come.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Sustainability;
