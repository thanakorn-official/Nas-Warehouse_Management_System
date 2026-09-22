const db = require('../config/db');

// 1. ดึงข้อมูลสินค้าทั้งหมด พร้อมชื่อหมวดหมู่
exports.getAllProducts = async (req, res) => {
    try {
        const sql = `
            SELECT p.*, c.name AS category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.id DESC
        `;
        const [products] = await db.query(sql);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. ค้นหาสินค้าด้วย Barcode (สำคัญมากสำหรับหน้าสแกนเนอร์)
exports.getProductByBarcode = async (req, res) => {
    const { barcode } = req.params;
    try {
        const sql = `
            SELECT p.*, c.name AS category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.barcode = ?
        `;
        const [rows] = await db.query(sql, [barcode]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'ไม่พบสินค้าจากบาร์โค้ดนี้' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. เพิ่มสินค้าใหม่
exports.createProduct = async (req, res) => {
    const { barcode, sku, name, category_id, quantity, min_quantity, price } = req.body;
    try {
        const sql = `
            INSERT INTO products (barcode, sku, name, category_id, quantity, min_quantity, price)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(sql, [
            barcode, sku, name, category_id || null, quantity || 0, min_quantity || 10, price || 0.00
        ]);
        res.status(201).json({ message: 'เพิ่มสินค้าเรียบร้อย', productId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. แก้ไขข้อมูลสินค้า
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { barcode, sku, name, category_id, quantity, min_quantity, price } = req.body;
    try {
        const sql = `
            UPDATE products 
            SET barcode = ?, sku = ?, name = ?, category_id = ?, quantity = ?, min_quantity = ?, price = ?
            WHERE id = ?
        `;
        await db.query(sql, [
            barcode, sku, name, category_id || null, quantity, min_quantity, price, id
        ]);
        res.json({ message: 'อัปเดตข้อมูลสินค้าสำเร็จ' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. ลบสินค้า
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM products WHERE id = ?', [id]);
        res.json({ message: 'ลบสินค้าสำเร็จ' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};