const express = require('express')
const router = express.Router()
const {getAllProd,
       // getFilteredProd,
       getSKUProd,
       setProd,
       setManyProd,
       updateProd,
       deleteProd,
       deleteAllProd} = require('../controllers/prodController')

       
router.route('/').get(getAllProd).post(setProd)

router.delete('/deleteAll',deleteAllProd)

// router.get('/findSpecific',getFilteredProd)

router.get('/findSKU',getSKUProd)

router.post('/setMany', setManyProd)

router.route('/:id').put(updateProd).delete(deleteProd)


module.exports = router