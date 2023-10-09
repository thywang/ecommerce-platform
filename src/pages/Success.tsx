import Colors from "../style/colors";
import "../style/AfterCheckout.css";
import { Button } from "react-bootstrap";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShoppingCart } from "../context/ShoppingCartContext";
import {
  getCheckoutSessionID,
  resetCheckoutSessionID,
} from "../service/AuthService";

export default function Success() {
  const { deleteCartAndResetCartID } = useShoppingCart();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const sessionID = getCheckoutSessionID();

  useEffect(() => {
    const querySessionID = queryParams.get("session_id");

    // Check if checkout session ID is valid
    if (!querySessionID || querySessionID !== sessionID) {
      navigate("/");
    } else {
      deleteCartAndResetCartID();
      console.log("successfully cleared cart!");
    }
    resetCheckoutSessionID();
  }, []);

  return (
    <div className="after-checkout">
      <h2>Thank you for your purchase!</h2>
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
