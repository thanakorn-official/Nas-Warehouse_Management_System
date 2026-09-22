const db = require('../config/db');

// 1. บันทึกการรับเข้า (IN) หรือ เบิกออก (OUT) โดยรองรับทั้ง Product ID หรือยิงด้วย Barcode
exports.handleTransaction = async (req, res) => {
    const { barcode, product_id, type, quantity, note, user_id } = req.body;

    // ตรวจสอบค่าที่จำเป็น
    if ((!barcode && !product_id) || !type || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'กรุณาระบุข้อมูลให้ครบถ้วน และจำนวนต้องมากกว่า 0' });
    }

    const actionType = type.toUpperCase();
    if (!['IN', 'OUT'].includes(actionType)) {
        return res.status(400).json({ message: 'ประเภท Transaction ต้องเป็น IN หรือ OUT เท่านั้น' });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1.1 ค้นหาสินค้าเป้าหมาย
        let productQuery = 'SELECT id, name, quantity FROM products WHERE ';
        let param = [];
        if (barcode) {
            productQuery += 'barcode = ? FOR UPDATE';
            param.push(barcode);
        } else {
            productQuery += 'id = ? FOR UPDATE';
            param.push(product_id);
        }

        const [products] = await connection.query(productQuery, param);
        if (products.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'ไม่พบรายการสินค้าที่ระบุ' });
        }

        const product = products[0];
        const numQty = parseInt(quantity, 10);

        // 1.2 ถ้าเป็นการเบิกออก (OUT) ตรวจสอบว่าสินค้ามีพอให้ตัดสต็อกหรือไม่
        if (actionType === 'OUT' && product.quantity < numQty) {
            await connection.rollback();
            return res.status(400).json({ 
                message: `สินค้าไม่เพียงพอ! ในคลังคงเหลือ ${product.quantity} ชิ้น แต่ต้องการเบิก ${numQty} ชิ้น` 
            });
        }

        // 1.3 คำนวณยอดสต็อกใหม่
        const newQuantity = actionType === 'IN' 
            ? product.quantity + numQty 
            : product.quantity - numQty;

        // 1.4 อัปเดตยอดคงเหลือในตาราง products
        await connection.query(
            'UPDATE products SET quantity = ? WHERE id = ?',
            [newQuantity, product.id]
        );

        // 1.5 บันทึกลงตารางประวัติ inventory_transactions
        await connection.query(
            `INSERT INTO inventory_transactions (product_id, type, quantity, note, user_id) 
             VALUES (?, ?, ?, ?, ?)`,
            [product.id, actionType, numQty, note || null, user_id || null]
        );

        await connection.commit();

        res.status(200).json({
            message: `บันทึกรายการ ${actionType} สำเร็จ`,
            product: {
                id: product.id,
                name: product.name,
                previousQuantity: product.quantity,
                currentQuantity: newQuantity
            }
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// 2. ดึงประวัติการเบิก-จ่ายย้อนหลังทั้งหมด
exports.getTransactionHistory = async (req, res) => {
    try {
        const sql = `
            SELECT t.id, t.type, t.quantity, t.note, t.created_at,
                   p.barcode, p.sku, p.name AS product_name,
                   u.fullname AS user_name
            FROM inventory_transactions t
            JOIN products p ON t.product_id = p.id
            LEFT JOIN users u ON t.user_id = u.id
            ORDER BY t.created_at DESC
            LIMIT 100
        `;
        const [transactions] = await db.query(sql);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};