const express = require('express');
const router = express.Router();
const CustomerModel = require('../models/customer');

router.get('/', async (req, res) => {
    try {
        const customers = await CustomerModel.find();
        res.send(customers);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async(req, res) => {
    try {
        const customer = await CustomerModel.find({ id: req.params.id });
        res.send(customer);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const customer = new CustomerModel({
        id: req.body.id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        contact: req.body.contact
    });
    try {
        const newCustomer = await customer.save();
        res.status(201).json(newCustomer);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const customer = await CustomerModel.find({ id: req.params.id });
        if (req.body.firstname) {
            customer.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
            customer.lastname = req.body.lastname;
        }
        if (req.body.contact) {
            customer.contact = req.body.contact;
        }
        const updatedCustomer = await customer.save();
        res.json(updatedCustomer);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const customer = await CustomerModel.find({ id: req.params.id });
        const deletedCustomer = await customer.remove();
        res.json(deletedCustomer);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
