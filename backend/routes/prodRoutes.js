const express = require('express')
const router = express.Router()
const {getProd,
       setProd,
       updateProd,
       deleteProd} = require('../controllers/prodController')

       
router.route('/').get(getProd).post(setProd)
       
router.route('/:id').put(updateProd).delete(deleteProd)

// router.get('/', getProd)
// router.post('/',setProd)


// router.delete('/:id',deleteProd)

module.exports = router