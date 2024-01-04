const express = require('express');
const router = express.Router();
const EmployeeModel = require('../models/employee');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.HastString;

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
                const token = jwt.sign({ username: employee.username }, secret,
                    { expiresIn: '3h' });
                res.cookie('jwttoken', token, { httpOnly: true, maxAge: 3 * 60 * 60 * 1000 });
                res.json({ message: 'Logged in' });
            }
            else {
                res.json({ message: 'Wrong password' });
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
    password = req.body.password;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const employee = new EmployeeModel({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        contact: req.body.contact,
        address: req.body.address,
        salary: req.body.salary,
        position: req.body.position,
        username: req.body.username,
        password: hashedPassword
    });
    try {
        const newEmployee = await employee.save()
        res.status(201).json(newEmployee);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
);

module.exports = router;