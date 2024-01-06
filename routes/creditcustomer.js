const express = require('express');
const router = express.Router();

const CreditCustomerModel = require('../models/creditcustomer');

router.get('/', async (req, res) => {
    try {
        const creditcustomers = await CreditCustomerModel.find();
        res.send(creditcustomers);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

router.get('/:id', async(req, res) => {
    try {
        const creditcustomer = await CreditCustomerModel.find({ id: req.params.id });
        res.send(creditcustomer);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

router.post('/', async (req, res) => {
    const creditcustomer = new CreditCustomerModel({
        creditID: req.body.creditID,
        customerID: req.body.customerID,
        totalcredit: req.body.totalcredit
    });
    try {
        const newCreditCustomer = await creditcustomer.save();
        res.status(201).json(newCreditCustomer);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const creditcustomer = await CreditCustomerModel.findById(req.params.id);
        if (req.body.totalcredit) {
            creditcustomer.totalcredit = req.body.totalcredit;
        }
        const updatedCreditCustomer = await creditcustomer.save();
        res.json(updatedCreditCustomer);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const creditcustomer = await CreditCustomerModel.findOneAndDelete({ id: req.params.id });
        res.json({ message: `CreditCustomer ${creditcustomer.creditID} has been deleted` });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;