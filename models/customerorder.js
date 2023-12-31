const moongoose = require('mongoose');

const customerOrderSchema = new moongoose.Schema({
    orderid: {
        type: Number,
        required: true
    },
    customerid: {
        type: Number,
        required: true
    },
    employeeid: {
        type: Number,
        required: true
    },
    orderDate: {
        type: Date,
        required: true
    },
    orderTime: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true
    },
});

const CustomerOrder = moongoose.model('CustomerOrder', customerOrderSchema);
module.exports = CustomerOrder;
