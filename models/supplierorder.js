const moongoose = require('mongoose');
const Supplier = require('./supplier');

const supplierOrderSchema = new moongoose.Schema({
    orderid: {
        type: Number,
        unique: true,
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
        try {
            const result = this.constructor.find().sort({ orderid: -1 }).limit(1);
            if(result.length > 0){
                this.orderid = result[0].orderid + 1;
            }
            else{
                this.orderid = 1;
            }
            next();
        } 
        catch (error) {
            console.error(error);
            next(error);
        }
    }
    else{
        next();
    }
}
);

const SupplierOrder = moongoose.model('SupplierOrder', supplierOrderSchema);
module.exports = SupplierOrder;