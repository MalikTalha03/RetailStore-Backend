const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.HastString;
const EmployeeModel = require('../models/employee');


const login = async (req, res,next ) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const employee = await EmployeeModel.findOne({ username: username });
        if (employee == null) {
            return res.status(400).json({ message: 'Cannot find employee' });
        }
        try {
            if (await bcrypt.compare(password, employee.password)) {
                const token = jwt.sign({ username: username }, secret, { expiresIn: '1h' });
                res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
                res.status(200).json({ 
                    message: 'Login Successful',
                    employee: employee
                 });
            }
            else {
                res.status(401).json({ message: 'Not Allowed' });
            }
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const register = async (req, res) => {
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

const logout = (req, res) => {
    res.cookie('token', '', { maxAge: 1 });
    res.status(200).json({ message: 'Logout Successful' });
}

module.exports = {
    login,
    register,
    logout
}