const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ errorMessage: "Unauthorized user" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.body.userId = decoded.userId;
    next();
  } catch (err) {
    
    return res.status(401).json({ errorMessage: "Invalid token" });
  }
};

module.exports = authMiddleware;
