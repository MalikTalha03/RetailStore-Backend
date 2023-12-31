const moongoose = require('mongoose');

const suppOrderDetailsSchema = new moongoose.Schema({
    transactionID: {
        type: Number,
        required: true
    },
    transactionType: {
        type: String,
        required: true
    },
    transactionDate: {
        type: Date,
        required: true
    },
    transactionTime: {
        type: String,
        required: true
    },
    orderID: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
});

const SuppOrderDetails = moongoose.model('SuppOrderDetails', suppOrderDetailsSchema);
module.exports = SuppOrderDetails;