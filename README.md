# ecommerce-platform
A React web application for a simple e-commerce platform. Created with React and TypeScript.

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

Start the server

```bash
  npm run dev
```

## React Frontend

#### Shopping Cart
Shopping cart uses Context as it contains data (e.g. what items are in the cart, how many of each there are) that needs to be accessible by many components (e.g. store, product page) at different nesting levels.

#### Color Palette
`Color.ts` lists and organizes the colors used in the app. Colors can be accessed in a `.tsx` file by importing `Colors`.

* Primary ![#E6E6FA](https://placehold.co/15x15/E6E6FA/E6E6FA.png) `#E6E6FA`
* Secondary ![#8A2BE2](https://placehold.co/15x15/8A2BE2/8A2BE2.png) `#8A2BE2`
* textPrimary ![#161629](https://placehold.co/15x15/161629/161629.png) `#161629`
* textSecondary ![#663399](https://placehold.co/15x15/663399/663399.png) `#663399`
  
#### Libraries Used
* **React-Bootstrap** for content layout and styling
* **Vitest** for testing
* **Axios** for HTTP requests to AWS backend

#### Responsiveness
* **Mobile first design approach**: start the product design from the mobile end which has more restrictions. At every stage of change ensure the content is displayed correctly.

Example: use Bootstrap grid system to specify how many products to show in a row.

`...
<Row md={2} xs={1} lg={3} className="g-3">
...`

## AWS Backend

![ecommerce-platform](https://github.com/thywang/ecommerce-platform/assets/88808428/ff0c0cc4-9ca3-42dd-8f2b-f4c0c31d28cd)

#### Services Used
* **Lambda** contains Node.js serverless API that uses `bcrypt` to encrypt passwords and `jwt` to generate tokens
* **API Gateway** to create, maintain, monitor and secure API defined in Lambda
* **DynamoDB** for scalable NoSQL user information storage
* **S3 Bucket** for simple static website hosting

## Challenges
* Troubleshooting errors from backend endpoint -> solved by inspecting Cloudwatch logs

Example: 502 errors when testing with Postman. Looking at Cloudwatch logs I realize that `export const` was the issue. The Node.js syntax is `module.exports`.

* Hiding `Navbar` and the cart when user isn't authenticated -> solved by defining `PrivateRoute` and using `Outlet`

Example: wrap `PrivateRoute` around private pages like `/store` and `/products/:id` and components like `Navbar`.

## Next Steps
* Checkout with Stripe integration
* Handling orders and storing them in DynamoDB

