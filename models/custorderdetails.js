const moongoose = require('mongoose');

const custOrderDetailsSchema = new moongoose.Schema({
    orderid: {
        type: Number,
        required: true
    },
    productid: {
        type: Number,
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