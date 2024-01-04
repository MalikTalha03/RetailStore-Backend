const moongoose = require('mongoose');
const SupplierOrder = require('./supplierorder');

const suppTransactionSchema = new moongoose.Schema({
    transactionID: {
        type: Number,
        required: true
    },
    transactionType: {
        type: String,
        enum: ['Credit', 'Cash', 'Bank Transfer'],
        required: true
    },
    transactionDate: {
        type: Date,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderID: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'SupplierOrder',
        required: true
    },
});

suppTransactionSchema.pre('save', function(next) {
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

const SuppTransaction = moongoose.model('SuppTransaction', suppTransactionSchema);
module.exports = SuppTransaction;