const mongoose = require('mongoose')

//nilesh Nilesh12!

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: [true, 'Please add the Username']
    },   
    firstname:{
        type: String,
        required: [true, 'Please add the First Name']
    },
    lastname:{
        type: String,
        required: [true, 'Please add the Last Name']
    },
    password:{
        type: String,
        required: [true, 'Please add the Password']
    },
    roles:[{
        type: String,
        default: "Employee",
    }],
    active:{
        type:Boolean,
        default:true
    }
    // email:{
    //     type: String,
    //     required: [true, 'Please add the Email']
    // },  

    },
    {
        timestamps: false,
    }
)

module.exports = mongoose.model('User', userSchema)