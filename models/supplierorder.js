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

supplierOrderSchema.pre('save', function(next) {
    if(!this.orderid){
        const maxid = this.constructor.find().sort({orderid: -1}).limit(1).then(result => {
            this.orderid = result[0].orderid + 1;
            next();
        });
    }
    else{
        next();
    }
}
);

const SupplierOrder = moongoose.model('SupplierOrder', supplierOrderSchema);
module.exports = SupplierOrder;