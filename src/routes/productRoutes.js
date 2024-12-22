const express = require('express');
const authenticate = require('../middlewares/auth');
const {
    createProduct,
    updateProduct,
    getAllProducts,
    deleteProduct,
} = require('../controllers/productController');
 
const router = express.Router();

router.post('/', authenticate, createProduct);

router.put('/:id', authenticate, updateProduct);    

router.get('/', authenticate, getAllProducts);

router.delete('/:id', authenticate, deleteProduct);

module.exports = router;
