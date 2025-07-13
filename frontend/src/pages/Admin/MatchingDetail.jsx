import React, { useState, useEffect } from "react";
import './DonationDetail.css';
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import { useParams } from 'react-router-dom';
import { bloodRequestAPI, certificateAPI } from '../../services/api';
import { adminStaffAPI } from '../../services/admin/adminStaff';

const fallbackMatching = {
  matchingId: 'M001',
  requestId: 'REQ056',
  hospitalName: 'Bệnh viện Trung Ương',
  donorName: 'Đậu Nguyễn Bảo Tuấn',
  requiredBloodGroup: 'O+',
  donorBloodGroup: 'O+',
  contactDate: '2024-07-20T09:30:00',
  status: 'contact_successful',
  quantityDonated: 120,
  distanceKm: 5.2,
  note: 'Người hiến đã đồng ý và sẵn sàng hiến máu'
};

export default function MatchingDetail() {
  const { id } = useParams();
  
  const [matching, setMatching] = useState(fallbackMatching);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [certificateNote, setCertificateNote] = useState("");
  const [certificateIssued, setCertificateIssued] = useState(false);
  const [certificateInfo, setCertificateInfo] = useState(null);

  // Fetch matching data from API
  useEffect(() => {
    const fetchMatchingDetail = async () => {
      try {
        setLoading(true);
        const allMatchings = await bloodRequestAPI.getMatchingBloodForAdmin();
        const matchingData = allMatchings.find(m => m.matchingId.toString() === id);
        
        if (matchingData) {
          setMatching(matchingData);
        } else {
          setError('Không tìm thấy thông tin matching');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching matching detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchingDetail();
  }, [id]);

  // Khi load trang, kiểm tra certificate đã cấp chưa
  useEffect(() => {
    const checkCertificate = async () => {
      try {
        const certs = await certificateAPI.getCertificatesByMatchingId(id);
        if (certs && certs.length > 0) {
          setCertificateIssued(true);
          setCertificateInfo(certs[0]);
          console.log('Certificate already issued:', certs[0]);
        } else {
          setCertificateIssued(false);
          setCertificateInfo(null);
          console.log('No certificate found for matching:', id);
        }
      } catch (error) {
        console.error('Error checking certificate:', error);
        setCertificateIssued(false);
        setCertificateInfo(null);
      }
    };
    checkCertificate();
  }, [id]);

  // Kiểm tra lại certificate khi trạng thái thay đổi
  useEffect(() => {
    if (matching.status === 'completed' || matching.status === 'accepted') {
      const checkCertificate = async () => {
        try {
          const certs = await certificateAPI.getCertificatesByMatchingId(id);
          if (certs && certs.length > 0) {
            setCertificateIssued(true);
            setCertificateInfo(certs[0]);
            console.log('Certificate found after status change:', certs[0]);
          } else {
            setCertificateIssued(false);
            setCertificateInfo(null);
            console.log('No certificate found after status change');
          }
        } catch (error) {
          console.error('Error checking certificate after status change:', error);
          setCertificateIssued(false);
          setCertificateInfo(null);
        }
      };
      checkCertificate();
    }
  }, [matching.status, id]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  // Format status for display
  const formatStatus = (status) => {
    if (!status) return 'Chưa xác định';
    const statusMap = {
      'contacting': 'Đang liên hệ',
      'contact_successful': 'Liên hệ thành công',
      'rejected': 'Đã từ chối',
      'accepted': 'Đã đồng ý',
      'completed': 'Hoàn thành'
    };
    return statusMap[status] || status;
  };

  // Get status style
  const getStatusStyle = (status) => {
    switch(status) {
      case 'contacting': return { color: "#f59e0b", fontWeight: "600" };
      case 'contact_successful': return { color: "#10b981", fontWeight: "600" };
      case 'rejected': return { color: "#ef4444", fontWeight: "600" };
      case 'accepted': return { color: "#3b82f6", fontWeight: "600" };
      case 'completed': return { color: "#059669", fontWeight: "600" };
      default: return { color: "#6b7280", fontWeight: "600" };
    }
  };

  // Ẩn toast sau 2.5s
  useEffect(() => {
    if (toast.show) {
      const t = setTimeout(() => setToast({ ...toast, show: false }), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  if (loading) {
    return (
      <div className="dashboard-root">
        <Header />
        <div className="dashboard-main">
          <Sidebar />
          <main className="donation-detail-root">
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Đang tải dữ liệu...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-root">
        <Header />
        <div className="dashboard-main">
          <Sidebar />
          <main className="donation-detail-root">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Lỗi!</h4>
              <p>Không thể tải dữ liệu: {error}</p>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Thử lại
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="donation-detail-root">
          <h2 className="donation-detail-title">Chi tiết Matching</h2>
          <div className="donation-detail-content" style={{ display: 'flex', flexDirection: 'row', gap: 32, alignItems: 'flex-start', marginLeft: 0 }}>
            {/* Cột trái: Thông tin matching */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 480, maxWidth: 520 }}>
              {/* Bảng thông tin matching */}
              <div className="donation-detail-table">
                <div className="donation-detail-section-title">Thông tin Matching</div>
                <table>
                  <tbody>
                    <tr><td>Matching ID:</td><td>{matching.matchingId}</td></tr>
                    <tr><td>Request ID:</td><td>{matching.requestId}</td></tr>
                    <tr><td>Tên bệnh viện:</td><td>{matching.hospitalName || '-'}</td></tr>
                    <tr><td>Tên người hiến:</td><td>{matching.donorName || '-'}</td></tr>
                    <tr><td>Nhóm máu cần:</td><td>{matching.requiredBloodGroup || '-'}</td></tr>
                    <tr><td>Nhóm máu người hiến:</td><td>{matching.donorBloodGroup || '-'}</td></tr>
                    <tr><td>Ngày liên hệ:</td><td>{formatDate(matching.contactDate)}</td></tr>
                    <tr><td>Trạng thái:</td><td style={getStatusStyle(matching.status)}>{formatStatus(matching.status)}</td></tr>
                    <tr><td>Số lượng hiến (ml):</td><td>{matching.quantityDonated || '-'}</td></tr>
                    <tr><td>Khoảng cách (km):</td><td>{matching.distanceKm !== null && matching.distanceKm !== undefined ? matching.distanceKm : '-'}</td></tr>
                    <tr><td>Ghi chú:</td><td>{matching.note || 'Không có ghi chú'}</td></tr>
                  </tbody>
                </table>
              </div>


            </div>

            {/* Cột phải: Bảng cấp chứng nhận */}
            <div style={{ minWidth: 340, maxWidth: 400, flex: '0 0 360px' }}>
              <div className="donation-detail-table">
                <div className="donation-detail-section-title">Cấp chứng nhận</div>
                <div style={{padding: '24px'}}>
                  {certificateIssued ? (
                    // Hiển thị thông tin chứng nhận đã cấp
                    <div style={{textAlign: 'center'}}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px'
                      }}>
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <h5 style={{color: '#059669', marginBottom: '8px', fontWeight: '600'}}>
                        Chứng nhận đã được cấp
                      </h5>
                      <p style={{color: '#6b7280', marginBottom: '16px', fontSize: '14px'}}>
                        Số chứng nhận: <strong>{certificateInfo?.certificateNumber}</strong>
                      </p>
                      <div style={{
                        padding: '12px',
                        backgroundColor: '#ecfdf5',
                        border: '1px solid #d1fae5',
                        borderRadius: '8px',
                        fontSize: '13px',
                        color: '#065f46'
                      }}>
                        <div><strong>Ngày cấp:</strong> {certificateInfo?.issuedDate}</div>
                        <div><strong>Người cấp:</strong> {certificateInfo?.issuedByStaffName}</div>
                        {certificateInfo?.notes && (
                          <div><strong>Ghi chú:</strong> {certificateInfo.notes}</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    // Form cấp chứng nhận - chỉ hiển thị khi trạng thái là completed hoặc accepted
                    (matching.status === 'completed' || matching.status === 'accepted') ? (
                      <div>
                        <div style={{marginBottom: '16px'}}>
                          <label className="form-label" style={{
                            fontWeight: '600',
                            marginBottom: '8px',
                            color: '#374151',
                            fontSize: '14px'
                          }}>
                            Ghi chú khi cấp chứng nhận: <span style={{color: '#dc3545'}}>*</span>
                          </label>
                          <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Nhập ghi chú khi cấp chứng nhận (bắt buộc)..."
                            value={certificateNote}
                            onChange={(e) => setCertificateNote(e.target.value)}
                            style={{
                              borderColor: certificateNote ? '#10b981' : '#d1d5db',
                              borderWidth: '2px',
                              resize: 'none'
                            }}
                          />
                        </div>
                        <button
                          onClick={async () => {
                            if (!certificateNote.trim()) {
                              setToast({
                                show: true,
                                type: 'error',
                                message: 'Vui lòng nhập ghi chú khi cấp chứng nhận!'
                              });
                              return;
                            }

                            // Lấy thông tin staff hiện tại
                            const accountId = localStorage.getItem('accountId');
                            let staffId = null;
                            
                            if (accountId) {
                              try {
                                const staffInfo = await adminStaffAPI.getByAccountId(accountId);
                                if (staffInfo && staffInfo.staffId) {
                                  staffId = staffInfo.staffId;
                                } else {
                                  throw new Error('Staff info không hợp lệ');
                                }
                              } catch (error) {
                                console.error('Error getting staff info:', error);
                                setToast({ 
                                  show: true, 
                                  type: 'error', 
                                  message: 'Không thể lấy thông tin staff. Vui lòng liên hệ quản trị viên.' 
                                });
                                return;
                              }
                            } else {
                              setToast({ 
                                show: true, 
                                type: 'error', 
                                message: 'Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại.' 
                              });
                              return;
                            }

                            try {
                              const result = await certificateAPI.createCertificateFromMatching(matching.matchingId, staffId, certificateNote);
                              setCertificateIssued(true);
                              setCertificateInfo(result);
                              setToast({
                                show: true,
                                type: 'success',
                                message: 'Cấp chứng nhận thành công!'
                              });
                            } catch (error) {
                              let errorMessage = 'Có lỗi xảy ra khi cấp chứng nhận!';
                              if (error.response?.data?.message) {
                                errorMessage = error.response.data.message;
                              } else if (error.message && error.message.includes('Đã cấp chứng nhận')) {
                                errorMessage = 'Chứng nhận đã được cấp cho matching này!';
                              }
                              setToast({
                                show: true,
                                type: 'error',
                                message: errorMessage
                              });
                            }
                          }}
                          disabled={!certificateNote.trim()}
                          style={{
                            width: '100%',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: certificateNote.trim() ? '#10b981' : '#e5e7eb',
                            color: certificateNote.trim() ? '#ffffff' : '#9ca3af',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: certificateNote.trim() ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s ease-in-out'
                          }}
                          onMouseEnter={(e) => {
                            if (certificateNote.trim()) {
                              e.target.style.backgroundColor = '#059669';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (certificateNote.trim()) {
                              e.target.style.backgroundColor = '#10b981';
                            }
                          }}
                        >
                          🏆 Cấp chứng nhận
                        </button>
                      </div>
                    ) : (
                      // Hiển thị thông báo khi chưa đủ điều kiện
                      <div style={{
                        padding: '16px',
                        backgroundColor: '#fef3c7',
                        border: '1px solid #f59e0b',
                        borderRadius: '8px',
                        textAlign: 'center',
                        color: '#92400e'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#f59e0b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 12px'
                        }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.694-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                          </svg>
                        </div>
                        <h6 style={{marginBottom: '8px', fontWeight: '600'}}>
                          Chưa thể cấp chứng nhận
                        </h6>
                        <p style={{margin: 0, fontSize: '13px'}}>
                          Chỉ có thể cấp chứng nhận khi người hiến đã hoàn thành quá trình hiến máu
                        </p>
                      </div>
                    )
                  )}
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