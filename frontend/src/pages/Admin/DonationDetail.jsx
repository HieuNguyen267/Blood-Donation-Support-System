import React, { useState } from "react";
import './DonationDetail.css';
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import { useParams } from 'react-router-dom';

const fallbackDonations = [
  { code: "A001", name: "Nguyễn Duy Hiếu", donateDate: "11/4/2024, 09:30", completeDate: "11/4/2024, 10:30", amount: "120 ml", status: "Xác nhận", blood: "Rh NULL" },
  { code: "A002", name: "Lữ Phước Nhật Tú", donateDate: "15/4/2024, 08:30", completeDate: "15/4/2024, 09:30", amount: "120 ml", status: "Chờ xác nhận", blood: "O-" },
  { code: "A003", name: "Nguyễn Gia Triệu", donateDate: "4/11/2025, 15:35", completeDate: "4/11/2025, 16:35", amount: "120 ml", status: "Xác nhận", blood: "O+" },
  { code: "A004", name: "Đậu Nguyễn Bảo Tuấn", donateDate: "27/5/2025, 10:30", completeDate: "27/5/2025, 11:30", amount: "120 ml", status: "Xác nhận", blood: "AB+" },
  { code: "A005", name: "Nguyễn Anh Khoa", donateDate: "27/5/2025, 10:45", completeDate: "27/5/2025, 11:45", amount: "120 ml", status: "Xác nhận", blood: "AB-" },
  { code: "A006", name: "Đoàn Nguyễn Thành Hòa", donateDate: "15/4/2024, 08:30", completeDate: "15/4/2024, 09:30", amount: "120 ml", status: "Từ chối", blood: "A+" },
  { code: "A007", name: "Nguyễn Tri Thông", donateDate: "15/4/2024, 08:30", completeDate: "15/4/2024, 09:30", amount: "120 ml", status: "Xác nhận", blood: "B-" },
  { code: "A008", name: "Nguyễn Văn Ớ", donateDate: "15/4/2024, 08:30", completeDate: "15/4/2024, 09:30", amount: "120 ml", status: "Từ chối", blood: "A-" },
  { code: "A009", name: "Nguyễn Công Chiến", donateDate: "27/5/2025, 10:45", completeDate: "27/5/2025, 11:45", amount: "120 ml", status: "Chờ xác nhận", blood: "B+" },
];

export default function DonationDetail() {
  const { id } = useParams();
  // Lấy danh sách đơn hiến từ localStorage nếu có, nếu không thì dùng fallback
  let donations = fallbackDonations;
  try {
    const local = localStorage.getItem('donations');
    if (local) donations = JSON.parse(local);
  } catch {}
  const donation = donations.find(d => d.code === id) || fallbackDonations[0];


  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [currentDonation, setCurrentDonation] = useState(donation);
  const [selectedStatus, setSelectedStatus] = useState('');
  // Khi id thay đổi, cập nhật currentDonation
  React.useEffect(() => { setCurrentDonation(donation); }, [id]);



  // Xử lý chọn trạng thái
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  // Hàm cập nhật trạng thái
  const handleStatusUpdate = () => {
    if (!selectedStatus) {
      setToast({ show: true, type: 'error', message: 'Vui lòng chọn trạng thái!' });
      return;
    }
    
    let donations = fallbackDonations;
    try {
      const local = localStorage.getItem('donations');
      if (local) donations = JSON.parse(local);
    } catch {}
    const idx = donations.findIndex(d => d.code === id);
    if (idx !== -1) {
      donations[idx] = { ...donations[idx], status: selectedStatus };
      localStorage.setItem('donations', JSON.stringify(donations));
      setCurrentDonation(donations[idx]);
      setToast({ show: true, type: 'success', message: `Đã cập nhật trạng thái: ${selectedStatus}` });
      setSelectedStatus(''); // Reset selection
    }
  };

  // Hàm lấy style cho trạng thái
  const getStatusStyle = (status) => {
    const styles = {
      'Xác nhận': { color: '#059669', fontWeight: '600' },
      'Chờ xác nhận': { color: '#f59e0b', fontWeight: '600' },
      'Từ chối': { color: '#dc2626', fontWeight: '600' }
    };
    return styles[status] || { color: '#6b7280', fontWeight: '600' };
  };

  // Ẩn toast sau 2.5s
  React.useEffect(() => {
    if (toast.show) {
      const t = setTimeout(() => setToast({ ...toast, show: false }), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="donation-detail-root">
          <h2 className="donation-detail-title">Chi tiết đơn hiến</h2>
          <div className="donation-detail-content">
            <div className="donation-detail-table">
              <div className="donation-detail-section-title">Thông tin đơn hiến</div>
              <table>
                <tbody>
                  <tr><td>Họ và tên :</td><td>{currentDonation.name}</td></tr>
                  <tr><td>Ngày và giờ hiến :</td><td>{currentDonation.donateDate}</td></tr>
                  <tr><td>Ngày và giờ hoàn thành :</td><td>{currentDonation.completeDate}</td></tr>
                  <tr><td>Số lượng (ml) :</td><td>{currentDonation.amount}</td></tr>
                  <tr><td>Trạng thái :</td><td style={getStatusStyle(currentDonation.status)}>{currentDonation.status}</td></tr>
                  <tr><td>Nhóm máu :</td><td>{currentDonation.blood}</td></tr>
                </tbody>
              </table>

            </div>
            
            {/* Bảng cập nhật trạng thái */}
            <div className="donation-detail-table" style={{marginTop: 24}}>
              <div className="donation-detail-section-title">Cập nhật trạng thái đơn hiến</div>
              <div style={{padding: '24px'}}>
                <label className="form-label" style={{
                  fontWeight: '500', 
                  marginBottom: '16px', 
                  color: '#374151',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  textAlign: 'center',
                  display: 'block'
                }}>
                  Cập nhật trạng thái
                </label>
                
                <div style={{display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '24px'}}>
                  {/* Nút Xác nhận */}
                  <div 
                    onClick={() => handleStatusChange('Xác nhận')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      border: selectedStatus === 'Xác nhận' ? '2px solid #059669' : '2px solid #e5e7eb',
                      backgroundColor: selectedStatus === 'Xác nhận' ? '#f0fdf4' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      minWidth: '140px',
                      boxShadow: selectedStatus === 'Xác nhận' ? '0 4px 12px rgba(5, 150, 105, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.05)',
                      userSelect: 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedStatus !== 'Xác nhận') {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.backgroundColor = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedStatus !== 'Xác nhận') {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.backgroundColor = '#ffffff';
                      }
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: selectedStatus === 'Xác nhận' ? '#059669' : '#e5e7eb',
                      marginRight: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease-in-out'
                    }}>
                      {selectedStatus === 'Xác nhận' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                      )}
                    </div>
                    <span style={{
                      color: selectedStatus === 'Xác nhận' ? '#059669' : '#6b7280',
                      fontWeight: '500',
                      fontSize: '14px'
                    }}>
                      Xác nhận
                    </span>
                  </div>

                  {/* Nút Từ chối */}
                  <div 
                    onClick={() => handleStatusChange('Từ chối')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      border: selectedStatus === 'Từ chối' ? '2px solid #dc2626' : '2px solid #e5e7eb',
                      backgroundColor: selectedStatus === 'Từ chối' ? '#fef2f2' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      minWidth: '140px',
                      boxShadow: selectedStatus === 'Từ chối' ? '0 4px 12px rgba(220, 38, 38, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.05)',
                      userSelect: 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedStatus !== 'Từ chối') {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.backgroundColor = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedStatus !== 'Từ chối') {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.backgroundColor = '#ffffff';
                      }
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: selectedStatus === 'Từ chối' ? '#dc2626' : '#e5e7eb',
                      marginRight: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease-in-out'
                    }}>
                      {selectedStatus === 'Từ chối' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <path d="M18 6L6 18M6 6l12 12"></path>
                        </svg>
                      )}
                    </div>
                    <span style={{
                      color: selectedStatus === 'Từ chối' ? '#dc2626' : '#6b7280',
                      fontWeight: '500',
                      fontSize: '14px'
                    }}>
                      Từ chối
                    </span>
                  </div>
                </div>
                
                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <button 
                    onClick={handleStatusUpdate}
                    disabled={!selectedStatus}
                    style={{
                      padding: '14px 32px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: selectedStatus ? '#2563eb' : '#e5e7eb',
                      color: selectedStatus ? '#ffffff' : '#9ca3af',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: selectedStatus ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s ease-in-out',
                      boxShadow: selectedStatus ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      minWidth: '200px'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedStatus) {
                        e.target.style.backgroundColor = '#1d4ed8';
                        e.target.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedStatus) {
                        e.target.style.backgroundColor = '#2563eb';
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    Cập nhật
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Toast thông báo */}
      {toast.show && (
        <div className={`custom-toast ${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
} 