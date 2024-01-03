const express = require('express');
const router = express.Router();
const SupplierTransactionModel = require('../models/supptransaction');

router.get('/', async (req, res) => {
    try {
        const suppliertransactions = await SupplierTransactionModel.find();
        res.send(suppliertransactions);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

router.get('/:id', async(req, res) => {
    try {
        const suppliertransaction = await SupplierTransactionModel.findById(req.params.id);
        res.send(suppliertransaction);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

router.post('/', async (req, res) => {
    const suppliertransaction = new SupplierTransactionModel({
        transactionID : req.body.transactionID,
        transactionType : req.body.transactionType,
        transactionDate : req.body.transactionDate,
        totalAmount : req.body.totalAmount,
        orderID : req.body.orderID
    });
    try {
        const newSupplierTransaction = await suppliertransaction.save();
        res.status(201).json(newSupplierTransaction);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

router.patch('/:id', async (req, res) => {
    try {
        const suppliertransaction = await SupplierTransactionModel.findById(req.params.id);
        if (req.body.transactionType) {
            suppliertransaction.transactionType = req.body.transactionType;
        }
        if (req.body.transactionDate) {
            suppliertransaction.transactionDate = req.body.transactionDate;
        }
        if (req.body.totalAmount) {
            suppliertransaction.totalAmount = req.body.totalAmount;
        }
        if (req.body.orderID) {
            suppliertransaction.orderID = req.body.orderID;
        }
        const updatedSupplierTransaction = await suppliertransaction.save();
        res.json(updatedSupplierTransaction);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

module.exports = router;