const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// เส้นทาง API สินค้า
router.get('/', productController.getAllProducts);
router.get('/barcode/:barcode', productController.getProductByBarcode);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;