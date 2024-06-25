import express from "express";
import bodyParser from "body-parser";
import { processPayment, updateViaStripe } from "../controllers/payment.js";
import {
  VerifyProfileController,
  postLoginController,
  postSignupController,
} from "../controllers/Auth.js";
import {
  getProductController,
  getSingleProductController,
  orderDetails,
  orderItemDetails,
  searchFeature,
} from "../controllers/product.js";

export const api = express.Router();

api.get("/products", getProductController);
api.get("/product/:productid", getSingleProductController);
api.get("/searchproduct", searchFeature);
api.get("/orders", orderDetails);
api.get("/orderitem", orderItemDetails);
api.post("/login", express.json(), postLoginController);
api.post("/profile", VerifyProfileController);
api.post("/signup", express.json(), postSignupController);
api.post("/creategateway", express.json(), processPayment);
api.post(
  "/updateUserOrders",
  bodyParser.raw({ type: "application/json" }),
  updateViaStripe
);
