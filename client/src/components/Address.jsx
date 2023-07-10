import React, { useState, useEffect, useContext } from "react";
import { Card, Container, Row, Button, Form } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import UserContext from "../context/UserContext";

function Address() {
  const { user } = useContext(UserContext);
  const [addressDetails, setAddressDetails] = useState([]);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const handleEditAddress = (addressId) => {
    setSelectedAddressId(addressId);
    setShowAddAddressForm(true);
  };

  const handleDeleteAddress = (addressId) => {
    setSelectedAddressId(addressId);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setSelectedAddressId(null);
    setShowDeleteModal(false);
  };

  const handleFormSubmit = (values) => {
    if (selectedAddressId) {
      fetch(`/api/addresses/${user.id}/${selectedAddressId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((response) => {
          if (response.ok) {
            setAddressDetails((prevAddressDetails) =>
              prevAddressDetails.map((address) =>
                address.id === selectedAddressId
                  ? { ...address, ...values }
                  : address
              )
            );
            setShowAddAddressForm(false);
          } else {
            throw new Error("Error saving address");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
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
    }
  };

  const handleConfirmDelete = () => {
    if (selectedAddressId) {
      fetch(`/api/addresses/${user.id}/${selectedAddressId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            setAddressDetails((prevAddressDetails) =>
              prevAddressDetails.filter(
                (address) => address.id !== selectedAddressId
              )
            );
            setSelectedAddressId(null);
            setShowDeleteModal(false);
          } else {
            throw new Error("Error deleting address");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
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
      {addressDetails && addressDetails.length === 0 ? (
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
                <Card.Title>
                  {address.address_line1}
                  {address.address_line2}
                </Card.Title>
                <Card.Text>
                  {address.city}, {address.state}, {address.postal_code}
                  <br />
                  Address Type: {address.type}
                </Card.Text>
                <Button
                  className="custom-btn-primary"
                  onClick={() => handleEditAddress(address.id)}
                >
                  Edit
                </Button>
                <Button
                  className="custom-btn-primary"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          ))}
        </Row>
      )}
      {showDeleteModal && (
        <div>
          <p>Are you sure you want to delete this address?</p>
          <Button className="custom-btn-primary" onClick={handleConfirmDelete}>
            Confirm
          </Button>
          <Button className="custom-btn-primary" onClick={handleCancelDelete}>
            Cancel
          </Button>
        </div>
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
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
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
                  <Field
                    as="select"
                    name="address_type"
                    className="form-control"
                  >
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
