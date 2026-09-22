import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';
import {
  Boxes,
  AlertTriangle,
  Layers,
  Banknote,
  Search,
  Filter,
  RefreshCw,
  QrCode
} from 'lucide-react';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) {
      console.error('ไม่สามารถดึงข้อมูลสินค้าได้:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // คำนวณสถิติภาพรวม
  const totalSKUs = products.length;
  const totalQuantity = products.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const lowStockItems = products.filter(item => item.quantity <= item.min_quantity);
  const totalStockValue = products.reduce((acc, item) => acc + (item.quantity * item.price || 0), 0);

  // ตัวกรองค้นหา
  const filteredProducts = products.filter(item => {
    const matchText = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      item.barcode.includes(searchTerm);
    const matchCat = selectedCategory === 'ALL' || item.category_id?.toString() === selectedCategory;
    return matchText && matchCat;
  });

  return (
    <div className="container">
      {/* Header ของหน้า Dashboard */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--primary)' }}>
            คลังสินค้าอุปกรณ์ไอทีและคอมพิวเตอร์สำนักงาน
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            แสดงยอดคงเหลือแบบ Real-time และแจ้งเตือนสต็อกต่ำอัตโนมัติ
          </p>
        </div>
        <button
          onClick={loadData}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid var(--border)',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-family)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            fontWeight: 500
          }}
        >
          <RefreshCw size={16} />
          รีเฟรชสต็อก
        </button>
      </div>

      {/* KPI Cards สรุป 4 กล่อง (โทนสีตาม Guidelines) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* กล่อง 1: จำนวนรุ่น/SKU */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={labelStyle}>จำนวนรายการ (SKU)</p>
              <h3 style={valStyle}>{totalSKUs} <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-muted)' }}>รายการ</span></h3>
            </div>
            <div style={{ ...iconWrapper, backgroundColor: '#eff6ff', color: '#1d4ed8' }}>
              <Layers size={24} />
            </div>
          </div>
        </div>

        {/* กล่อง 2: ยอดเครื่องคงเหลือรวม */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={labelStyle}>อุปกรณ์คงคลังทั้งหมด</p>
              <h3 style={valStyle}>{totalQuantity.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-muted)' }}>ชิ้น/เครื่อง</span></h3>
            </div>
            <div style={{ ...iconWrapper, backgroundColor: '#f0fdf4', color: '#15803d' }}>
              <Boxes size={24} />
            </div>
          </div>
        </div>

        {/* กล่อง 3: อุปกรณ์สต็อกต่ำ */}
        <div style={{ ...cardStyle, borderLeft: '4px solid var(--danger)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={labelStyle}>สินค้าสต็อกต่ำกว่าเกณฑ์</p>
              <h3 style={{ ...valStyle, color: 'var(--danger)' }}>
                {lowStockItems.length} <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-muted)' }}>รายการ</span>
              </h3>
            </div>
            <div style={{ ...iconWrapper, backgroundColor: '#fef2f2', color: 'var(--danger)' }}>
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>

        {/* กล่อง 4: มูลค่าทรัพย์สินรวมในคลัง */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={labelStyle}>มูลค่ารวมในคลัง</p>
              <h3 style={valStyle}>฿{totalStockValue.toLocaleString()}</h3>
            </div>
            <div style={{ ...iconWrapper, backgroundColor: '#faf5ff', color: '#7e22ce' }}>
              <Banknote size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* ส่วนตารางสินค้า + แถบฟิลเตอร์ค้นหา */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid var(--border)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
      }}>
        {/* Search & Category Filter Toolbar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px'
        }}>
          {/* กล่องค้นหา */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-main)',
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            flex: '1',
            minWidth: '240px',
            maxWidth: '450px'
          }}>
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่อสินค้า, รหัส SKU หรือบาร์โค้ด..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-family)'
              }}
            />
          </div>

          {/* เมนูดรอปดาวน์หมวดหมู่ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={18} color="var(--text-muted)" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                fontFamily: 'var(--font-family)',
                fontSize: '0.875rem',
                backgroundColor: '#ffffff',
                color: 'var(--text-main)',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="ALL">ทุกหมวดหมู่อุปกรณ์</option>
              <option value="1">คอมพิวเตอร์สำนักงาน (PC/AIO)</option>
              <option value="2">จอภาพแสดงผล (Monitors)</option>
              <option value="3">เครื่องสำรองไฟ (UPS)</option>
              <option value="4">อุปกรณ์ต่อพ่วง / สายสัญญาณ</option>
            </select>
          </div>
        </div>

        {/* ตารางแสดงข้อมูลสินค้า */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            กำลังโหลดข้อมูลสต็อกล่าสุด...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            ไม่พบข้อมูลสินค้าตรงกับเงื่อนไขการค้นหา
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '760px' }}>
              <thead>
                <tr style={{
                  borderBottom: '2px solid var(--border)',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <th style={{ padding: '12px 10px' }}>บาร์โค้ด</th>
                  <th style={{ padding: '12px 10px' }}>รหัส SKU</th>
                  <th style={{ padding: '12px 10px' }}>ชื่อรายการอุปกรณ์</th>
                  <th style={{ padding: '12px 10px' }}>หมวดหมู่</th>
                  <th style={{ padding: '12px 10px', textAlign: 'right' }}>ราคา/หน่วย</th>
                  <th style={{ padding: '12px 10px', textAlign: 'right' }}>คงเหลือ</th>
                  <th style={{ padding: '12px 10px', textAlign: 'center' }}>สถานะสต็อก</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((item) => {
                  const isLow = item.quantity <= item.min_quantity;
                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* บาร์โค้ด */}
                      <td style={{ padding: '14px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <QrCode size={16} color="var(--primary)" />
                          <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary)' }}>
                            {item.barcode}
                          </span>
                        </div>
                      </td>

                      {/* SKU */}
                      <td style={{ padding: '14px 10px', fontWeight: 600, color: '#334155' }}>
                        {item.sku}
                      </td>

                      {/* ชื่อสินค้า */}
                      <td style={{ padding: '14px 10px', fontWeight: 500 }}>
                        {item.name}
                      </td>

                      {/* หมวดหมู่ */}
                      <td style={{ padding: '14px 10px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        {item.category_name || '-'}
                      </td>

                      {/* ราคาต่อหน่วย */}
                      <td style={{ padding: '14px 10px', textAlign: 'right', color: 'var(--text-muted)' }}>
                        ฿{Number(item.price).toLocaleString()}
                      </td>

                      {/* จำนวนคงเหลือ */}
                      <td style={{ padding: '14px 10px', textAlign: 'right', fontWeight: 700, fontSize: '1rem' }}>
                        <span style={{ color: isLow ? 'var(--danger)' : 'var(--text-main)' }}>
                          {item.quantity.toLocaleString()}
                        </span>
                      </td>

                      {/* แท็กสถานะ */}
                      <td style={{ padding: '14px 10px', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          backgroundColor: isLow ? '#fee2e2' : '#dcfce7',
                          color: isLow ? 'var(--danger)' : 'var(--success)'
                        }}>
                          {isLow ? '⚠️ สต็อกต่ำ' : '✓ ปกติ'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// สไตล์ตกแต่ง
const cardStyle = {
  backgroundColor: 'var(--bg-card)',
  padding: '18px 20px',
  borderRadius: '12px',
  border: '1px solid var(--border)',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

const labelStyle = {
  color: 'var(--text-muted)',
  fontSize: '0.85rem',
  fontWeight: 400
};

const valStyle = {
  fontSize: '1.65rem',
  fontWeight: 700,
  marginTop: '4px',
  color: 'var(--text-main)'
};

const iconWrapper = {
  width: '46px',
  height: '46px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};