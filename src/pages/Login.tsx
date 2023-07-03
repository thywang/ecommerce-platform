import axios from "axios";
import { useState } from "react";
import { setUserSession } from "../service/AuthService";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useForm } from "../utilities/useForm";
import Colors from "../style/colors";
import "../style/Login.css";

const loginUrl = import.meta.env.VITE_LOGIN_TOKEN_URL;

export type LoginUser = {
  username: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    handleSubmit,
    handleChange,
    data: user,
    errors,
  } = useForm<LoginUser>({
    validations: {},
    onSubmit: () => {
      const requestConfig = {
        headers: { "x-api-key": import.meta.env.VITE_X_API_KEY },
      };
      const requestBody = {
        username: user.username,
        password: user.password,
      };
      axios
        .post(loginUrl, requestBody, requestConfig)
        .then((response) => {
          console.log("login from aws: " + response.data.token);
          setUserSession(response.data.user, response.data.token);
          // direct user to store
          navigate("/store");
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

  const signupCallback = () => {
    navigate("/signup");
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
                  Log In
                </h1>
                <div className="mt-2 mb-3 text-center">
                  Not registered yet?{" "}
                  <span
                    className="link-primary"
                    style={{ cursor: "pointer" }}
                    onClick={signupCallback}
                  >
                    Sign Up
                  </span>
                </div>
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

                <Form.Check
                  name="flexCheck"
                  id="flexCheckDefault"
                  className="mb-4"
                  label="Remember password"
                />

                <Button
                  size="lg"
                  style={{
                    backgroundColor: Colors.secondary,
                    borderColor: Colors.primary,
                  }}
                  type="submit"
                >
                  Log In
                </Button>
                {/* future options to sign in with Google */}
                {/* <hr className="my-4" />

                <Button
                  className="mb-2 w-100"
                  size="lg"
                  style={{
                    backgroundColor: "#dd4b39",
                    borderColor: Colors.primary,
                  }}
                >
                  Sign in with google
                </Button> */}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </form>
  );
}
