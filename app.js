const express = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require("path")
const cors = require('cors')
require("dotenv").config()

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const db = mongoose.connection
db.on("error", (error) => console.error(error.message))
db.on("open", () => console.log("Connected to DB"))

// allow cors
app.use(cors())
app.options('*', cors())

// allow app use json
app.use(express.json({limit: '50mb'}))

// make uploads/images folder be static to client
app.use('/images', express.static(process.env.UPLOAD_IMAGE_PATH))

// set Item router
const itemRouter = require("./routes/Item")
app.use("/item", itemRouter)

// set home page
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname + "/views/index.html"))
)

// Listening to port
app.listen(process.env.PORT, () => console.log("Server running at http://localhost:" + process.env.PORT))
