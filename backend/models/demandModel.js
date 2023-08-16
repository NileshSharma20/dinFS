const mongoose = require('mongoose')

const demandSchema = mongoose.Schema({
    ticketNumber:{
        type: String,
        // required: [true, 'Please add the Item Code']
    },   
    employeeId:{
        type: String,
        // required: [true, 'Please add the Model/s']
    },
    partnerName:{
        type: String,
        // required: [true, 'Please add the Company Name']
    },
    distributerName:{
        type: String,
        // required: true
    }, 
    status:{
        type: String,
        // required: [true, 'Please add the Part Number']
    },
    orderedProductList:{
        type: [String],
        // required: [true, 'Please add the Stock Keeping Unit']
    },
    recievedProductList: {
        type: [String],
        // required: [true, 'Please add the MRP']
    },
    // metaData:{
    //     type: Object,
    //     required: false,
    // },
    
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Demandslip', demandSchema)