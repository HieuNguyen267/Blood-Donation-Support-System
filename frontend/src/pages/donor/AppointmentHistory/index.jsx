import React, { useState, useEffect } from "react";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import { Typography, Button, Spin } from "antd";
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
      donorAPI.getDonationHistory(),
      donorAPI.getMatchingHistory()
    ])
      .then(([donationHistory, matchingHistory]) => {
        // Transform donation history to match the expected format
        const donationAppointments = (donationHistory || []).map(app => ({
          ...app,
          type: 'donation_register',
          id: app.registerId || app.id,
          // Use existing logic for date and time
          appointmentDate: app?.sendDate || app?.appointment_date || app?.appointmentDate || app?.date,
          timeSlot: app?.donationTimeSlot || app?.timeSlot || app?.appointmentTime,
          address: '466 Nguyễn Thị Minh Khai Phường 02, Quận 3, Tp Hồ Chí Minh',
          status: app.status,
          donationStatus: app.donationStatus
        }));

        // Transform matching history to match the expected format
        const matchingAppointments = (matchingHistory || []).map(app => ({
          ...app,
          type: 'matching_blood',
          id: app.matchingId,
          appointmentDate: app.arrivalTime,
          timeSlot: app.arrivalTime ? moment(app.arrivalTime).format('HH:mm') : null,
          address: app.address || 'Không xác định',
          status: app.status,
          donationStatus: null
        }));

        // Combine and sort by creation date (newest first)
        const allAppointments = [...donationAppointments, ...matchingAppointments]
          .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return dateB - dateA;
          });

        setAppointments(allAppointments);
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

  const handleDelete = async (id, type) => {
    try {
      if (type === 'donation_register') {
        await donorAPI.deleteDonationRegister(id);
      // Sau khi xóa thành công, gọi lại API để cập nhật danh sách
      const data = await donorAPI.getDonationHistory();
        setAppointments(prev => prev.filter(app => !(app.id === id && app.type === 'donation_register')));
      // Xóa dữ liệu localStorage liên quan
      localStorage.removeItem('bookingFormData');
      localStorage.removeItem('donationFormData');
      localStorage.removeItem('healthCheckAnswers');
      const email = localStorage.getItem('email');
      if (email) localStorage.removeItem('appointmentHistory_' + email);
      } else if (type === 'matching_blood') {
        // Note: We don't have a delete endpoint for matching_blood yet
        console.log('Delete functionality not implemented for matching blood');
      }
    } catch {
      // Nếu lỗi thì không làm gì
    }
  };

  const renderDate = (date) => {
    if (!date) return '-';
    return moment(date).format('DD/MM/YYYY');
  };

  const renderTime = (timeSlot) => {
    if (!timeSlot) return '-';
    // If timeSlot is already a time string, return it
    if (typeof timeSlot === 'string' && timeSlot.includes(':')) {
      return timeSlot;
    }
    // If it's a date, extract time
    return moment(timeSlot).format('HH:mm');
  };

  // Lấy ngày hẹn hiến máu ưu tiên giống RegisterDonatePage
  const getAppointmentDate = (app) => {
    if (app.type === 'matching_blood') {
      return app.appointmentDate;
    }
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
    if (app.type === 'matching_blood') {
      return app.timeSlot;
    }
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

  const getStatusText = (status, donationStatus, type) => {
    if (type === 'matching_blood') {
      if (!status) return 'Chờ phản hồi';
      switch (status) {
        case 'contacting': return 'Đang liên hệ';
        case 'contact_successful': return 'Đã đồng ý';
        case 'completed': return 'Hoàn thành';
        case 'rejected': return 'Từ chối';
        default: return status;
      }
    } else {
      // Original donation register status logic
      if (status === 'confirmed') {
        if (donationStatus === 'processing') return 'Chờ đến ngày hiến';
        if (donationStatus === 'deferred') return 'Tạm hoãn';
        if (donationStatus === 'completed') return 'Thành công';
        return 'Đã xác nhận';
      }
      if (status === 'cancelled') return 'Đã hủy';
      if (status === 'pending') return 'Đang chờ xác nhận';
      return status;
    }
  };

  const getStatusColor = (status, donationStatus, type) => {
    if (type === 'matching_blood') {
      if (!status) return 'gold';
      switch (status) {
        case 'contacting': return 'blue';
        case 'contact_successful': return 'green';
        case 'completed': return 'green';
        case 'rejected': return 'red';
        default: return 'default';
      }
    } else {
      // Original donation register status logic
      if (status === 'confirmed') {
        if (donationStatus === 'processing') return 'gold';
        if (donationStatus === 'deferred') return 'red';
        if (donationStatus === 'completed') return 'green';
        return 'blue';
      }
      if (status === 'cancelled') return 'red';
      if (status === 'pending') return 'gold';
      return 'default';
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
              <div key={`${app.type}-${app.id}`} className="appointment-card">
                <div className="card-left">
                  <div className="blood-drop-icon">🩸</div>
                  <Text strong>Hiến máu</Text>
                  {app.type === 'matching_blood' && (
                    <Text style={{ fontSize: '12px', color: '#1890ff' }}>Khẩn cấp</Text>
                  )}
                </div>
                <div className="card-main">
                  <Text className="location-title" style={{fontWeight: 'normal', fontSize: 18}}>
                    {app.address}
                  </Text>
                  <Text className="appointment-details">
                    Ngày hẹn: {renderDate(getAppointmentDate(app))}
                  </Text>
                  <Text className="appointment-details">
                    Khung giờ: {renderTime(getTimeSlot(app))}
                  </Text>
                  <Text className="appointment-details">
                    Trạng thái: <span style={{ color: getStatusColor(app.status, app.donationStatus, app.type) === 'green' ? '#52c41a' : 
                                               getStatusColor(app.status, app.donationStatus, app.type) === 'red' ? '#ff4d4f' : 
                                               getStatusColor(app.status, app.donationStatus, app.type) === 'blue' ? '#1890ff' : '#faad14' }}>
                      {getStatusText(app.status, app.donationStatus, app.type)}
                    </span>
                  </Text>
                </div>
                <div className="card-right">
                  {app.type === 'donation_register' && app.status === 'cancelled' ? (
                    <Button className="status-btn red-btn" disabled>
                      Đã xóa
                    </Button>
                  ) : app.type === 'donation_register' ? (
                    <Button className="status-btn yellow-btn" onClick={() => handleDelete(app.id, app.type)}>
                      Hủy lịch
                    </Button>
                  ) : null}
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