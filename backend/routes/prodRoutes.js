const express = require('express')
const router = express.Router()
const {getAllProd,
       getDataForExportProd,
       getSKUProd,
       pushToProduct,
       searchAll,
       getItemCodeIndex,
       setItemCodeIndex,
       setProd,
       setManyProd,
       updateProd,
       deleteProd,
       deleteAllProd,
       addNewFields,
       addNewFieldsBatch} = require('../controllers/prodController')

const verifyJWT = require('../middleware/verifyJWT')
       
router.route('/').post(verifyJWT, pushToProduct)
router.route('/:itemCode')
              .get(getAllProd)
              .post(setProd)

router.route('/exportMongoData/:itemCode')
       .get(verifyJWT, getDataForExportProd)

// router.route('/index')
router.route('/index/:itemCode')
       .get(getItemCodeIndex)
       // .post(setItemCodeIndex)

router.route('/index/all')
       .post(verifyJWT, setItemCodeIndex)

router.delete('/deleteAll',verifyJWT, deleteAllProd)

router.route('/search/sku/:skuOnlyFlag')
       .post(getSKUProd)
// router.route('/search/skuOnly').post(searchAllSKU)
router.route('/search/:searchKey')
       .get(searchAll)

router.post('/upload/multiple',verifyJWT, setManyProd)
// router.post('/upload',verifyJWT, setManyProd)

router.put('/addNewField/:itemCode',verifyJWT, addNewFields)

router.route('/:sku')
       .patch(verifyJWT, updateProd)
       .delete(verifyJWT, deleteProd)

// router.put('/batchUpdate/madness',verifyJWT, addNewFieldsBatch)


module.exports = router