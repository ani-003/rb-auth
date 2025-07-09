const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const users = require("../data/user");

router.post("/login", (req, res) => {
  const { logEmail, logPassword } = req.body;

  if (!logEmail || !logPassword) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const user = users.find(u => u.email === logEmail && u.password === logPassword);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { email: user.email, role: user.role },
    "mysecret456789087",
    { expiresIn: "24h" }
  );

  res.status(200).json({ message: "Login successful", token });
});

module.exports = router;
