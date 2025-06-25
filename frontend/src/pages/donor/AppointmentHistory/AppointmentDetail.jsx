import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../../components/user/Header';
import Footer from '../../../components/user/Footer';
import { donorAPI } from '../../../services/api';
import { Typography, Tag, Button } from 'antd';
import './AppointmentDetail.css';
import moment from 'moment';

const { Title, Text } = Typography;

export default function AppointmentDetail() {
  const [appointment, setAppointment] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const savedAppointments = JSON.parse(localStorage.getItem('appointmentHistory')) || [];
    const currentAppointment = savedAppointments.find(app => app.id.toString() === id);
    setAppointment(currentAppointment);
  }, [id]);

  if (!appointment) {
    return <div>Đang tải hoặc không tìm thấy lịch hẹn...</div>;
  }

  const statusTag = appointment.status === 'active' 
    ? <Tag color="yellow">Đã hẹn lịch</Tag> 
    : <Tag color="red">Đã hủy</Tag>;

  return (
    <div className="detail-page-container">
      <Header />
      <div className="detail-content">
        <Title level={2} className="detail-title">
          Lịch sử đã hẹn
        </Title>
        <Text className="detail-status">Trạng thái: {statusTag}</Text>
        
        <div className="info-card">
          <Title level={4} className="info-card-title">Thông tin hiến máu</Title>
          <div className="info-grid">
            <div className="info-row">
              <Text className="info-label">Cơ sở tiếp nhận máu:</Text>
              <Text className="info-value">Hiến máu tình nguyện</Text>
            </div>
            <div className="info-row">
              <Text className="info-label">Địa chỉ:</Text>
              <Text className="info-value">{appointment.address}</Text>
            </div>
            <div className="info-row">
              <Text className="info-label">Lượng máu đã hiến:</Text>
              <Text className="info-value">{appointment.sampleQuantity ? `${appointment.sampleQuantity} ml` : '-'}</Text>
            </div>
            <div className="info-row">
              <Text className="info-label">Ngày hiến:</Text>
              <Text className="info-value">{appointment.sendDate ? moment(appointment.sendDate).format('DD/MM/YYYY') : '-'}</Text>
            </div>
             <div className="info-row">
              <Text className="info-label">Khung giờ:</Text>
              <Text className="info-value">{appointment.donationTimeSlot}</Text>
            </div>
          </div>
        </div>
        
        <div className="back-button-container">
          <Link to="/appointmenthistory">
            <Button className="back-btn">Quay về</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
} 