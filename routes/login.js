const express = require("express");
const router = express.Router();
const { login, loggedIn } = require("../middleware/auth");

router.post("/", login, (req, res) => {
  res.status(200).json({ message: "Login Successful" });
});

router.get("/", loggedIn, (req, res) => {
  res.status(200).json({ message: "JWT OK" });
});

module.exports = router;
