const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.HastString;

const isAdmin = (req, res, next) => {
  if (req.headers.authorization == null) {
    return res
      .status(401)
      .json({ message: "Admin Token is required to access" });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (token == null) {
    return res.status(401).json({ message: "Token Not Found" });
  }
  const decoded = jwt.verify(token, secret);
  if (decoded.position == "Admin") {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { isAdmin };
