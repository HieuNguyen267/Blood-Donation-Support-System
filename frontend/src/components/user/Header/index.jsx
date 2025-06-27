import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./index.css";
import {
  Dropdown,
  Menu
} from "antd";
import {
  UserCircle,
  LogOut,
  Settings,
  Home,
  User2,
} from "lucide-react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [userName, setUserName] = useState('Đăng nhập');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    setUserName('Đăng nhập');
    navigate('/'); 
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        try {
          const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
          if (userInfo && userInfo.fullName) {
            setUserName(userInfo.fullName);
          } else {
            setUserName('Người dùng');
          }
        } catch {
          setUserName('Người dùng');
        }
      } else {
        setUserName('Đăng nhập');
      }
    };

    window.addEventListener('storage', checkLoginStatus);
    // Initial check
    checkLoginStatus();
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  let showDropdown = false;
  if (isLoggedIn && userName !== 'Đăng nhập') {
    showDropdown = true;
  }

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<User2 size={16} />}>
        <Link to="/profile">Thông tin cá nhân</Link>
      </Menu.Item>

      <Menu.Item key="3" icon={<Settings size={16} />}>
        <a href="/settings">Cài đặt</a>
      </Menu.Item>
      <Menu.Item key="4" icon={<LogOut size={16} />} danger onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const email = localStorage.getItem('email');

  return (
    <div className="header-wrapper">
      <div className="header-top">
        <div className="logo-title" style={{ cursor: 'pointer' }} onClick={() => navigate('/') }>
          <span className="logo">🩸</span>
          <span className="system-title">Hiến máu tình nguyện</span>
        </div>
        <div className="user-section">
          {showDropdown ? (
            <Dropdown overlay={menu} trigger={["click"]}>
              <div className="login-link" style={{ cursor: "pointer" }}>
                <UserCircle size={20} />
                <span>{userName} ▾</span>
              </div>
            </Dropdown>
          ) : (
            <Link to="/login" className="login-link">
              <UserCircle size={20} />
              <span>Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>
      <nav className="header-nav">
        <a href="/">TRANG CHỦ</a>
        {isLoggedIn ? (
          <>
            <a href="/registerdonate">ĐĂNG KÝ HIẾN MÁU</a>
            <a href="/appointmenthistory">LỊCH SỬ ĐẶT HẸN</a>
            <a href="/addcertificate">CHỨNG NHẬN</a>
            <a href="/faq">HỎI ĐÁP</a>
            <a href="/news">TIN TỨC</a>
            <a href="/contact">LIÊN HỆ</a>
            {/* <a href="/receiveblood">NHẬN MÁU</a> */}
          </>
        ) : (
          <>
            <a href="/faq">HỎI ĐÁP</a>
            <a href="/news">TIN TỨC</a>
            <a href="/contact">LIÊN HỆ</a>
          </>
        )}
      </nav>
    </div>
  );
}
