const moongoose = require('mongoose');

const categorySchema = new moongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please enter category name']
    },
});

const Category = moongoose.model('Category', categorySchema);
module.exports = Category;