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

const Employee = moongoose.model('Employee', employeeSchema);
module.exports = Employee;