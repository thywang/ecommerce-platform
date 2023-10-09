import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useLocation } from "react-router-dom";
import { ShoppingCart } from "../components/ShoppingCart";
import {
  GetCartAPIProps,
  UpdateCartAPIProps,
  getCartItems,
  updateCartItem,
  addItemToCart,
  deleteItemFromCart,
  resetCartID,
  removeAllItemsFromCart,
} from "../backend/CartAPI";

type ShoppingCartProviderProps = {
  children: ReactNode;
};

type CartItem = {
  id: number;
  quantity: number;
};

type ShoppingCartContext = {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  resetCartAndCartID: () => void;
  deleteCart: () => void;
  cartQuantity: number;
  cartItems: CartItem[];
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const location = useLocation();
  const cartQuantity = cartItems.reduce(
    (quantity, item) => quantity + item.quantity,
    0
  );

  const fetchAndSetCart = async () => {
    try {
      const cartData = await getCartItems();
      const cartDataItems = cartData.map((item: GetCartAPIProps) => {
        return {
          id: item.product_id,
          quantity: item.quantity,
        };
      });
      setCartItems(cartDataItems);
    } catch (error) {
      console.log("error on fetching cart items", error);
    }
  };

  useEffect(() => {
    fetchAndSetCart();
  }, [location.pathname]);

  const openCart = () => setIsCartOpen(true);

  const closeCart = () => setIsCartOpen(false);

  function getItemQuantity(id: number) {
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  }

  function getItemIndex(id: number) {
    return cartItems.findIndex((obj) => obj.id == id);
  }
  const increaseCartQuantity = async (id: number) => {
    try {
      const idx = getItemIndex(id);
      // default value
      let updatedItem: CartItem = { id, quantity: 1 };
      if (idx > -1) {
        // item exists, update value
        updatedItem = {
          ...cartItems[idx],
          quantity: cartItems[idx].quantity + 1,
        };
        const cartData: UpdateCartAPIProps = await updateCartItem(updatedItem);
        const cartDataItem: CartItem = {
          id: cartData.product_id,
          quantity: cartData.quantity,
        };
        const cartDataItems = [...cartItems];
        cartDataItems[idx] = cartDataItem;
        setCartItems(cartDataItems);
      } else {
        // add item to cart
        const cartData: UpdateCartAPIProps = await addItemToCart(updatedItem);
        const cartDataItem: CartItem = {
          id: cartData.product_id,
          quantity: cartData.quantity,
        };
        const cartDataItems = [...cartItems, cartDataItem];
        setCartItems(cartDataItems);
      }
    } catch (error) {
      console.log("error on increasing cart item quantity", error);
    }
  };

  const decreaseCartQuantity = async (id: number) => {
    try {
      const idx = getItemIndex(id);
      if (idx > -1) {
        // item exists
        if (cartItems[idx].quantity === 1) {
          // remove the item
          await deleteItemFromCart(id);
          const cartDataItems = [...cartItems];
          cartDataItems.splice(idx, 1);
          setCartItems(cartDataItems);
        } else {
          // decrement item quantity
          let updatedItem: CartItem = {
            ...cartItems[idx],
            quantity: cartItems[idx].quantity - 1,
          };

          const cartData: UpdateCartAPIProps = await updateCartItem(
            updatedItem
          );
          const cartDataItem: CartItem = {
            id: cartData.product_id,
            quantity: cartData.quantity,
          };
          const cartDataItems = [...cartItems];
          cartDataItems[idx] = cartDataItem;
          setCartItems(cartDataItems);
        }
      }
    } catch (error) {
      console.log("error on decreasing cart item quantity", error);
    }
  };

  const removeFromCart = async (id: number) => {
    // remove the item
    await deleteItemFromCart(id);
    setCartItems((currItems) => {
      return currItems.filter((item) => item.id !== id);
    });
  };

  const resetCartAndCartID = () => {
    setCartItems([]);
    resetCartID();
  };

  const deleteCart = async () => {
    await removeAllItemsFromCart();
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        openCart,
        closeCart,
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        resetCartAndCartID,
        deleteCart,
        cartItems,
        cartQuantity,
      }}
    >
      {children}
      <ShoppingCart isCartOpen={isCartOpen} />
    </ShoppingCartContext.Provider>
  );
}
