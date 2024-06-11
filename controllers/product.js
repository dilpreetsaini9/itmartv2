import { Product } from "../models/ProductModel.js";

// cached products
let catchedProducts = null;
let frontPageVisited = 0;

// get all products
export const fullTextSearchController = async (req, res) => {
  if (!req.body.data) {
    return res.status(500).json({ message: "error in fetching products" });
  }

  let data = req.body.data;

  let searchInDatabase = await Product.aggregate([
    {
      $search: {
        index: "default",
        text: {
          query: data,
          path: {
            wildcard: "*",
          },
        },
      },
    },
  ]);

  res.status(200).json(searchInDatabase);
};

export const getProductController = async (req, res) => {
  frontPageVisited++;

  if (catchedProducts) {
    return res.status(200).json(catchedProducts);
  }

  try {
    let products = await Product.find({});
    catchedProducts = products;
    res.status(200).json(products);
  } catch (e) {
    res.status(500).json({ message: "error in fetching products" });
  }
};

let productPageVisited = 0;

// get single product

export const getSingleProductController = async (req, res) => {
  productPageVisited++;

  let id = req.params.productid;

  if (!id) {
    return res.status(400).json({ message: "bad request" });
  }

  try {
    let products = await Product.findOne({ _id: id });
    products
      ? res.status(200).json(products)
      : res.status(400).json({ message: "bad request" });
  } catch (e) {
    res.status(400).json({ message: "bad request" });
  }
};
export const countController = async (req, res) => {
  res.status(200).json({
    total_views: frontPageVisited,
    product_views: productPageVisited,
  });
};

/// admin panel

export const getAdminProductController = async (req, res) => {
  if (catchedProducts) {
    return res.status(200).json(catchedProducts);
  }

  try {
    let products = await Product.find({});
    catchedProducts = products;
    res.status(200).json(products);
  } catch (e) {
    res.status(500).json({ message: "error in fetching products" });
  }
};

// admin routes

export const clearCountController = async (req, res) => {
  frontPageVisited = 0;
  productPageVisited = 0;

  res.json({ message: "clear" });
};

// ADMIN PANEL ( CURRENTY NOT WORKING )

// export const postProductController = async ( req , res ) => {

//     try {
//         let productName = req.body.productName
//         let price = req.body.price
//         let description = req.body.description
//         let image = req.file.filename
//         let Category = req.body.Category

//         let newProduct = new Product({
//             productName,
//             description,
//             price,
//             image,
//             Category
//         })

//         newProduct.save().then(()=>console.log("saved to database"))

//     }  catch(err){
//         console.log("error")
//     }

// }
