const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())

const authRoutes = require("./routes/auth")
const getProductRoutes = require("./routes/product")
const addProductRoutes = require("./routes/addProduct")

app.use(express.json())

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`)
  next()
})

app.use("/", authRoutes)
app.use("/", getProductRoutes)
app.use("/", addProductRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
