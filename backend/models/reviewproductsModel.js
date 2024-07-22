const mongoose = require('mongoose')

const reviewproductsSchema = mongoose.Schema({
    ticketNumber:{
        type: String,
        required: [true, 'Please add Ticket Number']
    },
    username:{
        type: String,
        required: true
    },
    sku:{
        type: String,
        required: [true, 'Please add the Stock Keeping Unit']
    },
    qty:{
        type: Number,
        default:0,
    },
    itemCode:{
        type: String,
        required: [true, 'Please add the Item Code']
    },   
    productName:{
        type: String,
        required: [true, 'Please add Product Name']
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
    mrp: {
        type: String,
        required: [false]
    },
    compatibleModels:{
        type: [String],
        required: [false]
    },   
    productFullName:{
        type: String,
        required: [true, 'Please Add Product Full Name']
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

module.exports = mongoose.model('Reviewproducts', reviewproductsSchema)