import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import UserContext from "../../context/UserContext";

function Login() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const initialValues = {
    identifier: "",
    password: "",
  };

  const validationSchema = Yup.object({
    identifier: Yup.string().required("Username or Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = (values) => {
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          throw new Error("Invalid username/email or password");
        } else if (response.status === 404) {
          throw new Error("User not found");
        } else {
          throw new Error("Error logging in");
        }
      })
      .then((user) => {
        setUser(user);
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage(error.message);
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
            <Form className="login-form">
              <h3>Login</h3>
              {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
              <div className="form-group">
                <label htmlFor="identifier">Username or Email:</label>
                <Field
                  type="text"
                  name="identifier"
                  id="identifier"
                  className="form-control form-field"
                />
                <ErrorMessage
                  name="identifier"
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
              <button type="submit" className="login-button">
                Submit
              </button>
            </Form>
          </Formik>
          <p>
            Don't have an account?
            <span
              style={{ cursor: "pointer", "marginLeft": "10px" }}
              onClick={() => navigate("/signup")}
            >
              <b>Sign Up</b>
            </span>
          </p>
        </Row>
      </Container>
    </>
  );
}

export default Login;
