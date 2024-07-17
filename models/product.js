const mongoose = require("mongoose");
const categorySchema = require("./category");
const supplierSchema = require("./supplier");
const productSchema = new mongoose.Schema({
  _id: { type: String},
  name: {
    type: String,
    required: [true, "Please enter product name"],
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  supplierID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
  },
  inventory: {
    type: Number,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
