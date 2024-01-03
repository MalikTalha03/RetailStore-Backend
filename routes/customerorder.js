const express = require('express');
const router = express.Router();
const CustomerOrderModel = require('../models/customerorder');

router.get('/', async (req, res) => {
    try {
        const customerorders = await CustomerOrderModel.find();
        res.send(customerorders);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

router.get('/:id', async(req, res) => {
    try {
        const customerorder = await CustomerOrderModel.findById(req.params.id);
        res.send(customerorder);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

router.post('/', async (req, res) => {
    const customerorder = new CustomerOrderModel({
        orderID : req.body.orderID,
        customerID : req.body.customerID,
        employeeID : req.body.employeeID,
        orderDate : req.body.orderDate,
        orderTime : req.body.orderTime,
        paymentStatus : req.body.paymentStatus
    });
    try {
        const newCustomerOrder = await customerorder.save();
        res.status(201).json(newCustomerOrder);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

router.patch('/:id', async (req, res) => {
    try {
        const customerorder = await CustomerOrderModel.findById(req.params.id);
        if (req.body.customerID) {
            customerorder.customerID = req.body.customerID;
        }
        if (req.body.employeeID) {
            customerorder.employeeID = req.body.employeeID;
        }
        if (req.body.orderDate) {
            customerorder.orderDate = req.body.orderDate;
        }
        if (req.body.orderTime) {
            customerorder.orderTime = req.body.orderTime;
        }
        if (req.body.paymentStatus) {
            customerorder.paymentStatus = req.body.paymentStatus;
        }
        const updatedCustomerOrder = await customerorder.save();
        res.json(updatedCustomerOrder);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

router.delete('/:id', async (req, res) => {
    try {
        const customerorder = await CustomerOrderModel.findById(req.params.id);
        const deletedCustomerOrder = await customerorder.remove();
        res.json(deletedCustomerOrder);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

module.exports = router;
