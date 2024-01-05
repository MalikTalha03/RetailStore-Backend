const express = require('express');
const router = express.Router();
const CustomerTransactionModel = require('../models/custtransactions');

router.get('/', async (req, res) => {
    try {
        const customertransactions = await CustomerTransactionModel.find();
        res.send(customertransactions);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

router.get('/:id', async(req, res) => {
    try {
        const customertransaction = await CustomerTransactionModel.find({ id: req.params.id });
        res.send(customertransaction);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

router.post('/', async (req, res) => {
    const customertransaction = new CustomerTransactionModel({
        transactionID : req.body.transactionID,
        transactionType : req.body.transactionType,
        transactionDate : req.body.transactionDate,
        transactionTime : req.body.transactionTime,
        orderID : req.body.orderID,
        totalAmount : req.body.totalAmount
    });
    try {
        const newCustomerTransaction = await customertransaction.save();
        res.status(201).json(newCustomerTransaction);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

router.patch('/:id', async (req, res) => {
    try {
        const customertransaction = await CustomerTransactionModel.find({ id: req.params.id });
        if (req.body.transactionType) {
            customertransaction.transactionType = req.body.transactionType;
        }
        if (req.body.transactionDate) {
            customertransaction.transactionDate = req.body.transactionDate;
        }
        if (req.body.transactionTime) {
            customertransaction.transactionTime = req.body.transactionTime;
        }
        if (req.body.orderID) {
            customertransaction.orderID = req.body.orderID;
        }
        if (req.body.totalAmount) {
            customertransaction.totalAmount = req.body.totalAmount;
        }
        const updatedCustomerTransaction = await customertransaction.save();
        res.json(updatedCustomerTransaction);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

router.delete('/:id', async (req, res) => {
    try {
        const customertransaction = await CustomerTransactionModel.find({ id: req.params.id });
        const deletedCustomerTransaction = await customertransaction.remove();
        res.json(deletedCustomerTransaction);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

module.exports = router;
