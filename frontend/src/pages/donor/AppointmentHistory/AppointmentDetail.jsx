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
          <Title level={4} className="info-card-title">Thông tin hiến máu</Title>
          <div className="info-grid">
            {appointment.fullName && (
              <div className="info-row">
                <Text className="info-label">Họ và tên:</Text>
                <Text className="info-value">{appointment.fullName}</Text>
              </div>
            )}
            {appointment.phone && (
              <div className="info-row">
                <Text className="info-label">Số điện thoại:</Text>
                <Text className="info-value">{appointment.phone}</Text>
              </div>
            )}
            {appointment.email && (
              <div className="info-row">
                <Text className="info-label">Email:</Text>
                <Text className="info-value">{appointment.email}</Text>
              </div>
            )}
            {appointment.address && (
              <div className="info-row">
                <Text className="info-label">Địa điểm hiến máu:</Text>
                <Text className="info-value">{appointment.address}</Text>
              </div>
            )}
            {appointment.location && (
              <div className="info-row">
                <Text className="info-label">Địa điểm hiến máu:</Text>
                <Text className="info-value">{appointment.location}</Text>
              </div>
            )}
            {appointment.weight && (
              <div className="info-row">
                <Text className="info-label">Cân nặng:</Text>
                <Text className="info-value">{appointment.weight} kg</Text>
              </div>
            )}
            {appointment.sampleGroup && (
              <div className="info-row">
                <Text className="info-label">Nhóm máu:</Text>
                <Text className="info-value">{appointment.sampleGroup}</Text>
              </div>
            )}
            {appointment.bloodGroup && (
              <div className="info-row">
                <Text className="info-label">Nhóm máu:</Text>
                <Text className="info-value">{appointment.bloodGroup}</Text>
              </div>
            )}
            {appointment.donateLast && (
              <div className="info-row">
                <Text className="info-label">Lần hiến máu gần nhất:</Text>
                <Text className="info-value">{appointment.donateLast}</Text>
              </div>
            )}
            {appointment.lastDonationDate && (
              <div className="info-row">
                <Text className="info-label">Lần hiến máu gần nhất:</Text>
                <Text className="info-value">{appointment.lastDonationDate}</Text>
              </div>
            )}
            {appointment.sendDate && (
              <div className="info-row">
                <Text className="info-label">Ngày hiến máu:</Text>
                <Text className="info-value">{appointment.sendDate}</Text>
              </div>
            )}
            {appointment.date && (
              <div className="info-row">
                <Text className="info-label">Ngày hiến máu:</Text>
                <Text className="info-value">{appointment.date}</Text>
              </div>
            )}
            {appointment.donationTimeSlot && (
              <div className="info-row">
                <Text className="info-label">Khung giờ:</Text>
                <Text className="info-value">{appointment.donationTimeSlot}</Text>
              </div>
            )}
            {appointment.timeSlot && (
              <div className="info-row">
                <Text className="info-label">Khung giờ hiến máu:</Text>
                <Text className="info-value">{appointment.timeSlot}</Text>
              </div>
            )}
            {appointment.readyTimeRange && (
              <div className="info-row">
                <Text className="info-label">Khoảng thời gian sẵn sàng hiến máu:</Text>
                <Text className="info-value">{
                  Array.isArray(appointment.readyTimeRange)
                    ? appointment.readyTimeRange.map(date => moment(date).format('DD/MM/YYYY')).join(' - ')
                    : moment(appointment.readyTimeRange).isValid() ? moment(appointment.readyTimeRange).format('DD/MM/YYYY') : appointment.readyTimeRange
                }</Text>
              </div>
            )}
            {appointment.sampleQuantity && (
              <div className="info-row">
                <Text className="info-label">Số lượng mẫu:</Text>
                <Text className="info-value">{appointment.sampleQuantity}</Text>
              </div>
            )}
            {appointment.note && (
              <div className="info-row">
                <Text className="info-label">Ghi chú:</Text>
                <Text className="info-value">{appointment.note}</Text>
              </div>
            )}
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