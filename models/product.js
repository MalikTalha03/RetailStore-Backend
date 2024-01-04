const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
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

const Product = mongoose.model('Product', productSchema);
module.exports = Product;