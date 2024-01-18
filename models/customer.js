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
  employeeid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  orderDate: {
    type: Date,
    required: true,
  },
  paymentStatus: {
    type: String,
    required: true,
  },
  orderDetails: [orderDetailsSchema],
  transactions: [transactionSchema], // Include transactions in the order schema
});

const customerSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please enter customer first name"],
  },
  lastname: {
    type: String,
  },
  contact: {
    type: String,
    required: [true, "Please enter customer contact"],
  },
  orders: [orderSchema],
});

customerSchema.pre("save", function (next) {
  this.orders.forEach((order) => {
      const totalPaidAmount = order.transactions.reduce((total, transaction) => {
          return total + transaction.totalAmount;
      }, 0);

      const totalOrderValue = order.orderDetails.reduce((total, orderDetail) => {
          return total + orderDetail.qty * orderDetail.unitPrice;
      }, 0);

      if (totalPaidAmount >= totalOrderValue) {
          order.paymentStatus = "Paid";
      } else {
          order.paymentStatus = "Pending";
      }
  });
  next();
});


const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
