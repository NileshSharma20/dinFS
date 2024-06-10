const mongoose = require('mongoose')

const variatorSchema = mongoose.Schema({
    itemCode:{
        type: String,
        required: [true, 'Please add the Item Code']
    },   
    productName:{
        type: String,
        default: "VARIATOR",
    }, 
    productFullName:{
        type: String,
        required: [true, 'Please Add Product Full Name']
    },  
    qty:{
        type:String,
        default:'0',
    },
    unit:{
        type: String,
        required:[true, 'Please Add Unit']
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

module.exports = mongoose.model('Variator', variatorSchema)