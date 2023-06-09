const express = require('express')
const router = express.Router()
const {getAllProd,
       getFilteredProd,
       setProd,
       setManyProd,
       updateProd,
       deleteProd} = require('../controllers/prodController')

       
router.route('/').get(getAllProd).post(setProd)

router.get('/findSpecific',getFilteredProd)

router.post('/setMany', setManyProd)

router.route('/:id').put(updateProd).delete(deleteProd)

// router.get('/', getProd)
// router.post('/',setProd)


// router.delete('/:id',deleteProd)

module.exports = router