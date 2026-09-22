const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// เส้นทาง API เบิก-จ่าย และ ประวัติ
router.post('/', transactionController.handleTransaction);
router.get('/history', transactionController.getTransactionHistory);

module.exports = router;