const moongoose = require('mongoose');
const Customer = require('./customer');

const creditCustomerSchema = new moongoose.Schema({
    creditID: {
        type: Number,
        required: true
    },
    customerID: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'Customer',
    },
    totalcredit: {
        type: Number,
        required: [true, 'Please enter total credit']
    },
});

creditCustomerSchema.pre('save', function(next) {
    if(!this.creditID){
        const maxid = this.constructor.find().sort({creditID: -1}).limit(1).then(result => {
            this.creditID = result[0].creditID + 1;
            next();
        });
    }
    else{
        next();
    }
});

const CreditCustomer = moongoose.model('CreditCustomer', creditCustomerSchema);
module.exports = CreditCustomer;