import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Footer from '../../../components/user/Footer';
import MedicalFacilityHeader from '../../../components/user/MedicalFacilityHeader';
import { mfBloodRequestAPI } from '../../../services/api';
import { Typography, Tag, Spin } from 'antd';
import './RequestDetail.css';
import EmergencyProcess from './EmergencyProcess';

const { Title, Text } = Typography;

function getStatusText(request) {
  if (request.emergencyStatus) {
    if (request.emergencyStatus === 'pending') return { text: 'Chờ liên hệ', color: '#faad14' };
    if (request.emergencyStatus === 'contacting') return { text: 'Đang liên hệ', color: '#1890ff' };
    if (request.emergencyStatus === 'completed') return { text: 'Hoàn thành', color: '#52c41a' };
  }
  if (request.requestStatus === 'confirmed' && request.processingStatus) {
    if (request.processingStatus === 'pending') return { text: 'Đang xử lí', color: '#faad14' };
    if (request.processingStatus === 'in transit') return { text: 'Đang vận chuyển', color: '#1890ff' };
    if (request.processingStatus === 'completed') return { text: 'Hoàn thành', color: '#52c41a' };
  }
  if (request.requestStatus === 'pending') return { text: 'Chờ xác nhận', color: '#faad14' };
  if (request.requestStatus === 'confirmed') return { text: 'Xác nhận', color: '#1890ff' };
  if (request.requestStatus === 'rejected') return { text: 'Từ chối', color: '#ff4d4f' };
  return { text: request.requestStatus || '-', color: '#888' };
}

function renderBloodGroup(abo, rh) {
  if (!abo) return '-';
  if (!rh) return abo;
  return `${abo}${rh === 'positive' ? '+' : rh === 'negative' ? '-' : ''}`;
}

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matchingList, setMatchingList] = useState([]);

  useEffect(() => {
    mfBloodRequestAPI.getBloodRequestById(id)
      .then(data => setRequest(data))
      .catch(() => setRequest(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (request && request.isEmergency) {
      mfBloodRequestAPI.getEmergencyProcessByRequestId(id)
        .then(data => setMatchingList(Array.isArray(data) ? data : []))
        .catch(() => setMatchingList([]));
    }
  }, [id, request]);

  if (loading) {
    return (
      <div className="detail-page-container">
        <MedicalFacilityHeader />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" /> Đang tải chi tiết yêu cầu máu...
        </div>
        <Footer />
      </div>
    );
  }
  if (!request) {
    return (
      <div className="detail-page-container">
        <MedicalFacilityHeader />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Text>Không tìm thấy yêu cầu máu hoặc bạn không có quyền xem.</Text>
        </div>
        <Footer />
      </div>
    );
  }

  const status = getStatusText(request);

  return (
    <div className="detail-page-container">
      <MedicalFacilityHeader />
      <div className="detail-content">
        <Title level={2} className="detail-title">Chi tiết yêu cầu máu</Title>
        <div className="detail-status">
          <Text strong>Trạng thái: </Text>
          <Tag color={status.color}>{status.text}</Tag>
        </div>
        {/* Bảng thông tin cơ sở y tế */}
        <div className="info-card" style={{ marginBottom: 32 }}>
          <Title level={4} className="info-card-title">Thông tin cơ sở y tế</Title>
          <div className="info-grid">
            <div className="info-row"><span className="info-label">Tên cơ sở y tế:</span> <span className="info-value">{request.facilityName || '-'}</span></div>
            <div className="info-row"><span className="info-label">Người liên hệ:</span> <span className="info-value">{request.contactPerson || '-'}</span></div>
            <div className="info-row"><span className="info-label">Địa chỉ:</span> <span className="info-value">{request.facilityAddress || '-'}</span></div>
            <div className="info-row"><span className="info-label">Số điện thoại liên hệ:</span> <span className="info-value">{request.contactPhone || '-'}</span></div>
            <div className="info-row"><span className="info-label">Điện thoại bàn:</span> <span className="info-value">{request.facilityPhone || '-'}</span></div>
            <div className="info-row"><span className="info-label">Email:</span> <span className="info-value">{request.facilityEmail || '-'}</span></div>
          </div>
        </div>
        {/* Bảng thông tin yêu cầu máu */}
        <div className="info-card" style={{ marginBottom: 32 }}>
          <Title level={4} className="info-card-title">Thông tin yêu cầu máu</Title>
          <div className="info-grid">
            <div className="info-row"><span className="info-label">Ngày yêu cầu:</span> <span className="info-value">{request.requiredBy ? new Date(request.requiredBy).toLocaleDateString() : '-'}</span></div>
            <div className="info-row"><span className="info-label">Nhóm máu yêu cầu:</span> <span className="info-value">{renderBloodGroup(request.bloodGroupAboType, request.bloodGroupRhFactor)}</span></div>
            <div className="info-row"><span className="info-label">Số lượng máu yêu cầu:</span> <span className="info-value">{request.quantityRequested ? request.quantityRequested + ' ml' : '-'}</span></div>
            <div className="info-row"><span className="info-label">Yêu cầu tương hợp:</span> <span className="info-value">{request.isCompatible ? 'Có' : 'Không'}</span></div>
            <div className="info-row"><span className="info-label">Ghi chú:</span> <span className="info-value">{request.specialRequirements || '-'}</span></div>
            <div className="info-row">
              <span className="info-label">Mức độ:</span>
              <span className="info-value" style={{ color: request.isEmergency ? '#ff4d4f' : '#52c41a', fontWeight: 500 }}>
                {request.isEmergency ? 'Khẩn cấp' : 'Bình thường'}
                {request.isEmergency && matchingList.length > 0 && (
                  <Link to={`/medical-facility/request-history/${request.id || request.requestId}/emergency-process`} style={{ marginLeft: 16, color: '#1890ff', fontWeight: 400 }}>
                    Xem quá trình khẩn cấp
                  </Link>
                )}
              </span>
            </div>
            {request.patientInfo && <div className="info-row"><span className="info-label">Tình trạng khẩn cấp:</span> <span className="info-value">{request.patientInfo}</span></div>}
          </div>
        </div>
        {/* Bảng thông tin nhận máu */}
        <div className="info-card" style={{ marginBottom: 32 }}>
          <Title level={4} className="info-card-title">Thông tin nhận máu</Title>
          <div className="info-grid">
            <div className="info-row"><span className="info-label">Nhóm máu nhận:</span> <span className="info-value">{request.bloodFullfilled || '-'}</span></div>
            <div className="info-row"><span className="info-label">Lượng máu nhận:</span> <span className="info-value">{request.bloodFullfilled || '-'}</span></div>
            <div className="info-row"><span className="info-label">Người vận chuyển:</span> <span className="info-value">{request.deliveryPerson || '-'}</span></div>
            <div className="info-row"><span className="info-label">Ghi chú của nhân viên:</span> <span className="info-value">{request.notes || '-'}</span></div>
          </div>
        </div>
        <div className="back-button-container">
          <button className="back-btn" onClick={() => navigate('/medical-facility/request-history')}>
            Quay lại Lịch sử
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RequestDetail; 