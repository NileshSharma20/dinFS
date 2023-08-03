const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')

//@desc Register new user
//@route POST /api/users
//@access PUBLIC
const registerUser = asyncHandler( async(req,res)=>{
    const {username, firstname, lastname, email, password} = req.body
    if(!username || !firstname || !lastname || !email || !password){
        res.status(400)
        throw new Error('Please add all fields')
    }

    //Check for username
    const userExists = await User.findOne({username})

    if(userExists){
        res.status(400)
        throw new Error('User already exists')
    }

    //Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        username,
        firstname,
        lastname,
        email,
        password: hashedPassword,
        roles:['Employee']
    })

    if(user){
        res.status(201).json({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            // roles: user.roles
        })
    }else{
        res.status(400)
        throw new Error('Invalid user data')
    }
})

//@desc Authenticate a user
//@route POST /api/users/login
//@access PUBLIC
const loginUser = asyncHandler( async(req, res) => {
    const {username, password} = req.body

    //Check for username
    const user = await User.findOne({username})

    if(user && (await bcrypt.compare(password, user.password))){
        res.status(201).json({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            // roles: user.roles
        })
    }else{
        res.status(400)
        throw new Error('Invalid Credentials')
    }
})


//Generate JWT
const generateToken = (data) => {
    return jwt.sign({data}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = {
    registerUser,
    loginUser,
}