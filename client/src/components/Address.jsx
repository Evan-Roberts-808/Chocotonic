import React, { useState, useEffect, useContext } from "react";
import { Card, Container, Row, Button, Form } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import UserContext from "../context/UserContext";

function Address() {
  const { user } = useContext(UserContext);
  const [addressDetails, setAddressDetails] = useState([]);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
console.log(addressDetails)
  useEffect(() => {
    fetch(`/api/addresses/${user.id}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 404) {
          return [];
        } else {
          throw new Error("Error fetching address details");
        }
      })
      .then((addresses) => {
        setAddressDetails(addresses);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user]);

  const handleAddAddress = () => {
    setShowAddAddressForm(true);
  };

  const handleFormSubmit = (values) => {
    console.log(values);

    fetch(`/api/addresses/${user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (response.ok) {
          setAddressDetails((prevAddressDetails) => [
            ...prevAddressDetails,
            values,
          ]);
          setShowAddAddressForm(false);
        } else {
          throw new Error("Error saving address details");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const addressValidationSchema = Yup.object().shape({
    address_line_1: Yup.string().required("Address Line 1 is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    postal_code: Yup.string().required("Postal Code is required"),
    address_type: Yup.string().required("Address Type is required"),
  });

  return (
    <Container>
      {addressDetails.length === 0 ? (
        <Row>
          <p>
            No addresses on record. Add an address?{" "}
            <span onClick={handleAddAddress} className="address-click">
              Click Here
            </span>
          </p>
        </Row>
      ) : (
        <Row>
          <p>
            Add a new address?{" "}
            <span onClick={handleAddAddress} className="address-click">
              Click Here
            </span>
          </p>
          {addressDetails.map((address) => (
            <Card key={address.id} className="col-sm-4">
              <Card.Body>
                <Card.Title>{address.address_line1}{address.address_line2}</Card.Title>
                <Card.Text>
                  {address.city}, {address.state}, {address.postal_code}
                  <p>Address Type: {address.type}</p>
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Row>
      )}
      {showAddAddressForm && (
        <Row>
          <Formik
            initialValues={{
              address_line_1: "",
              address_line_2: "",
              city: "",
              state: "",
              postal_code: "",
              address_type: "",
            }}
            validationSchema={addressValidationSchema}
            onSubmit={handleFormSubmit}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group
                  controlId="address_line_1"
                  className="address-form-input"
                >
                  <Form.Label>Address Line 1</Form.Label>
                  <Field type="text" name="address_line_1" as={Form.Control} />
                  <ErrorMessage
                    name="address_line_1"
                    component={Form.Text}
                    className="text-danger"
                  />
                </Form.Group>

                <Form.Group
                  controlId="address_line_2"
                  className="address-form-input"
                >
                  <Form.Label>Address Line 2</Form.Label>
                  <Field type="text" name="address_line_2" as={Form.Control} />
                </Form.Group>

                <Form.Group controlId="city" className="address-form-input">
                  <Form.Label>City</Form.Label>
                  <Field type="text" name="city" as={Form.Control} />
                  <ErrorMessage
                    name="city"
                    component={Form.Text}
                    className="text-danger"
                  />
                </Form.Group>

                <Form.Group controlId="state" className="address-form-input">
                  <Form.Label>State</Form.Label>
                  <Field as="select" name="state" className="form-control">
                    <option value="">Select a state</option>
                    {/* Add options for all 50 states */}
                    {/* Example: */}
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    {/* ...and so on */}
                  </Field>
                  <ErrorMessage
                    name="state"
                    component={Form.Text}
                    className="text-danger"
                  />
                </Form.Group>

                <Form.Group
                  controlId="postal_code"
                  className="address-form-input"
                >
                  <Form.Label>Postal Code</Form.Label>
                  <Field type="text" name="postal_code" as={Form.Control} />
                  <ErrorMessage
                    name="postal_code"
                    component={Form.Text}
                    className="text-danger"
                  />
                </Form.Group>

                <Form.Group
                  controlId="address_type"
                  className="address-form-input"
                >
                  <Form.Label>Address Type</Form.Label>
                  <Field as="select" name="address_type" className="form-control">
                    <option value="">Select an address type</option>
                    <option value="billing">Billing</option>
                    <option value="shipping">Shipping</option>
                  </Field>
                  <ErrorMessage
                    name="address_type"
                    component={Form.Text}
                    className="text-danger"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="custom-btn-primary address-form-button"
                >
                  Add Address
                </Button>
              </Form>
            )}
          </Formik>
        </Row>
      )}
    </Container>
  );
}

export default Address;
