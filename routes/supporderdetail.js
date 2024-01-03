const express = require('express');
const router = express.Router();
const SupplierOrderetailDModel = require('../models/supporderdetails');

router.get('/', async (req, res) => {
    try {
        const supporderdetails = await SupplierOrderetailDModel.find();
        res.send(supporderdetails);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

router.get('/:id', async(req, res) => {
    try {
        const supporderdetail = await SupplierOrderetailDModel.findById(req.params.id);
        res.send(supporderdetail);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

router.post('/', async (req, res) => {
    const supporderdetail = new SupplierOrderetailDModel({
        orderid : req.body.orderid,
        productid : req.body.productid,
        qty : req.body.qty,
        unitPrice : req.body.unitPrice
    });
    try {
        const newSupplierOrderetailD = await supporderdetail.save();
        res.status(201).json(newSupplierOrderetailD);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

router.patch('/:id', async (req, res) => {
    try {
        const supporderdetail = await SupplierOrderetailDModel.findById(req.params.id);
        if (req.body.productid) {
            supporderdetail.productid = req.body.productid;
        }
        if (req.body.qty) {
            supporderdetail.qty = req.body.qty;
        }
        if (req.body.unitPrice) {
            supporderdetail.unitPrice = req.body.unitPrice;
        }
        const updatedSupplierOrderetailD = await supporderdetail.save();
        res.json(updatedSupplierOrderetailD);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

router.delete('/:id', async (req, res) => {
    try {
        const supporderdetail = await SupplierOrderetailDModel.findById(req.params.id);
        const deletedSupplierOrderetailD = await supporderdetail.remove();
        res.json(deletedSupplierOrderetailD);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

module.exports = router;