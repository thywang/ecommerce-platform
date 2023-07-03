import axios from "axios";
import PrivateRoute from "./utilities/PrivateRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Store } from "./pages/Store";
import { Product } from "./pages/Product";
import { ShoppingCartProvider } from "./context/ShoppingCartContext";
import { StoreItemsProvider } from "./context/StoreItemsContext";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import {
  getToken,
  setUserSession,
  getUser,
  resetUserSession,
} from "./service/AuthService";

const verifyTokenAPIURL = import.meta.env.VITE_VERIFY_TOKEN_URL;

function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (
      token === "undefined" ||
      token === undefined ||
      token === null ||
      !token
    ) {
      return;
    }

    const requestConfig = {
      headers: { "x-api-key": import.meta.env.VITE_X_API_KEY },
    };

    const requestBody = {
      user: getUser(),
      token: token,
    };

    axios
      .post(verifyTokenAPIURL, requestBody, requestConfig)
      .then((response) => {
        setUserSession(response.data.user, response.data.token);
        setIsAuthenticating(false);
      })
      .catch(() => {
        // error during verifying
        resetUserSession();
        setIsAuthenticating(false);
      });
  }, []);

  const token = getToken();
  if (isAuthenticating && token) {
    return <div>Authenticating...</div>;
  }

  return (
    <StoreItemsProvider>
      <ShoppingCartProvider>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />

          <Route path="/" element={<PrivateRoute />}>
            <Route path="store" element={<Store />} />
            <Route path="products">
              <Route path=":id" element={<Product />} />
            </Route>
          </Route>
        </Routes>
      </ShoppingCartProvider>
    </StoreItemsProvider>
  );
}

export default App;
