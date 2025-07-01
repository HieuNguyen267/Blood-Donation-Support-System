import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../../components/user/Header';
import Footer from '../../../components/user/Footer';
import { donorAPI } from '../../../services/api';
import { Typography, Tag, Button } from 'antd';
import './AppointmentDetail.css';
import { FileTextOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function AppointmentDetail() {
  const [userInfo, setUserInfo] = useState({});
  const [appointment, setAppointment] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const [profile, apiAppointment] = await Promise.all([
          donorAPI.getProfile(),
          donorAPI.getDonationDetail(id)
        ]);
        setUserInfo(profile || {});
        setAppointment(apiAppointment || null);
      } catch {
        // fallback nếu cần
      }
    }
    fetchData();
  }, [id]);

  if (!appointment) {
    return <div>Đang tải hoặc không tìm thấy lịch hẹn...</div>;
  }

  const getStatusText = (status) => {
    if (status === 'cancelled') return 'Đã hủy';
    return 'Đang chờ xác nhận';
  };

  const statusTag = appointment.status === 'cancelled' 
    ? <Tag color="red">{getStatusText(appointment.status)}</Tag> 
    : <Tag color="yellow">{getStatusText(appointment.status)}</Tag>;

  return (
    <div className="detail-page-container">
      <Header />
      <div className="detail-content">
        <Title level={2} className="detail-title">
          Lịch sử đã hẹn
        </Title>
        <Text className="detail-status">Trạng thái: {statusTag}</Text>
        
        <div className="info-card">
          <Title level={4} className="info-card-title">Thông tin cá nhân</Title>
          <div className="info-grid">
            <div className="info-row"><Text className="info-label">Họ và tên:</Text> <Text className="info-value">{userInfo.fullName}</Text></div>
            <div className="info-row"><Text className="info-label">Ngày sinh:</Text> <Text className="info-value">{userInfo.dateOfBirth}</Text></div>
            <div className="info-row"><Text className="info-label">Giới tính:</Text> <Text className="info-value">{userInfo.gender}</Text></div>
            <div className="info-row"><Text className="info-label">Nghề nghiệp:</Text> <Text className="info-value">{userInfo.job}</Text></div>
            <div className="info-row"><Text className="info-label">Nhóm máu:</Text> <Text className="info-value">{userInfo.bloodGroup}</Text></div>
            <div className="info-row"><Text className="info-label">Địa chỉ:</Text> <Text className="info-value">{userInfo.address}</Text></div>
            <div className="info-row"><Text className="info-label">Điện thoại:</Text> <Text className="info-value">{userInfo.phone}</Text></div>
            <div className="info-row"><Text className="info-label">Email:</Text> <Text className="info-value">{userInfo.email}</Text></div>
          </div>
        </div>

        <div className="info-card">
          <Title level={4} className="info-card-title">Thông tin hiến máu</Title>
          <div className="info-grid">
            <div className="info-row"><Text className="info-label">Ngày hiến máu:</Text> <Text className="info-value">{appointment.appointmentDate || '-'}</Text></div>
            <div className="info-row"><Text className="info-label">Địa điểm:</Text> <Text className="info-value">{appointment.address || '466 Nguyễn Thị Minh Khai Phường 02, Quận 3, Tp Hồ Chí Minh'}</Text></div>
            <div className="info-row"><Text className="info-label">Khung giờ:</Text> <Text className="info-value">{appointment.donationTimeSlot || appointment.timeSlot || '-'}</Text></div>
            <div className="info-row"><Text className="info-label">Ghi chú:</Text> <Text className="info-value">{appointment.note || '-'}</Text></div>
            {/* Thêm các trường khác nếu có */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 