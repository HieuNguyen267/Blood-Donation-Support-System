import React, { useState } from 'react';
import Header from '../../Component/Admin/Header/Header';
import Sidebar from '../../Component/Admin/Sidebar/Sidebar';
import { FaUserCog, FaShieldAlt, FaBell, FaSave } from 'react-icons/fa';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="settings-card">
            <h3>Cài đặt chung</h3>
            <div className="form-group">
              <label htmlFor="language">Ngôn ngữ</label>
              <select id="language" name="language" className="form-control">
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="timezone">Múi giờ</label>
              <select id="timezone" name="timezone" className="form-control">
                <option value="gmt7">(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
                <option value="gmt8">(GMT+08:00) Kuala Lumpur, Singapore</option>
              </select>
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