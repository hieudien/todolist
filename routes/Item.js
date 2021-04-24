const express = require("express")
const router = express.Router()
const multer = require("multer")
const Item = require("../models/Item")
const fs = require('fs')
const { Parser } = require('json2csv')


// setup multer storeage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOAD_IMAGE_PATH)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})
 
const upload = multer({ storage: storage })

// Get all Item
router.get("/", async (req, res) => {
  try {
    let items
    // filter by isDone
    if (req.query.status === "done") {
      // find items is done
      items = await Item.find({ isDone: true })
    } else if (req.query.status === "notyet") {
      // find items is not done
      items = await Item.find({ isDone: false })
    } else {
      // find all items
      items = await Item.find()
    }
    res.status(200).json(items)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create Item
router.post("/", upload.single("image"), async (req, res) => {
  const item = new Item({
    name: req.body.name,
    expires: req.body.expires,
    image: req.file?.filename
  })
  try {
    const newItem = await item.save()
    res.status(201).json(newItem)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update Item
router.patch("/:id", getItem, async (req, res) => {
  if (req.body.name) {
    res.item.name = req.body.name
  }
  if (req.body.isDone !== null) {
    res.item.isDone = req.body.isDone
  }
  try {
    const updatedItem = await res.item.save()
    res.status(200).json(updatedItem)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete Item
router.delete("/:id", getItem, async (req, res) => {
  try {
    // remove item
    await res.item.remove()
    // remove image
    fs.unlink(process.env.UPLOAD_IMAGE_PATH + res.item.image, (err) => err)
    res.json({ message: "Item deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


// Download all Item as csv file
router.get("/csv", async (req, res) => {
  try {
    let items
    // filter by isDone
    if (req.query.status === "done") {
      // find items is done
      items = await Item.find({ isDone: true })
    } else if (req.query.status === "notyet") {
      // find items is not done
      items = await Item.find({ isDone: false })
    } else {
      // find all items
      items = await Item.find()
    }
    const json2csv = new Parser({ fields: [
      {
        label: 'Name',
        value: 'name'
      },
      {
        label: 'Is Done',
        value: 'isDone'
      },
      {
       label: 'Expires',
        value: 'expires'
      }
    ]});
    const csv = json2csv.parse(items);
    res.header('Content-Type', 'text/csv');
    res.attachment('todo.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// middleware to get Item
async function getItem(req, res, next) {
  let item
  try {
    item = await Item.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: "Item not found" })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }

  res.item = item
  next()
}
module.exports = router
