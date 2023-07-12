import React, { useEffect, useState, useContext } from "react";
import UserContext from "../context/UserContext";
import { Formik, Field, ErrorMessage } from "formik";
import { Card } from "react-bootstrap";
import * as Yup from "yup";
import { Button, Form } from "react-bootstrap";

function EnterPayment({ onNext }) {
  const { user } = useContext(UserContext);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [useCardOnRecord, setUseCardOnRecord] = useState(false);

  const paymentValidationSchema = Yup.object().shape({
    cardholder_name: Yup.string().required("Cardholder name is required"),
    card_number: Yup.string().required("Card number is required").length(16, "Card number must be exactly 16 characters"),
    expiration_month: Yup.number()
      .required("Expiration month is required")
      .min(1, "Invalid month")
      .max(12, "Invalid month"),
    expiration_year: Yup.number()
      .required("Expiration year is required")
      .min(new Date().getFullYear(), "Invalid year"),
    cvv: Yup.string()
      .required("CVV is required")
      .matches(/^\d{3}$/, "Invalid CVV"),
  });

  useEffect(() => {
    if (user) {
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
    }
  }, [user]);

  const handleNext = (values) => {

    fetch(`/api/payments/${user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error saving payment details");
        }
      })
      .then((newPaymentInfo) => {
        onNext();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      {!useCardOnRecord && paymentDetails && paymentDetails.length > 0 && (
        <div>
          <p>Would you like to use a card on record?</p>
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
          <Button
            className="custom-btn-primary checkout-button use-card"
            onClick={() => onNext()}
          >
            Use Card on Record
          </Button>
          <Button
            className="custom-btn-primary checkout-button"
            onClick={() => setUseCardOnRecord(true)}
          >
            Enter New Payment
          </Button>
        </div>
      )}
      {!useCardOnRecord && (!paymentDetails || paymentDetails.length === 0) && (
        <Formik
            initialValues={{
              cardholder_name: "",
              card_number: "",
              expiration_month: "",
              expiration_year: "",
              cvv: "",
            }}
            validationSchema={paymentValidationSchema}
            onSubmit={handleNext}
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
      )}

      {useCardOnRecord && (
        <div>
          <p>Enter new payment details:</p>
          <Formik
            initialValues={{
              cardholder_name: "",
              card_number: "",
              expiration_month: "",
              expiration_year: "",
              cvv: "",
            }}
            validationSchema={paymentValidationSchema}
            onSubmit={handleNext}
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
        </div>
      )}
    </div>
  );
}

export default EnterPayment;
