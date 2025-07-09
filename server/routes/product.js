const express = require("express");
const fs = require("fs");
const path = require("path");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

const productFilePath = path.join(__dirname, "../data/productDetails.json");

const readProducts = () => {
  try {
    const data = fs.readFileSync(productFilePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.log("read error", err);
    return [];
  }
};

router.get("/products", authMiddleware, (req, res) => {
  const user = req.user;
  const products = readProducts();

  let visibleProducts = [];

  if (user.role === "admin") {
    visibleProducts = products;
  } else if (user.role === "seller") {
    visibleProducts = products.filter(p => p.createdBy === user.email);
  } else if (user.role === "buyer") {
    visibleProducts = products.filter(p => p.isPublic);
  } else {
    return res.status(403).json({ message: "Unauthorized role" });
  }

  res.json({ products: visibleProducts });
});

module.exports = router;
