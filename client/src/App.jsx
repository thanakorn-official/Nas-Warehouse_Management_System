import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main style={{ flex: 1 }}>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'scan' && (
          <div className="container" style={{ padding: '40px 16px', textAlign: 'center' }}>
            <h3>หน้าจอสแกนบาร์โค้ด (เตรียมสร้างในสเต็ปถัดไป)</h3>
          </div>
        )}
        {activeTab === 'history' && (
          <div className="container" style={{ padding: '40px 16px', textAlign: 'center' }}>
            <h3>หน้าจอประวัติเบิก-จ่าย (เตรียมสร้างในสเต็ปถัดไป)</h3>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;