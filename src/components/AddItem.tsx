import { Button } from "react-bootstrap";
import { useShoppingCart } from "../context/ShoppingCartContext";
import Colors from "../style/colors";

type AddItemProps = {
  id: number;
};

export function AddItem({ id }: AddItemProps) {
  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  } = useShoppingCart();
  const quantity = getItemQuantity(id);
  return (
    <>
      {quantity === 0 ? (
        <Button
          style={{
            backgroundColor: Colors.secondary,
            borderColor: Colors.primary,
          }}
          className="w-100"
          onClick={() => increaseCartQuantity(id)}
        >
          + Add To Cart
        </Button>
      ) : (
        <div
          className="d-flex align-items-center flex-column"
          style={{
            gap: ".5rem",
          }}
        >
          <div
            className="d-flex align-item-center justify-content-center"
            style={{
              gap: ".5rem",
            }}
          >
            <Button
              style={{
                backgroundColor: Colors.secondary,
                borderColor: Colors.primary,
              }}
              onClick={() => decreaseCartQuantity(id)}
            >
              -
            </Button>
            <div>
              <span className="fs-3">{quantity}</span> in cart
            </div>
            <Button
              style={{
                backgroundColor: Colors.secondary,
                borderColor: Colors.primary,
              }}
              onClick={() => increaseCartQuantity(id)}
            >
              +
            </Button>
          </div>
          <Button onClick={() => removeFromCart(id)} variant="danger" size="sm">
            Remove
          </Button>
        </div>
      )}
    </>
  );
}
