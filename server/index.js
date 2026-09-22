const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

// 1. นำเข้า Routes
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 2. เรียกใช้งาน Route สินค้า
app.use('/api/products', productRoutes);

// API เส้นทดสอบเดิม
app.get('/api/test', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        res.json({ message: 'เชื่อมต่อ Database สำเร็จ!', result: rows[0].result });
    } catch (error) {
        res.status(500).json({ error: 'ไม่สามารถเชื่อมต่อ Database ได้: ' + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});