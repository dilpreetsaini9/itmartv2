import Stripe from "stripe";
import JWT from "jsonwebtoken";
import { pool } from "../db/database.js";
import {
  createOrderID,
  createOrderItems,
  getProductDetails,
} from "../db/commands.js";
const stripe = new Stripe(process.env.STRIPEKEY);

// create session
export const processPayment = async (req, res) => {
  const authorizationHeader = req.headers["token"];

  if (!authorizationHeader) {
    return res.status(400).json({ message: "bad req" });
  }
  let decode = JWT.verify(authorizationHeader, process.env.JWTKEY);

  const ids = req.body.map((product) => product.id);

  let payload = [];

  for (let i = 0; i < ids.length; i++) {
    try {
      let [productFromDb] = await pool.query(getProductDetails, [ids[i]]);
      if (productFromDb) {
        payload.push(productFromDb[0]);
      }
    } catch (error) {
      console.error(`Error fetching document with _id ${ids[i]}:`, error);
    }
  }
  console.log(payload);
  const lineItems = payload.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: { name: item.productName },
      unit_amount: item.price * 100,
    },
    quantity: 1,
  }));
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      metadata: {
        UserId: decode.id,
        products: JSON.stringify(ids),
      },

      client_reference_id: decode.id,
      mode: "payment",
      success_url: "https://itsmyitmart.store",
      cancel_url: "https://itsmyitmart.store",
    });
    res.status(200).json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const updateViaStripe = async (request, response) => {
  const sig = request.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case "checkout.session.completed":
      const paymentIntentSucceeded1 = event.data.object;

      let userId = parseInt(paymentIntentSucceeded1.metadata.UserId);
      let products = JSON.parse(paymentIntentSucceeded1.metadata.products);
      let [id] = await pool.query(createOrderID, [userId]);

      if (id.insertId) {
        for (let i = 0; i < products.length; i++) {
          let [insertOrderItems] = await pool.query(createOrderItems, [
            id.insertId,
            products[i],
          ]);
        }
      }
      break;
  }
  response.send();
};
