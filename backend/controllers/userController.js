const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')

//@desc Get all users
//@route GET /api/users
//@access PRIVATE
const getAllUsers = asyncHandler(async(req,res)=>{
    const users = await User.find().select('-password').lean()

    const { roles } = req

    if(!roles.includes("Manager")){
        res.status(403)
        throw new Error("Forbidden")
    }

    if(!users?.length){
        res.status(400)
        throw new Error('No users found')
    }

    res.json(users)
})


//@desc Register new user
//@route POST /api/users
//@access PUBLIC
const createNewUser = asyncHandler( async(req,res)=>{
    const {username, firstname, lastname, password, roles} = req.body
    const rolesAccess = req.roles
    
    if(!username || !firstname || !lastname || !password || 
        !Array.isArray(roles) || !roles.length){
            res.status(400)
            throw new Error('Please fill all fields')
    }

    // Check for minimum Managaer Level Access
    if(!rolesAccess?.length || !Array.isArray(rolesAccess) ||
        !rolesAccess.includes("Manager")){
            res.status(403)
            throw new Error("Forbidden")
    }

    //Check for duplicate usernames
    const userExists = await User.findOne({username}).lean().exec()

    if(userExists){
        res.status(409)
        throw new Error('Duplicate username')
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
    const { id, username, firstname, lastname, roles, active, password } = req.body
    const rolesAccess = req.roles

    //Confirm data
    if(!id || !username || !firstname ||!lastname || !Array.isArray(roles) || 
       !roles.length || typeof active !== 'boolean'){
            res.status(400)
            throw new Error(`All fields are required`)
    }

    // Check for minimum Managaer Level Access
    if(!rolesAccess?.length || !Array.isArray(rolesAccess) ||
        !rolesAccess.includes("Manager")){
        res.status(403)
        throw new Error("Forbidden")
    }

    const user = await User.findById(id).exec()

    if(!user){
        res.status(400)
        throw new Error('User not found')
    }

    //Check for duplicate
    const userExists = await User.findOne({username}).lean().exec()
    
    // Allow updates to original user
    if(userExists && userExists?._id.toString()!==id){
        res.status(409)
        throw new Error('Duplicate username')
    }

    user.username = username
    user.firstname = firstname
    user.lastname = lastname
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
    const {roles} = req

    if(!id){
        return res.status(400).json({message:`User ID Required`})
    }

    // Check for minimum Admin Level Access
    if(!roles?.length || !Array.isArray(roles) || 
        !roles.includes("Admin")){
        res.status(403)
        throw new Error("Forbidden")   
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
        })
    }else{
        res.status(400)
        throw new Error('Invalid Credentials')
    }
})


module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    loginUser,
}