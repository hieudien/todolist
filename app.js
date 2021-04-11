const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error.message));
db.on("open", () => console.log("Connected to DB"));

// allow app use json
app.use(express.json());

// set Item router
const itemRouter = require("./routes/Item");
app.use("/item", itemRouter);

// set home page
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname + "/views/index.html"))
);

// Listening to port
app.listen(8080, () => console.log("Server running"));
