// server/middleware/isAuthenticated.js

require("dotenv").config();
const jwt = require("jsonwebtoken");
const { SECRET } = process.env;

if (!SECRET) {
  throw new Error("SECRET environment variable is not defined");
}

module.exports = {
  isAuthenticated: (req, res, next) => {
    const headerToken = req.get("Authorization");

    if (!headerToken) {
      console.log("ERROR IN auth middleware: No token provided");
      return res.status(401).json({ message: "No token provided" });
    }

    let token;
    try {
      // Handle "Bearer " prefix if present
      const tokenPart = headerToken.split(" ");
      token = tokenPart.length === 2 ? tokenPart[1] : headerToken;
      token = jwt.verify(token, SECRET);
    } catch (err) {
      console.log("ERROR IN auth middleware: Invalid token");
      return res.status(401).json({ message: "Invalid token" });
    }

    if (!token) {
      const error = new Error("Not authenticated.");
      error.statusCode = 401;
      return next(error);
    }

    next();
  },
};
