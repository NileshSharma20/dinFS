const mongoose = require('mongoose')

const shockerSchema = mongoose.Schema({
    itemCode:{
        type: String,
        required: [true, 'Please add the Item code']
    },   
    vehicleModel:{
        type: [String],
        required: [true, 'Please add the Model/s']
    },
    brandCompany:{
        type: String,
        required: [true, 'Please add the Company name']
    }, 
    partNum:{
        type: String,
        required: [true, 'Please add the Part number']
    },
    mrp: {
        type: String,
        required: [true, 'Please add the MRP']
    },
    colour: {
        type: String,
        required: [false]
    },
    position: {
        type: String,
        required: [false]
    },
    type: {
        type: String,
        required: [false]
    },
    compatibileModels:{
        type: Array,
        required: [false]
    }
    },
    {
        timestamps: false,
    }
)

module.exports = mongoose.model('Shocker', shockerSchema)