const moongoose = require('mongoose');
const CustomerOrder = require('./customerorder');
const Product = require('./product');

const custOrderDetailsSchema = new moongoose.Schema({
    orderid: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'CustomerOrder',
        required: true
    },
    productid: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
});

const CustOrderDetails = moongoose.model('CustOrderDetails', custOrderDetailsSchema);
module.exports = CustOrderDetails;