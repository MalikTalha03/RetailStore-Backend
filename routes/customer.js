const express = require("express");
const router = express.Router();
const Customer = require("../models/customer");
const Product = require("../models/product");

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
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  const customer = new Customer({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    contact: req.body.contact,
  });
  const cust = await Customer.findOne({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    contact: req.body.contact,
  });
  if (cust) {
    return res.status(201).json({ id: cust._id });
  }
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
    let employeeid = req.body.employeeid;
    if (employeeid === undefined) {
      employeeid = null;
    }
    let orderType = req.body.orderType;
    if (req.body.orderType !== "Online") {
      orderType = "Shop";
    }

    customer.orders.push({
      orderDate: req.body.orderDate,
      paymentStatus: req.body.paymentStatus,
      employeeid: req.body.employeeid,
      orderType: orderType,
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
    const orderDetails = order.orderDetails;
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const { refundDate } = req.body;

    const originalTotalPaidAmount = order.transactions.reduce(
      (total, transaction) => total + transaction.totalAmount,
      0
    );

    const originalTotalOrderValue = order.orderDetails.reduce(
      (total, orderDetail) => total + orderDetail.qty * orderDetail.unitPrice,
      0
    );

    const updatedTotalOrderValue = req.body.orderDetails.reduce(
      (total, orderDetail) => total + orderDetail.qty * orderDetail.unitPrice,
      0
    );
    const detail = req.body.orderDetails;

    orderDetails.forEach(async (orderDetail) => {
      const correspondingDetail = detail.find(
        (detail) => orderDetail.productid.toString() === detail.productid
      );

      if (correspondingDetail) {
        orderDetail.qty -= correspondingDetail.qty;
        const product = await Product.findById(correspondingDetail.productid);
        product.inventory += orderDetail.qty;
        await product.save();
      }
    });

    const refundAmount = originalTotalPaidAmount - updatedTotalOrderValue;

    if (refundAmount <= 0) {
      return res
        .status(400)
        .json({ message: "Refund amount must be greater than 0" });
    }

    order.transactions.push({
      transactionType: "Refund",
      transactionDate: refundDate,
      totalAmount: refundAmount,
    });

    order.orderDetails = req.body.orderDetails;

    const remainingRefundAmount = originalTotalPaidAmount - refundAmount;

    if (remainingRefundAmount >= originalTotalOrderValue) {
      order.paymentStatus = "Paid";
    } else {
      order.paymentStatus = "Pending";
    }

    const updatedCustomer = await customer.save();

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
    const { productid, qty, unitPrice } = req.body;

    const updatedCustomer = await Customer.findOneAndUpdate(
      { _id: id, "orders._id": orderId },
      {
        $push: {
          "orders.$.orderDetails": { productid, qty, unitPrice },
        },
      },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer or Order not found" });
    }

    const updatedOrder = updatedCustomer.orders.find(
      (order) => order._id.toString() === orderId
    );

    const updatedProducts = await Promise.all(
      updatedOrder.orderDetails.map(async (orderDetail) => {
        const product = await Product.findById(orderDetail.productid);
        if (!product) {
          throw new Error(
            `Product not found with id: ${orderDetail.productid}`
          );
        }

        product.inventory -= orderDetail.qty;

        await product.save();

        return product;
      })
    );

    const newOrderDetails = updatedOrder.orderDetails;
    res.json({
      message: "Order Details Added",
      id: newOrderDetails[newOrderDetails.length - 1]._id,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/:id/orders/:orderId/transactions", async (req, res) => {
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
    order.transactions.push({
      transactionType: req.body.transactionType,
      transactionDate: req.body.transactionDate,
      totalAmount: req.body.totalAmount,
    });

    const updatedCustomer = await customer.save();
    res
      .json({
        message: "Transaction Added",
      })
      .status(200);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        contact: req.body.contact,
      },
      { new: true }
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Customer Updated" }).status(200);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
