# ecommerce-platform
A React web application for a simple e-commerce platform. Created with React and TypeScript.

## Key Features
* **Checkout with Stripe:** both guest and authenticated user can checkout
* **Cart migration:** all of the guest user cart items are migrated to their newly created account when they sign up
* **Cart expiration:** using DynamoDB's native functionality where a TTL is written along with the cart item, the TTL defaults to 1 day for guest carts and 7 days for authenticated carts

**note:** guest user is a user who has not logged in, authenticated user is a user who has logged in

## React Frontend

#### Shopping Cart
Shopping cart uses Context as it contains data (e.g. what items are in the cart, how many of each there are) that needs to be accessible by many components (e.g. store, product page) at different nesting levels.

#### Color Palette
`Color.ts` lists and organizes the colors used in the app. Colors can be accessed in a `.tsx` file by importing `Colors`.

* Primary ![#CAF0F8](https://placehold.co/15x15/CAF0F8/CAF0F8.png) `#E6E6FA`
* Secondary ![#0077B6](https://placehold.co/15x15/0077B6/0077B6.png) `#8A2BE2`
* textPrimary ![#161629](https://placehold.co/15x15/161629/161629.png) `#161629`
* textSecondary ![#023E8A](https://placehold.co/15x15/023E8A/023E8A.png) `#663399`
  
#### Libraries Used
* **React-Bootstrap** for content layout and styling
* **Vitest** for testing
* **Axios** for HTTP requests to AWS backend
* **React Stripe.js** for prebuilt UI components used for Stripe integration
* **Stripe** for checkout with Stripe

#### Responsiveness
* **Mobile first design approach**: start the product design from the mobile end which has more restrictions. At every stage of change ensure the content is displayed correctly.

Example: use Bootstrap grid system to specify how many products to show in a row.

`...
<Row md={2} xs={1} lg={3} className="g-3">
...`

## AWS Backend

![ecommerce-platform-ver2](https://github.com/thywang/ecommerce-platform/assets/88808428/e60b4cf0-a410-4d71-a637-de7531c2cc68)

#### How It's Built
* **Node** for handling user authentication
* **Express** for managing checkout routes (using `serverless-http` to connect to Invoke URL on Checkout Server API Gateway)

**note:** current `server.js` file on GitHub is the local version and does not require `serverless-http`

#### Services Used
* **Lambda** contains Node.js serverless API that uses `bcrypt` to encrypt passwords and `jwt` to generate tokens
* **API Gateway** to create, maintain, monitor and secure API defined in Lambda
* **DynamoDB** for scalable NoSQL user information storage
* **S3 Bucket** for simple static website hosting

## Challenges
* Troubleshooting errors from backend endpoint -> solved by inspecting Cloudwatch logs

Example: 502 errors when testing with Postman. Looking at Cloudwatch logs I realize that `export const` was the issue. The Node.js syntax is `module.exports`.

* Protecting the checkout success route -> I considered using Stripe webhooks and creating webserver using libraries like `Socket.IO`. In the end I solved it by saving the Stripe checkout session ID in sessionStorage, then checking if the session ID passed in query parameters matches the stored session ID

Example: when a successfully created checkout session is returned by Stripe in `CheckoutButton.tsx`, save the session's `session_id` in sessionStorage. In `server.js` pass the `CHECKOUT_SESSION_ID` as query parameter in `success_url`. Finally verify in `Success.tsx` that the `session_id` from query parameter matches the one in sessionStorage.

* Cart not clearing after checkout after deployment -> solved by clearing cart on render

Example: when I removed `console.log` statements in production, the cart was not emptying after checkout. Initially I thought the issue was the removal of `console.log` and its effect in async functions, but eventually I realized it was because I was resetting cart state in `useEffect` which is executed after the render phase. Moving the call to reset cart state outside `useEffect` solved the issue.

## Next Steps
* Store orders in DynamoDB if need arise

## Run Locally

Clone the project

```bash
  git clone https://github.com/thywang/ecommerce-platform.git
```

Go to the project directory

```bash
  cd ecommerce-platform
```

Install dependencies

```bash
  npm install
```

Set server URL in .env file

```bash
  VITE_STRIPE_SERVER_URL="http://localhost:4242"
```

Start the backend server in one terminal window

```bash
  npm run dev:backend
```

Start the frontend in second terminal window

```bash
  npm run dev:frontend
```
