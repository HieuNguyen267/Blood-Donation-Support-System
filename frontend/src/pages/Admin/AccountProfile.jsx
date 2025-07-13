import React, { useEffect, useState } from 'react';
import { 
  FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaVenusMars, 
  FaCalendarAlt, FaEdit, FaHistory, FaCheckCircle, FaPlusCircle, FaArrowCircleRight 
} from 'react-icons/fa';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import { useAdmin } from '../../contexts/AdminContext';
import './AccountProfile.css';

const AccountProfile = () => {
  const { adminInfo, loading } = useAdmin();

  // Mock data for activity feed
  const activityFeed = [
    { icon: <FaCheckCircle />, text: "Đã duyệt một yêu cầu máu khẩn cấp.", time: "2 giờ trước" },
    { icon: <FaPlusCircle />, text: "Đã thêm một cơ sở y tế mới: Bệnh viện Trung Ương.", time: "1 ngày trước" },
    { icon: <FaArrowCircleRight />, text: "Đã cập nhật trạng thái cho 5 đơn hiến máu.", time: "3 ngày trước" },
    { icon: <FaCheckCircle />, text: "Đã duyệt 10 tài khoản người hiến máu mới.", time: "5 ngày trước" },
  ];

  if (loading) return <div>Đang tải thông tin admin...</div>;

  return (
    <div className="admin-dashboard">
      <Header />
      <Sidebar />
      <div className="profile-page main-content">
        {/* Profile Banner */}
        <div className="profile-banner">
          <div className="profile-banner-header" /> {/* Green background */}
          <FaUserCircle size={120} className="profile-page-avatar" />
          
          <div className="profile-banner-content">
            <div className="profile-banner-info">
              <h2>{adminInfo?.fullName || adminInfo?.full_name || "Admin"}</h2>
              <p>Quản trị viên hệ thống</p>
            </div>
            <div className="location-info">
              <FaMapMarkerAlt />
              <span>{adminInfo?.address || "Chưa cập nhật"}</span>
            </div>
          </div>
          
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">128</span>
              <span className="stat-label">Yêu cầu đã xử lý</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">15</span>
              <span className="stat-label">Chiến dịch đã tạo</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">95%</span>
              <span className="stat-label">Tỷ lệ thành công</span>
            </div>
          </div>
        </div>

        {/* Profile Main Content */}
        <div className="profile-main-content">
          {/* Left Column */}
          <div className="profile-left-column">
            <div className="profile-card">
              <h3 className="card-title">Thông tin liên hệ</h3>
              <div className="contact-info-body">
                <div className="info-item">
                  <FaEnvelope className="info-icon" />
                  <div className="info-text">
                    <label>Địa chỉ Email</label>
                    <span>{adminInfo?.email || "Chưa cập nhật"}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FaPhone className="info-icon" />
                  <div className="info-text">
                    <label>Số điện thoại</label>
                    <span>{adminInfo?.phone || "Chưa cập nhật"}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FaMapMarkerAlt className="info-icon" />
                  <div className="info-text">
                    <label>Địa chỉ</label>
                    <span>{adminInfo?.address || "Chưa cập nhật"}</span>
                  </div>
                </div>
                 <div className="info-item">
                  <FaVenusMars className="info-icon" />
                  <div className="info-text">
                    <label>Giới tính</label>
                    <span>{adminInfo?.gender || "Chưa cập nhật"}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FaCalendarAlt className="info-icon" />
                  <div className="info-text">
                    <label>Ngày tham gia</label>
                    <span>{adminInfo?.created_at ? new Date(adminInfo.created_at).toLocaleDateString('vi-VN') : "Chưa cập nhật"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="profile-right-column">
            <div className="profile-card">
              <h3 className="card-title">
                <FaHistory /> Lịch sử hoạt động
              </h3>
              <ul className="activity-feed">
                {activityFeed.map((activity, index) => (
                  <li key={index} className="activity-item">
                    <div className="activity-icon-wrapper">{activity.icon}</div>
                    <div className="activity-text">
                      <p>{activity.text}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile; 