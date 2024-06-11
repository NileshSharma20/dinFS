const mongoose = require('mongoose')

const headoringSchema = mongoose.Schema({
    itemCode:{
        type: String,
        required: [true, 'Please add the Item Code']
    },   
    productName:{
        type: String,
        default: "HEAD-ORING",
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
    productFullName:{
        type: String,
        required: [true, 'Please Add Product Full Name']
    },  
    qty:{
        type: Number,
        default:0,
    },
    unit:{
        type: String,
        default: "PC",
        // required:[true, 'Please Add Unit']
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

module.exports = mongoose.model('Headoring', headoringSchema)