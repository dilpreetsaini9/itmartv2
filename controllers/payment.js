import Stripe from "stripe";
import JWT from "jsonwebtoken";
const stripe = new Stripe(process.env.STRIPEKEY);

// custom imports
import { Product } from "../models/ProductModel.js";
import { User } from "../models/UserModel.js";

// create session
export const processPayment = async (req, res) => {
  const authorizationHeader = req.headers["token"];
  let decode = JWT.verify(authorizationHeader, process.env.JWTKEY);
  const ids = req.body.map((product) => product._id);

  let payload = [];

  for (let i = 0; i < ids.length; i++) {
    try {
      let fromDB = await Product.findOne({ _id: ids[i] });
      if (fromDB) {
        payload.push(fromDB);
      }
    } catch (error) {
      console.error(`Error fetching document with _id ${ids[i]}:`, error);
    }
  }

  const lineItems = payload.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: { name: item.productName },
      unit_amount: item.price * 100,
    },
    quantity: 1,
  }));

  const itemsForDB = payload.map((item) => item.productName);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      metadata: {
        userId: decode.id,
        cartItems: JSON.stringify(ids),
        cartString: JSON.stringify(itemsForDB),
      },
      client_reference_id: decode.id,
      mode: "payment",
      success_url: "http://192.46.214.212",
      cancel_url: "https://facebook.com",
    });

    res.status(200).json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// webhook
export const updateViaStripe = async (req, res) => {
  console.log("acticaed");
  const sig = req.headers["stripe-signature"];
  const endpointSecret = "whsec_nHHw2ulYk67McIzDj4WfqZBiUD1Y8zOM";

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
    case "checkout.session.completed":
      const paymentIntent = event.data.object;
      const clientReferenceId = paymentIntent.client_reference_id;

      console.log(paymentIntent, clientReferenceId, "end");

      // bug -
      const updateinDB = await User.findOneAndUpdate(
        { _id: clientReferenceId },
        { $push: { orders: paymentIntent.metadata.cartString } },
        { new: true }
      );

      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send();
};
