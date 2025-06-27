import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown } from 'antd';
import { UserCircle } from 'lucide-react';
import Footer from "../../../components/user/Footer";
import "./ReceiveBloodSuccess.css";

export default function ReceiveBloodSuccess() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    navigate('/'); 
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };

    window.addEventListener('storage', checkLoginStatus);
    checkLoginStatus();

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  let userName = 'Đăng nhập';
  let showDropdown = false;
  if (isLoggedIn) {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo && userInfo.fullName) {
        userName = userInfo.fullName;
        showDropdown = true;
      } else {
        userName = 'Người dùng';
        showDropdown = true;
      }
    } catch {
      userName = 'Người dùng';
      showDropdown = true;
    }
  }

  const menu = (
    <div style={{ 
      background: 'white', 
      border: '1px solid #d9d9d9', 
      borderRadius: '6px', 
      padding: '4px 0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}>
      <div 
        style={{ 
          padding: '8px 16px', 
          cursor: 'pointer',
          borderBottom: '1px solid #f0f0f0'
        }}
        onClick={() => navigate('/medical-facility/profile')}
      >
        Thông tin cơ sở
      </div>
      <div 
        style={{ 
          padding: '8px 16px', 
          cursor: 'pointer',
          color: '#ff4d4f'
        }}
        onClick={handleLogout}
      >
        Đăng xuất
      </div>
    </div>
  );

  return (
    <>
      <div className="header-wrapper">
        <div className="header-top">
          <div
            className="logo-title"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/medical-facility')}
          >
            <span className="logo">🏥</span>
            <span className="system-title">Hệ thống Nhận Máu</span>
          </div>
          <div className="user-section">
            {showDropdown ? (
              <Dropdown overlay={menu} trigger={['click']}>
                <div className="login-link" style={{ cursor: 'pointer' }}>
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
          <a href="/medical-facility">TRANG CHỦ</a>
          <a href="/medical-facility/receive-blood">YÊU CẦU MÁU</a>
          <a href="/medical-facility/request-history">LỊCH SỬ YÊU CẦU</a>
          <a href="#">TIN TỨC</a>
          <a href="/contact">LIÊN HỆ</a>
        </nav>
      </div>
      <div className="receive-blood-success-container">
        <div className="success-icon">✅</div>
        <h2>Gửi yêu cầu thành công!</h2>
        <p>
          Yêu cầu nhận máu của bạn đã được ghi nhận.<br />
          Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.<br />
          Cảm ơn bạn đã sử dụng hệ thống!
        </p>
        <Link to="/medical-facility" className="back-home-btn">Về trang chủ</Link>
      </div>
      <Footer />
    </>
  );
} 