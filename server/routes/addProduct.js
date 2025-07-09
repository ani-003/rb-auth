const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const authMiddleware = require("../middlewares/auth");
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

const writeProducts = (products) => {
  try {
    fs.writeFileSync(productFilePath, JSON.stringify(products, null, 2));
  } catch (err) {
    console.log("write error", err);
  }
};

router.post("/products", authMiddleware, (req, res) => {
  const user = req.user;
  const { name, price, isPublic } = req.body;

  if (user.role !== "admin" && user.role !== "seller") {
    return res.status(403).json({ message: "Access denied" });
  }

  if (!name || !price || typeof isPublic !== "boolean") {
    return res.status(400).json({ message: "Invalid product data" });
  }

  const products = readProducts();

  const newProduct = {
    id: products.length + 1,
    name,
    price,
    isPublic,
    createdBy: user.email
  };

  products.push(newProduct);
  writeProducts(products);

  res.status(201).json({ message: "Product created", product: newProduct });
});

module.exports = router;
