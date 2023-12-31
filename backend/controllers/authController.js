const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')

//@desc Verify Access Token's validity
//@route GET /auth
//@access PUBLIC (Function for Authorization)
const healthCheck = asyncHandler(async(req,res)=>{
    res.status(200).json({verified:true})
})

//@desc Login user
//@route POST /auth
//@access PUBLIC
const login = asyncHandler(async(req,res)=>{
    const { username, password } = req.body

    if(!username || !password){
        res.status(400)
        throw new Error(`Please fill all fields`)
    }

    const foundUser = await User.findOne({username}).exec()

    if(!foundUser || !foundUser.active){
        res.status(401)
        throw new Error(`Unauthorized: User not found`)
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password)

    if(!passwordMatch){
        res.status(401)
        throw new Error(`Unauthorized: Incorrect password`)
    }

    // Create Tokens for Authorization on Successful Login
    const accessToken = jwt.sign(
        {
            "UserInfo":{
                "username":foundUser.username,
                "roles":foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '15m'}
    )

    const refreshToken = jwt.sign(
        {
            "username": foundUser.username
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:'7d'}
    )

    // Create secure http cookie with refresh token
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https only
        sameSite: 'None', //cross-site cookie
        maxAge: 7*24*60*60*1000, //cookie expiry: set to match refreshToken (7d)
    })

    // Send accessToken containing username and roles
    res.json({accessToken})
})

//@desc Refresh
//@route GET /auth/refresh
//@access PUBLIC - because Access Token has expired
const refresh = (req,res)=>{
    const cookies = req.cookies

    if(!cookies?.jwt){
        console.log(`no cookie`)
        res.status(401)
        throw new Error(`Unauthorized`)
    }

    const refreshToken = cookies.jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async(err, decoded)=>{
            if(err){
                res.status(403)
                throw new Error('Forbidden')
            }

            const foundUser = await User.findOne({username: decoded.username}).exec()

            if(!foundUser){
                res.status(401)
                throw new Error('Unauthorized')
            }

            const accessToken = jwt.sign(
                {
                    "UserInfo":{
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'15m'}
            )

            res.json({accessToken})
        })
    )
}

//@desc Logout user
//@route POST /auth/logout
//@access PUBLIC - just to clear if cookie exists
const logout = (req,res)=>{
    const cookies = req.cookies
    if(!cookies?.jwt){
        return res.status(204) //No content
    }

    res.clearCookie('jwt',{httpOnly: true, sameSite:'None', secure:true})
    res.json({message:'Cookie cleared'})
}

module.exports = {
    healthCheck,
    login,
    refresh,
    logout,
}