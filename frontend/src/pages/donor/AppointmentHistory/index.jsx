import React, { useState, useEffect } from "react";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import { Typography, Button, Spin } from "antd";
import { Link } from "react-router-dom";
import { EnvironmentOutlined, ClockCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import "./index.css";
import { donorAPI } from '../../../services/api';

const { Title, Text } = Typography;

export default function AppointmentHistory() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bloodGroup, setBloodGroup] = useState('-');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      donorAPI.getDonationHistory(),
      donorAPI.getProfile()
    ])
      .then(([history, profile]) => {
        setAppointments(history || []);
        setBloodGroup(profile?.bloodGroup || '-');
      })
      .catch(() => {
        setAppointments([]);
        setBloodGroup('-');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (registerId) => {
    try {
      await donorAPI.deleteDonationRegister(registerId);
      // Sau khi xóa thành công, gọi lại API để cập nhật danh sách
      const data = await donorAPI.getDonationHistory();
      setAppointments(data || []);
    } catch {
      // Nếu lỗi thì không làm gì
    }
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
              <div key={app.registerId || app.id} className="appointment-card">
                <div className="card-left">
                  <div className="blood-drop-icon">🩸</div>
                  <Text strong>Hiến máu</Text>
                </div>
                <div className="card-main">
                  <Title level={4} className="location-title">
                    {'466 Nguyễn Thị Minh Khai Phường 02, Quận 3, Tp Hồ Chí Minh'}
                  </Title>
                  <Text className="appointment-details">
                    <EnvironmentOutlined /> 466 Nguyễn Thị Minh Khai Phường 02, Quận 3, Tp Hồ Chí Minh
                  </Text>
                  <Text className="appointment-details">
                    Ngày hiến máu: {app.appointmentDate || app.date || app.sendDate || '-'}
                  </Text>
                  <Text className="appointment-details">
                    <ClockCircleOutlined /> {app.appointmentTime || app.timeSlot || app.donationTimeSlot || '-'}
                  </Text>
                  <Text className="appointment-details">
                    Nhóm máu: {bloodGroup}
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
                  <Link to={`/appointment/${app.registerId || app.id}`} className="details-link">
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