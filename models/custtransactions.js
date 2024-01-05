const moongoose = require('mongoose');
const CustomerOrder = require('./customerorder');

const suppOrderDetailsSchema = new moongoose.Schema({
    transactionID: {
        type: Number,
        unique: true,
    },
    transactionType: {
        type: String,
        enum : ['Credit', 'Bank Transfer', 'Cash', 'Refund'],
        required: true
    },
    transactionDate: {
        type: Date,
        required: true
    },
    transactionTime: {
        type: String,
        required: true
    },
    orderID: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'CustomerOrder',
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
});

suppOrderDetailsSchema.pre('save', function(next) {
    if(!this.transactionID){
        try {
            const result = this.constructor.find().sort({ transactionID: -1 }).limit(1);
            if(result.length > 0){
                this.transactionID = result[0].transactionID + 1;
            }
            else{
                this.transactionID = 1;
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

const SuppOrderDetails = moongoose.model('SuppOrderDetails', suppOrderDetailsSchema);
module.exports = SuppOrderDetails;