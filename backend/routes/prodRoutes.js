const express = require('express')
const router = express.Router()
const {getAllProd,
       getFilteredProd,
       setProd,
       updateProd,
       deleteProd} = require('../controllers/prodController')

       
router.route('/').get(getAllProd).post(setProd)

router.route('/findSpecific').get(getFilteredProd)

router.route('/:id').put(updateProd).delete(deleteProd)

// router.get('/', getProd)
// router.post('/',setProd)


// router.delete('/:id',deleteProd)

module.exports = router