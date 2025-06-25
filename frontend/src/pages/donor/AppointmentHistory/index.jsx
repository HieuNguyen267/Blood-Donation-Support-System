import React, { useState, useEffect } from "react";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import { Typography, Button, message, Spin } from "antd";
import { Link } from "react-router-dom";
import { EnvironmentOutlined, ClockCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import { donorAPI } from "../../../services/api";
import "./index.css";
import moment from 'moment';

const { Title, Text } = Typography;

export default function AppointmentHistory() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasAppointments = appointments.length > 0;

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("appointmentHistory")) || [];
    setAppointments(history);
    setLoading(false);
  }, []);

  const handleDelete = (id) => {
    const updatedAppointments = appointments.map(app =>
      app.id === id ? { ...app, status: 'cancelled' } : app
    );
    setAppointments(updatedAppointments);
    localStorage.setItem("appointmentHistory", JSON.stringify(updatedAppointments));
    message.success('Đã hủy lịch hẹn thành công');
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
                    {app.address}
                  </Title>
                  <Text className="appointment-details">
                    <EnvironmentOutlined /> {app.address}
                  </Text>
                  <Text className="appointment-details">
                    <ClockCircleOutlined /> {app.donationTimeSlot} - {app.sendDate ? moment(app.sendDate).format('DD/MM/YYYY') : '-'}
                  </Text>
                </div>
                <div className="card-right">
                  {app.status === 'active' ? (
                    <Button className="status-btn yellow-btn" onClick={() => handleDelete(app.id)}>
                      Hủy lịch
                    </Button>
                  ) : (
                    <Button className="status-btn red-btn" disabled>
                      Đã hủy
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
