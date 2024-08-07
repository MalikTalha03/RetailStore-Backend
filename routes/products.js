const express = require("express");
const router = express.Router();
const ProductModel = require("../models/product");
const { isAdmin } = require("../middleware/admin");
const moongose = require("mongoose");

const { v4: uuidv4 } = require('uuid');

router.get("/", async (req, res) => {
  try {
    const products = await ProductModel.find().populate({
      path: "supplierID",
      select: "name",
    });
    res.send(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await ProductModel.find({ id: req.params.id });
    res.send(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const productData = {
    _id: req.body._id || uuidv4(),
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    supplierID: req.body.supplierID,
    inventory: req.body.inventory || 0,
  };

  const product = new ProductModel(productData);

  try {
    const newProduct = await product.save();
    console.log(newProduct);
    res.status(201).json({ message: "Product added successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log(err);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updateData = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.price) updateData.price = req.body.price;
    if (req.body.category) updateData.category = req.body.category;
    if (req.body.supplierID) updateData.supplierID = req.body.supplierID;
    if (req.body.inventory) updateData.inventory = req.body.inventory;

    const product = await ProductModel.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.send(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    console.log(req.params.id)
    const product = await ProductModel.findOneAndDelete({ _id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: `Product ${product.name} has been deleted` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
