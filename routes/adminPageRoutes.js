// import express from "express";
// import { pool } from "../db/database.js";

// export const admin = express.Router();

// admin.get("/pendingorders", async (req, res) => {
//   console.log("req come");
//   const command = `SELECT * FROM orders WHERE order_status='placed'`;
//   let [fetchingPendingProducts] = await pool.query(command);
//   res.send(fetchingPendingProducts);
// });
// admin.get("/pendingorderdetail", async (req, res) => {
//   let id = req.query.id;
//   console.log("req come");
//   const command = `SELECT
//   p.id AS product_id,
//   p.productName,
//   p.price

// FROM
//   order_items oi
// JOIN
//   products p ON oi.product_id = p.id
// WHERE
//   oi.order_id = ?;`;
//   let [fetchingPendingProducts] = await pool.query(command, [id]);
//   console.log(fetchingPendingProducts);
//   res.send(fetchingPendingProducts);
// });
// // secure this  route
// admin.post("/updateorder", express.json(), async (req, res) => {
//   let id = req.body.id;
//   let command = `update orders
// set order_status = "preparing to dispatch"
// where id = ?`;
//   let [updated] = await pool.query(command, [id]);
//   console.log(updated);
//   res.send("order updated");
// });
