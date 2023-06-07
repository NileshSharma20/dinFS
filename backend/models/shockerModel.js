const mongoose = require('mongoose')

const shockerSchema = mongoose.Schema({
    itemCode:{
        type: String,
        required: [true, 'Please add a Item code']
    },   
    vehicleModel:{
        type: String,
        required: [true, 'Please add a Model']
    },
    brandCompany:{
        type: String,
        required: [true, 'Please add a Company name']
    }, 
    partNum:{
        type: String,
        required: [true, 'Please add a Part number']
    },
    mrp: {
        type: String,
        required: [true, 'Please add MRP']
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
        timestamps: true,
    }
)

module.exports = mongoose.model('Shocker', shockerSchema)