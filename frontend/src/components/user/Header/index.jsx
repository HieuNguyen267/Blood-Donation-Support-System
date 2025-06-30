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
    localStorage.clear();
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

  const menuItems = [
    {
      key: '1',
      icon: <User2 size={16} />,
      label: <Link to="/profile">Thông tin cá nhân</Link>
    },
    {
      key: '3',
      icon: <Settings size={16} />,
      label: <Link to="/settings">Cài đặt</Link>
    },
    {
      key: '4',
      icon: <LogOut size={16} />,
      label: 'Đăng xuất',
      danger: true,
      onClick: handleLogout
    }
  ];

  return (
    <div className="header-wrapper">
      <div className="header-top">
        <div className="logo-title" style={{ cursor: 'pointer' }} onClick={() => navigate('/') }>
          <span className="logo">🩸</span>
          <span className="system-title">Hiến máu tình nguyện</span>
        </div>
        <div className="user-section">
          {showDropdown ? (
            <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
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
        <Link to="/">TRANG CHỦ</Link>
        {isLoggedIn ? (
          <>
            <Link to="/registerdonate">ĐĂNG KÝ HIẾN MÁU</Link>
            <Link to="/appointmenthistory">LỊCH SỬ ĐẶT HẸN</Link>
            <Link to="/certificate">CHỨNG NHẬN</Link>
            <Link to="/faq">HỎI ĐÁP</Link>
            <Link to="/news">TIN TỨC</Link>
            <Link to="/contact">LIÊN HỆ</Link>
          </>
        ) : (
          <>
            <Link to="/faq">HỎI ĐÁP</Link>
            <Link to="/news">TIN TỨC</Link>
            <Link to="/contact">LIÊN HỆ</Link>
          </>
        )}
      </nav>
    </div>
  );
}
