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
                res.status(401).json({ message: 'Incorrect Password' });
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
    if(!req.body.username){
        const username = req.body.firstname+req.body.lastname
    }
    else{
        const username = req.body.username
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const employee = new EmployeeModel({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        contact: req.body.contact,
        address: req.body.address,
        salary: req.body.salary,
        position: req.body.position,
        username: username,
        password: hashedPassword
    });
    try {
        const newEmployee = await employee.save();
        res.status(201).json({
            message: 'Registration Successful',
            employee: newEmployee
        });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const logout = (req, res) => {
    res.cookie('token', '', { maxAge: 1 });
    res.status(200).json({ message: 'Logout Successful' });
}

const loggedIn = (req, res, next) => {
    const token = req.cookies.token;
    if (token == null) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        jwt.verify(token, secret);
        next();
    }
    catch (err) {
        return res.status(403).json({ message: 'Forbidden' });
    }
}

module.exports = {
    login,
    register,
    logout,
    loggedIn
}