const moongoose = require('mongoose');
const Customer = require('./customer');
const Employee = require('./employee');


const customerOrderSchema = new moongoose.Schema({
    orderid: {
        type: Number,
        required: true
    },
    customerid: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    employeeid: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'Employee',
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

customerOrderSchema.pre('save', function(next) {
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

const CustomerOrder = moongoose.model('CustomerOrder', customerOrderSchema);
module.exports = CustomerOrder;
