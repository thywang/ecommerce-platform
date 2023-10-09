import { Offcanvas, Stack } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";
import { CartItem } from "./CartItem";
import { formatCurrency } from "../utilities/formatCurrency";
import { useStoreItems } from "../context/StoreItemsContext";
import CheckoutButton from "./CheckoutButton";

type ShoppingCartProps = {
  isCartOpen: boolean;
};

export function ShoppingCart({ isCartOpen }: ShoppingCartProps) {
  const { closeCart, cartItems } = useShoppingCart();
  const { storeItems } = useStoreItems();

  const currTotal = cartItems.reduce((total, cartItem) => {
    const item = storeItems.find((item) => item.id === cartItem.id);
    return total + (item?.price || 0) * cartItem.quantity;
  }, 0);

  return (
    <Offcanvas show={isCartOpen} onHide={closeCart} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Cart</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Stack gap={3}>
          {cartItems.map((item) => (
            <CartItem key={item.id} {...item} />
          ))}
          <div className="ms-auto fw-bold fs-5">
            Total {formatCurrency(currTotal)}
          </div>
          {currTotal > 0 && (
            <div className="mt-auto">
              <CheckoutButton />
            </div>
          )}
        </Stack>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
