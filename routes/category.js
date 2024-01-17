const express = require('express');
const router = express.Router();
const CategoryModel = require('../models/category');

router.get('/', async (req, res) => {
    try {
        const categories = await CategoryModel.find();
        res.send(categories);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

router.get('/:id', async(req, res) => {
    try {
        const category = await CategoryModel.find({ id: req.params.id });
        res.send(category);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

router.post('/', async (req, res) => {
    const category = new CategoryModel({
        name: req.body.name,
    });
    try {
        const newCategory = await category.save();
        res.status(201).json({ message: 'New Category has been added' });
    } catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.name === 1) {
            // Duplicate key error (name already exists)
            res.status(400).json({ message: 'Category with this name already exists' });
        } else {
            // Other errors
            res.status(400).json({ message: err.message });
        }
    }
});


router.patch('/:id', async (req, res) => {
    try {
        const category = await CategoryModel.find({ id: req.params.id });
        if (!req.body.name) return res.status(400).json({ message: 'Name is required' });
        category.name = req.body.name;
        const updatedCategory = await category.save();
        res.json(updatedCategory);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

router.delete('/:id', async (req, res) => {
    try {
        const category = await CategoryModel.findOneAndDelete({ id: req.params.id });
        res.json({ message: `Category ${category.name} has been deleted` });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

module.exports = router;
