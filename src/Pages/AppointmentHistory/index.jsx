import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import StepProgress from "../../components/StepProgress";
import { Typography, Button } from "antd";
import { Link } from "react-router-dom";
import { EnvironmentOutlined, ClockCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import "./index.css";

const { Title, Text } = Typography;

export default function AppointmentHistory() {
  const [appointments, setAppointments] = useState([]);
  const hasAppointments = appointments.length > 0;

  useEffect(() => {
    const savedAppointments = JSON.parse(localStorage.getItem("appointmentHistory")) || [];
    setAppointments(savedAppointments);
  }, []);

  const handleDelete = (id) => {
    const updatedAppointments = appointments.map(app => 
      app.id === id ? { ...app, status: 'cancelled' } : app
    );
    setAppointments(updatedAppointments);
    localStorage.setItem("appointmentHistory", JSON.stringify(updatedAppointments));
  };

  return (
    <div className="history-page-container">
      <Header />
      <div className="history-content">
        <Title level={2} className="history-title">
          Lịch sử đặt hẹn
        </Title>
        <div className="step-progress-container">
          <StepProgress currentStep={hasAppointments ? 1 : 0} />
        </div>

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
                    {app.address} (thời gian làm việc từ 7g đến 11g)
                  </Title>
                  <Text className="appointment-details">
                    <EnvironmentOutlined /> {app.address}
                  </Text>
                  <Text className="appointment-details">
                    <ClockCircleOutlined /> {app.timeSlot} - {app.date}
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
