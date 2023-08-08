const express = require('express')
const router = express.Router()
const verifyJWT = require('../middleware/verifyJWT')
const {getAllUsers,
       createNewUser, 
       loginUser,
       updateUser,
       deleteUser} = require('../controllers/userController')

router.use(verifyJWT)

router.route('/')
    .get(getAllUsers)
    .post(createNewUser)
    .patch(updateUser)
    .delete(deleteUser)

// router.post('/login', loginUser)

module.exports = router