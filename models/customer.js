const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    firstname: {
        type: String,
        required: [true, 'Please enter customer first name']
    },
    lastname: {
        type: String,
        required: [true, 'Please enter customer last name']
    },
    contact: {
        type: String,
        required: [true, 'Please enter customer contact']
    },
});

customerSchema.pre('save', function(next) {
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

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
