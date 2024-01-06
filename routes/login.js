const express = require('express');
const router = express.Router();
const { login } = require('../middleware/auth');

router.post ('/', login, (req, res) => {
    res.status(200).json({ message: 'Login Successful' });
}
);

module.exports = router;