const mongoose = require("mongoose");
const categorySchema = require("./category");
const supplierSchema = require("./supplier");
const productSchema = new mongoose.Schema({
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
    required: true,
  },
  supplierID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: [true, "Please enter supplier ID"],
  },
  inventory: {
    type: Number,
    required: [true, "Please enter product inventory"],
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
