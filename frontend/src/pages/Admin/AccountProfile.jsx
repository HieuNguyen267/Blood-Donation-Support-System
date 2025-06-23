import React from 'react';
import { 
  FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaVenusMars, 
  FaCalendarAlt, FaEdit, FaHistory, FaCheckCircle, FaPlusCircle, FaArrowCircleRight 
} from 'react-icons/fa';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import './AccountProfile.css';

const AccountProfile = () => {
  // Mock data for activity feed
  const activityFeed = [
    { icon: <FaCheckCircle />, text: "Đã duyệt một yêu cầu máu khẩn cấp.", time: "2 giờ trước" },
    { icon: <FaPlusCircle />, text: "Đã thêm một cơ sở y tế mới: Bệnh viện Trung Ương.", time: "1 ngày trước" },
    { icon: <FaArrowCircleRight />, text: "Đã cập nhật trạng thái cho 5 đơn hiến máu.", time: "3 ngày trước" },
    { icon: <FaCheckCircle />, text: "Đã duyệt 10 tài khoản người hiến máu mới.", time: "5 ngày trước" },
  ];

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
              <h2>Admin Nguyen</h2>
              <p>Quản trị viên hệ thống</p>
            </div>
            <div className="location-info">
              <FaMapMarkerAlt />
              <span>Hà Nội, Việt Nam</span>
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
                    <span>admin.nguyen@example.com</span>
                  </div>
                </div>
                <div className="info-item">
                  <FaPhone className="info-icon" />
                  <div className="info-text">
                    <label>Số điện thoại</label>
                    <span>(+84) 123 456 789</span>
                  </div>
                </div>
                <div className="info-item">
                  <FaMapMarkerAlt className="info-icon" />
                  <div className="info-text">
                    <label>Địa chỉ</label>
                    <span>123 Đường ABC, Quận XYZ, Hà Nội</span>
                  </div>
                </div>
                 <div className="info-item">
                  <FaVenusMars className="info-icon" />
                  <div className="info-text">
                    <label>Giới tính</label>
                    <span>Nam</span>
                  </div>
                </div>
                <div className="info-item">
                  <FaCalendarAlt className="info-icon" />
                  <div className="info-text">
                    <label>Ngày tham gia</label>
                    <span>15 tháng 8, 2023</span>
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