const mongoose = require('mongoose')

const demandslipSchema = mongoose.Schema({
    ticketNumber:{
        type: String,
        required: true
    },   
    employeeId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    username:{
        type: String,
        required: true
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
    dataStatus:{
        type:String,
        required: false,
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

module.exports = mongoose.model('Demandslip', demandslipSchema)