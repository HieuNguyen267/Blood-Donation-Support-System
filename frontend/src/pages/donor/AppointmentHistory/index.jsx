import React, { useState, useEffect } from "react";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import { Typography, Button, message, Spin } from "antd";
import { Link } from "react-router-dom";
import { EnvironmentOutlined, ClockCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import "./index.css";
import { donorAPI } from '../../../services/api';

const { Title, Text } = Typography;

export default function AppointmentHistory() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const email = localStorage.getItem('email');
    const history = JSON.parse(localStorage.getItem(`appointmentHistory_${email}`)) || [];
    setAppointments(history);
    setLoading(false);
  }, []);

  const handleDelete = async (registerId) => {
    const email = localStorage.getItem('email');
    try {
      await donorAPI.deleteDonationRegister(registerId);
    } catch { /* ignore */ }
    // Luôn xóa localStorage và cập nhật UI
    const history = JSON.parse(localStorage.getItem(`appointmentHistory_${email}`)) || [];
    const updated = history.filter(item => item.registerId !== registerId);
    localStorage.setItem(`appointmentHistory_${email}`, JSON.stringify(updated));
    // XÓA THÊM các key liên quan
    localStorage.removeItem('donationFormData');
    localStorage.removeItem('bookingFormData');
    localStorage.removeItem('healthCheckAnswers');
    setAppointments(updated);
    message.success('Đã xóa đơn đăng ký khỏi hệ thống');
  };

  if (loading) {
    return (
      <div className="history-page-container">
        <Header />
        <div className="history-content">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '20px' }}>Đang tải lịch sử đặt hẹn...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="history-page-container">
      <Header />
      <div className="history-content">
        <Title level={2} className="history-title">
          Lịch sử đặt hẹn
        </Title>

        <div className="appointment-list">
          {appointments.length > 0 ? (
            appointments.map((app) => (
              <div key={app.id} className="appointment-card">
                <div className="card-left">
                  <div className="blood-drop-icon">🩸</div>
                  <Text strong>Hiến máu</Text>
                </div>
                <div className="card-main">
                  <Title level={4} className="location-title">
                    {app.location || app.address || '-'}
                  </Title>
                  <Text className="appointment-details">
                    <EnvironmentOutlined /> {app.location || app.address || '-'}
                  </Text>
                  <Text className="appointment-details">
                    <ClockCircleOutlined /> {(app.timeSlot || app.donationTimeSlot || '-')}
                  </Text>
                  <Text className="appointment-details">
                    Ngày hiến máu: {app.date || app.sendDate || '-'}
                  </Text>
                  <Text className="appointment-details">
                    Nhóm máu: {app.bloodGroup || app.sampleGroup || '-'}
                  </Text>
                </div>
                <div className="card-right">
                  {app.status === 'cancelled' ? (
                    <Button className="status-btn red-btn" disabled>
                      Đã xóa
                    </Button>
                  ) : (
                    <Button className="status-btn yellow-btn" onClick={() => handleDelete(app.registerId || app.id)}>
                      Hủy lịch
                    </Button>
                  )}
                  <Link to={`/appointment/${app.id}`} className="details-link">
                    <FileTextOutlined /> Xem chi tiết
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <Text className="no-history-text">Bạn chưa có lịch hẹn nào.</Text>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}