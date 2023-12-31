const moongoose = require('mongoose');
const SupplierOrder = require('./supplierorder');

const suppTransactionSchema = new moongoose.Schema({
    transactionID: {
        type: Number,
        required: true
    },
    transactionType: {
        type: String,
        enum: ['Credit', 'Cash', 'Bank Transfer'],
        required: true
    },
    transactionDate: {
        type: Date,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderID: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'SupplierOrder',
        required: true
    },
});

const SuppTransaction = moongoose.model('SuppTransaction', suppTransactionSchema);
module.exports = SuppTransaction;