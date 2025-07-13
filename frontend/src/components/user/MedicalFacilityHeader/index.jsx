import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'antd';
import { UserCircle } from 'lucide-react';
import './index.css';
import { medicalFacilitiesAPI } from '../../../services/api';

const MedicalFacilityHeader = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );
  const [healthAnswers, setHealthAnswers] = useState([]);
  const [facilityName, setFacilityName] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
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

  useEffect(() => {
    const storedHealthAnswers = localStorage.getItem("healthCheckAnswers");
    if (storedHealthAnswers) {
      setHealthAnswers(JSON.parse(storedHealthAnswers));
    }
  }, []);

  useEffect(() => {
    async function fetchFacilityName() {
      try {
        let userInfo = null;
        try {
          userInfo = JSON.parse(localStorage.getItem('userInfo'));
        } catch {}
        let accountId = userInfo?.accountId || localStorage.getItem('accountId');
        let facilityId = userInfo?.facilityId || localStorage.getItem('facilityId');
        let role = userInfo?.role || localStorage.getItem('role');
        if (role && role.toLowerCase() === 'medical_facility') {
          if (facilityId) {
            const facility = await medicalFacilitiesAPI.getFacilityById(facilityId);
            if (facility && facility.facilityName) {
              setFacilityName(facility.facilityName);
            } else {
              setFacilityName(null);
              alert('Không tìm thấy tên cơ sở y tế! Vui lòng kiểm tra lại thông tin tài khoản.');
            }
          } else if (accountId) {
            const facility = await medicalFacilitiesAPI.getFacilityByAccountId(accountId);
            if (facility && facility.facilityId) {
              setFacilityName(facility.facilityName);
              // Lưu lại facilityId vào localStorage cho lần sau
              localStorage.setItem('facilityId', facility.facilityId);
              if (userInfo) {
                userInfo.facilityId = facility.facilityId;
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
              }
            } else {
              setFacilityName(null);
              alert('Không tìm thấy thông tin cơ sở y tế! Vui lòng liên hệ quản trị viên.');
            }
          } else {
            setFacilityName(null);
            alert('Không tìm thấy facilityId/accountId! Vui lòng đăng nhập lại.');
          }
        }
      } catch (err) {
        setFacilityName(null);
        alert('Lỗi khi lấy tên cơ sở y tế: ' + (err.message || 'Không xác định'));
        console.log('DEBUG fetchFacilityName error:', err);
      }
    }
    fetchFacilityName();
  }, [isLoggedIn]);

  let userName = 'Đăng nhập';
  let showDropdown = false;
  if (isLoggedIn) {
    try {
      let userInfo = null;
      try {
        userInfo = JSON.parse(localStorage.getItem('userInfo'));
      } catch {}
      let role = userInfo?.role || localStorage.getItem('role');
      if (role && role.toLowerCase() === 'medical_facility' && facilityName) {
        userName = facilityName;
        showDropdown = true;
      } else if (userInfo && userInfo.fullName) {
        userName = userInfo.fullName;
        showDropdown = true;
      } else {
        userName = localStorage.getItem('email') || 'Người dùng';
        showDropdown = true;
      }
    } catch {
      userName = localStorage.getItem('email') || 'Người dùng';
      showDropdown = true;
    }
  }

  const menu = (
    <div
      style={{
        background: 'white',
        border: '1px solid #d9d9d9',
        borderRadius: '6px',
        padding: '4px 0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}
    >
      <div
        style={{
          padding: '8px 16px',
          cursor: 'pointer',
          borderBottom: '1px solid #f0f0f0',
        }}
        onClick={() => navigate('/medical-facility/profile')}
      >
        Thông tin cơ sở
      </div>
      <div
        style={{
          padding: '8px 16px',
          cursor: 'pointer',
          color: '#ff4d4f',
        }}
        onClick={handleLogout}
      >
        Đăng xuất
      </div>
    </div>
  );

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
    console.log('Request headers:', headers);
    return headers;
  };

  console.log('Token:', localStorage.getItem('token'))
  console.log('Headers:', getHeaders())

  return (
    <>
      <div className="header-wrapper">
        <div className="header-top">
          <div
            className="logo-title"
            onClick={() => navigate('/medical-facility')}
          >
            <span className="logo">🩸</span>
            <span className="system-title">Hiến máu tình nguyện</span>
          </div>
          <div className="user-section">
            {showDropdown ? (
              <Dropdown overlay={menu} trigger={['click']}>
                <div className="login-link">
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
      </div>
      <div className="header-nav-container">
        <nav className="header-nav">
          <Link to="/medical-facility">TRANG CHỦ</Link>
          <Link to="/medical-facility/receive-blood">YÊU CẦU MÁU</Link>
          <Link to="/medical-facility/request-history">LỊCH SỬ YÊU CẦU</Link>
          <Link to="/medical-facility/contact">LIÊN HỆ</Link>
        </nav>
      </div>
    </>
  );
};

export default MedicalFacilityHeader; 