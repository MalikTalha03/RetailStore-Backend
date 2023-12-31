const moongoose = require('mongoose');
const SupplierOrder = require('./supplierorder');
const Product = require('./product');

const suppOrderDetailsSchema = new moongoose.Schema({
    orderid: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'SupplierOrder',
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