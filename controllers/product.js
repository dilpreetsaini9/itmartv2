import {
  getAllProducts,
  getOrderItems,
  getOrdersOfUsers,
  searchCommand,
  singleProduct,
} from "../db/commands.js";
import { pool } from "../db/database.js";

export const getProductController = async (req, res) => {
  let [rows] = await pool.query(getAllProducts);
  res.json(rows);
};

export const getSingleProductController = async (req, res) => {
  let id = req.params.productid;
  if (!id) {
    return res.status(400).json({ message: "bad request" });
  }
  let [rows] = await pool.query(singleProduct, [id]);
  res.json(rows[0]);
};

export const orderDetails = async (req, res) => {
  let user_id = req.query.userid;
  let [rows] = await pool.query(getOrdersOfUsers, [user_id]);
  res.send(rows);
};

export const orderItemDetails = async (req, res) => {
  let orderId = req.query.orderid;
  let [rows] = await pool.query(getOrderItems, [orderId]);
  res.send(rows);
};

export const searchFeature = async (req, res) => {
  let query = req.query.search;
  if (!query) {
    return res.status(404);
  }
  let searchPattern = `${query}%`;
  let [results] = await pool.query(searchCommand, [searchPattern]);
  res.send(results);
};
