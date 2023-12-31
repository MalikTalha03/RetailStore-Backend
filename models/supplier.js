const moongoose = require('mongoose');

const supplierSchema = new moongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please enter supplier name']
    },
    contact: {
        type: String,
        required: [true, 'Please enter supplier contact']
    },
    address: {
        type: String,
        required: [true, 'Please enter supplier address']
    },
});

const Supplier = moongoose.model('Supplier', supplierSchema);
module.exports = Supplier;