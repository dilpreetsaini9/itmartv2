import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    productName: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      
    },
    price: {
      type: Number,
      required: true,
    },
    Category:{
      type : String,
      default:"Peripherals"
    },
    image: {
        type: String,
        default:"default.png"
      },
  });

  export const Product = mongoose.model('Product', ProductSchema);
  
