import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Container, Image } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import UserContext from "../../context/UserContext";

function Signup() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const initialValues = {
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .required("Email is required")
      .matches(/^[^@]+@[^@]+\.[^@]+$/, "Invalid email format"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    if (values.password !== values.confirmPassword) {
      setErrors({
        confirmPassword: "Passwords must match",
      });
      setSubmitting(false);
      return;
    }
  
    fetch("/api/signup", {
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
          throw new Error("Username or email is already in use");
        }
      })
      .then((data) => {
        setUser(data);
        navigate("/");
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setSubmitting(false);
      });
  };

  return (
    <>
      <Container>
        <Row>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="signup-form">
              <h3>Sign Up</h3>
              {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  className="form-control form-field"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="error-message"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <Field
                  type="text"
                  name="email"
                  id="email"
                  className="form-control form-field"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
              </div>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <Field
                  type="text"
                  name="username"
                  id="username"
                  className="form-control form-field"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="error-message"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  className="form-control form-field"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="form-control form-field"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="error-message"
                />
              </div>
              <button type="submit" className="signup-button">
                Submit
              </button>
            </Form>
          </Formik>
          <p>
            Already a user?
            <span
              style={{ cursor: "pointer", "marginLeft": "10px" }}
              onClick={() => navigate("/login")}
            >
              <b>Sign In</b>
            </span>
          </p>
        </Row>
      </Container>
    </>
  );
}

export default Signup;
