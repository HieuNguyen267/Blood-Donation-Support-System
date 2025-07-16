import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MedicalFacilityHeader from '../../../components/user/MedicalFacilityHeader';
import Footer from '../../../components/user/Footer';
import { mfBloodRequestAPI } from '../../../services/api';
import { Spin, Tag, Modal, message } from 'antd';
import './EmergencyProcess.css';

export default function EmergencyProcess() {
  const { id: requestId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [acceptedDonorsList, setAcceptedDonorsList] = useState([]);
  const [requestDetail, setRequestDetail] = useState(null);
  const [summary, setSummary] = useState(null);
  const [editModal, setEditModal] = useState({ open: false, matching: null, value: '' });

  // Lấy danh sách matching accepted (contact_successful, completed)
  useEffect(() => {
    if (!requestId) return;
    if (typeof mfBloodRequestAPI.getAcceptedMatchingByRequestId === 'function') {
      mfBloodRequestAPI.getAcceptedMatchingByRequestId(requestId)
        .then(setAcceptedDonorsList)
        .catch(() => setAcceptedDonorsList([]));
    }
  }, [requestId]);

  // Lấy chi tiết đơn yêu cầu máu
  useEffect(() => {
    if (!requestId) return;
    if (typeof mfBloodRequestAPI.getRequestById === 'function') {
      mfBloodRequestAPI.getRequestById(requestId)
        .then(setRequestDetail)
        .catch(() => setRequestDetail(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [requestId]);

  // Lấy thống kê máu từ API summary mới
  useEffect(() => {
    if (!requestId) return;
    mfBloodRequestAPI.getBloodRequestSummaryById(requestId)
      .then(setSummary)
      .catch(() => setSummary(null));
  }, [requestId]);

  const handleOpenEditModal = (matching) => {
    setEditModal({ open: true, matching, value: matching.quantityMl || '' });
  };

  const handleUpdateQuantity = async () => {
    const { matching, value } = editModal;
    if (!value || isNaN(value) || value <= 0) {
      message.error('Vui lòng nhập số lượng hợp lệ!');
      return;
    }
    try {
      await mfBloodRequestAPI.updateMatchingBloodQuantity(matching.matchingId, Number(value));
      message.success('Cập nhật thành công!');
      setEditModal({ open: false, matching: null, value: '' });
      // Reload lại danh sách accepted donors
      mfBloodRequestAPI.getAcceptedMatchingByRequestId(requestId)
        .then(setAcceptedDonorsList)
        .catch(() => setAcceptedDonorsList([]));
    } catch (err) {
      message.error('Cập nhật thất bại!');
    }
  };

  const handleConfirmCompleted = async (matching) => {
    try {
      await mfBloodRequestAPI.confirmMatchingBloodCompleted(matching.matchingId);
      message.success('Xác nhận thành công!');
      mfBloodRequestAPI.getAcceptedMatchingByRequestId(requestId)
        .then(setAcceptedDonorsList)
        .catch(() => setAcceptedDonorsList([]));
    } catch (err) {
      message.error('Xác nhận thất bại!');
    }
  };

  // Thêm hàm hoàn thành quá trình khẩn cấp
  const handleCompleteEmergency = async () => {
    try {
      await mfBloodRequestAPI.completeEmergencyProcess(requestId);
      message.success('Đã hoàn thành quá trình khẩn cấp!');
      // Reload lại trang để lấy dữ liệu mới nhất
      window.location.reload();
    } catch (err) {
      message.error('Thao tác thất bại!');
    }
  };

  // Hàm format trạng thái
  const formatStatus = (status) => {
    if (!status) return <Tag color="default">-</Tag>;
    switch (status) {
      case 'contacting': return <Tag color="orange">Đang liên hệ</Tag>;
      case 'contact_successful': return <Tag color="green">Liên hệ thành công</Tag>;
      case 'completed': return <Tag color="blue">Hoàn thành</Tag>;
      case 'rejected': return <Tag color="red">Từ chối</Tag>;
      default: return <Tag color="default">{status}</Tag>;
    }
  };

  // Hàm tính tuổi từ ngày sinh
  const calcAge = (dob) => {
    if (!dob) return '';
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  // Hàm format nhóm máu
  const formatBloodGroup = (abo, rh) => {
    if (!abo || !rh) return '';
    return abo + (rh === 'positive' || rh === '+' ? '+' : rh === 'negative' || rh === '-' ? '-' : rh);
  };

  // Hàm parse tổng máu đã gửi từ chuỗi bloodFullfilled (O+: 100 ml, ...)
  function parseBloodFullfilled(str) {
    if (!str) return 0;
    // Ví dụ: "O+: 100 ml, A-: 100 ml"
    return str.split(',').reduce((sum, part) => {
      const match = part.match(/(\d+)\s*ml/);
      if (match) {
        return sum + parseInt(match[1], 10);
      }
      return sum;
    }, 0);
  }

  // Thay thế các biến thống kê bằng dữ liệu từ summary
  const totalAccepted = summary?.totalAccepted || 0;
  const totalAcceptedBlood = summary?.totalAcceptedBlood || 0;
  const totalBloodFullfilled = summary?.totalBloodFullfilled || 0;
  const totalBlood = summary?.totalBlood || 0;
  const quantityRequested = summary?.quantityRequested || 0;
  const remainingNeeded = summary?.remainingNeeded || 0;
  const progressPercent = summary?.progressPercent || 0;

  // Debug trạng thái
  console.log('DEBUG requestDetail:', requestDetail);
  const emergencyStatus = requestDetail?.emergencyStatus || requestDetail?.emergency_status;
  console.log('DEBUG emergencyStatus:', emergencyStatus);

  return (
    <div className="emergency-process-root">
      <MedicalFacilityHeader />
      <div className="emergency-process-content" style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
        <h2 style={{ textAlign: 'center', color: '#c80000' }}>Quá trình yêu cầu máu khẩn cấp</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}><Spin /> Đang tải quá trình khẩn cấp...</div>
        ) : null}

        {/* Bảng tiến độ */}
        <div className="card bg-light mb-4" style={{ maxWidth: 600, margin: '0 auto' }}>
          <div className="card-body text-center">
            <h6 className="text-muted">Tiến độ</h6>
            <div className="progress mb-2" style={{ height: 18, borderRadius: 8 }}>
              <div 
                className="progress-bar bg-success" 
                style={{width: `${progressPercent}%`, fontWeight: 600, fontSize: 14}}
              ></div>
            </div>
            <div>
              <span className="text-success fw-bold" style={{ fontSize: 18 }}>{totalBlood} ml</span> / {quantityRequested} ml
            </div>
            {remainingNeeded > 0 && (
              <div className="mt-2">
                <span className="text-danger" style={{ fontSize: 16 }}>Còn thiếu: {remainingNeeded} ml</span>
              </div>
            )}
          </div>
        </div>

        {/* Bảng người hiến đã đồng ý */}
        <div className="card p-3 mb-3">
          <h5 className="text-primary">🩸 Những người hiến đã đồng ý</h5>
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead className="table-light">
                <tr>
                  <th className="text-center">STT</th>
                  <th className="text-center">Họ và tên</th>
                  <th className="text-center">Nhóm máu</th>
                  <th className="text-center">Tuổi</th>
                  <th className="text-center">SĐT</th>
                  <th className="text-center">Địa chỉ</th>
                  <th className="text-center">Thời điểm phản hồi</th>
                  <th className="text-center">Số lượng (ml)</th>
                  <th className="text-center">Thời điểm đến</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {acceptedDonorsList.length > 0 ? acceptedDonorsList.map((d, idx) => {
                  // Format nhóm máu
                  const bloodGroup = d.aboType + (d.rhFactor === 'positive' || d.rhFactor === '+' ? '+' : d.rhFactor === 'negative' || d.rhFactor === '-' ? '-' : '');
                  // Tính tuổi
                  const calcAge = (dob) => {
                    if (!dob) return '';
                    const birth = new Date(dob);
                    const today = new Date();
                    let age = today.getFullYear() - birth.getFullYear();
                    const m = today.getMonth() - birth.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
                    return age;
                  };
                  // Format trạng thái
                  let statusLabel = null;
                  if (d.status === 'contact_successful') statusLabel = <span style={{color:'#1890ff', fontWeight:600}}>Liên hệ thành công</span>;
                  else if (d.status === 'completed') statusLabel = <span style={{color:'#52c41a', fontWeight:600}}>Hoàn thành</span>;
                  else statusLabel = <span>{d.status}</span>;
                  // Hành động
                  let actionCell = null;
                  if (d.status === 'completed') {
                    actionCell = <span style={{color:'#52c41a', fontWeight:600}}>Đã cập nhật số lượng</span>;
                  } else if (d.status === 'contact_successful') {
                    actionCell = <>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleOpenEditModal(d)}>
                        Nhập lượng máu
                      </button>
                      <button className="btn btn-sm btn-success" onClick={() => handleConfirmCompleted(d)}>
                        Xác nhận
                      </button>
                    </>;
                  }
                  return (
                    <tr key={d.matchingId || d.donorId || idx}>
                      <td className="text-center">{idx + 1}</td>
                      <td className="text-center">{d.fullName}</td>
                      <td className="text-center">{bloodGroup}</td>
                      <td className="text-center">{calcAge(d.dateOfBirth)}</td>
                      <td className="text-center">{d.phone}</td>
                      <td className="text-center">{d.address}</td>
                      <td className="text-center">{d.responseTime ? new Date(d.responseTime).toLocaleString('vi-VN') : '-'}</td>
                      <td className="text-center">{d.quantityMl || '-'}</td>
                      <td className="text-center">{d.arrivalTime ? new Date(d.arrivalTime).toLocaleString('vi-VN') : '-'}</td>
                      <td className="text-center">{statusLabel}</td>
                      <td className="text-center">{actionCell}</td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={11} className="text-center text-secondary">Không có người hiến đã đồng ý</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4 ô thống kê */}
        <div className="stat-cards-row" style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
          <div className="stat-card bg-primary-soft" style={{ flex: 1, minWidth: 0, borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 24, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="stat-icon" style={{ fontSize: 28, color: '#6c3eb6', marginBottom: 8 }}>👥</div>
            <div className="stat-info" style={{ textAlign: 'center' }}>
              <h6 style={{ fontWeight: 500, marginBottom: 8 }}>Tổng người chấp nhận</h6>
              <h4 style={{ fontWeight: 700, fontSize: 28 }}>{totalAccepted}</h4>
            </div>
          </div>
          <div className="stat-card bg-danger-soft" style={{ flex: 1, minWidth: 0, borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 24, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="stat-icon" style={{ fontSize: 28, color: '#e11d48', marginBottom: 8 }}>🩸</div>
            <div className="stat-info" style={{ textAlign: 'center' }}>
              <h6 style={{ fontWeight: 500, marginBottom: 8 }}>Tổng máu đã có</h6>
              <h4 style={{ fontWeight: 700, fontSize: 28 }}>{totalBlood} <small style={{ fontSize: 16 }}>ml</small></h4>
            </div>
          </div>
          <div className="stat-card bg-warning-soft" style={{ flex: 1, minWidth: 0, borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 24, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="stat-icon" style={{ fontSize: 28, color: '#f59e0b', marginBottom: 8 }}>⚠️</div>
            <div className="stat-info" style={{ textAlign: 'center' }}>
              <h6 style={{ fontWeight: 500, marginBottom: 8 }}>Còn thiếu</h6>
              <h4 style={{ fontWeight: 700, fontSize: 28 }}>{remainingNeeded} <small style={{ fontSize: 16 }}>ml</small></h4>
            </div>
          </div>
          <div className="stat-card bg-info-soft" style={{ flex: 1, minWidth: 0, borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 24, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="stat-icon" style={{ fontSize: 28, color: '#3b82f6', marginBottom: 8 }}>📈</div>
            <div className="stat-info" style={{ textAlign: 'center' }}>
              <h6 style={{ fontWeight: 500, marginBottom: 8 }}>Tiến độ</h6>
              <h4 style={{ fontWeight: 700, fontSize: 28 }}>{quantityRequested > 0 ? Math.round((totalBlood/quantityRequested)*100) : 0}<small style={{ fontSize: 16 }}>%</small></h4>
            </div>
          </div>
        </div>

        {/* Modal nhập lượng máu */}
        <Modal
          open={editModal.open}
          title="Nhập lượng máu"
          onCancel={() => setEditModal({ open: false, matching: null, value: '' })}
          onOk={handleUpdateQuantity}
          okText="Cập nhật"
          cancelText="Hủy"
        >
          <div>
            <label>Số lượng máu (ml):</label>
            <input
              type="number"
              min={0}
              value={editModal.value}
              onChange={e => setEditModal({ ...editModal, value: e.target.value })}
              style={{ width: '100%', marginTop: 8 }}
            />
          </div>
        </Modal>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          {emergencyStatus !== 'completed' && (
            <button
              className="complete-btn"
              style={{ marginRight: 16, background: '#1890ff', color: '#fff', padding: '8px 20px', borderRadius: 6, border: 'none', fontWeight: 600 }}
              onClick={handleCompleteEmergency}
            >
              Hoàn thành quá trình
            </button>
          )}
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Quay lại
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
} 