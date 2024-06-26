const mongoose = require('mongoose')

const itemCodeIndexSchema = mongoose.Schema({
    itemCode:{
        type: String,
        required: [true, 'Please add the Item Code']
    },   
    productName:{
        type: String,
        required: [true, 'Please add the Product Name']
    }
    },
    {
        timestamps: false,
    }
)

module.exports = mongoose.model('ItemCodeIndex', itemCodeIndexSchema)