import React from "react";
import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom';

const menu = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Quản lý đơn hiến', path: '/admin/donations' },
  { label: 'Quản lý người hiến', path: '/admin/donors' },
  { label: 'Quản lý kho máu', path: '/admin/blood-storage' },
  { label: 'Quản lý tin tức', path: '/admin/news' },
  { label: 'Thống kê', path: '/admin/statistics' },
];

const Sidebar = () => {
  const location = useLocation();
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img className="avatar" src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" />
        <div>
          <div className="sidebar-name">Sarah Smith</div>
          <div className="sidebar-role">STAFF</div>
        </div>
      </div>
      <ul className="sidebar-menu">
        {menu.map(item => (
          <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
            <Link to={item.path} style={{textDecoration:'none', color:'inherit', display:'block'}}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar; 