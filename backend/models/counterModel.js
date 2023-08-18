const mongoose = require('mongoose')

const counterSchema = mongoose.Schema({
    counterNumber:{
        type: Number,
        required: true
    },
    date:{
        type: Number,
        required: true
    },
    counterType:{
        type: String,
        required: true
    }
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Counter', counterSchema)