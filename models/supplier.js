const moongoose = require('mongoose');

const supplierSchema = new moongoose.Schema({
    id: {
        type: Number,
        unique: true
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
        try {
            const result = this.constructor.find().sort({ id: -1 }).limit(1);
            if(result.length > 0){
                this.id = result[0].id + 1;
            }
            else{
                this.id = 1;
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

const Supplier = moongoose.model('Supplier', supplierSchema);
module.exports = Supplier;