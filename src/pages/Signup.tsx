import axios from "axios";
import Colors from "../style/colors";
import "../style/Login.css";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useForm } from "../utilities/useForm";
import { useState } from "react";

const signupUrl = import.meta.env.VITE_SIGNUP_TOKEN_URL;

type SignupUser = {
  email: string;
  username: string;
  password: string;
};

export default function Register() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    handleSubmit,
    handleChange,
    data: user,
    errors,
  } = useForm<SignupUser>({
    validations: {
      email: {
        custom: {
          isValid: (value) => {
            const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            return emailRegex.test(value);
          },
          message: "Please provide a valid email address.",
        },
      },
      username: {
        custom: {
          isValid: (value) => value.length >= 6,
          message: "The username needs to be at least 6 characters long.",
        },
      },
      password: {
        custom: {
          isValid: (value) => value.length >= 8,
          message: "The password needs to be at least 8 characters long.",
        },
      },
    },
    onSubmit: () => {
      const requestConfig = {
        headers: { "x-api-key": import.meta.env.VITE_X_API_KEY },
      };
      const requestBody = {
        username: user.username,
        email: user.email,
        password: user.password,
      };
      axios
        .post(signupUrl, requestBody, requestConfig)
        .then((response) => {
          setErrorMessage(null);
          alert("Sign up successful");
        })
        .catch((error) => {
          if (error.response.status === 401 || error.response.status === 403) {
            setErrorMessage(error.response.data.message);
          } else {
            setErrorMessage(
              "Sorry... the backend server is down! Please try again later"
            );
          }
        });
    },
  });

  const loginCallback = () => {
    navigate("/login");
  };
  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Container fluid>
        <Row className="d-flex justify-content-center align-items-center h-100">
          <Col col="12">
            <Card
              className="bg-white my-5 mx-auto"
              style={{ borderRadius: "1rem", maxWidth: "500px" }}
            >
              <Card.Body className="p-5 w-100 d-flex flex-column">
                <h1
                  className="fw-bold mb-2 text-center"
                  style={{ color: Colors.textSecondary }}
                >
                  Sign Up
                </h1>
                <div className="mt-2 mb-3 text-center">
                  Already registered?{" "}
                  <span
                    className="link-primary"
                    style={{ cursor: "pointer" }}
                    onClick={loginCallback}
                  >
                    Sign In
                  </span>
                </div>
                <label htmlFor="Email address">Email address</label>
                <input
                  className="mb-4 w-100 input-lg"
                  id="Email address"
                  type="email"
                  onChange={handleChange("email")}
                  required
                />
                {errors.email && <p className="error">{errors.email}</p>}
                <label htmlFor="Username">Username</label>
                <input
                  className="mb-4 w-100 input-lg"
                  id="Username"
                  type="username"
                  onChange={handleChange("username")}
                  required
                />
                {errors.username && <p className="error">{errors.username}</p>}
                <label htmlFor="Password">Password</label>
                <input
                  className="mb-4 w-100 input-lg"
                  id="Password"
                  type="password"
                  onChange={handleChange("password")}
                  required
                />
                {errors.password && <p className="error">{errors.password}</p>}

                <Button
                  size="lg"
                  style={{
                    backgroundColor: Colors.secondary,
                    borderColor: Colors.primary,
                  }}
                  type="submit"
                >
                  Sign Up
                </Button>
                {/* future options to sign up with Google */}
                {/* <hr className="my-4" />

                <Button
                  className="mb-2 w-100"
                  size="lg"
                  style={{
                    backgroundColor: "#dd4b39",
                    borderColor: Colors.primary,
                  }}
                >
                  Sign up with google
                </Button> */}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </form>
  );
}
