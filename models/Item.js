const mongoose = require("mongoose")

const itemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    image: {
        type: String,
    },

    isDone: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("Item", itemSchema)