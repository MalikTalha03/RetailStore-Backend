const express = require('express');
const router = express.Router();
const Customer = require('../models/customer');

// Get all customers
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers.map(customer => {
            return {
                firstname: customer.firstname,
                lastname: customer.lastname,
                contact: customer.contact,
                _id: customer._id,
            }
        }));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Post customer information
router.post('/', async (req, res) => {
    const customer = new Customer({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        contact: req.body.contact,
    });

    try {
        const newCustomer = await customer.save();
        res.status(201).json({ message: 'Customer Added', id: newCustomer._id });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Patch route for adding an order
router.patch('/:id/orders', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        customer.orders.push({
            orderDate: req.body.orderDate,
            paymentStatus: req.body.paymentStatus,
            employeeid: req.body.employeeid,
        });

        const updatedCustomer = await customer.save();
        res.json({ message: 'Order Added', id: updatedCustomer.orders[updatedCustomer.orders.length - 1]._id });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Patch route for adding order details
router.patch('/:id/orders/:orderId/details', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const order = customer.orders.id(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.orderDetails.push({
            productid: req.body.productid,
            qty: req.body.qty,
            unitPrice: req.body.unitPrice,
        });

        const updatedCustomer = await customer.save();
        res.json({ message: 'Order Details Added', id: updatedCustomer.orders[updatedCustomer.orders.length - 1].orderDetails[updatedCustomer.orders[updatedCustomer.orders.length - 1].orderDetails.length - 1]._id });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Patch route for adding transactions
router.patch('/:id/orders/:orderId/transactions', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const order = customer.orders.id(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.transactions.push({
            transactionType: req.body.transactionType,
            transactionDate: req.body.transactionDate,
            totalAmount: req.body.totalAmount,
        });

        const updatedCustomer = await customer.save();
        res.json({ message: 'Transaction Added', id: updatedCustomer.orders[updatedCustomer.orders.length - 1].transactions[updatedCustomer.orders[updatedCustomer.orders.length - 1].transactions.length - 1]._id });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
