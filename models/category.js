const moongoose = require('mongoose');

const categorySchema = new moongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please enter category name']
    },
});

categorySchema.pre('save', function(next) {
    if(!this.id){
        const maxid = this.constructor.find().sort({id: -1}).limit(1).then(result => {
            this.id = result[0].id + 1;
            next();
        });
    }
    else{
        next();
    }
});

const Category = moongoose.model('Category', categorySchema);
module.exports = Category;