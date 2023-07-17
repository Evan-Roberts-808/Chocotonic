import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Container, Table, Row, Button } from "react-bootstrap";

function OrderById() {
  const { user } = useContext(UserContext);
  const [order, setOrder] = useState(null);
  const { order_id } = useParams();
  const navigate = useNavigate();
  const [confirmation, setConfirmation] = useState(false);
  console.log(order)
  useEffect(() => {
    fetch(`/api/user/orders/${order_id}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error fetching order details");
        }
      })
      .then((order) => {
        setOrder(order);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [order_id]);

  if (!order) {
    return <div>Loading...</div>;
  }

  const showConfirmation = () => {
    setConfirmation((prev) => !prev);
  };

  const handleYes = () => {
    fetch(`/api/user/orders/${order_id}`, {
      method: "PATCH",
      headers: {
        'Content-Type':'application/json'
      }
    })
      .then(() => {
        navigate("/profile-details");
      })
      .catch((error) => {
        console.error("Error cancelling the order:", error);
      });
  };

  const handleNo = () => {
    setConfirmation((prev) => !prev);
  };

  const orderItems = order.order_items.map((item) => {
    return (
      <tr>
        <td>{item.product_name}</td>
        <td>{item.price}</td>
        <td>{item.quantity}</td>
      </tr>
    );
  });

  const backToProfile = () => {
    navigate("/profile-details")
  }

  return (
    <Container>
      <Row>
        <h3>Order: {order_id}</h3> <p>Return to profile? <span onClick={backToProfile} style={{cursor:'pointer'}}><b>Click Here</b></span></p>
      </Row>
      <Row>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {orderItems}
            <tr>
              <td></td>
              <td></td>
              <td>Total: ${order.total_price.toFixed(2)}</td>
            </tr>
          </tbody>
        </Table>
        {confirmation ? (
          <>
            <p>Are you sure you'd like to cancel your order?</p>
            <Button className="user-delete" variant="success" onClick={handleYes}>
              Yes
            </Button>
            <Button className="user-delete" variant="danger" onClick={handleNo}>
              No
            </Button>
          </>
        ) : order.order_status !== 4 ? (
          <Button className="custom-btn-primary cancel-order" onClick={showConfirmation}>
            Cancel Order
          </Button>
        ) : null}
      </Row>
    </Container>
  );
        }

export default OrderById;
