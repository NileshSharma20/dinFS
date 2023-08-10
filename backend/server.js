const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const colors = require('colors')
const dotenv = require('dotenv').config()
const corsOptions = require('./config/corsOptions')
const port = process.env.PORT || 5000
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')

connectDB()

const app = express()

// app.use(cors(corsOptions))

app.set('trust proxy', 1) // For express-rate-limit error message

app.use(express.json())
app.use(express.urlencoded({ extended:false }))
app.use(cookieParser())

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/prod', require('./routes/prodRoutes'))

app.use(errorHandler)

app.listen(port,()=> console.log(`Server started on port ${port}`.yellow.underline))