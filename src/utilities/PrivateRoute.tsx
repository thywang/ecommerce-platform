import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../service/AuthService";
import { Navbar } from "../components/Navbar";
import { Container } from "react-bootstrap";

export default function PrivateRoute() {
  if (!getToken()) return <Navigate to="/login" />;

  return (
    <>
      <Navbar />
      <Container className="mb-4">
        <Outlet />
      </Container>
    </>
  );
}
