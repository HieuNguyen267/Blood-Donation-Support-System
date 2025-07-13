import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../../components/user/Footer';
import MedicalFacilityHeader from '../../../components/user/MedicalFacilityHeader';
import { Typography, Button, message, Spin } from "antd";
import { EnvironmentOutlined, ClockCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import "../../donor/AppointmentHistory/index.css";
import { mfBloodRequestAPI } from '../../../services/api';

const { Title, Text } = Typography;

const RequestHistory = () => {
  const [receiveRequests, setReceiveRequests] = useState([]);
  const [donateRequests, setDonateRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      
      // Lấy lịch sử yêu cầu máu từ API thực tế
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const facilityId = userInfo.facilityId;
      
      if (facilityId) {
        // Sử dụng API mfBloodRequestAPI để lấy dữ liệu từ database
        const bloodRequests = await mfBloodRequestAPI.getAllBloodRequests();
        // Map dữ liệu sang camelCase nếu cần
        const mapped = (bloodRequests || []).map(req => ({
          ...req,
          id: req.id || req.requestId,
          isEmergency: req.isEmergency ?? req.is_emergency,
          quantityRequested: req.quantityRequested ?? req.quantity_requested,
          requiredBy: req.requiredBy ?? req.required_by,
        }));
        console.log('receiveRequests:', mapped);
        setReceiveRequests(mapped);
      } else {
        setReceiveRequests([]);
      }

      // Lấy lịch sử hiến máu (giữ nguyên logic cũ)
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
      // TODO: Implement delete API for blood requests
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
      await mfBloodRequestAPI.deleteBloodRequest(requestId);
      message.success('Đã hủy yêu cầu nhận máu');
      fetchAllRequests();
    } catch (error) {
      console.error('Error canceling receive request:', error);
      message.error('Không thể hủy yêu cầu nhận máu');
    }
  };

  const getStatusText = (status, isEmergency) => {
    if (isEmergency) {
      return 'Khẩn cấp';
    }
    switch (status) {
      case 'PENDING': return 'Chờ xác nhận';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'REJECTED': return 'Từ chối';
      case 'COMPLETED': return 'Hoàn thành';
      default: return status || 'Chờ xác nhận';
    }
  };

  const getStatusColor = (status, isEmergency) => {
    if (isEmergency) return 'red';
    switch (status) {
      case 'PENDING': return 'gold';
      case 'CONFIRMED': return 'blue';
      case 'REJECTED': return 'red';
      case 'COMPLETED': return 'green';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch {
      return dateString;
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
        <Title level={2} className="history-title">
          Lịch sử yêu cầu máu
        </Title>

        <div className="appointment-list">
          {receiveRequests.length > 0 ? (
            receiveRequests.map((req) => (
              <div key={req.id || req.requestId} className="appointment-card">
                <div className="card-left">
                  <div className="blood-drop-icon">🩸</div>
                  <Text strong>Nhận máu</Text>
                </div>
                <div className="card-main">
                  <Text className="location-title" style={{fontWeight: 'normal', fontSize: 18}}>
                    Mã yêu cầu: {req.id || req.requestId}
                  </Text>
                  <Text className="appointment-details">
                    Ngày yêu cầu: {formatDate(req.requiredBy)}
                  </Text>
                  <Text className="appointment-details">
                    Số lượng yêu cầu: {req.quantityRequested || '-'} ml
                  </Text>
                  <Text className="appointment-details">
                    Tình trạng: {req.isEmergency ? (
                      <span style={{ color: 'red', fontWeight: 'bold' }}>Khẩn cấp</span>
                    ) : (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>Bình thường</span>
                    )}
                  </Text>
                  <Text className="appointment-details">
                    Trạng thái: <span style={{ color: getStatusColor(req.requestStatus, req.isEmergency) === 'green' ? '#52c41a' : 
                                               getStatusColor(req.requestStatus, req.isEmergency) === 'red' ? '#ff4d4f' : 
                                               getStatusColor(req.requestStatus, req.isEmergency) === 'blue' ? '#1890ff' : '#faad14' }}>
                      {getStatusText(req.requestStatus, req.isEmergency)}
                    </span>
                  </Text>
                  {req.patientInfo && (
                    <Text className="appointment-details">
                      Thông tin: {req.patientInfo}
                    </Text>
                  )}
                </div>
                <div className="card-right">
                  <Button className="status-btn yellow-btn" onClick={() => handleCancelReceiveRequest(req.id || req.requestId)}>
                    Hủy yêu cầu
                  </Button>
                  <Link to={`/medical-facility/request-history/${req.id || req.requestId}`} className="details-link">
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
                  <Text className="location-title" style={{fontWeight: 'normal', fontSize: 18}}>
                    Mã đăng ký: {req.registerId}
                  </Text>
                  <Text className="appointment-details">
                    Ngày hẹn: {req.appointmentDate || '-'}
                  </Text>
                  <Text className="appointment-details">
                    Số lượng: {req.quantity || '-'} ml
                  </Text>
                  <Text className="appointment-details">
                    Trạng thái: <span style={{ color: req.status === 'confirmed' ? '#52c41a' : 
                                               req.status === 'cancelled' ? '#ff4d4f' : '#faad14' }}>
                      {req.status === 'confirmed' ? 'Đã xác nhận' : 
                       req.status === 'cancelled' ? 'Đã hủy' : 'Chờ xác nhận'}
                    </span>
                  </Text>
                </div>
                <div className="card-right">
                  {req.status === 'cancelled' ? (
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