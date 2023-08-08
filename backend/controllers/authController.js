const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')

const User = require('../models/userModel')

//@desc Login user
//@route POST /auth
//@access PUBLIC
const login = asyncHandler(async(req,res)=>{
    const { username, password } = req.body

    if(!username || !password){
        return res.status(400).json({message: `Please fill all fields`})
    }

    const foundUser = await User.findOne({username}).exec()

    if(!foundUser || !foundUser.active){
        return res.status(401).json({message:`Unauthorized`})
    }

    const passwordMatch = await bcrypt.compare(password, foundUser.password)

    if(!passwordMatch) {return res.status(401).json({message:`Unauthorized`})}

    // Create Tokens for Authorization on Successful Login
    const accessToken = jwt.sign(
        {
            "UserInfo":{
                "username":foundUser.username,
                "roles":foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '10s'}
    )

    const refreshToken = jwt.sign(
        {
            "username": foundUser.username
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:'1d'}
    )

    // Create secure http cookie with refresh token
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server
        secure: true, //https only
        sameSite: 'None', //cross-site cookie
        maxAge: 7*24*60*60*1000, //cookie expiry: set to match refreshToken
    })

    // Send accessToken containing username and roles
    res.json({accessToken})
})

//@desc Refresh
//@route GET /auth/refresh
//@access PUBLIC - because access token has expired
const refresh = (req,res)=>{
    const cookies = req.cookies

    if(!cookies?.jwt){
        return res.status(401).json({message: `Unauthorized`})
    }

    const refreshToken = cookies.jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async(err, decoded)=>{
            if(err) {return res.status(403).json({message:'Forbidden'})}

            const foundUser = await User.findOne({username: decoded.username}).exec()

            if(!foundUser){return res.status(401).json({message:'Unauthorized'})}

            const accessToken = jwt.sign(
                {
                    "UserInfo":{
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'10s'}
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
    login,
    refresh,
    logout,
}