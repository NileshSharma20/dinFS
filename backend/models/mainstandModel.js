const mongoose = require('mongoose')

const mainstandSchema = mongoose.Schema({
    itemCode:{
        type: String,
        required: [true, 'Please add the Item Code']
    },   
    vehicleModel:{
        type: String,
        required: [true, 'Please add the Model/s']
    },
    brandCompany:{
        type: String,
        required: [true, 'Please add the Company Name']
    }, 
    partNum:{
        type: String,
        required: [true, 'Please add the Part Number']
    },
    sku:{
        type: String,
        required: [true, 'Please add the Stock Keeping Unit']
    },
    mrp: {
        type: String,
        required: [true, 'Please add the MRP']
    },
    compatibleModels:{
        type: [String],
        required: [false]
    },
    metaData:{
        type: Object,
        required: false,
    },
    // netRate: {
    //     type: String,
    //     required: [false]
    // },
    // position: {
    //     type: String,
    //     required: [false]
    // },
    
    },
    {
        timestamps: false,
    }
)

module.exports = mongoose.model('Mainstand', mainstandSchema)