const express = require("express");
const router = express.Router();
const SupplierModel = require("../models/supplier");
const ProductModel = require("../models/product");

// Get all suppliers
router.get("/", async (req, res) => {
  try {
    const suppliers = await SupplierModel.find();
    res.json(
      suppliers.map((supplier) => {
        return {
          name: supplier.name,
          _id: supplier._id,
        };
      })
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const suppliers = await SupplierModel.find();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Post supplier information
router.post("/", async (req, res) => {
  const supplier = new SupplierModel({
    name: req.body.name,
    contact: req.body.contact,
    address: req.body.address,
  });

  try {
    const newSupplier = await supplier.save();
    res.status(201).json({ message: "Supplier Added", id: newSupplier._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Patch route for adding an order
router.patch("/:id/orders", async (req, res) => {
  try {
    const supplier = await SupplierModel.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    supplier.orders.push({
      orderDate: req.body.orderDate,
      totalAmount: req.body.totalAmount,
      paymentStatus: req.body.paymentStatus,
    });

    const updatedSupplier = await supplier.save();
    res.json({
      message: "Order Added",
      id: updatedSupplier.orders[updatedSupplier.orders.length - 1]._id,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Patch route for adding order details
router.patch("/:id/orders/:orderId/details", async (req, res) => {
  try {
    console.log(req.body);
    const updatedSupplier = await SupplierModel.findOneAndUpdate(
      { _id: req.params.id, "orders._id": req.params.orderId },
      {
        $push: {
          "orders.$.orderDetails": {
            productid: req.body.productid,
            qty: req.body.qty,
            unitPrice: req.body.unitPrice,
          },
        },
      },
      { new: true }
    );

    if (!updatedSupplier) {
      return res.status(404).json({ message: "Supplier or Order not found" });
    }

    const product = await ProductModel.findByIdAndUpdate(
      req.body.productid,
      {
        $inc: { inventory: req.body.qty },
        $set: { price: req.body.saleprice },
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Order Details Added",
      id: updatedSupplier.orders.find(
        (order) => order._id == req.params.orderId
      ).orderDetails[
        updatedSupplier.orders.find((order) => order._id == req.params.orderId)
          .orderDetails.length - 1
      ]._id,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.error(err);
  }
});

router.patch("/:id/orders/:orderId/transactions", async (req, res) => {
  console.log(req.body);
  try {
    const supplier = await SupplierModel.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    const order = supplier.orders.id(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.paymentStatus === "Paid") {
      return res.status(400).json({ message: "Order already paid" });
    }
    const totalPaidAmount = order.transactions.reduce((total, transaction) => {
      return total + transaction.totalAmount;
    }, 0);

    const remainingAmount = order.totalAmount - totalPaidAmount;

    if (req.body.totalAmount > remainingAmount) {
      return res
        .status(400)
        .json({ message: "Payment amount exceeds remaining amount" });
    }
    order.transactions.push({
      transactionType: req.body.transactionType,
      transactionDate: req.body.transactionDate,
      totalAmount: req.body.totalAmount,
    });
    const updatedSupplier = await supplier.save();
    res.json({ message: "Transaction Added" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const supplier = await SupplierModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        contact: req.body.contact,
        address: req.body.address,
      },
      { new: true }
    );
    res.json({ message: "Supplier Updated" });
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
