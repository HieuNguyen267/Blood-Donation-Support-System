import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../../components/user/Footer';
import MedicalFacilityHeader from '../../../components/user/MedicalFacilityHeader';
import { Typography, Button, message, Spin } from "antd";
import { EnvironmentOutlined, ClockCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import "../../donor/AppointmentHistory/index.css";
import { bloodRequestAPI } from '../../../services/api';

const { Title, Text } = Typography;

const RequestHistory = () => {
  const [receiveRequests, setReceiveRequests] = useState([]);
  const [donateRequests, setDonateRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      // Lấy lịch sử nhận máu
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const facilityId = userInfo.facilityId;
      let receiveData = [];
      if (facilityId) {
        const res1 = await fetch(`http://localhost:8080/blood-requests/facility/${facilityId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });
        receiveData = await res1.json();
      }
      setReceiveRequests(receiveData || []);
      // Lấy lịch sử hiến máu
      const res2 = await fetch('http://localhost:8080/donation-registers', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      const donateData = await res2.json();
      setDonateRequests(donateData || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      message.error('Không thể tải lịch sử yêu cầu');
      setReceiveRequests([]);
      setDonateRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const handleCancelRequest = async (requestId) => {
    try {
      await bloodRequestAPI.deleteRequest(requestId);
      message.success('Đã hủy yêu cầu');
      fetchAllRequests(); // Tải lại danh sách sau khi hủy
    } catch (error) {
      console.error('Error canceling request:', error);
      message.error('Không thể hủy yêu cầu');
    }
  };

  // Hàm hủy yêu cầu nhận máu
  const handleCancelReceiveRequest = async (requestId) => {
    try {
      await bloodRequestAPI.deleteRequest(requestId);
      message.success('Đã hủy yêu cầu nhận máu');
      fetchAllRequests();
    } catch (error) {
      console.error('Error canceling receive request:', error);
      message.error('Không thể hủy yêu cầu nhận máu');
    }
  };

  if (loading) {
    return (
      <div className="history-page-container">
        <MedicalFacilityHeader />
        <div className="history-content">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '20px' }}>Đang tải lịch sử yêu cầu...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="history-page-container">
      <MedicalFacilityHeader />
      <div className="history-content">
        <div className="appointment-list">
          {receiveRequests.length > 0 ? (
            receiveRequests.map((req) => (
              <div key={req.requestId} className="appointment-card">
                <div className="card-left">
                  <div className="blood-drop-icon">🩸</div>
                  <Text strong>Nhận máu</Text>
                </div>
                <div className="card-main">
                  <Title level={4} className="location-title">
                    Mã yêu cầu: {req.requestId}
                  </Title>
                  <Text className="appointment-details">
                    Ngày cần: {req.requiredBy ? req.requiredBy.split('T')[0] : '-'}
                  </Text>
                  <Text className="appointment-details">
                    Số lượng: {req.quantityRequested || '-'} ml
                  </Text>
                  <Text className="appointment-details">
                    Mức độ: {req.urgencyLevel === 'urgent' ? 'Khẩn cấp' : 'Bình thường'}
                  </Text>
                </div>
                <div className="card-right">
                  <Button className="status-btn yellow-btn" onClick={() => handleCancelReceiveRequest(req.requestId)}>
                    Hủy yêu cầu
                  </Button>
                  <Link to={`/medical-facility/request-history/${req.requestId}`} className="details-link">
                    <FileTextOutlined /> Xem chi tiết
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <Text className="no-history-text">Chưa có yêu cầu nhận máu nào.</Text>
          )}
        </div>
        <div className="appointment-list">
          {donateRequests.length > 0 ? (
            donateRequests.map((req) => (
              <div key={req.registerId} className="appointment-card">
                <div className="card-left">
                  <div className="blood-drop-icon">🩸</div>
                  <Text strong>Hiến máu</Text>
                </div>
                <div className="card-main">
                  <Title level={4} className="location-title">
                    Mã đăng ký: {req.registerId}
                  </Title>
                  <Text className="appointment-details">
                    Ngày hẹn: {req.appointmentDate || '-'}
                  </Text>
                  <Text className="appointment-details">
                    Số lượng: {req.quantity || '-'} ml
                  </Text>
                </div>
                <div className="card-right">
                  {req.status === 'Đã hủy' ? (
                    <Button className="status-btn red-btn" disabled>
                      Đã hủy
                    </Button>
                  ) : (
                    <Button className="status-btn yellow-btn" onClick={() => handleCancelRequest(req.id)}>
                      Hủy yêu cầu
                    </Button>
                  )}
                  <Link to={`/medical-facility/request-history/${req.registerId}`} className="details-link">
                    <FileTextOutlined /> Xem chi tiết
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <Text className="no-history-text">Chưa có đăng ký hiến máu nào.</Text>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RequestHistory; 