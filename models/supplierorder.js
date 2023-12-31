const moongoose = require('mongoose');
const Supplier = require('./supplier');

const supplierOrderSchema = new moongoose.Schema({
    orderid: {
        type: Number,
        required: true
    },
    supplierid: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
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