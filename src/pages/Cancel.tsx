import Colors from "../style/colors";
import "../style/AfterCheckout.css";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Cancel() {
  const navigate = useNavigate();
  return (
    <div className="after-checkout">
      <h2>Sorry to see you cancelled your order</h2>
      <Button
        style={{
          backgroundColor: Colors.secondary,
          borderColor: Colors.primary,
        }}
        size="lg"
        onClick={() => {
          navigate("/store");
        }}
      >
        Continue shopping
      </Button>
    </div>
  );
}
