import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <div>
      {/* Nút Ẩn/Hiện Sidebar */}
      <FontAwesomeIcon
        icon={faBars}
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          left: isSidebarOpen ? '250px' : '10px',
          top: '10px',
          padding: '10px',
          color: '#e74c3c',
          cursor: 'pointer',
          fontSize: '20px',
          transition: 'left 0.3s ease',
          zIndex: 1000,
        }}
      />

      {/* Sidebar */}
      <div
        style={{
          // position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: isSidebarOpen ? '250px' : '0',
          backgroundColor: '#2c3e50',
          color: '#fff',
          transition: 'width 0.3s ease',
          overflow: 'hidden',
          zIndex: 999,
          boxShadow: isSidebarOpen ? '2px 0 5px rgba(0, 0, 0, 0.2)' : 'none',
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#34495e',
            fontSize: '18px',
            fontWeight: 'bold',
          }}
        >
          MENU
        </div>

        {/* Menu Items */}
        {isSidebarOpen && (
          <ul
            style={{
              listStyle: 'none',
              padding: '20px',
              margin: 0,
            }}
          >
            {[
              { name: 'Home', href: '/' },
              { name: 'Upload', href: '/upload' },
              { name: 'All Data', href: '/all-data' },
              { name: 'Logout', href: '/logout' },
            ].map((item) => (
              <li
                key={item.name}
                style={{
                  margin: '10px 0', // Khoảng cách giữa các menu item
                }}
              >
                <Link
                  href={item.href}
                  style={{
                    display: 'block',
                    color: '#fff',
                    textDecoration: 'none',
                    padding: '15px 20px', // Tăng diện tích bấm
                    borderRadius: '5px', // Bo góc
                    transition: 'background-color 0.3s ease, transform 0.2s', // Hiệu ứng hover
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = '#34495e';
                    (e.target as HTMLElement).style.transform = 'scale(1.05)'; // Phóng to khi hover
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.backgroundColor =
                      'transparent';
                    (e.target as HTMLElement).style.transform = 'scale(1)';
                  }}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
