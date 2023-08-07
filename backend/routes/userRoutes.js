const express = require('express')
const router = express.Router()
const {getAllUsers,
       createNewUser, 
       loginUser,
       updateUser,
       deleteUser
    } = require('../controllers/userController')

router.route('/')
    .get(getAllUsers)
    .post(createNewUser)
    .put(updateUser)
    .delete(deleteUser)
router.post('/login', loginUser)

module.exports = router