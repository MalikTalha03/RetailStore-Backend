const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Please enter product name']
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price']
    },
    category: {
        type: String,
        required: [true, 'Please enter product category']
    },
    supplierID: {
        type: Number,
        required: [true, 'Please enter supplier ID']
    },
    inventory: {
        type: Number,
        required: [true, 'Please enter product inventory']
    }
});

productSchema.pre('save', function(next) {
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

const Product = mongoose.model('Product', productSchema);
module.exports = Product;