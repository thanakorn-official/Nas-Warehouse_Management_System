import React from 'react';
import { LayoutDashboard, ScanBarcode, History, MonitorCheck, HardDrive } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const menus = [
    { id: 'dashboard', label: 'ภาพรวมสต็อก (Dashboard)', icon: LayoutDashboard },
    { id: 'scan', label: 'สแกนรับเข้า / เบิกจ่าย', icon: ScanBarcode },
    { id: 'history', label: 'ประวัติเบิก-จ่าย', icon: History },
  ];

  return (
    <header style={{
      backgroundColor: 'var(--primary)',
      color: '#ffffff',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 4px 12px rgba(10, 58, 107, 0.15)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '10px',
        paddingBottom: '10px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Brand & Logo บริษัท */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MonitorCheck size={28} color="#67e8f9" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.5px' }}>NAS-WMS</span>
              <span style={{
                fontSize: '0.7rem',
                backgroundColor: '#0284c7',
                padding: '2px 8px',
                borderRadius: '12px',
                fontWeight: 600
              }}>NAS COMP</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 300 }}>
              ระบบบริหารจัดการคลังสินค้า อุปกรณ์ไอทีและคอมพิวเตอร์สำนักงาน
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {menus.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-family)',
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.22)' : 'transparent',
                  color: isActive ? '#ffffff' : '#cbd5e1',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}