const express = require('express');
const router = express.Router();
const ProductModel = require('../models/product');

router.get('/', async (req, res) => {
    try {
        const products = await ProductModel.find();
        res.send(products);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async(req, res) => {
    try {
        const product = await ProductModel.find({ id: req.params.id });
        res.send(product);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

router.post('/', async (req, res) => {
    const product = new ProductModel({
        id: req.body.id,
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        supplierID: req.body.supplierID,
        inventory: req.body.inventory
    });
    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

router.patch('/:id', async (req, res) => {
    try {
        const product = await ProductModel.find({ id: req.params.id });
        if (req.body.name) {
            product.name = req.body.name;
        }
        if (req.body.price) {
            product.price = req.body.price;
        }
        if (req.body.category) {
            product.category = req.body.category;
        }
        if (req.body.supplierID) {
            product.supplierID = req.body.supplierID;
        }
        if (req.body.inventory) {
            product.inventory = req.body.inventory;
        }
        await product.save();
        res.send(product);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}
);

router.delete('/:id', async (req, res) => {
    try {
        const product = await ProductModel.find({ id: req.params.id });
        await product.remove();
        res.json({ message: 'Deleted Product' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

module.exports = router;