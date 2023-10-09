const express = require("express");
var cors = require("cors");
require("dotenv").config();

// This is your test secret API key.
const stripe = require("stripe")(process.env.VITE_STRIPE_SECRET_API_KEY);
const appURL = "http://localhost:5173";

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

const port = process.env.PORT || 4242;

// routes
app.get("/get-products", async (req, res) => {
  const { items } = req.query;
  let ids = [];
  let products = [];

  items.forEach((item) => {
    ids.push(item.id);
  });

  for (let i = 0; i < ids.length; i++) {
    const product = await stripe.products.retrieve(ids[i]);
    products.push(product);
  }

  res.send(
    JSON.stringify({
      products: products,
    })
  );
});

app.post("/checkout", async (req, res) => {
  const { items, cartId } = req.body;

  const customer = await stripe.customers.create({
    metadata: {
      cartId: cartId,
    },
  });

  let lineItems = [];
  items.forEach((item) => {
    lineItems.push({ price: item.price, quantity: item.quantity });
  });

  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    line_items: lineItems,
    mode: "payment",
    success_url: `${appURL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appURL}`,
  });

  res.send(
    JSON.stringify({
      session_id: session.id,
      url: session.url,
    })
  );
});

app.listen(port, () =>
  console.log("Node server listening on port " + port + "!")
);
