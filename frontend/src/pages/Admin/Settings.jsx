import React, { useState } from 'react';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import { FaUserCog, FaShieldAlt, FaBell, FaSave } from 'react-icons/fa';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="settings-card">
            <h3>Thông tin cá nhân</h3>
            <div className="form-group">
              <label htmlFor="fullname">Họ và tên</label>
              <input type="text" id="fullname" name="fullname" className="form-control" defaultValue="Admin Nguyen" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" className="form-control" defaultValue="admin.nguyen@example.com" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input type="tel" id="phone" name="phone" className="form-control" defaultValue="(+84) 123 456 789" />
            </div>
            <div className="form-group">
              <label htmlFor="address">Địa chỉ</label>
              <input type="text" id="address" name="address" className="form-control" defaultValue="123 Đường ABC, Quận XYZ, Hà Nội" />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Giới tính</label>
              <select id="gender" name="gender" className="form-control" defaultValue="Nam">
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="dob">Ngày sinh</label>
              <input type="date" id="dob" name="dob" className="form-control" defaultValue="1990-01-01" />
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="settings-card">
            <h3>Bảo mật</h3>
            <p>Thay đổi mật khẩu của bạn để bảo vệ tài khoản.</p>
            <div className="form-group">
              <label htmlFor="current-password">Mật khẩu hiện tại</label>
              <input type="password" id="current-password" name="current-password" className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="new-password">Mật khẩu mới</label>
              <input type="password" id="new-password" name="new-password" className="form-control" />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password">Xác nhận mật khẩu mới</label>
              <input type="password" id="confirm-password" name="confirm-password" className="form-control" />
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="settings-card">
            <h3>Thông báo</h3>
            <p>Quản lý cách bạn nhận thông báo từ hệ thống.</p>
            <div className="form-group checkbox-group">
              <input type="checkbox" id="email-news" name="email-news" defaultChecked />
              <label htmlFor="email-news">Nhận tin tức và cập nhật qua email</label>
            </div>
            <div className="form-group checkbox-group">
              <input type="checkbox" id="email-requests" name="email-requests" defaultChecked />
              <label htmlFor="email-requests">Thông báo email về các yêu cầu khẩn cấp mới</label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <Header />
      <Sidebar />
      <div className="settings-page main-content">
        <div className="settings-header">
          <h2>Cài đặt tài khoản</h2>
          <button className="save-settings-btn">
            <FaSave />
            Lưu thay đổi
          </button>
        </div>
        <div className="settings-layout">
          <div className="settings-tabs">
            <button
              className={`tab-item ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <FaUserCog />
              <span>Chung</span>
            </button>
            <button
              className={`tab-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <FaShieldAlt />
              <span>Bảo mật</span>
            </button>
            <button
              className={`tab-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <FaBell />
              <span>Thông báo</span>
            </button>
          </div>
          <div className="settings-content">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 