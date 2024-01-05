const moongoose = require('mongoose');
const Customer = require('./customer');

const creditCustomerSchema = new moongoose.Schema({
    creditID: {
        type: Number,
        unique: true,
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
        try {
            const result = this.constructor.find().sort({ creditID: -1 }).limit(1);
            if(result.length > 0){
                this.creditID = result[0].creditID + 1;
            }
            else{
                this.creditID = 1;
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
});

const CreditCustomer = moongoose.model('CreditCustomer', creditCustomerSchema);
module.exports = CreditCustomer;