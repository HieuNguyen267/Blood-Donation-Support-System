import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import { donorAPI, bloodRequestAPI } from '../../services/api';
import { message, Modal } from 'antd';
import './DonationDetail.css';
import { useEffect } from 'react';

const GOOGLE_MAPS_API_KEY = 'a04183a395a6fd210ec327f88707af47';

// Hàm lấy khoảng cách từ backend
async function getDistance(origin, destination) {
  if (!origin || !destination) return '';
  const url = `http://localhost:8080/api/common/distance?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Distance API error:', res.status, errorData);
      
      // Hiển thị thông tin lỗi chi tiết hơn
      if (errorData.error && errorData.suggestion) {
        return `⚠️ ${errorData.error}`;
      } else if (errorData.error) {
        return `⚠️ ${errorData.error}`;
      } else {
        return '⚠️ Không thể tính khoảng cách';
      }
    }
    const data = await res.json();
    if (data.text) return data.text;
    return '';
  } catch (error) {
    console.error('Distance calculation error:', error);
    return '⚠️ Lỗi kết nối';
  }
}

export default function EmergencyProcess() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState({});
  
  // State for blood request detail
  const [request, setRequest] = useState(null);

  // Fetch blood request detail on mount
  useEffect(() => {
    if (requestId) {
      bloodRequestAPI.getRequestById(requestId)
        .then(setRequest)
        .catch(() => setRequest(null));
    }
  }, [requestId]);

  // Dữ liệu mẫu cho những người hiến đã chấp nhận


  const [eligibleDonors, setEligibleDonors] = React.useState([]);
  React.useEffect(() => {
    donorAPI.getEligibleDonors().then(setEligibleDonors).catch(() => setEligibleDonors([]));
  }, []);

  // State lưu khoảng cách cho từng donor
  const [distances, setDistances] = React.useState({});
  React.useEffect(() => {
    if (!request?.facilityName || eligibleDonors.length === 0) return;
    const fetchDistances = async () => {
      const newDistances = {};
      for (const donor of eligibleDonors) {
        const key = donor.donor_id;
        const origin = donor.address;
        const destination = request?.facilityAddress || request?.facilityName;
        newDistances[key] = await getDistance(origin, destination);
      }
      setDistances(newDistances);
    };
    fetchDistances();
  }, [eligibleDonors, request?.facilityName]);

  // State lưu matching_blood cho request
  const [matchingList, setMatchingList] = React.useState([]);
  React.useEffect(() => {
    if (!requestId) return;
    bloodRequestAPI.getMatchingBlood(requestId)
      .then(setMatchingList)
      .catch(() => setMatchingList([]));
  }, [requestId]);

  // State lưu danh sách người hiến đã đồng ý (accepted donors)
  const [acceptedDonorsList, setAcceptedDonorsList] = React.useState([]);
  React.useEffect(() => {
    if (requestId) {
      bloodRequestAPI.getAcceptedDonorsByRequestId(requestId)
        .then(setAcceptedDonorsList)
        .catch(() => setAcceptedDonorsList([]));
    }
  }, [requestId]);

  // Tính toán thống kê dựa trên matchingList
  const acceptedMatchings = matchingList.filter(m => m.status === 'contact_successful');
  const totalAccepted = acceptedDonorsList.length;
  // Tính tổng máu đã có từ acceptedDonorsList
  const totalAcceptedBlood = acceptedDonorsList.reduce((sum, d) => sum + (d.quantityMl || 0), 0);

  // Tính tổng máu đã gửi từ bloodFullfilled (O+: 100 ml, A-: 100 ml, ...)
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
  const totalBloodFullfilled = parseBloodFullfilled(request?.bloodFullfilled);

  // Tổng máu đã có = máu đã đồng ý + máu đã gửi
  const totalBlood = totalAcceptedBlood + totalBloodFullfilled;
  const remainingNeeded = Math.max((request?.quantityRequested || 0) - totalBlood, 0);
  const progressPercent = request?.quantityRequested ? Math.min((totalBlood / request?.quantityRequested) * 100, 100) : 0;

  // Hàm trả về màu sắc cho trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "Đã xác nhận": return "text-success fw-bold";
      case "Đang di chuyển": return "text-warning fw-bold";
      case "Đã đến": return "text-primary fw-bold";
      case "Đã hiến": return "text-success fw-bold";
      default: return "text-secondary";
    }
  };

  // Hàm trả về badge cho trạng thái
  const getStatusBadge = (status) => {
    switch (status) {
      case "Đã xác nhận": return "badge bg-success";
      case "Đang di chuyển": return "badge bg-warning text-dark";
      case "Đã đến": return "badge bg-primary";
      case "Đã hiến": return "badge bg-success";
      default: return "badge bg-secondary";
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
  // Hàm format thời gian chấp nhận
  const formatAvailable = (from, until) => {
    if (!from && !until) return '';
    const f = from ? new Date(from).toLocaleDateString('vi-VN') : '';
    const u = until ? new Date(until).toLocaleDateString('vi-VN') : '';
    return f && u ? `${f} - ${u}` : f || u;
  };

  // Helper lấy matching theo donorId
  const getMatchingByDonor = (donorId) => matchingList.find(m => m.donorId === donorId);

  // Hàm format trạng thái với màu sắc
  const formatStatus = (status) => {
    if (!status) return '';
    switch (status) {
      case 'contacting':
        return <span className="status-orange">Đang liên hệ</span>;
      case 'contact_successful':
        return <span className="status-green">Liên hệ thành công</span>;
      case 'completed':
        return <span className="status-green">Hoàn thành</span>;
      case 'rejected':
        return <span className="status-red">Từ chối</span>;
      default:
        return <span className="status-gray">{status}</span>;
    }
  };

  // Hàm xử lý gửi mail khẩn cấp
  const handleContactDonor = async (donorId, donorName) => {
    setLoading(prev => ({ ...prev, [donorId]: true }));
    try {
      // Lấy distanceKm từ distances (chuỗi '4.3 km' hoặc số), parse về số thực
      let distanceStr = distances[donorId];
      let distanceKm = null;
      if (distanceStr) {
        if (typeof distanceStr === 'string') {
          const match = distanceStr.match(/([\d.]+)/);
          if (match) distanceKm = parseFloat(match[1]);
        } else if (typeof distanceStr === 'number') {
          distanceKm = distanceStr;
        }
      }
      await bloodRequestAPI.contactDonorForEmergency(requestId, { donorId, distanceKm });
      message.success(`Đã gửi email yêu cầu hiến máu khẩn cấp cho ${donorName}`);
      // Cập nhật lại trạng thái đơn yêu cầu máu (emergency_status)
      if (typeof bloodRequestAPI.getRequestById === 'function') {
        bloodRequestAPI.getRequestById(requestId).then(newReq => {
          if (setRequest) setRequest(newReq);
        });
      }
    } catch (error) {
      console.error('Error sending emergency email:', error);
      message.error(`Lỗi khi gửi email: ${error.message || 'Lỗi không xác định'}`);
    } finally {
      setLoading(prev => ({ ...prev, [donorId]: false }));
    }
  };

  // Hàm test email
  const handleTestEmail = async () => {
    try {
      await bloodRequestAPI.testEmail("swp391.donateblood@gmail.com");
      message.success("Test email sent successfully!");
    } catch (error) {
      console.error('Error sending test email:', error);
      message.error(`Test email failed: ${error.message || 'Lỗi không xác định'}`);
    }
  };

  // Hàm test email thật
  const handleTestRealEmail = async () => {
    try {
      await bloodRequestAPI.testSimpleEmail("swp391.donateblood@gmail.com");
      message.success("Real email sent successfully! Check your inbox.");
    } catch (error) {
      console.error('Error sending real email:', error);
      message.error(`Real email failed: ${error.message || 'Lỗi không xác định'}`);
    }
  };

  // Hàm test email không cần auth
  const handleTestEmailNoAuth = async () => {
    try {
      await bloodRequestAPI.testEmailNoAuth("swp391.donateblood@gmail.com");
      message.success("Test email (no auth) sent successfully! Check your inbox.");
    } catch (error) {
      console.error('Error sending test email (no auth):', error);
      message.error(`Test email (no auth) failed: ${error.message || 'Lỗi không xác định'}`);
    }
  };

  // Hàm test log only
  const handleTestLogOnly = async () => {
    try {
      await bloodRequestAPI.testLogOnly("swp391.donateblood@gmail.com");
      message.success("Log test completed! Check backend logs.");
    } catch (error) {
      console.error('Error in log test:', error);
      message.error(`Log test failed: ${error.message || 'Lỗi không xác định'}`);
    }
  };

  // Hàm hoàn thành quá trình
  const handleCompleteProcess = () => {
    // Kiểm tra xem emergency_status hoặc processing_status đã completed chưa
    const isCompleted = request?.emergency_status === 'completed' || request?.processing_status === 'completed';
    
    if (isCompleted) {
      message.info('Yêu cầu đã hoàn thành!');
      return;
    }

    Modal.confirm({
      title: 'Xác nhận hoàn thành',
      content: 'Bạn muốn xác nhận đơn yêu cầu đã hoàn thành chứ?',
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          // Gọi API cập nhật trạng thái matching_blood và blood_request
          await bloodRequestAPI.completeEmergencyRequest(requestId);
          message.success("Đã hoàn thành quá trình yêu cầu máu khẩn cấp.");
          navigate(`/admin/blood-request-detail/${requestId}`);
        } catch (error) {
          console.error('Error completing emergency request:', error);
          message.error(`Lỗi khi hoàn thành quá trình: ${error.message || 'Lỗi không xác định'}`);
        }
      }
    });
  };

  // Bảng tương hợp máu
  const BLOOD_COMPATIBILITY = {
    'O-': ['O-'],
    'O+': ['O-', 'O+'],
    'A-': ['O-', 'A-'],
    'A+': ['O-', 'O+', 'A-', 'A+'],
    'B-': ['O-', 'B-'],
    'B+': ['O-', 'O+', 'B-', 'B+'],
    'AB-': ['O-', 'A-', 'B-', 'AB-'],
    'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    'Rh Null': ['Rh Null'],
    'Bombay': ['Bombay']
  };

  // Hàm lấy danh sách nhóm máu phù hợp để nhận máu cho đơn yêu cầu
  const getCompatibleBloodGroups = (recipientGroup) => {
    if (!recipientGroup) return [];
    if (recipientGroup === 'Rh Null') return ['Rh Null'];
    if (recipientGroup === 'Bombay') return ['Bombay'];
    return BLOOD_COMPATIBILITY[recipientGroup] || [recipientGroup];
  };

  // Lọc donor phù hợp nhóm máu
  const compatibleGroups = getCompatibleBloodGroups(request?.bloodGroup);
  const filteredDonors = eligibleDonors.filter(donor => {
    const donorGroup = formatBloodGroup(donor.abo_type, donor.rh_factor);
    return compatibleGroups.includes(donorGroup);
  });

  // Lọc ra những donor chưa hoàn thành (trạng thái khác 'completed')
  const filteredDonorsNotCompleted = filteredDonors.filter(donor => {
    const matching = getMatchingByDonor(donor.donor_id);
    return !matching || matching.status !== 'completed';
  });

  // Hàm lấy số thực từ chuỗi khoảng cách
  const getDistanceNumber = (val) => {
    if (!val) return Infinity;
    if (typeof val === 'number') return val;
    const match = val.toString().replace(',', '.').match(/([\d.]+)/);
    return match ? parseFloat(match[1]) : Infinity;
  };

  // Sắp xếp donor: trạng thái rỗng hoặc 'contacting' lên trên (theo khoảng cách tăng dần), còn lại xuống dưới
  const sortedDonors = [...filteredDonors].sort((a, b) => {
    const matchingA = getMatchingByDonor(a.donor_id);
    const matchingB = getMatchingByDonor(b.donor_id);
    const statusA = matchingA?.status || '';
    const statusB = matchingB?.status || '';
    const isActiveA = !statusA || statusA === 'contacting';
    const isActiveB = !statusB || statusB === 'contacting';
    if (isActiveA && !isActiveB) return -1;
    if (!isActiveA && isActiveB) return 1;
    if (isActiveA && isActiveB) {
      // Sắp xếp theo khoảng cách tăng dần
      const distA = getDistanceNumber(distances[a.donor_id]);
      const distB = getDistanceNumber(distances[b.donor_id]);
      return distA - distB;
    }
    return 0;
  });

  // Kiểm tra xem đã có matching nào hoàn thành chưa
  const hasCompletedMatching = matchingList.some(m => m.status === 'completed');

  // Kiểm tra xem emergency_status hoặc processing_status đã completed chưa
  const isCompleted = request?.emergency_status === 'completed' || request?.processing_status === 'completed';

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="donor-page-root">
          <h2 className="donor-title">Quá trình yêu cầu máu khẩn cấp</h2>
          
          {/* Thông tin đơn yêu cầu */}
          <div className="card p-3 mb-3">
            <div className="row">
              <div className="col-md-8">
                <h5 className="text-danger fw-bold">🚨 Đơn yêu cầu #{request?.requestId}</h5>
                <div className="row">
                  <div className="col-md-6">
                    <span>Cơ sở y tế: <b>{request?.facilityName}</b></span><br/>
                    <span>Địa chỉ: <b>{request?.facilityAddress || 'Chưa có thông tin'}</b></span><br/>
                    <span>Nhóm máu: <b className="text-danger">{request?.bloodGroup}</b></span><br/>
                    <span>Mức độ: <b className="text-danger">{request?.isEmergency ? 'Khẩn cấp' : 'Bình thường'}</b></span>
                  </div>
                  <div className="col-md-6">
                    <span>Số lượng cần: <b>{request?.quantityRequested} ml</b></span><br/>
                    <span>Ngày cần: <b>{request?.requiredBy}</b></span><br/>
                    <span>Liên hệ: <b>{request?.contactPerson} ({request?.contactPhone})</b></span>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card bg-light">
                  <div className="card-body text-center">
                    <h6 className="text-muted">Tiến độ</h6>
                    <div className="progress mb-2">
                      <div 
                        className="progress-bar bg-success" 
                        style={{width: `${progressPercent}%`}}
                      ></div>
                    </div>
                    <small>
                      <span className="text-success fw-bold">{totalBlood} ml</span> / {request?.quantityRequested} ml
                    </small>
                    {remainingNeeded > 0 && (
                      <div className="mt-2">
                        <small className="text-danger">Còn thiếu: {remainingNeeded} ml</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bảng người hiến có thể liên hệ */}
          <div className="card p-3 mb-3">
            <h5 className="text-success">📞 Những người có thể liên hệ</h5>
            <div className="table-responsive">
              {/* Ẩn bảng nếu không còn donor nào chưa hoàn thành */}
              {filteredDonorsNotCompleted.length > 0 ? (
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
                    <th className="text-center">Khoảng cách</th>
                  </tr>
                </thead>
                <tbody>
                    {filteredDonorsNotCompleted.map((donor, idx) => {
                    const matching = getMatchingByDonor(donor.donor_id);
                    return (
                      <tr key={donor.donor_id}>
                        <td className="text-center">{idx + 1}</td>
                        <td className="text-center fw-bold">{donor.full_name}</td>
                          <td className="text-center">{formatBloodGroup(donor.abo_type, donor.rh_factor)}</td>
                        <td className="text-center">{calcAge(donor.date_of_birth)}</td>
                        <td className="text-center">{donor.phone}</td>
                        <td className="text-center">{donor.address}</td>
                        <td className="text-center">{matching?.responseTime ? new Date(matching.responseTime).toLocaleString('vi-VN') : ''}</td>
                        <td className="text-center">{matching?.quantityMl || ''}</td>
                        <td className="text-center">{matching?.arrivalTime ? new Date(matching.arrivalTime).toLocaleString('vi-VN') : ''}</td>
                        <td className="text-center">{formatStatus(matching?.status)}</td>
                        <td className="text-center">
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <button 
                              title="Liên hệ khẩn cấp"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                                height: '32px',
                                backgroundColor: '#f59e0b',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: (matching?.status === 'contact_successful' || matching?.status === 'completed') ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease-in-out',
                                boxShadow: '0 1px 3px rgba(245, 158, 11, 0.2)'
                              }}
                              onClick={() => {
                                if (matching?.status === 'contact_successful') {
                                  message.info('Người hiến đã chấp nhận yêu cầu.');
                                  return;
                                }
                                if (matching?.status === 'completed') {
                                  message.info('Yêu cầu đã hoàn thành.');
                                  return;
                                }
                                handleContactDonor(donor.donor_id, donor.full_name);
                              }}
                              disabled={loading[donor.donor_id] || matching?.status === 'contact_successful' || matching?.status === 'completed'}
                            >
                              {loading[donor.donor_id] ? (
                                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M12 2v4M12 18v4M2 12h4M18 12h4M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"></path>
                                </svg>
                              ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                  <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="text-center">{distances[donor.donor_id] || '...'}</td>
                      </tr>
                    );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="text-center text-secondary py-3">Không còn người hiến nào có thể liên hệ (tất cả đã hoàn thành)</div>
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
                    <th className="text-center">Khoảng cách (km)</th>
                    <th className="text-center">Thời điểm phản hồi</th>
                    <th className="text-center">Số lượng (ml)</th>
                    <th className="text-center">Thời điểm đến</th>
                    <th className="text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {acceptedDonorsList.length > 0 ? acceptedDonorsList.map((d, idx) => (
                    <tr key={d.matchingId}>
                      <td className="text-center">{idx + 1}</td>
                      <td className="text-center">{d.fullName}</td>
                      <td className="text-center">{d.aboType}{d.rhFactor === 'positive' ? '+' : d.rhFactor === 'negative' ? '-' : ''}</td>
                      <td className="text-center">{d.dateOfBirth ? new Date().getFullYear() - new Date(d.dateOfBirth).getFullYear() : ''}</td>
                      <td className="text-center">{d.phone}</td>
                      <td className="text-center">{d.address}</td>
                      <td className="text-center">{d.distanceKm || '-'}</td>
                      <td className="text-center">{d.responseTime ? new Date(d.responseTime).toLocaleString('vi-VN') : '-'}</td>
                      <td className="text-center">{d.quantityMl || '-'}</td>
                      <td className="text-center">{d.arrivalTime ? new Date(d.arrivalTime).toLocaleString('vi-VN') : '-'}</td>
                      <td className="text-center">{formatStatus(d.status)}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={11} className="text-center text-secondary">Không có người hiến đã đồng ý</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Thống kê nhanh - Giao diện mới */}
          <div className="row mb-4 g-3">
            <div className="col-md-3">
              <div className="stat-card bg-primary-soft">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h6>Tổng người chấp nhận</h6>
                  <h4>{totalAccepted}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card bg-success-soft">
                <div className="stat-icon">🩸</div>
                <div className="stat-info">
                  <h6>Tổng máu đã có</h6>
                  <h4>{totalBlood} <small>ml</small></h4>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card bg-warning-soft">
                <div className="stat-icon">⚠️</div>
                <div className="stat-info">
                  <h6>Còn thiếu</h6>
                  <h4>{remainingNeeded} <small>ml</small></h4>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card bg-info-soft">
                <div className="stat-icon">📈</div>
                <div className="stat-info">
                  <h6>Tiến độ</h6>
                  <h4>{request?.quantityRequested > 0 ? Math.round((totalBlood/request?.quantityRequested)*100) : 0}<small>%</small></h4>
                </div>
              </div>
            </div>
          </div>

          {/* Dãy nút thao tác */}
          <div className="mb-3 d-flex gap-2">
            {isCompleted ? (
              <button 
                className="btn btn-success btn-lg px-4 py-2 fw-bold" 
                style={{fontSize: '1.15rem'}} 
                disabled
                title="Yêu cầu đã hoàn thành"
              >
                <span role="img" aria-label="check">✅</span> Đã hoàn thành quá trình
              </button>
            ) : (
              <button 
                className="btn btn-outline-success btn-lg px-4 py-2 fw-bold" 
                style={{fontSize: '1.15rem'}} 
                onClick={handleCompleteProcess}
              >
                <span role="img" aria-label="check">✅</span> Hoàn thành quá trình
              </button>
            )}
            <button className="btn btn-outline-secondary btn-lg px-4 py-2 fw-bold" style={{fontSize: '1.15rem'}} onClick={() => navigate(-1)}>
              ← Quay lại
            </button>
          </div>
        </main>
      </div>
      
      {/* CSS cho animation loading spinner */}
      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
} 