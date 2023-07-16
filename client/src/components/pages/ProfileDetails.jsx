import React, { useState, useEffect, useContext } from "react";
import UserContext from "../../context/UserContext";
import { Container, Table, Row, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Address from "../Address.jsx";
import PaymentDetails from "../PaymentDetails.jsx";

function ProfileDetails() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAccountEdit, setAccountEdit] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  useEffect(() => {
    fetch("/api/user/orders")
      .then((r) => r.json())
      .then((orders) => {
        setOrders(orders);
      });
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const { name, username, email, id } = user;

  const handleDeleteConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleAccountEdit = () => {
    setAccountEdit((prev) => !prev);
  };

  const handleYes = () => {
    fetch(`/api/users`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          setUser(null);
          navigate("/");
        } else {
          throw new Error("Error confirming the order");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleNo = () => {
    setShowConfirmation(false);
  };

  const orderData = orders.map((order) => {
    const date = new Date(order.created);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <tr key={order.order_id}>
        <td>{order.order_id}</td>
        <td>{formattedDate}</td>
        <td>${order.total_price.toFixed(2)}</td>
        <td>{order.status}</td>
        <td>
          <Link to={`/order/${order.order_id}`}>View Details</Link>
        </td>
      </tr>
    );
  });

  return (
    <Container>
      <Row className="separation">
        <h3>My Account</h3>
        <h5>Hello, {name}</h5>
        <p>
          Welcome to your profile page. Here you can view your order history as
          well as update any information we may have on record for you.
        </p>
        {showAccountEdit ? (
          <>
            <Formik
              initialValues={{ email: user.email, password: "" }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                fetch("/api/users", {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                  }),
                })
                  .then((response) => {
                    if (response.ok) {
                    } else {
                      throw new Error("Error updating email and password");
                    }
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              }}
            >
              <Form>
                <h4>Edit Email and Password</h4>
                <hr />
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email:
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="edit-form"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-message"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password:
                  </label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className="edit-form"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error-message"
                  />
                </div>
                <Button type="submit" className="custom-btn-primary">
                  Update
                </Button>
                <Button variant="danger" onClick={handleAccountEdit}>
                  Cancel
                </Button>
              </Form>
            </Formik>
          </>
        ) : (
          <p>
            Would you like to edit your account details?{" "}
            <span onClick={handleAccountEdit} className="edit-click">
              Click Here
            </span>
          </p>
        )}
      </Row>
      <Row className="separation">
        <h4>Payment Details</h4>
        <hr />
        <PaymentDetails />
      </Row>
      <Row className="separation">
        <h4>Addresses</h4>
        <hr />
        <Address />
      </Row>
      <Row className="separation">
        <h3>Order History</h3>
        <hr />
        <div className="reble-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Order Date</th>
              <th>Total</th>
              <th>Order Status</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>{orderData}</tbody>
        </Table>
        </div>
      </Row>
      <Row className="separation">
        <h3>Danger Zone</h3>
        <hr />
        {showConfirmation ? (
          <>
            <p>Are you sure you want to delete your account?</p>
            <Button
              className="user-delete"
              variant="success"
              onClick={handleYes}
            >
              Yes
            </Button>
            <Button className="user-delete" variant="danger" onClick={handleNo}>
              No
            </Button>
          </>
        ) : (
          <Button
            className="custom-btn-primary user-delete"
            onClick={handleDeleteConfirmation}
          >
            Delete Account
          </Button>
        )}
      </Row>
    </Container>
  );
}

export default ProfileDetails;
