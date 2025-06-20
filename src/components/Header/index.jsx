import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/'); 
  };

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    navigate('/');
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };

    window.addEventListener('storage', checkLoginStatus);
    
    // Initial check
    checkLoginStatus();

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<User2 size={16} />}>
        <a href="/profile">Thông tin cá nhân</a>
      </Menu.Item>

      <Menu.Item key="3" icon={<Settings size={16} />}>
        <a href="/settings">Cài đặt</a>
      </Menu.Item>
      <Menu.Item key="4" icon={<LogOut size={16} />} danger onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="header-wrapper">
      <div className="header-top">
        <div className="logo-title">
          <span className="logo">🩸</span>
          <span className="system-title">Hiến máu tình nguyện</span>
        </div>
        <div className="user-section">
          {isLoggedIn ? (
            <Dropdown overlay={menu} trigger={["click"]}>
              <div className="login-link" style={{ cursor: "pointer" }}>
                <UserCircle size={20} />
                <span>User ▾</span>
              </div>
            </Dropdown>
          ) : (
            <div className="login-link" onClick={handleLogin} style={{cursor: 'pointer'}}>
              <UserCircle size={20} />
              <span>Đăng nhập</span>
            </div>
          )}
        </div>
      </div>
      <nav className="header-nav">
        <a href="/">TRANG CHỦ</a>
        {isLoggedIn ? (
          <>
            <a href="/registerdonate">LỊCH HẸN CỦA BẠN</a>
            <a href="/appointmenthistory">LỊCH SỬ ĐẶT HẸN</a>
            <a href="/addcertificate">CHỨNG NHẬN</a>
            <a href="/faq">HỎI ĐÁP</a>
            <a href="#">TIN TỨC</a>
            <a href="/contact">LIÊN HỆ</a>
            <a href="/receiveblood">NHẬN MÁU</a>
          </>
        ) : (
          <>
            <a href="/faq">HỎI ĐÁP</a>
            <a href="#">TIN TỨC</a>
            <a href="/contact">LIÊN HỆ</a>
          </>
        )}
      </nav>
    </div>
  );
}
