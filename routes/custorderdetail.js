const express = require('express');
const router = express.Router();
const CustomerOrderDetailModel = require('../models/custorderdetails');

router.get('/', async (req, res) => {
    try {
        const customerorderdetails = await CustomerOrderDetailModel.find();
        res.send(customerorderdetails);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

router.get('/:id', async(req, res) => {
    try {
        const customerorderdetail = await CustomerOrderDetailModel.findById(req.params.id);
        res.send(customerorderdetail);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

router.post('/', async (req, res) => {
    const customerorderdetail = new CustomerOrderDetailModel({
        orderID : req.body.orderID,
        productID : req.body.productID,
        qty : req.body.qty,
        unitPrice : req.body.unitPrice
    });
    try {
        const newCustomerOrderDetail = await customerorderdetail.save();
        res.status(201).json(newCustomerOrderDetail);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

router.patch('/:id', async (req, res) => {
    try {
        const customerorderdetail = await CustomerOrderDetailModel.findById(req.params.id);
        if (req.body.productID) {
            customerorderdetail.productID = req.body.productID;
        }
        if (req.body.qty) {
            customerorderdetail.qty = req.body.qty;
        }
        if (req.body.unitPrice) {
            customerorderdetail.unitPrice = req.body.unitPrice;
        }
        const updatedCustomerOrderDetail = await customerorderdetail.save();
        res.json(updatedCustomerOrderDetail);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const customerorderdetail = await CustomerOrderDetailModel.findById(req.params.id);
        const deletedCustomerOrderDetail = await customerorderdetail.remove();
        res.json(deletedCustomerOrderDetail);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;