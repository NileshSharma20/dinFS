const mongoose = require('mongoose')

const leversetSchema = mongoose.Schema({
    itemCode:{
        type: String,
        required: [true, 'Please add the Item Code']
    },   
    productName:{
        type: String,
        default: "LEVER-SET",
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
    
    },
    {
        timestamps: false,
    }
)

module.exports = mongoose.model('Leverset', leversetSchema)