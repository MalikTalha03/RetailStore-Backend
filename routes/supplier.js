const express = require('express');
const router = express.Router();
const SupplierModel = require('../models/supplier');
const ProductModel = require('../models/product');


// Get all suppliers
router.get('/', async (req, res) => {
    try {
        const suppliers = await SupplierModel.find();
        res.json(suppliers.map(supplier => {
            return {
                name: supplier.name,
                _id: supplier._id,
            }
        }));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Post supplier information
router.post('/', async (req, res) => {
    const supplier = new SupplierModel({
        name: req.body.name,
        contact: req.body.contact,
        address: req.body.address,
    });

    try {
        const newSupplier = await supplier.save();
        res.status(201).json({ message: 'Supplier Added', id: newSupplier._id });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Patch route for adding an order
router.patch('/:id/orders', async (req, res) => {
    try {
        const supplier = await SupplierModel.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        supplier.orders.push({
            orderDate: req.body.orderDate,
            totalAmount: req.body.totalAmount,
            paymentStatus: req.body.paymentStatus,
        });

        const updatedSupplier = await supplier.save();
        res.json({ message: 'Order Added', id: updatedSupplier.orders[updatedSupplier.orders.length - 1]._id});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Patch route for adding order details
router.patch('/:id/orders/:orderId/details', async (req, res) => {
    try {
        const supplier = await SupplierModel.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        const order = supplier.orders.id(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const product = await ProductModel.findByIdAndUpdate(req.body.productid, { $inc: { inventory: req.body.qty, price: req.body.unitPrice } });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        order.orderDetails.push({
            productid: req.body.productid,
            qty: req.body.qty,
            unitPrice: req.body.unitPrice,
        });
        const updatedSupplier = await supplier.save();
        res.json({ message: 'Order Details Added', id: updatedSupplier.orders[updatedSupplier.orders.length - 1].orderDetails[updatedSupplier.orders[updatedSupplier.orders.length - 1].orderDetails.length - 1]._id});
    } 
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.patch('/:id/orders/:orderId/transactions', async (req, res) => {
    try {
        const supplier = await SupplierModel.findById(req.params.id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        const order = supplier.orders.id(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.transactions.push({
            transactionType: req.body.transactionType,
            transactionDate: req.body.transactionDate,
            totalAmount: req.body.totalAmount,
        });

        const updatedSupplier = await supplier.save();
        res.json({ message: 'Transaction Added', id: updatedSupplier.orders[updatedSupplier.orders.length - 1].transactions[updatedSupplier.orders[updatedSupplier.orders.length - 1].transactions.length - 1]._id});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
