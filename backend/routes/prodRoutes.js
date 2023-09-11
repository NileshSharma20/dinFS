const express = require('express')
const router = express.Router()
const {getAllProd,
       getSKUProd,
       pushToProduct,
       searchAll,
       setProd,
       setManyProd,
       updateProd,
       deleteProd,
       deleteAllProd} = require('../controllers/prodController')

const verifyJWT = require('../middleware/verifyJWT')
       
router.route('/').post(verifyJWT, pushToProduct)
router.route('/:itemCode').get(getAllProd).post(setProd)

router.delete('/deleteAll',verifyJWT, deleteAllProd)

router.route('/search/sku').post(getSKUProd)
router.route('/search/:searchKey').get(searchAll)

router.post('/upload/multiple',verifyJWT, setManyProd)
// router.post('/upload',verifyJWT, setManyProd)

router.route('/:sku').patch(verifyJWT, updateProd).delete(verifyJWT, deleteProd)


module.exports = router