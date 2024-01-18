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
    // Get today's date
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

router.patch("/:id/orders/:orderId/details", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const order = customer.orders.id(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderDetails.push({
      productid: req.body.productid,
      qty: req.body.qty,
      unitPrice: req.body.unitPrice,
    });

    const updatedCustomer = await customer.save();
    res.json({
      message: "Order Details Added",
      id: updatedCustomer.orders[updatedCustomer.orders.length - 1]
        .orderDetails[
        updatedCustomer.orders[updatedCustomer.orders.length - 1].orderDetails
          .length - 1
      ]._id,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
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
