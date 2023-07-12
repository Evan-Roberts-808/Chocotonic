import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";
import UserContext from "../context/UserContext";

function ConfirmOrder() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleYes = () => {
    fetch(`/api/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          navigate("/profile-details");
        } else {
          throw new Error("Error confirming the order");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleNo = () => {
    navigate("/cart");
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2>Confirm Order?</h2>
          <Button variant="success" onClick={handleYes}>
            Yes
          </Button>{" "}
          <Button variant="danger" onClick={handleNo}>
            No
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default ConfirmOrder;
