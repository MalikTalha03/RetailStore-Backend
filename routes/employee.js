const express = require("express");
const router = express.Router();
const EmployeeModel = require("../models/employee");
const { isAdmin } = require("../middleware/admin");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.HastString;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

router.get("/", isAdmin, async (req, res) => {
  try {
    const employees = await EmployeeModel.find();
    employees.forEach(async (employee) => {
      const salt = await bcrypt.genSalt();
      const decodedPass = await bcrypt.hash(employee.password, salt);
      employee.password = decodedPass;
    });
    res.send(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", isAdmin, async (req, res) => {
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
    username: req.body.username,
    password: hashedPassword,
  });
  try {
    const newEmployee = await employee.save();
    res.status(201).json({ message: "Employee has been added" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/token/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, secret);
    const username = decoded.username;
    const employee = await EmployeeModel.findOne({ username: username });
    res.send({ id: employee._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const employee = await EmployeeModel.findOne({
      _id: new mongoose.Types.ObjectId(req.params.id),
    });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    employee.password = "";
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:id", isAdmin, async (req, res) => {
  try {
    const employee = await EmployeeModel.findOne({
      _id: new mongoose.Types.ObjectId(req.params.id),
    });
    const emp = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      contact: req.body.contact,
      address: req.body.address,
      salary: req.body.salary,
      position: req.body.position,
      username: req.body.username,
    };
    if (req.body.password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      emp.password = hashedPassword;
    }
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    } else {
      await EmployeeModel.updateOne(
        { _id: new mongoose.Types.ObjectId(req.params.id) },
        { $set: emp }
      );
      res.status(200).json({ message: "Employee has been updated" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const employee = await EmployeeModel.findOneAndDelete({
      id: req.params.id,
    });
    res.json({
      message: `Employee with ID: ${employee.id} has been deleted`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
