const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    firstname: {
        type: String,
        required: [true, 'Please enter customer first name']
    },
    lastname: {
        type: String,
        required: [true, 'Please enter customer last name']
    },
    contact: {
        type: String,
        required: [true, 'Please enter customer contact']
    },
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
