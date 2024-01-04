const moongoose = require('mongoose');

const supplierSchema = new moongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please enter supplier name']
    },
    contact: {
        type: String,
        required: [true, 'Please enter supplier contact']
    },
    address: {
        type: String,
        required: [true, 'Please enter supplier address']
    },
});

supplierSchema.pre('save', function(next) {
    if(!this.id){
        const maxid = this.constructor.find().sort({id: -1}).limit(1).then(result => {
            this.id = result[0].id + 1;
            next();
        });
    }
    else{
        next();
    }
}
);

const Supplier = moongoose.model('Supplier', supplierSchema);
module.exports = Supplier;