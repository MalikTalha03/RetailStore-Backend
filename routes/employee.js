const express = require('express');
const router = express.Router();
const EmployeeModel = require('../models/employee');
const { isAdmin } = require('../middleware/admin');
router.get('/',isAdmin, async (req, res) => {
    try {
        const employees = await EmployeeModel.find();
        res.send(employees);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

router.get('/:id', async(req, res) => {
    try {
        const employee = await EmployeeModel.find({ id: req.params.id });
        res.send(employee);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);



router.patch('/:id',isAdmin ,async (req, res) => {
    try {
        const employee = await EmployeeModel.find({ id: req.params.id });
        if (req.body.firstname) {
            employee.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
            employee.lastname = req.body.lastname;
        }
        if (req.body.contact) {
            employee.contact = req.body.contact;
        }
        if (req.body.address) {
            employee.address = req.body.address;
        }
        if (req.body.salary) {
            employee.salary = req.body.salary;
        }
        if (req.body.position) {
            employee.position = req.body.position;
        }
        if (req.body.password) {
            employee.password = req.body.password;
        }
        const updatedEmployee = await employee.save();
        res.json(updatedEmployee);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

router.delete('/:id',isAdmin ,async (req, res) => {
    try {
        const employee = await EmployeeModel.findOneAndDelete({ id: req.params.id });
        res.json({
            message: `Employee with ID: ${employee.id} has been deleted`,
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}
);

module.exports = router;