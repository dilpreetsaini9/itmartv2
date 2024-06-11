import express from "express";
import bodyParser from "body-parser";

// my imports
// import { upload } from "../middleware/multer/multer.js";

import { processPayment, updateViaStripe } from "../controllers/payment.js";
import { VerifyJWTController, VerifyProfileController, postLoginController, postSignupController ,  } from "../controllers/Auth.js";
import { getProductController, getSingleProductController , countController, clearCountController, fullTextSearchController} from "../controllers/product.js";

export const api = express.Router()

// get mothods of main routes
api.get('/products', getProductController)
api.get('/product/:productid', getSingleProductController)
api.get('/count', countController)
api.get('/clearcount' , clearCountController)

// verift jwt 
api.post('/verify', VerifyJWTController)
api.post('/profile', VerifyProfileController)

// post methods of main routes
api.post('/search' , express.json() , fullTextSearchController)
api.post('/signup', express.json(), postSignupController)
api.post('/login', express.json(), postLoginController)

// ADMIN PANEL ( CURRENTY NOT WORKING )
// api.post('/products', upload.single("file"), postProductController)

// stripe
api.post('/creategateway', express.json(), processPayment)
api.post('/updateUserOrders', bodyParser.raw({ type: 'application/json' }), updateViaStripe)




