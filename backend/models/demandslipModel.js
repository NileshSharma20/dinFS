const mongoose = require('mongoose')

const demandslipSchema = mongoose.Schema({
    ticketNumber:{
        type: String,
        required: true
    },   
    employeeId:{
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
        required: true
    },
    orderedProductList:{
        type: Array,
        required: true
    },
    recievedProductList: {
        type: Array,
        required: false
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

module.exports = mongoose.model('Demandslip', demandslipSchema)