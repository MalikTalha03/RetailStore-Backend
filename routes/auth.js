const express = require('express');
const router = express.Router();
const EmployeeModel = require('../models/employee');
const bcrypt = require('bcrypt');

router.get('/login', async (req, res) => {
    try {
        username = req.query.username;
        password = req.query.password;
        const employee = await EmployeeModel.findOne({ username: username });
        if (employee == null) {
            return res.status(400).json({ message: 'Cannot find employee' });
        }
        try {
            if (await bcrypt.compare(password, employee.password)) {
                res.send(employee);
            }
            else {
                res.send('Not Allowed');
            }
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/register', async (req, res) => {
    const employee = new EmployeeModel({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        contact: req.body.contact,
        address: req.body.address,
        salary: req.body.salary,
        position: req.body.position,
        username: req.body.username,
        password: req.body.password
    });
    try {
        const newEmployee = await employee.save();
        res.status(201).json(newEmployee);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

module.exports = router;