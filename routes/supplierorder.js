const express = require('express');
const router = express.Router();
const SupplierModel = require('../models/supplierorder');

router.get('/', async (req, res) => {
    try {
        const suppliers = await SupplierModel.find();
        res.send(suppliers);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

router.get('/:id', async(req, res) => {
    try {
        const supplier = await SupplierModel.find({ id: req.params.id });
        res.send(supplier);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

router.post('/', async (req, res) => {
    const supplier = new SupplierModel({
        orderid : req.body.orderid,
        supplierid : req.body.supplierid,
        orderDate : req.body.orderDate,
        totalAmonut : req.body.totalAmonut,
        paymentStatus : req.body.paymentStatus
    });
    try {
        const newSupplier = await supplier.save();
        res.status(201).json(newSupplier);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

router.patch('/:id', async (req, res) => {
    try {
        const supplier = await SupplierModel.find({ id: req.params.id });
        if (req.body.supplierid) {
            supplier.supplierid = req.body.supplierid;
        }
        if (req.body.orderDate) {
            supplier.orderDate = req.body.orderDate;
        }
        if (req.body.totalAmonut) {
            supplier.totalAmonut = req.body.totalAmonut;
        }
        if (req.body.paymentStatus) {
            supplier.paymentStatus = req.body.paymentStatus;
        }
        const updatedSupplier = await supplier.save();
        res.json(updatedSupplier);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

router.delete('/:id', async (req, res) => {
    try {
        const supplier = await SupplierModel.findOneAndDelete({ id: req.params.id });
        res.json({ message: `Supplier ${supplier.name} has been deleted` });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

module.exports = router;