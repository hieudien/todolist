const moment = require("moment")

const mongoose = require("mongoose")

const itemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    image: String,

    expires: {
        type: Date,
        validate: {
            validator: function(value) {
              return this._id || moment(value).isAfter(moment())
            },
            message: props => `Expired time is invalid!`
        },
    },

    isDone: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("Item", itemSchema)