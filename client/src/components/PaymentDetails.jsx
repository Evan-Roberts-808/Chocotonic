import React, { useState, useEffect, useContext } from "react";
import { Card, Container, Row, Button, Form } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import UserContext from "../context/UserContext";

function PaymentDetails() {

  const { user } = useContext(UserContext);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);

  useEffect(() => {
    fetch(`/api/payments/${user.id}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 404) {
          return [];
        } else {
          throw new Error("Error fetching payment details");
        }
      })
      .then((payments) => {
        setPaymentDetails(payments);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user]);

  const handleAddPayment = () => {
    setShowAddPaymentForm(true);
  };

  const handleFormSubmit = (values) => {
    console.log(values);

    fetch(`/api/payments/${user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (response.ok) {
          setPaymentDetails((prevPaymentDetails) => [
            ...prevPaymentDetails,
            values,
          ]);
          setShowAddPaymentForm(false);
        } else {
          throw new Error("Error saving payment details");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const paymentValidationSchema = Yup.object().shape({
    cardholder_name: Yup.string().required("Cardholder name is required"),
    card_number: Yup.string().required("Card number is required"),
  });

  return (
    <Container>
      {paymentDetails.length === 0 ? (
        <Row>
          <p>
            No payments on record. Add a payment?{" "}
            <span onClick={handleAddPayment} className="payment-click">
              Click Here
            </span>
          </p>
        </Row>
      ) : (
        <Row>
          <p>
            Add a new payment?{" "}
            <span onClick={handleAddPayment} className="payment-click">
              Click Here
            </span>
          </p>
          {paymentDetails.map((paymentMethod) => (
            <Card key={paymentMethod.id} className="col-sm-4">
              <Card.Body>
                <Card.Title>{paymentMethod.cardholder_name}</Card.Title>
                <Card.Text>
                  Card Number ending in: ****
                  {paymentMethod.card_number.slice(-4)}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Row>
      )}
      {showAddPaymentForm && (
        <Row>
          <Formik
            initialValues={{
              cardholder_name: "",
              card_number: "",
              expiration_month: "",
              expiration_year: "",
              cvv: "",
            }}
            validationSchema={paymentValidationSchema}
            onSubmit={handleFormSubmit}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group
                  controlId="cardholder_name"
                  className="payment-form-input"
                >
                  <Form.Label>Cardholder Name</Form.Label>
                  <Field type="text" name="cardholder_name" as={Form.Control} />
                  <ErrorMessage
                    name="cardholder_name"
                    component={Form.Text}
                    className="text-danger"
                  />
                </Form.Group>

                <Form.Group
                  controlId="card_number"
                  className="payment-form-input"
                >
                  <Form.Label>Card Number</Form.Label>
                  <Field type="text" name="card_number" as={Form.Control} />
                  <ErrorMessage
                    name="card_number"
                    component={Form.Text}
                    className="text-danger"
                  />
                </Form.Group>

                <Form.Group
                  controlId="expiration_month"
                  className="payment-form-input"
                >
                  <Form.Label>Expiration Month</Form.Label>
                  <Field
                    type="number"
                    min="1"
                    max="12"
                    name="expiration_month"
                    as={Form.Control}
                  />
                  <ErrorMessage
                    name="expiration_month"
                    component={Form.Text}
                    className="text-danger"
                  />
                </Form.Group>

                <Form.Group
                  controlId="expiration_year"
                  className="payment-form-input"
                >
                  <Form.Label>Expiration Year</Form.Label>
                  <Field
                    type="number"
                    min={new Date().getFullYear()}
                    name="expiration_year"
                    as={Form.Control}
                  />
                  <ErrorMessage
                    name="expiration_year"
                    component={Form.Text}
                    className="text-danger"
                  />
                </Form.Group>

                <Form.Group controlId="cvv" className="payment-form-input">
                  <Form.Label>CVV</Form.Label>
                  <Field
                    type="password"
                    pattern="\d{3}"
                    name="cvv"
                    as={Form.Control}
                  />
                  <ErrorMessage
                    name="cvv"
                    component={Form.Text}
                    className="text-danger"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="custom-btn-primary payment-form-button"
                >
                  Add Payment
                </Button>
              </Form>
            )}
          </Formik>
        </Row>
      )}
    </Container>
  );
}

export default PaymentDetails;
