const moongoose = require('mongoose');

const employeeSchema = new moongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    firstname: {
        type: String,
        required: [true, 'Please enter employee first name']
    },
    lastname: {
        type: String,
        required: [true, 'Please enter employee last name']
    },
    contact: {
        type: String,
        required: [true, 'Please enter employee contact']
    },
    address: {
        type: String,
        required: [true, 'Please enter employee address']
    },
    salary: {
        type: Number,
        required: [true, 'Please enter employee salary']
    },
    position: {
        type: String,
        required: [true, 'Please enter employee position']
    },
    password: {
        type: String,
        required: [true, 'Please enter employee password']
    },
});

employeeSchema.pre('save', function(next) {
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

const Employee = moongoose.model('Employee', employeeSchema);
module.exports = Employee;