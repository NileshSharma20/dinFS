const mongoose = require('mongoose')

const demandsliphistorySchema = mongoose.Schema({
    ticketNumber:{
        type: String,
        required: true
    },   
    employeeId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    deliveryPartnerName:{
        type: String,
    },
    distributorName:{
        type: String,
        required: true
    }, 
    status:{
        type: String,
        default:"pending"
    },
    totalCost:{
        type:Number,
        default:0
    },
    orderedProductList:{
        type: [Object],
        required: true
    },
    recievedProductList: {
        type: [Object],
        required: false
    },
    
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('DemandslipHistory', demandsliphistorySchema)