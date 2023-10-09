import axios from "axios";
import Stripe from "stripe";
import Colors from "../style/colors";
import { Button } from "react-bootstrap";
import { CartItemProps } from "./CartItem";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { getCartID } from "../backend/CartAPI";
import { setCheckoutSessionID } from "../service/AuthService";

const serverURL = import.meta.env.VITE_STRIPE_SERVER_URL;

const checkout = async (checkoutItems: CartItemProps[]) => {
  const requestConfig = {
    headers: {
      "x-api-key": import.meta.env.VITE_X_API_KEY,
      "Content-Type": "application/json",
    },
  };
  const requestBody = { items: checkoutItems, cartId: getCartID() };
  await axios
    .post(`${serverURL}/checkout`, requestBody, requestConfig)
    .then((res) => {
      if (res.data.url && res.data.session_id) {
        setCheckoutSessionID(res.data.session_id);
        window.location.assign(res.data.url); // forward user to Stripe
      }
    })
    .catch((err) => console.log(err.message));
};

export default function CheckoutButton() {
  const { cartItems } = useShoppingCart();

  const fetchPriceAndCheckout = async (items: CartItemProps[]) => {
    const requestConfig = {
      headers: {
        "x-api-key": import.meta.env.VITE_X_API_KEY,
        "Content-Type": "application/json",
      },
      params: {
        items: items.map((item) => {
          return {
            id: String(item.id), // Stripe expects id to be string type
            quantity: item.quantity,
          };
        }),
      },
    };

    await axios
      .get(`${serverURL}/get-products`, requestConfig)
      .then(async (res) => {
        const products = res.data.products;
        const checkoutItems = products.map(
          (product: Stripe.Product, i: number) => {
            return {
              price: product.default_price,
              quantity: items[i].quantity,
            };
          }
        );
        await checkout(checkoutItems);
      });
  };

  return (
    <Button
      style={{
        backgroundColor: Colors.secondary,
        borderColor: Colors.primary,
      }}
      className="w-100"
      onClick={async () => {
        await fetchPriceAndCheckout(cartItems);
      }}
    >
      Checkout
    </Button>
  );
}
