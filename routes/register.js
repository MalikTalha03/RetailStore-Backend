const express = require("express");
const router = express.Router();
const { register } = require("../middleware/auth");

router.post("/", register, (req, res) => {
  res.status(201).json({ message: "Register Successful" });
});

module.exports = router;
