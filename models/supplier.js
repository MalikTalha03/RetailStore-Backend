const mongoose = require("mongoose");

const orderDetailsSchema = new mongoose.Schema({
  productid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
});

const transactionSchema = new mongoose.Schema({
  transactionType: {
    type: String,
    enum: ["Credit", "Cash", "Bank Transfer"],
    required: true,
  },
  transactionDate: {
    type: Date,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  orderDate: {
    type: Date,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    required: true,
  },
  orderDetails: [orderDetailsSchema],
  transactions: [transactionSchema], // Include transactions in the order schema
});

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter supplier name"],
  },
  contact: {
    type: String,
    required: [true, "Please enter supplier contact"],
  },
  address: {
    type: String,
    required: [true, "Please enter supplier address"],
  },
  orders: [orderSchema],
});

orderSchema.pre("save", function (next) {
  const totalPaidAmount = this.transactions.reduce((total, transaction) => {
    return total + transaction.totalAmount;
  }, 0);

  if (totalPaidAmount >= this.totalAmount) {
    this.paymentStatus = "Paid";
  } else {
    this.paymentStatus = "Pending";
  }

  next();
});

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
