import React, { useState, useEffect } from "react";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import { Typography, Button, Spin, Modal } from "antd";
import { Link } from "react-router-dom";
import { EnvironmentOutlined, ClockCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import "./index.css";
import { donorAPI } from '../../../services/api';
import moment from "moment";

const { Title, Text } = Typography;

export default function AppointmentHistory() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState(null);
  const [donationFormData, setDonationFormData] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      donorAPI.getDonationHistory()
    ])
      .then(([history]) => {
        setAppointments(history || []);
      })
      .catch(() => {
        setAppointments([]);
      })
      .finally(() => setLoading(false));
    // Lấy dữ liệu localStorage giống RegisterDonatePage
    const booking = localStorage.getItem('bookingFormData');
    if (booking) setBookingData(JSON.parse(booking));
    const donationForm = localStorage.getItem('donationFormData');
    if (donationForm) setDonationFormData(JSON.parse(donationForm));
  }, []);

  const handleDelete = async (registerId) => {
    Modal.confirm({
      title: 'Xác nhận hủy lịch',
      content: 'Bạn có muốn hủy lịch này không?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      okButtonProps: { style: { backgroundColor: '#10b981', borderColor: '#10b981' } },
      onOk: async () => {
        try {
          await donorAPI.deleteDonationRegister(registerId);
          // Sau khi xóa thành công, gọi lại API để cập nhật danh sách
          const data = await donorAPI.getDonationHistory();
          setAppointments(data || []);
          // Xóa dữ liệu localStorage liên quan
          localStorage.removeItem('bookingFormData');
          localStorage.removeItem('donationFormData');
          localStorage.removeItem('healthCheckAnswers');
          const email = localStorage.getItem('email');
          if (email) localStorage.removeItem('appointmentHistory_' + email);
        } catch {
          // Nếu lỗi thì không làm gì
        }
      }
    });
  };

  const renderDate = (date) => {
    // Nếu date null, undefined, rỗng hoặc moment(date) không hợp lệ thì trả về "-"
    if (!date || !moment(date).isValid()) return "-";
    return moment(date).format("DD/MM/YYYY");
  };
  // Lấy ngày hẹn hiến máu ưu tiên giống RegisterDonatePage
  const getAppointmentDate = (app) => {
    return (
      app?.sendDate ||
      app?.appointment_date ||
      donationFormData?.appointment_date ||
      bookingData?.appointment_date ||
      donationFormData?.sendDate ||
      bookingData?.sendDate ||
      app?.appointmentDate ||
      app?.date ||
      '-'
    );
  };
  // Lấy khung giờ hiến máu ưu tiên giống RegisterDonatePage
  const getTimeSlot = (app) => {
    return (
      app?.donationTimeSlot ||
      app?.timeSlot ||
      donationFormData?.donationTimeSlot ||
      bookingData?.donationTimeSlot ||
      donationFormData?.timeSlot ||
      bookingData?.timeSlot ||
      app?.appointmentTime ||
      '-'
    );
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
                  <Text className="location-title" style={{fontWeight: 'normal', fontSize: 18}}>
                    {'466 Nguyễn Thị Minh Khai Phường 02, Quận 3, Tp Hồ Chí Minh'}
                  </Text>
                  <Text className="appointment-details">
                    Ngày hẹn: {renderDate(getAppointmentDate(app))}
                  </Text>
                  <Text className="appointment-details">
                    Khung giờ: {getTimeSlot(app)}
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