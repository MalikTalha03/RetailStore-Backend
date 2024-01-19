const express = require("express");
const router = express.Router();
const Customer = require("../models/customer");

// Get all customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(
      customers.map((customer) => {
        return {
          firstname: customer.firstname,
          lastname: customer.lastname,
          contact: customer.contact,
          name: customer.firstname + " " + customer.lastname,
          _id: customer._id,
        };
      })
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/today", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await Customer.aggregate([
      {
        $unwind: "$orders",
      },
      {
        $match: {
          "orders.orderDate": { $gte: today },
        },
      },
      {
        $project: {
          _id: 0,
          customerName: {
            $concat: ["$firstname", " ", { $ifNull: ["$lastname", ""] }],
          },
          contact: "$contact",
          order: "$orders",
        },
      },
    ]);

    res.json(todayOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Post customer information
router.post("/", async (req, res) => {
  console.log(req.body);
  const customer = new Customer({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    contact: req.body.contact,
  });

  try {
    const newCustomer = await customer.save();
    res.status(201).json({ message: "Customer Added", id: newCustomer._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log(err);
  }
});

router.patch("/:id/orders", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    customer.orders.push({
      orderDate: req.body.orderDate,
      paymentStatus: req.body.paymentStatus,
      employeeid: req.body.employeeid,
    });

    const updatedCustomer = await customer.save();
    res.json({
      message: "Order Added",
      id: updatedCustomer.orders[updatedCustomer.orders.length - 1]._id,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/:id/orders/:orderId/refund", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const order = customer.orders.id(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const { refundDate } = req.body;

    // Calculate the original total amount paid for the order
    const originalTotalPaidAmount = order.transactions.reduce(
      (total, transaction) => total + transaction.totalAmount,
      0
    );

    // Calculate the original total order value
    const originalTotalOrderValue = order.orderDetails.reduce(
      (total, orderDetail) => total + orderDetail.qty * orderDetail.unitPrice,
      0
    );

    // Calculate the updated total order value
    const updatedTotalOrderValue = req.body.orderDetails.reduce(
      (total, orderDetail) => total + orderDetail.qty * orderDetail.unitPrice,
      0
    );

    // Calculate the refund amount based on the changes in order details
    const refundAmount = originalTotalPaidAmount - updatedTotalOrderValue;

    // Validate the refund amount
    if (refundAmount <= 0) {
      return res.status(400).json({ message: "Refund amount must be greater than 0" });
    }

    // Add a refund transaction
    order.transactions.push({
      transactionType: "Refund",
      transactionDate: refundDate,
      totalAmount: refundAmount,
    });

    // Update order details with the new data
    order.orderDetails = req.body.orderDetails;

    // Update order payment status based on the remaining amount
    const remainingRefundAmount = originalTotalPaidAmount - refundAmount;

    if (remainingRefundAmount >= originalTotalOrderValue) {
      order.paymentStatus = "Paid";
    } else {
      order.paymentStatus = "Pending";
    }

    const updatedCustomer = await customer.save();

    // Calculate the amount to be returned to the customer
    const amountToReturn = originalTotalPaidAmount - remainingRefundAmount;

    res.json({
      message: "Refund processed successfully",
      updatedCustomer,
      amountToReturn,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



router.patch("/:id/orders/:orderId/details", async (req, res) => {
  try {
    const { id, orderId } = req.params;

    const updatedCustomer = await Customer.findOneAndUpdate(
      { _id: id, "orders._id": orderId },
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

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer or Order not found" });
    }

    const newOrder = updatedCustomer.orders.find((order) => order._id.toString() === orderId);
    const newOrderDetails = newOrder.orderDetails;

    res.json({
      message: "Order Details Added",
      id: newOrderDetails[newOrderDetails.length - 1]._id,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.error(err);
  }
});

router.patch("/:id/orders/:orderId/transactions", async (req, res) => {
  console.log(req.body)
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const order = customer.orders.id(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const remainingAmount = order.orderDetails.reduce(
      (acc, curr) => acc + curr.qty * curr.unitPrice,
      0
    );
    if (remainingAmount < req.body.totalAmount) {
      return res
        .status(400)
        .json({ message: "Amount paid exceeds total amount" });
    }

    if (order.paymentStatus === "Paid") {
      return res.status(400).json({ message: "Amount paid in full" });
    }
    console.log(remainingAmount);
    console.log(order.totalAmount);
    order.transactions.push({
      transactionType: req.body.transactionType,
      transactionDate: req.body.transactionDate,
      totalAmount: req.body.totalAmount,
    });

    const updatedCustomer = await customer.save();
    res.json({
      message: "Transaction Added",
    }).status(200);
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log(err);
  }
});

module.exports = router;
