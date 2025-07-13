import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../../components/user/Header';
import Footer from '../../../components/user/Footer';
import { donorAPI } from '../../../services/api';
import { Typography, Tag, Button, Spin } from 'antd';
import './AppointmentDetail.css';
import { FileTextOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;

export default function AppointmentDetail() {
  const [userInfo, setUserInfo] = useState({});
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointmentType, setAppointmentType] = useState(null); // 'donation_register' or 'matching_blood'
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const profile = await donorAPI.getProfile();
        setUserInfo(profile || {});

        // Try to fetch appointment detail from both endpoints
        let appointmentData = null;
        let type = null;

        // First try matching blood detail
        try {
          const matchingDetail = await donorAPI.getMatchingDetail(id);
          if (matchingDetail && matchingDetail.matchingId) {
            appointmentData = matchingDetail;
            type = 'matching_blood';
          }
        } catch (error) {
          console.log('Not a matching blood appointment, trying donation register...');
        }

        // If not found in matching blood, try donation register
        if (!appointmentData) {
          try {
            const donationDetail = await donorAPI.getDonationDetail(id);
            if (donationDetail) {
              appointmentData = donationDetail;
              type = 'donation_register';
            }
          } catch (error) {
            console.log('Not a donation register appointment either');
          }
        }

        setAppointment(appointmentData);
        setAppointmentType(type);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="detail-page-container">
        <Header />
        <div className="detail-content">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '20px' }}>Đang tải chi tiết lịch hẹn...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="detail-page-container">
        <Header />
        <div className="detail-content">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Text>Không tìm thấy lịch hẹn hoặc bạn không có quyền xem.</Text>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Format giới tính
  const renderGender = (gender) => {
    if (!gender) return '-';
    if (gender.toLowerCase() === 'male') return 'Nam';
    if (gender.toLowerCase() === 'female') return 'Nữ';
    return gender;
  };

  // Format nhóm máu
  const renderBloodGroup = (bloodGroup) => {
    if (!bloodGroup) return '-';
    return bloodGroup.replace('positive', '+').replace('negative', '-');
  };

  // Trạng thái hiển thị
  const getStatusText = (status, donationStatus) => {
    if (appointmentType === 'matching_blood') {
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

  // Màu trạng thái
  const getStatusColor = (status, donationStatus) => {
    if (appointmentType === 'matching_blood') {
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

  const renderDate = (date) => {
    if (!date) return '-';
    return moment(date).format('DD/MM/YYYY');
  };

  const renderTime = (date) => {
    if (!date) return '-';
    return moment(date).format('HH:mm');
  };

  const renderDateTime = (date) => {
    if (!date) return '-';
    return moment(date).format('DD/MM/YYYY HH:mm');
  };

  const statusText = getStatusText(appointment.status, appointment.donationStatus);
  const statusColor = getStatusColor(appointment.status, appointment.donationStatus);

  return (
    <div className="detail-page-container">
      <Header />
      <div className="detail-content">
        <Title level={2} className="detail-title">
          {appointmentType === 'matching_blood' ? 'Chi tiết lịch hẹn hiến máu khẩn cấp' : 'Chi tiết lịch hẹn hiến máu'}
        </Title>
        <Text className="detail-status">
          Trạng thái: <Tag color={statusColor}>{statusText}</Tag>
        </Text>
        
        <div className="info-card">
          <Title level={4} className="info-card-title">Thông tin cá nhân</Title>
          <div className="info-grid">
            <div className="info-row"><Text className="info-label">Họ và tên:</Text> <Text className="info-value">{userInfo.fullName}</Text></div>
            <div className="info-row"><Text className="info-label">Ngày sinh:</Text> <Text className="info-value">{userInfo.dateOfBirth}</Text></div>
            <div className="info-row"><Text className="info-label">Giới tính:</Text> <Text className="info-value">{renderGender(userInfo.gender)}</Text></div>
            <div className="info-row"><Text className="info-label">Cân nặng:</Text> <Text className="info-value">{userInfo.weight || '-'}</Text></div>
            <div className="info-row"><Text className="info-label">Nghề nghiệp:</Text> <Text className="info-value">{userInfo.job}</Text></div>
            <div className="info-row"><Text className="info-label">Nhóm máu:</Text> <Text className="info-value">{renderBloodGroup(userInfo.bloodGroup)}</Text></div>
            <div className="info-row"><Text className="info-label">Địa chỉ:</Text> <Text className="info-value">{userInfo.address}</Text></div>
            <div className="info-row"><Text className="info-label">Điện thoại:</Text> <Text className="info-value">{userInfo.phone}</Text></div>
            <div className="info-row"><Text className="info-label">Email:</Text> <Text className="info-value">{userInfo.email}</Text></div>
          </div>
        </div>

        <div className="info-card">
          <Title level={4} className="info-card-title">Thông tin hiến máu</Title>
          <div className="info-grid">
            {appointmentType === 'matching_blood' ? (
              <>
                <div className="info-row"><Text className="info-label">Ngày hiến máu:</Text> <Text className="info-value">{renderDate(appointment.arrivalTime)}</Text></div>
                <div className="info-row"><Text className="info-label">Địa điểm:</Text> <Text className="info-value">{appointment.address || 'Không xác định'}</Text></div>
                <div className="info-row"><Text className="info-label">Khung giờ:</Text> <Text className="info-value">{renderTime(appointment.arrivalTime)}</Text></div>
                <div className="info-row"><Text className="info-label">Lượng máu đã hiến:</Text> <Text className="info-value">{appointment.quantityMl ? `${appointment.quantityMl} ml` : '-'}</Text></div>
                <div className="info-row"><Text className="info-label">Ghi chú:</Text> <Text className="info-value">{appointment.notes || '-'}</Text></div>
                <div className="info-row"><Text className="info-label">Tên cơ sở y tế:</Text> <Text className="info-value">{appointment.facilityName || 'Không xác định'}</Text></div>
                <div className="info-row"><Text className="info-label">Số điện thoại cơ sở:</Text> <Text className="info-value">{appointment.phone || '-'}</Text></div>
                <div className="info-row"><Text className="info-label">Email cơ sở:</Text> <Text className="info-value">{appointment.email || '-'}</Text></div>
                <div className="info-row"><Text className="info-label">Thời gian tạo:</Text> <Text className="info-value">{renderDateTime(appointment.createdAt)}</Text></div>
                {appointment.responseTime && (
                  <div className="info-row"><Text className="info-label">Thời gian phản hồi:</Text> <Text className="info-value">{renderDateTime(appointment.responseTime)}</Text></div>
                )}
                {appointment.notificationSentAt && (
                  <div className="info-row"><Text className="info-label">Thời gian thông báo:</Text> <Text className="info-value">{renderDateTime(appointment.notificationSentAt)}</Text></div>
                )}
              </>
            ) : (
              <>
            <div className="info-row"><Text className="info-label">Ngày hiến máu:</Text> <Text className="info-value">{appointment.appointmentDate || '-'}</Text></div>
            <div className="info-row"><Text className="info-label">Địa điểm:</Text> <Text className="info-value">{appointment.address || '466 Nguyễn Thị Minh Khai Phường 02, Quận 3, Tp Hồ Chí Minh'}</Text></div>
            <div className="info-row"><Text className="info-label">Khung giờ:</Text> <Text className="info-value">{appointment.donationTimeSlot || appointment.timeSlot || '-'}</Text></div>
                <div className="info-row"><Text className="info-label">Lượng máu đã hiến:</Text> <Text className="info-value">{appointment.quantityMl || appointment.quantity_ml || '-'}</Text></div>
                <div className="info-row"><Text className="info-label">Ghi chú:</Text> <Text className="info-value">{appointment.staffNotes || appointment.staff_notes || '-'}</Text></div>
                {/* Bỏ dòng cân nặng ở đây */}
              </>
            )}
          </div>
        </div>

        {appointmentType === 'matching_blood' && appointment.bloodGroup && (
          <div className="info-card">
            <Title level={4} className="info-card-title">Thông tin yêu cầu máu</Title>
            <div className="info-grid">
              <div className="info-row"><Text className="info-label">Nhóm máu cần:</Text> <Text className="info-value">{renderBloodGroup(appointment.bloodGroup)}</Text></div>
              <div className="info-row"><Text className="info-label">Lượng máu yêu cầu:</Text> <Text className="info-value">{appointment.quantityRequested ? `${appointment.quantityRequested} ml` : '-'}</Text></div>
              <div className="info-row"><Text className="info-label">Khẩn cấp:</Text> <Text className="info-value">{appointment.isEmergency ? 'Có' : 'Không'}</Text></div>
              <div className="info-row"><Text className="info-label">Thông tin bệnh nhân:</Text> <Text className="info-value">{appointment.patientInfo || '-'}</Text></div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
} 