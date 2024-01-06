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
        id: req.body.id,
        name: req.body.name,
    });
    try {
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

router.patch('/:id', async (req, res) => {
    try {
        const category = await CategoryModel.find({ id: req.params.id });
        if (req.body.name) {
            category.name = req.body.name;
        }
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
