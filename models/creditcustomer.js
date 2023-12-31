const moongoose = require('mongoose');

const creditCustomerSchema = new moongoose.Schema({
    creditID: {
        type: Number,
        required: true
    },
    customerID: {
        type: Number,
        required: true
    },
    totalcredit: {
        type: Number,
        required: [true, 'Please enter total credit']
    },
});

const CreditCustomer = moongoose.model('CreditCustomer', creditCustomerSchema);
module.exports = CreditCustomer;