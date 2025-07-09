const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No token found");
    return res.status(401).json({ message: "Auth header missing or wrong" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const userData = jwt.verify(token, "mysecret456789087");
    req.user = userData;
    console.log("Token verified:", userData);
    next();
  } catch (err) {
    console.log("Token error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
