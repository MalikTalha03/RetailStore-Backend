const moongoose = require('mongoose');
const CustomerOrder = require('./customerorder');

const suppOrderDetailsSchema = new moongoose.Schema({
    transactionID: {
        type: Number,
        required: true
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
        const maxid = this.constructor.find().sort({transactionID: -1}).limit(1).then(result => {
            this.transactionID = result[0].transactionID + 1;
            next();
        });
    }
    else{
        next();
    }
}
);

const SuppOrderDetails = moongoose.model('SuppOrderDetails', suppOrderDetailsSchema);
module.exports = SuppOrderDetails;