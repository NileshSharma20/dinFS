const express = require('express')
const router = express.Router()
const {getAllProd,
       getSKUProd,
       setProd,
       setManyProd,
       updateProd,
       deleteProd,
       deleteAllProd} = require('../controllers/prodController')

       
router.route('/').post(setProd)

router.delete('/deleteAll',deleteAllProd)

router.get('/findSKU',getSKUProd).post('/getProducts',getAllProd)

router.post('/setMany', setManyProd)

router.route('/:sku').put(updateProd).delete(deleteProd)


module.exports = router