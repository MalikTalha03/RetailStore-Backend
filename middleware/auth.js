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
        const position = employee.position;
        try {
            console.log("position",position);
            if (await bcrypt.compare(password, employee.password)) {
                const token = jwt.sign({ username: username, position: position }, secret, { expiresIn: '1h' });
                res.status(200).json({ 
                    message: 'Login Successful',
                    token: token,
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
    const usernamee = req.body.username;
    if(usernamee == null){
        const usernamee = req.body.firstname+req.body.lastname
    }
    else{
        const usernamee = req.body.username
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
        username: usernamee,
        password: hashedPassword
    });
    try {
        const newEmployee = await employee.save();
        res.status(201).json({
            message: 'Registration Successful',
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
    const header = req.headers.authorization;
    if(!header || !header.startsWith('Bearer ')){
        return res.status(401).json({message: 'Token not found'});
    }
    const token = header.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token not found' });
    }
    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        
        console.log("decoded",decoded);
        const now = Date.now().valueOf() / 1000;
        if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
            return res.status(401).json({ message: 'Token Expired' });
        }
        next();
    }
    catch (err) {
        res.status(400).json({ message:err.message});
    }
}

module.exports = {
    login,
    register,
    logout,
    loggedIn
}