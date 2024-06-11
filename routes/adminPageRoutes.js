import express from "express";
import bodyParser from "body-parser";



import { processPayment, updateViaStripe } from "../controllers/payment.js";
import { VerifyJWTController, VerifyProfileController, adminAuthController, adminPassChangeController, postLoginController, postSignupController ,  } from "../controllers/Auth.js";
import { getAdminProductController } from "../controllers/product.js";

export const admin = express.Router()

// get mothods of main routes
admin.get('/products', getAdminProductController)
admin.post('/login', express.json(),adminAuthController)
admin.post('/changepassword', express.json(), adminPassChangeController)
// api.get('/product/:productid', getSingleProductController)
// api.get('/count', countController)

// // verift jwt 
// api.post('/verify', VerifyJWTController)
// api.post('/profile', VerifyProfileController)

// // post methods of main routes
// api.post('/signup', express.json(), postSignupController)
// api.post('/login', express.json(), postLoginController)

// // ADMIN PANEL ( CURRENTY NOT WORKING )
// // api.post('/products', upload.single("file"), postProductController)

// // stripe
// api.post('/creategateway', express.json(), processPayment)
// api.post('/updateUserOrders', bodyParser.raw({ type: 'application/json' }), updateViaStripe)
