import React, { useState, useEffect } from "react";
import './BloodCheckDetail.css';
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import { useParams } from 'react-router-dom';
import bloodCheckService from '../../services/bloodCheckService';

const STATUS_MAPPING = {
  'pending': 'Chờ xét nghiệm',
  'approved': 'Đạt chuẩn',
  'rejected': 'Không đạt chuẩn'
};

function mapBloodCheckDetail(data) {
  return {
    bloodCheckId: data.bloodCheckId || '-',
    donorName: data.donorName || '-',
    aboType: data.aboType || '',
    rhFactor: data.rhFactor || '',
    quantityMl: data.quantityMl || '-',
    appointmentDate: data.appointmentDate || '',
    startTime: data.startTime || '',
    endTime: data.endTime || '',
    staffName: data.staffName || '-',
    status: STATUS_MAPPING[data.status] || data.status || '-',
    notes: data.notes || ''
  };
}

export default function BloodCheckDetail() {
  const { id } = useParams();
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [bloodCheck, setBloodCheck] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isStatusUpdated, setIsStatusUpdated] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const data = await bloodCheckService.getBloodCheckById(id);
        const mapped = mapBloodCheckDetail(data);
        setBloodCheck(mapped);
        setEditNotes(mapped.notes || '');
        if (mapped.status && mapped.status !== 'Chờ xét nghiệm') {
          setIsStatusUpdated(true);
          setSelectedStatus(mapped.status);
        } else {
          setIsStatusUpdated(false);
        }
      } catch (e) {
        setBloodCheck(null);
        setIsStatusUpdated(false);
      }
    }
    fetchDetail();
  }, [id]);

  const getBloodGroup = (aboType, rhFactor) => {
    if (!aboType || !rhFactor) return '';
    const rhSymbol = rhFactor.toLowerCase() === 'positive' ? '+' : rhFactor.toLowerCase() === 'negative' ? '-' : rhFactor;
    return aboType + rhSymbol;
  };

  const getAppointmentTime = (appointmentDate, startTime, endTime) => {
    if (!appointmentDate) return '';
    const dateStr = new Date(appointmentDate).toLocaleDateString('vi-VN');
    if (startTime && endTime) {
      const formatTime = (time) => time ? time.toString().substring(0, 5) : '';
      return dateStr + ', ' + formatTime(startTime) + ' - ' + formatTime(endTime);
    }
    return dateStr;
  };

  // Xử lý chọn trạng thái
  const handleStatusChange = (status) => {
    if (!isStatusUpdated) {
      setSelectedStatus(status);
    }
  };

  // Hàm cập nhật trạng thái và ghi chú
  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      setToast({ show: true, type: 'error', message: 'Vui lòng chọn trạng thái!' });
      return;
    }
    try {
      let backendStatus = '';
      if (selectedStatus === 'Đạt chuẩn') backendStatus = 'approved';
      else if (selectedStatus === 'Không đạt chuẩn') backendStatus = 'rejected';
      else backendStatus = 'pending';
      // Lấy staffId từ localStorage
      let staffId = null;
      try {
        const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(localStorage.getItem('admin'));
        staffId = user?.id;
      } catch {}
      await bloodCheckService.updateBloodCheck(id, { status: backendStatus, notes: editNotes, staffId });
      setToast({ show: true, type: 'success', message: `Đã cập nhật trạng thái: ${selectedStatus}` });
      setIsStatusUpdated(true);
      const data = await bloodCheckService.getBloodCheckById(id);
      const mapped = mapBloodCheckDetail(data);
      setBloodCheck(mapped);
      setSelectedStatus(mapped.status);
      setEditNotes(mapped.notes || '');
      setIsEditing(false);
    } catch (e) {
      setToast({ show: true, type: 'error', message: 'Cập nhật trạng thái thất bại!' });
    }
  };

  // Ẩn toast sau 2.5s
  useEffect(() => {
    if (toast.show) {
      const t = setTimeout(() => setToast({ ...toast, show: false }), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  if (!bloodCheck) {
    return (
      <div className="blood-check-detail-root">
        <Header />
        <div className="dashboard-main">
          <Sidebar />
          <main>
            <h2 className="blood-check-detail-title">Chi tiết kiểm tra máu</h2>
            <div style={{textAlign:'center',color:'#888',padding:'32px'}}>Không tìm thấy thông tin kiểm tra máu</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="blood-check-detail-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main>
          <h2 className="blood-check-detail-title">Chi tiết kiểm tra máu</h2>
          <div className="blood-check-detail-content">
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div className="blood-check-detail-table">
                  <div className="blood-check-detail-section-title">Thông tin kiểm tra máu</div>
                  <table>
                    <tbody>
                      <tr><td>Mã kiểm tra máu :</td><td>{bloodCheck.bloodCheckId}</td></tr>
                      <tr><td>Người hiến máu :</td><td>{bloodCheck.donorName}</td></tr>
                      <tr><td>Nhóm máu :</td><td>{getBloodGroup(bloodCheck.aboType, bloodCheck.rhFactor)}</td></tr>
                      <tr><td>Số lượng máu (ml) :</td><td>{bloodCheck.quantityMl}</td></tr>
                      <tr><td>Ngày và giờ hẹn :</td><td>{getAppointmentTime(bloodCheck.appointmentDate, bloodCheck.startTime, bloodCheck.endTime)}</td></tr>
                      <tr><td>Nhân viên phụ trách :</td><td>{bloodCheck.staffName}</td></tr>
                      <tr>
                        <td>Trạng thái :</td>
                        <td>
                          <span style={{
                            color: bloodCheck.status === 'Đạt chuẩn' ? '#059669' : bloodCheck.status === 'Chờ xét nghiệm' ? '#f59e0b' : bloodCheck.status === 'Không đạt chuẩn' ? '#dc2626' : '#6b7280',
                            fontWeight: 600
                          }}>
                            {bloodCheck.status}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                <div className="blood-check-detail-table" style={{ marginTop: 24, maxWidth: 380, width: '100%', marginLeft: 'auto', marginRight: 'auto', padding: '12px 0' }}>
                  <div className="blood-check-detail-section-title">Cập nhật trạng thái xét nghiệm</div>
                  <div style={{ padding: '16px' }}>
                    <label className="form-label" style={{ fontWeight: '500', marginBottom: '12px', color: '#374151', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center', display: 'block' }}>
                      Cập nhật trạng thái
                    </label>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '18px' }}>
                      <div
                        onClick={() => handleStatusChange('Đạt chuẩn')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px 12px',
                          borderRadius: '10px',
                          border: selectedStatus === 'Đạt chuẩn' ? '2px solid #059669' : '2px solid #e5e7eb',
                          backgroundColor: selectedStatus === 'Đạt chuẩn' ? '#f0fdf4' : '#ffffff',
                          cursor: isStatusUpdated ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          minWidth: '90px',
                          boxShadow: selectedStatus === 'Đạt chuẩn' ? '0 2px 8px rgba(5, 150, 105, 0.10)' : '0 1px 2px rgba(0, 0, 0, 0.03)',
                          userSelect: 'none',
                          opacity: isStatusUpdated && selectedStatus !== 'Đạt chuẩn' ? 0.5 : 1
                        }}
                      >
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: selectedStatus === 'Đạt chuẩn' ? '#059669' : '#e5e7eb',
                          marginRight: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease-in-out'
                        }}>
                          {selectedStatus === 'Đạt chuẩn' && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                              <polyline points="20,6 9,17 4,12"></polyline>
                            </svg>
                          )}
                        </div>
                        <span style={{
                          color: selectedStatus === 'Đạt chuẩn' ? '#059669' : '#6b7280',
                          fontWeight: '500',
                          fontSize: '14px'
                        }}>
                          Đạt chuẩn
                        </span>
                      </div>
                      <div
                        onClick={() => handleStatusChange('Không đạt chuẩn')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px 12px',
                          borderRadius: '10px',
                          border: selectedStatus === 'Không đạt chuẩn' ? '2px solid #dc2626' : '2px solid #e5e7eb',
                          backgroundColor: selectedStatus === 'Không đạt chuẩn' ? '#fef2f2' : '#ffffff',
                          cursor: isStatusUpdated ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          minWidth: '90px',
                          boxShadow: selectedStatus === 'Không đạt chuẩn' ? '0 2px 8px rgba(220, 38, 38, 0.10)' : '0 1px 2px rgba(0, 0, 0, 0.03)',
                          userSelect: 'none',
                          opacity: isStatusUpdated && selectedStatus !== 'Không đạt chuẩn' ? 0.5 : 1
                        }}
                      >
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: selectedStatus === 'Không đạt chuẩn' ? '#dc2626' : '#e5e7eb',
                          marginRight: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease-in-out'
                        }}>
                          {selectedStatus === 'Không đạt chuẩn' && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                              <path d="M18 6L6 18M6 6l12 12"></path>
                            </svg>
                          )}
                        </div>
                        <span style={{
                          color: selectedStatus === 'Không đạt chuẩn' ? '#dc2626' : '#6b7280',
                          fontWeight: '500',
                          fontSize: '14px'
                        }}>
                          Không đạt chuẩn
                        </span>
                      </div>
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <div className="notes-label">Ghi chú</div>
                      <textarea
                        value={editNotes}
                        onChange={e => setEditNotes(e.target.value)}
                        placeholder="Nhập ghi chú..."
                        className="notes-textarea"
                        disabled={isStatusUpdated}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                      {!isStatusUpdated ? (
                        <button
                          onClick={handleStatusUpdate}
                          className="btn-confirm"
                          style={{ minWidth: 120 }}
                        >
                          Cập nhật
                        </button>
                      ) : (
                        <div style={{
                          padding: '14px 32px',
                          borderRadius: '12px',
                          backgroundColor: '#f0f9ff',
                          color: '#0369a1',
                          fontWeight: '600',
                          fontSize: '14px',
                          border: '2px solid #7dd3fc',
                          textAlign: 'center',
                          minWidth: '200px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}>
                          <span>✓</span>
                          <span>Trạng thái đã được cập nhật</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {toast.show && (
        <div className={`custom-toast ${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
} 