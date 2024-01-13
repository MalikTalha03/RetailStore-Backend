const mongoose = require('mongoose');

const orderDetailsSchema = new mongoose.Schema({
    productid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    unitPrice: {
        type: Number,
        required: true,
    },
});

const transactionSchema = new mongoose.Schema({
    transactionType: {
        type: String,
        enum: ['Credit', 'Cash', 'Bank Transfer'],
        required: true,
    },
    transactionDate: {
        type: Date,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
});

const orderSchema = new mongoose.Schema({
    employeeid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    orderDate: {
        type: Date,
        required: true,
    },
    paymentStatus: {
        type: String,
        required: true,
    },
    orderDetails: [orderDetailsSchema],
    transactions: [transactionSchema], // Include transactions in the order schema
});

const customerSchema = new mongoose.Schema({
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
    orders: [orderSchema],
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
