import axios from "axios";
import { getUser } from "../service/AuthService";
import { CartItemProps } from "../components/CartItem";

export type GetCartAPIProps = {
  cart_id: string;
  product_id: number;
  quantity: number;
  expiration_time: number;
};

export type UpdateCartAPIProps = {
  cart_id: string;
  product_id: number;
  quantity: number;
};

export type DeleteCartAPIProps = {
  cart_id: string;
  product_id: number;
};

const cartURL = import.meta.env.VITE_CART_TOKEN_URL;

function getCartID() {
  const user = getUser();
  const username = user !== "undefined" && user ? user.username : "";
  return "user#" + username;
}

export async function getCartItems(): Promise<GetCartAPIProps[]> {
  const requestConfig = {
    headers: { "x-api-key": import.meta.env.VITE_X_API_KEY },
    params: { cart_id: getCartID() },
  };
  return axios
    .get(cartURL, requestConfig)
    .then((response) => {
      console.log("get response from databse");
      console.log(response.data);
      return response.data.items;
    })
    .catch((error) => {
      if (error.response.status === 401 || error.response.status === 403) {
        alert(error.response.data.message);
      } else {
        alert("Sorry... the backend server is down! Please try again later");
      }
    });
}

export async function updateCartItem(
  cartItem: CartItemProps
): Promise<UpdateCartAPIProps> {
  const requestConfig = {
    headers: { "x-api-key": import.meta.env.VITE_X_API_KEY },
    params: { cart_id: getCartID() },
  };
  return axios
    .put(cartURL, cartItem, requestConfig)
    .then((response) => {
      console.log("update response from databse");
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      if (error.response.status === 401 || error.response.status === 403) {
        alert(error.response.data.message);
      } else {
        alert("Sorry... the backend server is down! Please try again later");
      }
    });
}

export async function addItemToCart(
  cartItem: CartItemProps
): Promise<UpdateCartAPIProps> {
  const requestConfig = {
    headers: { "x-api-key": import.meta.env.VITE_X_API_KEY },
    params: { cart_id: getCartID() },
  };
  return axios
    .post(cartURL, cartItem, requestConfig)
    .then((response) => {
      console.log("post response from databse");
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      if (error.response.status === 401 || error.response.status === 403) {
        alert(error.response.data.message);
      } else {
        alert("Sorry... the backend server is down! Please try again later");
      }
    });
}

export async function deleteItemFromCart(
  product_id: number
): Promise<DeleteCartAPIProps> {
  const requestConfig = {
    headers: { "x-api-key": import.meta.env.VITE_X_API_KEY },
    params: { cart_id: getCartID(), product_id: product_id },
  };
  return axios
    .delete(cartURL, requestConfig)
    .then((response) => {
      console.log("delete response from databse");
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      if (error.response.status === 401 || error.response.status === 403) {
        alert(error.response.data.message);
      } else {
        alert("Sorry... the backend server is down! Please try again later");
      }
    });
}

/** Unused currently */
export function removeAllItemsFromCart() {
  const requestConfig = {
    headers: { "x-api-key": import.meta.env.VITE_X_API_KEY },
    params: { cart_id: getCartID() },
  };
  axios
    .delete(cartURL, requestConfig)
    .then((response) => {
      console.log(response.data);
      alert("Remove all items successful");
    })
    .catch((error) => {
      if (error.response.status === 401 || error.response.status === 403) {
        alert(error.response.data.message);
      } else {
        alert("Sorry... the backend server is down! Please try again later");
      }
    });
}
