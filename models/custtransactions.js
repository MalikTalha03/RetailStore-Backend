const moongoose = require('mongoose');
const CustomerOrder = require('./customerorder');

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
        type: moongoose.Schema.Types.ObjectId,
        ref: 'CustomerOrder',
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
});

const SuppOrderDetails = moongoose.model('SuppOrderDetails', suppOrderDetailsSchema);
module.exports = SuppOrderDetails;