const paypal = require("paypal-rest-sdk");
require("dotenv").config();

paypal.configure({
  mode: "sandbox",
  client_id:
    process.env.PAYPAL_CLIENT_ID || "http://localhost:5173/shop/paypal-return",
  client_secret:
    process.env.PAYPAL_CLIENT_SECRET ||
    "http://localhost:5173/shop/paypal-cancel",
});

module.exports = paypal;
