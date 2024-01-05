const moongoose = require('mongoose');

const employeeSchema = new moongoose.Schema({
    id: {
        type: Number,
        unique: true,
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
    username: {
        type: String,
        required: [true, 'Please enter employee username']
    }
});

employeeSchema.pre('save',async function(next) {
    if(!this.id){
        const result = await this.constructor.find().sort({ id: -1 }).limit(1);
            if (result && result.length > 0) {
                this.id = result[0].id + 1;
            } else {
                this.id = 1; // Set the initial value if no records are found
            }
            next();
    }
    else{
        next();
    }
}
);

const Employee = moongoose.model('Employee', employeeSchema);
module.exports = Employee;