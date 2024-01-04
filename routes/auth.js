const express = require('express');
const router = express.Router();
const { login, register, logout } = require('../middleware/auth');

router.get('/login', login, (req, res) => {
    res.status(200).json({ message: 'Login Successful' });
}
);

router.post('/register', register, (req, res) => {
    res.status(201).json({ message: 'Register Successful' });
}
);

router.get('/logout', logout, (req, res) => {
    res.status(200).json({ message: 'Logout Successful' });
}
);

module.exports = router;