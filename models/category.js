const moongoose = require('mongoose');

const categorySchema = new moongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please enter category name']
    },
});


const Category = moongoose.model('Category', categorySchema);
module.exports = Category;