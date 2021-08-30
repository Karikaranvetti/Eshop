const mongoose = require('mongoose')
const validator = require('validator')

const Iterm = mongoose.model('Iterm', {
    name: {
        type: String,
        required: true,
        trim: true

    },
    description: {
        type: String,
        trim: true,
    },
    price: {
        type: Float,
        required: true,
        default: 0.00
    },
    location: {
        type: String,
        trim: true,
        required: true
    },
    quantity: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    }
})

module.exports = Iterm