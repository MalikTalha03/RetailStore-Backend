const moongoose = require('mongoose');

const suppOrderDetailsSchema = new moongoose.Schema({
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