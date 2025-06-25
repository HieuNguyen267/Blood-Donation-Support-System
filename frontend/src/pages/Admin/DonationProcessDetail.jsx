import React, { useState } from "react";
import './DonationDetail.css';
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import { useParams } from 'react-router-dom';

const fallbackDonations = [
  { code: "A001", name: "Nguyễn Duy Hiếu", donateDate: "11/4/2024, 09:30", completeDate: "11/4/2024, 10:30", amount: "120 ml", status: "Xác nhận", blood: "Rh NULL", processStatus: "Đang xử lý" },
  { code: "A003", name: "Nguyễn Gia Triệu", donateDate: "4/11/2025, 15:35", completeDate: "4/11/2025, 16:35", amount: "120 ml", status: "Xác nhận", blood: "O+", processStatus: "Hoàn thành" },
  { code: "A004", name: "Đậu Nguyễn Bảo Tuấn", donateDate: "27/5/2025, 10:30", completeDate: "27/5/2025, 11:30", amount: "120 ml", status: "Xác nhận", blood: "AB+", processStatus: "Đang xử lý" },
  { code: "A005", name: "Nguyễn Anh Khoa", donateDate: "27/5/2025, 10:45", completeDate: "27/5/2025, 11:45", amount: "120 ml", status: "Xác nhận", blood: "AB-", processStatus: "Hoàn thành" },
  { code: "A007", name: "Nguyễn Trí Thông", donateDate: "15/4/2024, 08:30", completeDate: "15/4/2024, 09:30", amount: "120 ml", status: "Xác nhận", blood: "B-", processStatus: "Tạm dừng" },
];

export default function DonationProcessDetail() {
  const { id } = useParams();
  
  // Lấy danh sách đơn hiến từ localStorage nếu có, nếu không thì dùng fallback
  let donations = fallbackDonations;
  try {
    const local = localStorage.getItem('donations');
    if (local) {
      const allDonations = JSON.parse(local);
      // Chỉ lấy những đơn có trạng thái "Xác nhận"
      donations = allDonations
        .filter(d => d.status === "Xác nhận")
        .map(d => ({
          ...d,
          processStatus: d.processStatus || "Đang xử lý"
        }));
    }
  } catch {}
  
  const donation = donations.find(d => d.code === id) || fallbackDonations[0];

  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(donation);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [currentDonation, setCurrentDonation] = useState(donation);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [isBloodQuantityUpdated, setIsBloodQuantityUpdated] = useState(false);
  
  // Khi id thay đổi, cập nhật editData và currentDonation
  React.useEffect(() => { 
    setEditData(donation); 
    setCurrentDonation(donation);
    setIsBloodQuantityUpdated(false); // Reset trạng thái cập nhật máu khi chuyển donation
  }, [id]);

  // Validate dữ liệu
  const validate = () => {
    if (!editData.amount) {
      setToast({ show: true, type: 'error', message: 'Vui lòng nhập lượng máu!' });
      return false;
    }
    if (isNaN(parseInt(editData.amount)) || parseInt(editData.amount) <= 0) {
      setToast({ show: true, type: 'error', message: 'Số lượng phải là số dương!' });
      return false;
    }
    return true;
  };

  // Hàm lưu chỉnh sửa
  const handleSaveEdit = () => {
    if (!validate()) return;
    
    // Cập nhật trong localStorage
    try {
      const allDonations = JSON.parse(localStorage.getItem('donations') || '[]');
      const idx = allDonations.findIndex(d => d.code === id);
      if (idx !== -1) {
        // Chỉ cập nhật lượng máu
        allDonations[idx] = { ...allDonations[idx], amount: editData.amount };
        localStorage.setItem('donations', JSON.stringify(allDonations));
        setCurrentDonation(allDonations[idx]);
        setIsBloodQuantityUpdated(true); // Đánh dấu đã cập nhật lượng máu
        setToast({ show: true, type: 'success', message: 'Cập nhật lượng máu thành công!' });
        setShowEdit(false);
      } else {
        setToast({ show: true, type: 'error', message: 'Không tìm thấy đơn hiến!' });
      }
    } catch (error) {
      setToast({ show: true, type: 'error', message: 'Có lỗi xảy ra khi lưu!' });
    }
  };

  // Cập nhật trạng thái quá trình
  const handleStatusUpdate = () => {
    if (!selectedStatus) {
      setToast({ show: true, type: 'error', message: 'Vui lòng chọn trạng thái!' });
      return;
    }

    // Kiểm tra nếu chọn "Hoàn thành" nhưng chưa cập nhật lượng máu
    if (selectedStatus === 'Hoàn thành' && !isBloodQuantityUpdated) {
      setToast({ show: true, type: 'error', message: 'Vui lòng cập nhật lượng máu trước khi hoàn thành!' });
      return;
    }

    if (selectedStatus === 'Gặp sự cố' && !incidentDescription.trim()) {
      setToast({ show: true, type: 'error', message: 'Vui lòng mô tả sự cố đã gặp!' });
      return;
    }

    try {
      const allDonations = JSON.parse(localStorage.getItem('donations') || '[]');
      const idx = allDonations.findIndex(d => d.code === id);
      if (idx !== -1) {
        const updatedDonation = {
          ...allDonations[idx],
          processStatus: selectedStatus,
          incidentDescription: selectedStatus === 'Gặp sự cố' ? incidentDescription : undefined
        };
        allDonations[idx] = updatedDonation;
        localStorage.setItem('donations', JSON.stringify(allDonations));
        setCurrentDonation(updatedDonation);
        setToast({ show: true, type: 'success', message: `Đã cập nhật trạng thái: ${selectedStatus}` });
        
        // Reset form
        setSelectedStatus('');
        setIncidentDescription('');
        setShowIncidentForm(false);
      }
    } catch (error) {
      setToast({ show: true, type: 'error', message: 'Có lỗi xảy ra khi cập nhật!' });
    }
  };

  // Xử lý khi chọn trạng thái
  const handleStatusChange = (status) => {
    // Kiểm tra nếu chọn "Hoàn thành" nhưng chưa cập nhật lượng máu
    if (status === 'Hoàn thành' && !isBloodQuantityUpdated) {
      setToast({ show: true, type: 'warning', message: 'Vui lòng cập nhật lượng máu trước khi chọn hoàn thành!' });
      return;
    }
    
    setSelectedStatus(status);
    if (status === 'Gặp sự cố') {
      setShowIncidentForm(true);
    } else {
      setShowIncidentForm(false);
      setIncidentDescription('');
    }
  };

  // Ẩn toast sau 2.5s
  React.useEffect(() => {
    if (toast.show) {
      const t = setTimeout(() => setToast({ ...toast, show: false }), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const getProcessStatusStyle = (status) => {
    switch(status) {
      case "Đang xử lý": return { color: "#f59e0b", fontWeight: "600" };
      case "Hoàn thành": return { color: "#10b981", fontWeight: "600" };
      case "Gặp sự cố": return { color: "#ef4444", fontWeight: "600" };
      case "Tạm dừng": return { color: "#ef4444", fontWeight: "600" };
      default: return { color: "#6b7280", fontWeight: "600" };
    }
  };

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="donation-detail-root">
          <h2 className="donation-detail-title">Chi tiết quá trình hiến</h2>
          <div className="donation-detail-content">
            <div className="donation-detail-table">
              <div className="donation-detail-section-title">Thông tin đơn hiến</div>
              <table>
                <tbody>
                  <tr><td>Họ và tên :</td><td>{currentDonation.name}</td></tr>
                  <tr><td>Ngày và giờ hiến :</td><td>{currentDonation.donateDate}</td></tr>
                  <tr><td>Ngày và giờ hoàn thành :</td><td>{currentDonation.completeDate}</td></tr>
                  <tr><td>Số lượng (ml) :</td><td>{currentDonation.amount}</td></tr>
                  <tr><td>Trạng thái đơn hiến :</td><td>{currentDonation.status}</td></tr>
                  <tr><td>Trạng thái xử lý :</td><td style={getProcessStatusStyle(currentDonation.processStatus)}>{currentDonation.processStatus}</td></tr>
                  <tr><td>Nhóm máu :</td><td>{currentDonation.blood}</td></tr>
                </tbody>
              </table>
              <button className="btn-edit-info" style={{marginTop: 24, width: '100%'}} onClick={()=>setShowEdit(true)}>🩸 Cập nhật lượng máu đã hiến</button>
              {isBloodQuantityUpdated ? (
                <div style={{
                  marginTop: 8,
                  padding: '8px 12px',
                  backgroundColor: '#d1fae5',
                  border: '1px solid #059669',
                  borderRadius: '6px',
                  color: '#059669',
                  fontSize: '12px',
                  fontWeight: '500',
                  textAlign: 'center'
                }}>
                  ✓ Lượng máu đã được cập nhật - Có thể chọn trạng thái hoàn thành
                </div>
              ) : (
                <div style={{
                  marginTop: 8,
                  padding: '8px 12px',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #f59e0b',
                  borderRadius: '6px',
                  color: '#92400e',
                  fontSize: '12px',
                  fontWeight: '500',
                  textAlign: 'center'
                }}>
                  ⚠ Cần cập nhật lượng máu trước khi có thể hoàn thành quá trình
                </div>
              )}
            </div>
            
            {/* Bảng cập nhật trạng thái */}
            <div className="donation-detail-table" style={{marginTop: 24}}>
              <div className="donation-detail-section-title">Cập nhật trạng thái quá trình</div>
              <div style={{padding: '24px'}}>
                <div className="row g-4">
                  <div className="col-md-8">
                    <label className="form-label" style={{
                      fontWeight: '500', 
                      marginBottom: '16px', 
                      color: '#374151',
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Cập nhật trạng thái
                    </label>
                    <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
                      {/* Nút Hoàn thành */}
                      <div 
                        onClick={() => handleStatusChange('Hoàn thành')}
                        title={!isBloodQuantityUpdated ? 'Vui lòng cập nhật lượng máu trước khi chọn hoàn thành' : ''}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '12px 20px',
                          borderRadius: '12px',
                          border: selectedStatus === 'Hoàn thành' ? '2px solid #059669' : '2px solid #e5e7eb',
                          backgroundColor: selectedStatus === 'Hoàn thành' ? '#f0fdf4' : '#ffffff',
                          cursor: isBloodQuantityUpdated ? 'pointer' : 'not-allowed',
                          transition: 'all 0.2s ease-in-out',
                          minWidth: '140px',
                          boxShadow: selectedStatus === 'Hoàn thành' ? '0 4px 12px rgba(5, 150, 105, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.05)',
                          userSelect: 'none',
                          opacity: isBloodQuantityUpdated ? 1 : 0.6
                        }}
                        onMouseEnter={(e) => {
                          if (selectedStatus !== 'Hoàn thành' && isBloodQuantityUpdated) {
                            e.target.style.borderColor = '#d1d5db';
                            e.target.style.backgroundColor = '#f9fafb';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedStatus !== 'Hoàn thành' && isBloodQuantityUpdated) {
                            e.target.style.borderColor = '#e5e7eb';
                            e.target.style.backgroundColor = '#ffffff';
                          }
                        }}
                      >
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: selectedStatus === 'Hoàn thành' ? '#059669' : '#e5e7eb',
                          marginRight: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease-in-out'
                        }}>
                          {selectedStatus === 'Hoàn thành' && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                              <polyline points="20,6 9,17 4,12"></polyline>
                            </svg>
                          )}
                        </div>
                        <span style={{
                          color: selectedStatus === 'Hoàn thành' ? '#059669' : '#6b7280',
                          fontWeight: '500',
                          fontSize: '14px'
                        }}>
                          Hoàn thành
                        </span>
                      </div>

                      {/* Nút Gặp sự cố */}
                      <div 
                        onClick={() => handleStatusChange('Gặp sự cố')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '12px 20px',
                          borderRadius: '12px',
                          border: selectedStatus === 'Gặp sự cố' ? '2px solid #dc2626' : '2px solid #e5e7eb',
                          backgroundColor: selectedStatus === 'Gặp sự cố' ? '#fef2f2' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          minWidth: '140px',
                          boxShadow: selectedStatus === 'Gặp sự cố' ? '0 4px 12px rgba(220, 38, 38, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.05)',
                          userSelect: 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedStatus !== 'Gặp sự cố') {
                            e.target.style.borderColor = '#d1d5db';
                            e.target.style.backgroundColor = '#f9fafb';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedStatus !== 'Gặp sự cố') {
                            e.target.style.borderColor = '#e5e7eb';
                            e.target.style.backgroundColor = '#ffffff';
                          }
                        }}
                      >
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: selectedStatus === 'Gặp sự cố' ? '#dc2626' : '#e5e7eb',
                          marginRight: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease-in-out'
                        }}>
                          {selectedStatus === 'Gặp sự cố' && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.694-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                            </svg>
                          )}
                        </div>
                        <span style={{
                          color: selectedStatus === 'Gặp sự cố' ? '#dc2626' : '#6b7280',
                          fontWeight: '500',
                          fontSize: '14px'
                        }}>
                          Gặp sự cố
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4" style={{display: 'flex', alignItems: 'flex-end'}}>
                    <button 
                      onClick={handleStatusUpdate}
                      disabled={!selectedStatus}
                      style={{
                        width: '100%',
                        padding: '14px 24px',
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
                        letterSpacing: '0.5px'
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
                
                {/* Form mô tả sự cố */}
                {showIncidentForm && (
                  <div style={{marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px'}}>
                    <label className="form-label" style={{fontWeight: '600', marginBottom: '8px', color: '#856404'}}>
                      Mô tả sự cố đã gặp: <span style={{color: '#dc3545'}}>*</span>
                    </label>
                    <textarea 
                      className="form-control" 
                      rows="3"
                      placeholder="Vui lòng mô tả chi tiết sự cố đã xảy ra trong quá trình hiến máu..."
                      value={incidentDescription}
                      onChange={(e) => setIncidentDescription(e.target.value)}
                      style={{borderColor: '#ffc107'}}
                    />
                  </div>
                )}
                
                {/* Hiển thị sự cố hiện tại nếu có */}
                {currentDonation.incidentDescription && (
                  <div style={{marginTop: '20px', padding: '15px', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '8px'}}>
                    <label className="form-label" style={{fontWeight: '600', marginBottom: '8px', color: '#721c24'}}>
                      Sự cố đã ghi nhận:
                    </label>
                    <p style={{margin: 0, color: '#721c24'}}>{currentDonation.incidentDescription}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Modal chỉnh sửa thông tin */}
      {showEdit && (
        <div className="modal fade show" style={{display:'block',background:'rgba(0,0,0,0.3)'}} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{background:'#8fd19e'}}>
                <h5 className="modal-title">Cập nhật lượng máu đã hiến</h5>
                <button type="button" className="btn-close" onClick={()=>setShowEdit(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <input className="form-control" placeholder="Họ và tên" value={editData.name} disabled style={{backgroundColor: '#f8f9fa'}} />
                  </div>
                  <div className="col-md-6">
                    <input className="form-control" placeholder="Ngày và giờ hiến" value={editData.donateDate} disabled style={{backgroundColor: '#f8f9fa'}} />
                  </div>
                  <div className="col-md-6">
                    <input className="form-control" placeholder="Ngày và giờ hoàn thành" value={editData.completeDate} disabled style={{backgroundColor: '#f8f9fa'}} />
                  </div>
                  <div className="col-md-6">
                    <div style={{position: 'relative'}}>
                      <input 
                        className="form-control" 
                        placeholder="Số lượng máu đã hiến*" 
                        type="number" 
                        min="50" 
                        max="500" 
                        value={editData.amount ? editData.amount.replace(' ml', '') : ''} 
                        onChange={e => {
                          const value = e.target.value;
                          setEditData({...editData, amount: value ? `${value} ml` : ''});
                        }} 
                        style={{borderColor: '#28a745', borderWidth: '2px', paddingRight: '40px'}} 
                      />
                      <span style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#6b7280',
                        fontWeight: '500',
                        pointerEvents: 'none'
                      }}>ml</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <input className="form-control" placeholder="Nhóm máu" value={editData.blood} disabled style={{backgroundColor: '#f8f9fa'}} />
                  </div>
                  <div className="col-md-6">
                    <select className="form-control" value={editData.processStatus} disabled style={{backgroundColor: '#f8f9fa'}}>
                      <option value="Đang xử lý">Đang xử lý</option>
                      <option value="Hoàn thành">Hoàn thành</option>
                      <option value="Tạm dừng">Tạm dừng</option>
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <small className="text-muted">* Chỉ có thể chỉnh sửa lượng máu đã hiến</small>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={handleSaveEdit}>Cập nhật lượng máu</button>
                <button className="btn btn-danger" onClick={()=>setShowEdit(false)}>Hủy</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast thông báo */}
      {toast.show && (
        <div className={`custom-toast ${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
} 