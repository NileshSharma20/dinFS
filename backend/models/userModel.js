const mongoose = require('mongoose')

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
    email:{
        type: String,
        required: [true, 'Please add the Email']
    },  
    password:{
        type: String,
        required: [true, 'Please add the Password']
    },
    roles:{
        type: [String],
        required: [true, 'Please add the Roles']
    },

    },
    {
        timestamps: false,
    }
)

module.exports = mongoose.model('User', userSchema)