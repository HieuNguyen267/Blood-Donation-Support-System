import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  FaTachometerAlt, FaUserInjured, FaUsers, FaBox, FaHeartbeat,
  FaNewspaper, FaProcedures, FaCity, FaChartBar, FaLink, FaChevronDown, FaChevronRight, FaCogs
} from 'react-icons/fa';
import './Sidebar.css';
import { useAdmin } from '../../../contexts/AdminContext';

// --- Centralized Menu Configuration ---
const menuItems = [
  { path: '/admin', icon: <FaTachometerAlt />, label: 'Dashboard' },
  { path: '/admin/donations', icon: <FaUserInjured />, label: 'Quản lý đơn hiến' },
  { path: '/admin/donation-process', icon: <FaCogs />, label: 'Quản lý quá trình hiến' },
  { path: '/admin/blood-test', icon: <FaProcedures />, label: 'Quản lý kiểm tra máu' },
  { path: '/admin/donors', icon: <FaUsers />, label: 'Quản lý người hiến' },
  { path: '/admin/blood-storage', icon: <FaBox />, label: 'Quản lý kho máu' },
  {
    label: 'Quản lý đơn yêu cầu máu',
    icon: <FaHeartbeat />,
    path: '/admin/blood-requests',
    children: [
      { path: '/admin/matching', icon: <FaLink />, label: 'Quản lý Matching' }
    ]
  },
  { path: '/admin/news', icon: <FaNewspaper />, label: 'Quản lý tin tức' },
  { path: '/admin/medical-facilities', icon: <FaCity />, label: 'Quản lý cơ sở y tế' },
  { path: '/admin/accounts', icon: <FaProcedures />, label: 'Quản lý tài khoản' },
  { path: '/admin/statistics', icon: <FaChartBar />, label: 'Thống kê' },
];

const Sidebar = () => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState('');
  const { adminInfo } = useAdmin();
  
  // Debug log
  console.log('Sidebar received adminInfo from context:', adminInfo);

  const handleDropdownToggle = (label) => {
    setOpenDropdown(prev => (prev === label ? '' : label));
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/path-to-your-avatar.png" alt="Admin Avatar" className="avatar" />
        <div className="sidebar-user-info">
          <span className="sidebar-name">{adminInfo ? (adminInfo.fullName || adminInfo.full_name) : 'Đang tải...'}</span>
          <span className="sidebar-role">{adminInfo ? (adminInfo.role || 'ADMIN') : 'ADMIN'}</span>
          {adminInfo && <span className="sidebar-email">{adminInfo.email}</span>}
        </div>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item) => {
          const isParentActive = (
            (item.path && location.pathname.startsWith(item.path)) ||
            (item.children && item.children.some(child => location.pathname.startsWith(child.path)))
          );

          if (!item.children) {
            return (
              <li key={item.path}>
                <Link to={item.path} className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}>
                  <div className="sidebar-icon-container">{item.icon}</div>
                  <span className="sidebar-label">{item.label}</span>
                </Link>
              </li>
            );
          }

          return (
            <li key={item.label} className={isParentActive ? 'active' : ''}>
              <div className="sidebar-item">
                <Link to={item.path} className="sidebar-item-link">
                  <div className="sidebar-icon-container">{item.icon}</div>
                  <span className="sidebar-label">{item.label}</span>
                </Link>
                <span className="dropdown-arrow" onClick={() => handleDropdownToggle(item.label)}>
                  {openDropdown === item.label ? <FaChevronDown /> : <FaChevronRight />}
                </span>
              </div>
              {openDropdown === item.label && (
                <ul className="sidebar-submenu">
                  {item.children.map((child) => (
                    <li key={child.path}>
                      <Link to={child.path} className={`sidebar-item sub-item ${location.pathname === child.path ? 'active' : ''}`}>
                        <div className="sidebar-icon-container">{child.icon}</div>
                        <span className="sidebar-label">{child.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;