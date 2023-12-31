const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please enter product name']
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price']
    },
    category: {
        type: String,
        required: [true, 'Please enter product category']
    },
    supplierID: {
        type: Number,
        required: [true, 'Please enter supplier ID']
    },
    inventory: {
        type: Number,
        required: [true, 'Please enter product inventory']
    }
});
