// app/layout.tsx
'use client';

import React, { useState } from 'react';
import '../styles/globals.css';
import Sidebar from '@/components/sidebar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', height: '100vh' }}>
          {/* Sidebar */}
          <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

          {/* Main Content */}
          <div style={{ flex: 1, padding: '20px' }}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
};

export default Layout;
