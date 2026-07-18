const mongoose = require('mongoose')

const equipmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    dailyPrice: {
        type: Number,
        required: true,
        min: 0, 
    },
    description: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true })

const Equipment = mongoose.model('Equipment', equipmentSchema)

module.exports = Equipment