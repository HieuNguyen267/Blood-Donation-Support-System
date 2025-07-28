import React, { useState } from "react";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import './BloodRequestManagement.css';
import { useNavigate } from 'react-router-dom';
import { validateRequest } from './utils';
import { bloodRequestAPI } from '../../services/api';


const statuses = ["Chờ liên hệ", "Đang liên hệ", "Chờ xác nhận", "Đang xử lý", "Hủy đơn yêu cầu", "Đang vận chuyển", "Hoàn thành"];
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Rh NULL", "Bombay"];
const urgencyLevels = ["Khẩn cấp", "Bình thường"];




const PAGE_SIZE = 5;

// Mapping trạng thái emergency_status sang tiếng Việt
const getEmergencyStatusVN = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'pending': return 'Chờ liên hệ';
    case 'contacting': return 'Đang liên hệ';
    case 'contact successful': return 'Liên hệ thành công';
    case 'completed': return 'Hoàn thành';
    default: return status;
  }
};

// Hàm xác định trạng thái hiển thị theo thứ tự ưu tiên
const getDisplayStatus = (request) => {
  // Ưu tiên cao nhất: emergency_status
  if (request.emergency_status) {
    return getEmergencyStatusVN(request.emergency_status);
  }
  
  // Ưu tiên thứ hai: processing_status
  if (request.processing_status) {
    switch ((request.processing_status || '').toLowerCase()) {
      case 'pending': return 'Chờ xử lý';
      case 'in transit': return 'Đang vận chuyển';
      case 'completed': return 'Hoàn thành';
      default: return request.processing_status;
    }
  }
  
  // Ưu tiên thấp nhất: request_status
  if (request.request_status === 'cancelled') {
    return 'Hủy đơn yêu cầu';
  }
  return request.request_status || 'Chờ duyệt';
};

// Mapping trạng thái sang class màu sắc
const getStatusClass = (status) => {
  if (!status) return 'status-gray';
  const s = status.toLowerCase();
  if (s === 'chờ liên hệ') return 'status-orange';
  if (s === 'đang liên hệ') return 'status-blue';
  if (s === 'liên hệ thành công' || s === 'hoàn thành') return 'status-green';
  if (s === 'chờ xác nhận') return 'status-orange';
  if (s === 'từ chối') return 'status-red';
  if (s === 'xác nhận') return 'status-green';
  if (s === 'hủy đơn yêu cầu') return 'status-red';
  if (s === 'chờ xử lý') return 'status-orange';
  if (s === 'đang vận chuyển') return 'status-blue';
  return 'status-gray';
};

export default function BloodRequestManagement() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Tất cả");
  const [bloodGroup, setBloodGroup] = useState("Tất cả");
  const [urgency, setUrgency] = useState("Tất cả");
  const [dateSort, setDateSort] = useState("");
  const [page, setPage] = useState(1);
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await bloodRequestAPI.getAllAdminBloodRequests();
        console.log('BloodRequest API data:', data); // Debug log
        setRequests(data.map(r => ({
          request_id: r.requestId,
          facility_name: r.facilityName,
          blood_group: r.bloodGroup,
          quantity_requested: r.quantityRequested,
          is_emergency: r.isEmergency, // boolean từ backend
          required_by: r.requiredBy,
          contact_person: r.contactPerson,
          contact_phone: r.contactPhone,
          manager: r.fullName,
          delivery_person: r.deliveryPerson,
          special_requirements: r.specialRequirements, // ghi chú từ backend
          request_status: r.requestStatus,
          emergency_status: r.emergencyStatus, // Thêm trường emergency_status
          processing_status: r.processingStatus // Thêm trường processing_status
        })));
      } catch (error) {
        setRequests([]);
      }
    };
    fetchRequests();
  }, []);

  // Save to localStorage when requests change
  React.useEffect(() => {
    localStorage.setItem('bloodRequests', JSON.stringify(requests));
  }, [requests]);

  // Filter và sort data
  let filtered = requests.filter(r => 
    r.facility_name.toLowerCase().includes(search.toLowerCase()) &&
    (status === "Tất cả" || getDisplayStatus(r) === status) &&
    (bloodGroup === "Tất cả" || r.blood_group === bloodGroup) &&
    (urgency === "Tất cả" || (urgency === "Khẩn cấp" ? r.is_emergency : !r.is_emergency))
  );

  // Sắp xếp theo ngày cần nếu được chọn
  if (dateSort) {
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.required_by || '');
      const dateB = new Date(b.required_by || '');
      
      if (dateSort === 'asc') {
        return dateA - dateB; // Tăng dần (sớm nhất lên đầu)
      } else {
        return dateB - dateA; // Giảm dần (muộn nhất lên đầu)
      }
    });
  } else {
    // Sắp xếp mặc định theo mức độ khẩn cấp từ cao đến thấp
    filtered = filtered.sort((a, b) => {
    const urgencyOrder = { critical: 4, emergency: 3, urgent: 2, routine: 1 };
    const urgencyDiff = urgencyOrder[b.urgency_level] - urgencyOrder[a.urgency_level];
    
    // Nếu cùng mức độ khẩn cấp, sắp xếp theo thời gian cần (sớm nhất lên đầu)
    if (urgencyDiff === 0) {
      return new Date(a.required_by) - new Date(b.required_by);
    }
    
    return urgencyDiff;
  });
  }
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  React.useEffect(() => { setPage(1); }, [search, status, bloodGroup, urgency, dateSort]);

  // Validation
  const validateRequestData = (data) => {
    return validateRequest(data);
  };

  // Edit logic - Navigate to detail page
  const handleEdit = (requestId) => {
    navigate(`/admin/blood-requests/${requestId}`);
  };
  const handleSaveEdit = () => {
    const errors = validateRequestData(editData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    const newRequests = [...requests];
    newRequests[editIdx] = { ...editData };
    setRequests(newRequests);
    setEditIdx(null);
    setEditData(null);
    setValidationErrors({});
  };
  const handleCancelEdit = () => {
    setEditIdx(null);
    setEditData(null);
    setValidationErrors({});
  };
  // Delete logic
  const handleDelete = (idx) => { setDeleteIdx(idx); };
  const handleConfirmDelete = () => {
    const globalIdx = requests.findIndex(r => r === filtered[deleteIdx]);
    setRequests(requests.filter((_, i) => i !== globalIdx));
    setDeleteIdx(null);
  };
  const handleCancelDelete = () => { setDeleteIdx(null); };

  // Add logic
  const handleAdd = () => {
    setAddMode(true);
    setEditIdx(null);
    setEditData({
      facility_name: '', blood_group: '', quantity_requested: '', urgency_level: '', patient_info: '', required_by: '', quantity_fulfilled: 0, request_status: 'pending', special_requirements: '', contact_person: '', contact_phone: '', notes: '', manager: '', delivery_person: ''
    });
    setValidationErrors({});
  };
  const handleSaveAdd = () => {
    const errors = validateRequestData(editData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setRequests([{ ...editData, request_id: Date.now() }, ...requests]);
    setAddMode(false);
    setEditData(null);
    setValidationErrors({});
  };
  const handleCancelAdd = () => {
    setAddMode(false);
    setEditData(null);
    setValidationErrors({});
  };

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="donor-page-root">
          <h2 className="donor-title">Quản lý đơn yêu cầu máu</h2>
          <div className="donor-toolbar" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <input className="donor-search" placeholder="🔍 Tìm kiếm cơ sở y tế ..."
              value={search} onChange={e => setSearch(e.target.value)} style={{ height: 40, minWidth: 220 }} />
            <select className="donor-filter" value={urgency} onChange={e => setUrgency(e.target.value)} style={{ height: 40 }}>
              <option value="Tất cả">Mức độ</option>
              {urgencyLevels.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <select className="donor-filter" value={status} onChange={e => setStatus(e.target.value)} style={{ height: 40 }}>
              <option value="Tất cả">Trạng thái</option>
              {statuses.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <select className="donor-filter" value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} style={{ height: 40 }}>
              <option value="Tất cả">Nhóm máu</option>
              {bloodGroups.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <select className="donor-filter" value={dateSort} onChange={e => setDateSort(e.target.value)} style={{ height: 40 }}>
              <option value="">Ngày cần</option>
              <option value="asc">Tăng dần</option>
              <option value="desc">Giảm dần</option>
            </select>
          </div>
          <div className="donor-table-card">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-center" style={{minWidth: 60}}>Mã</th>
                  <th className="text-center">Cơ sở y tế</th>
                  <th className="text-center">Nhóm máu</th>
                  <th className="text-center">Số lượng (ml)</th>
                  <th className="text-center">Mức độ</th>
                  <th className="text-center">Ngày cần</th>
                  <th className="text-center">Người liên hệ</th>
                  <th className="text-center">SĐT liên hệ</th>
                  <th className="text-center">Người phụ trách</th>
                  <th className="text-center">Người vận chuyển</th>
                  <th className="text-center">Ghi chú</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((r, i) => (
                  <tr key={i}>
                    <td className="text-center">{r.request_id || (i+1+(page-1)*PAGE_SIZE)}</td>
                    <td className="text-center">{r.facility_name}</td>
                    <td className="text-center">{r.blood_group}</td>
                    <td className="text-center">{r.quantity_requested}</td>
                    <td className="text-center">
                      <span style={{
                        color: r.is_emergency ? '#dc2626' : '#059669',
                        fontWeight: '600',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: r.is_emergency ? '#fef2f2' : '#f0fdf4',
                        border: `1px solid ${r.is_emergency ? '#fecaca' : '#bbf7d0'}`
                      }}>
                        {r.is_emergency ? "Khẩn cấp" : "Bình thường"}
                      </span>
                    </td>
                    <td className="text-center">{r.required_by?.replace('T', ' ')}</td>
                    <td className="text-center">{r.contact_person}</td>
                    <td className="text-center">{r.contact_phone}</td>
                    <td className="text-center">{r.manager}</td>
                    <td className="text-center">{r.delivery_person}</td>
                    <td className="text-center">{r.special_requirements}</td>
                    <td className="text-center">
                      <span>
                        <span className={`status-dot ${getStatusClass(getDisplayStatus(r))}`}></span>
                        <span className={getStatusClass(getDisplayStatus(r))}>{getDisplayStatus(r)}</span>
                      </span>
                    </td>
                    <td className="text-center">
                      <div style={{display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap'}}>
                        <button 
                          onClick={() => handleEdit(r.request_id)}
                          title="Xem chi tiết"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#059669',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            boxShadow: '0 1px 3px rgba(5, 150, 105, 0.2)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#047857';
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 2px 6px rgba(5, 150, 105, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#059669';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 1px 3px rgba(5, 150, 105, 0.2)';
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(i)}
                          title="Xóa"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#dc2626',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            boxShadow: '0 1px 3px rgba(220, 38, 38, 0.2)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#b91c1c';
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 2px 6px rgba(220, 38, 38, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#dc2626';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 1px 3px rgba(220, 38, 38, 0.2)';
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center text-secondary">Không có dữ liệu phù hợp</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
         
          {/* Modal xác nhận xóa */}
          {deleteIdx !== null && (
            <div className="modal fade show" style={{display:'block',background:'rgba(0,0,0,0.3)'}} tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Xác nhận xóa</h5>
                  </div>
                  <div className="modal-body">
                    <p>Bạn có chắc muốn xóa đơn yêu cầu máu này không?</p>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-danger" onClick={handleConfirmDelete}>Xóa</button>
                    <button className="btn btn-secondary" onClick={handleCancelDelete}>Hủy</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="donor-pagination">
            <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))}>{'⟨'}</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>{'⟩'}</button>
          </div>
        </main>
      </div>
    </div>
  );
} 