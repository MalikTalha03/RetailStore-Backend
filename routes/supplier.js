const express = require('express');
const router = express.Router();
const SupplierModel = require('../models/supplier');

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
        const supplier = await SupplierModel.findById(req.params.id);
        res.send(supplier);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

router.post('/', async (req, res) => {
    const supplier = new SupplierModel({
        id : req.body.id,
        name : req.body.name,
        contact : req.body.contact,
        address : req.body.address
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
        const supplier = await SupplierModel.findById(req.params.id);
        if (req.body.name) {
            supplier.name = req.body.name;
        }
        if (req.body.contact) {
            supplier.contact = req.body.contact;
        }
        if (req.body.address) {
            supplier.address = req.body.address;
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
        const supplier = await SupplierModel.findById(req.params.id);
        const deletedSupplier = await supplier.remove();
        res.json(deletedSupplier);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

module.exports = router;