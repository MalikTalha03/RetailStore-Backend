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

const CreditCustomer = moongoose.model('CreditCustomer', creditCustomerSchema);
module.exports = CreditCustomer;