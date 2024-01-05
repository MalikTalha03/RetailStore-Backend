const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true
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

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
