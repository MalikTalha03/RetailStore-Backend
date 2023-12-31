const moongoose = require('mongoose');

const supplierOrderSchema = new moongoose.Schema({
    orderid: {
        type: Number,
        required: true
    },
    supplierid: {
        type: Number,
        required: true
    },
    orderDate: {
        type: Date,
        required: true
    },
    totalAmonut: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true
    },
});

const SupplierOrder = moongoose.model('SupplierOrder', supplierOrderSchema);
module.exports = SupplierOrder;