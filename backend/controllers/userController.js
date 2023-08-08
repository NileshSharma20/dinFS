const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')

//@desc Get all users
//@route GET /api/users
//@access PRIVATE
const getAllUsers = asyncHandler(async(req,res)=>{
    const users = await User.find().select('-password').lean()

    if(!users?.length){
        return res.status(400).json({message: 'No users found'})
    }

    res.json(users)
})


//@desc Register new user
//@route POST /api/users
//@access PUBLIC
const createNewUser = asyncHandler( async(req,res)=>{
    const {username, firstname, lastname, password, roles} = req.body
    
    if(!username || !firstname || !lastname || !password || 
        !Array.isArray(roles) || !roles.length){
            res.status(400)
            throw new Error('Please fill all fields')
    }

    //Check for duplicate users
    const userExists = await User.findOne({username}).lean().exec()

    if(userExists){
        return res.status(409).json({message:'Duplicate username'})
        // throw new Error('Duplicate username')
    }

    //Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        username,
        firstname,
        lastname,
        password: hashedPassword,
        roles
    })

    if(user){
        res.status(201).json({message: `New user ${username} created`})
    }else{
        res.status(400)
        throw new Error('Invalid user data')
    }
})

//@desc Update an user
//@route PATCH /api/users
//@access PRIVATE
const updateUser = asyncHandler(async(req,res)=>{
    const {id, username, roles, active, password } = req.body

    //Confirm data
    if(!id || !username || !Array.isArray(roles) || 
       !roles.length || typeof active !== 'boolean'){
            return res.status(400).json({message:`All fields are required`})
       }

       const user = await User.findById(id).exec()

       if(!user){
        return res.status(400).json({message:'User not found'})
       }

       //Check for duplicate
       const userExists = await User.findOne({username}).lean().exec()
       //Allow updates to original user
       if(userExists && userExists?._id.toString()!==id){
        return res.status(409).json({message:'Duplicate username'})
       }

       user.username = username
       user.roles = roles
       user.active = active

       if(password){
        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        
        user.password= hashedPassword
       }

       const updatedUser = await user.save()

       res.json({message:`${updatedUser.username} updated`})
})

//@desc Delete an user
//@route DELETE /api/users
//@access PRIVATE
const deleteUser = asyncHandler(async(req,res)=>{
    const {id} = req.body

    if(!id){
        return res.status(400).json({message:`User ID Required`})
    }

    const user = await User.findById(id).exec()

    if(!user){
        return res.status(400).json({message:`User not found`})
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`
    
    res.status(200).json(reply)
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
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    loginUser,
}