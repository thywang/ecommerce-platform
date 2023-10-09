import axios from "axios";
import { v4 as uuid } from "uuid";
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

export type DeleteCartItemAPIProps = {
  cart_id: string;
  product_id: number;
};

export type DeleteCartAPIProps = {
  cart_id: string;
};

export type MigrateCartAPIProps = {
  cart_id: string;
};

const cartURL = import.meta.env.VITE_CART_TOKEN_URL;
const migrateCartURL = import.meta.env.VITE_MIGRATE_CART_TOKEN_URL;

export function getCartID() {
  const user = getUser();
  if (user !== "undefined" && user) {
    return "user#" + user.username;
  } else {
    // guest cart
    let cart_id = sessionStorage.getItem("cart_id");
    if (
      cart_id === "undefined" ||
      cart_id === undefined ||
      cart_id === null ||
      !cart_id
    ) {
      // generate guest cart id
      cart_id = generateGuestCartID();
      sessionStorage.setItem("cart_id", cart_id);
    }
    return cart_id;
  }
}

export function resetCartID() {
  sessionStorage.removeItem("cart_id");
}

function generateGuestCartID() {
  return "cart#" + uuid();
}

/** Returns cart_id upon successful migration and deletion of guest cart */
export async function migrateGuestCartItems(
  username: string
): Promise<MigrateCartAPIProps> {
  const guest_cart_id = getCartID();
  const user_cart_id = "user#" + username;

  const requestConfig = {
    headers: {
      "x-api-key": import.meta.env.VITE_X_API_KEY,
    },
    params: { old_cart_id: guest_cart_id, new_cart_id: user_cart_id },
  };

  return axios
    .post(migrateCartURL, null, requestConfig)
    .then((response) => {
      console.log("migration response from databse");
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
): Promise<DeleteCartItemAPIProps> {
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

export function removeAllItemsFromCart(): Promise<DeleteCartAPIProps> {
  const requestConfig = {
    headers: {
      "x-api-key": import.meta.env.VITE_X_API_KEY,
    },
    params: { cart_id: getCartID() },
  };
  return axios
    .delete(cartURL, requestConfig)
    .then((response) => {
      console.log("delete all response from databse");
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
