
import React, { useState } from "react";
import './DonationManagement.css';
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { validateDonation, getStatusStyle } from './utils';
import { adminDonationRegisterAPI } from '../../services/admin/donationRegister';

// Status mapping từ DB sang hiển thị
const STATUS_MAPPING = {
  'pending': 'Chờ xác nhận',
  'confirmed': 'Xác nhận',
  'Not meeting health requirements': 'Không đủ điều kiện sức khỏe'
};

// Reverse mapping từ hiển thị sang DB
const REVERSE_STATUS_MAPPING = {
  'Chờ xác nhận': 'pending',
  'Xác nhận': 'confirmed',
  'Không đủ điều kiện sức khỏe': 'Not meeting health requirements'
};

const bloodTypes = ["Tất cả", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Rh_Null", "Bombay"];
const statuses = ["Tất cả", "Chờ xác nhận", "Xác nhận", "Không đủ điều kiện sức khỏe"];

const PAGE_SIZE = 8;

const sortOptions = [
  { value: '', label: 'Sắp xếp theo...' },
  { value: 'code', label: 'Mã đơn nhận' },
  { value: 'name', label: 'Họ và tên' },
  { value: 'donateDate', label: 'Ngày và giờ hiến' }
];

const statusOptions = ["Chờ xác nhận", "Xác nhận", "Không đủ điều kiện sức khỏe"];
const bloodTypesSort = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Rh_Null", "Bombay"];
const orderOptions = [
  { value: 'asc', label: 'Tăng dần' },
  { value: 'desc', label: 'Giảm dần' }
];

export default function DonationManagement() {
  const [originalDonations, setOriginalDonations] = useState([]);
  const [search, setSearch] = useState("");
  const [blood, setBlood] = useState("Tất cả");
  const [status, setStatus] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterStatus, setFilterStatus] = useState(statusOptions[0]);
  const [filterBlood, setFilterBlood] = useState(bloodTypesSort[0]);

  // Fetch donations từ API
    const fetchDonations = async () => {
    setLoading(true);
      try {
      const data = await adminDonationRegisterAPI.getAllForManagement();
      console.log('API response data:', data);
      
      // Map dữ liệu từ API response
      const mappedData = data.map(d => ({
        code: d.registerId.toString(),  // Mã đơn nhận
        name: d.donorName,              // Họ và tên
        donateDate: d.appointmentTime || formatDate(d.appointmentDate), // Ngày và giờ hiến (sử dụng appointmentTime nếu có)
        status: STATUS_MAPPING[d.status] || d.status, // Trạng thái xử lý (Vietnamese)
        blood: d.bloodGroup,            // Nhóm máu
        originalStatus: d.status,       // Lưu status gốc từ DB
        registerId: d.registerId        // Lưu registerId để update
      }));
      // Sắp xếp theo trạng thái mong muốn
      const statusOrder = {
        'Chờ xác nhận': 0,
        'Xác nhận': 1,
        'Không đủ điều kiện sức khỏe': 2
      };
      mappedData.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
      setOriginalDonations(mappedData);
      } catch (error) {
      console.error('Error fetching donations:', error);
      // Fallback to mock data if API fails
        const fallbackData = [
        { code: "1", name: "Nguyễn Duy Hiếu", donateDate: "11/4/2024", status: "Xác nhận", blood: "A+", originalStatus: "confirmed", registerId: 1 },
        { code: "2", name: "Lữ Phước Nhật Tú", donateDate: "15/4/2024", status: "Chờ xác nhận", blood: "O-", originalStatus: "pending", registerId: 2 },
        { code: "3", name: "Nguyễn Gia Triệu", donateDate: "4/11/2024", status: "Xác nhận", blood: "O+", originalStatus: "confirmed", registerId: 3 },
        { code: "4", name: "Đậu Nguyễn Bảo Tuấn", donateDate: "27/5/2024", status: "Không đủ điều kiện sức khỏe", blood: "AB+", originalStatus: "Not meeting health requirements", registerId: 4 },
      ];
      setOriginalDonations(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // Format date từ YYYY-MM-DD sang DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  React.useEffect(() => {
    fetchDonations();
  }, []);

  // Hàm tính toán danh sách hiển thị
  const getFilteredAndSortedDonations = () => {
    let filtered = [...originalDonations];
    if (search.trim()) filtered = filtered.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
    if (status !== "Tất cả") filtered = filtered.filter(d => d.status === status);
    if (blood !== "Tất cả") filtered = filtered.filter(d => d.blood === blood);
    if (sortBy && sortBy !== '') {
  if (sortBy === 'code') {
        filtered = filtered.sort((a, b) => sortOrder === 'asc' ? parseInt(a.code) - parseInt(b.code) : parseInt(b.code) - parseInt(a.code));
      } else if (sortBy === 'name') {
    filtered = filtered.sort((a, b) => sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
      } else if (sortBy === 'donateDate') {
        filtered = filtered.sort((a, b) => {
          const dateA = new Date(a.donateDate.split('/').reverse().join('-'));
          const dateB = new Date(b.donateDate.split('/').reverse().join('-'));
          return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
      } else if (sortBy === 'status') {
        const statusOrder = {
          'Chờ xác nhận': 0,
          'Xác nhận': 1,
          'Không đủ điều kiện sức khỏe': 2
        };
        filtered = filtered.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
      } else if (sortBy === 'blood') {
        filtered = filtered.sort((a, b) => sortOrder === 'asc' ? a.blood.localeCompare(b.blood) : b.blood.localeCompare(a.blood));
      }
    }
    return filtered;
  };

  const donations = getFilteredAndSortedDonations();

  // Pagination logic
  const totalPages = Math.ceil(donations.length / PAGE_SIZE);
  const paged = donations.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  React.useEffect(() => { setPage(1); }, [search, blood, status]);

  // Cập nhật status donation
  const handleStatusUpdate = async (idx, newStatus) => {
    const donation = donations[idx];
    const dbStatus = REVERSE_STATUS_MAPPING[newStatus];
    
    try {
      await adminDonationRegisterAPI.updateDonationStatus(donation.registerId, dbStatus);
      // Refresh data sau khi update
      await fetchDonations();
    } catch (error) {
      console.error('Error updating donation status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái!');
    }
  };

  // Edit logic
  const handleEdit = (idx) => {
    const donation = donations[idx];
    navigate(`/admin/donations/${donation.registerId}`); // Sử dụng registerId thực tế
  };

  const handleSaveEdit = () => {
    const errors = validateDonation(editData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    const globalIdx = originalDonations.findIndex(d => d === donations[editIdx]);
    const newDonations = [...originalDonations];
    newDonations[globalIdx] = editData;
    setOriginalDonations(newDonations);
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
  
  const handleConfirmDelete = async () => {
    const donation = donations[deleteIdx];
    try {
      await adminDonationRegisterAPI.deleteDonationRegister(donation.registerId);
      await fetchDonations(); // Refresh data
    setDeleteIdx(null);
    } catch (error) {
      console.error('Error deleting donation:', error);
      alert('Có lỗi xảy ra khi xóa đơn hiến!');
    }
  };

  const handleCancelDelete = () => { setDeleteIdx(null); };

  // Add logic (nếu cần)
  const handleAdd = () => {
    setAddMode(true);
    setEditIdx(null);
    setEditData({
      code: '', name: '', donateDate: '', status: 'Chờ xác nhận', blood: bloodTypes[1]
    });
    setValidationErrors({});
  };

  const handleSaveAdd = () => {
    const errors = validateDonation(editData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setOriginalDonations([editData, ...originalDonations]);
    setAddMode(false);
    setEditData(null);
    setValidationErrors({});
  };

  const handleCancelAdd = () => {
    setAddMode(false);
    setEditData(null);
    setValidationErrors({});
  };

  // Bulk operations
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(paged.map((_, i) => i));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (index, isChecked) => {
    if (isChecked) {
      setSelectedItems([...selectedItems, index]);
    } else {
      setSelectedItems(selectedItems.filter(i => i !== index));
    }
  };

  const handleBulkDelete = () => {
    setShowBulkDeleteModal(true);
  };

  const handleConfirmBulkDelete = async () => {
    const itemsToDelete = selectedItems.map(i => donations[i]);
    try {
      // Delete multiple items
      await Promise.all(
        itemsToDelete.map(item => 
          adminDonationRegisterAPI.deleteDonationRegister(item.registerId)
        )
      );
      await fetchDonations(); // Refresh data
    setSelectedItems([]);
    setShowBulkDeleteModal(false);
    } catch (error) {
      console.error('Error bulk deleting donations:', error);
      alert('Có lỗi xảy ra khi xóa các đơn hiến!');
    }
  };

  const handleCancelBulkDelete = () => {
    setShowBulkDeleteModal(false);
  };

  // Reset selected items when page or filters change
  React.useEffect(() => {
    setSelectedItems([]);
  }, [page, search, blood, status]);

  // Lưu danh sách vào localStorage mỗi khi thay đổi
  React.useEffect(() => {
    localStorage.setItem('donations', JSON.stringify(originalDonations));
  }, [originalDonations]);

  // Khi chọn lại 'Sắp xếp theo...'
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    if (e.target.value === '') {
      // Không cần setDonations, chỉ cần setSortBy, render sẽ tự động cập nhật
    }
  };

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="donation-page-root">
          <h2 className="donation-title">Quản lý đơn hiến</h2>
          <div className="donation-toolbar" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <input className="donation-search" placeholder="🔍 Tìm kiếm người hiến ....."
              value={search} onChange={e => setSearch(e.target.value)} style={{ height: 40, minWidth: 220 }} />
            <select className="donation-filter" value={sortBy} onChange={handleSortChange} style={{ height: 40 }}>
              {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            {sortBy && sortBy !== '' && (
              <select className="donation-filter" value={sortOrder} onChange={e => setSortOrder(e.target.value)} style={{ height: 40 }}>
                <option value="asc">Tăng dần</option>
                <option value="desc">Giảm dần</option>
              </select>
            )}
            <select className="donation-filter" value={status} onChange={e => setStatus(e.target.value)} style={{ height: 40 }}>
              <option value="Tất cả">Trạng thái</option>
              {statuses.filter(opt => opt !== 'Tất cả').map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            <select className="donation-filter" value={blood} onChange={e => setBlood(e.target.value)} style={{ height: 40 }}>
              <option value="Tất cả">Nhóm máu</option>
              {bloodTypes.filter(opt => opt !== 'Tất cả').map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            <button className="donation-filter-btn" style={{ height: 40, padding: '0 12px' }}>⏷</button>
            <button 
              className="modern-export-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
                marginLeft: '8px',
                height: 40
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1d4ed8';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(37, 99, 235, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(37, 99, 235, 0.2)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7,10 12,15 17,10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Xuất tệp</span>
            </button>
            {selectedItems.length > 0 ? (
              <button 
                className="modern-delete-btn"
                onClick={handleBulkDelete}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)',
                  marginLeft: '8px',
                  position: 'relative',
                  height: 40
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#b91c1c';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(220, 38, 38, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#dc2626';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px rgba(220, 38, 38, 0.2)';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3,6 5,6 21,6"></polyline>
                  <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                <span>Xóa đơn</span>
                <span 
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '2px 8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginLeft: '4px'
                  }}
                >
                  {selectedItems.length}
                </span>
              </button>
            ) : null}
          </div>
          <div className="donation-table-card">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-center" style={{minWidth: 50}}>
                    <input 
                      type="checkbox" 
                      checked={selectedItems.length === paged.length && paged.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-center" style={{minWidth: 60}}>Mã</th>
                  <th className="text-center" style={{minWidth: 110}}>Mã đơn nhận</th>
                  <th className="text-center" style={{minWidth: 180}}>Họ và tên</th>
                  <th className="text-center" style={{minWidth: 160}}>Ngày và giờ hiến</th>
                  <th className="text-center" style={{minWidth: 120}}>Trạng thái</th>
                  <th className="text-center" style={{minWidth: 100}}>Nhóm máu</th>
                  <th className="text-center" style={{minWidth: 90}}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="text-center text-secondary">Đang tải dữ liệu...</td>
                  </tr>
                ) : paged.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center text-secondary">Không có dữ liệu phù hợp</td>
                  </tr>
                ) : (
                  paged.map((d, i) => (
                  <tr key={i}>
                    <td className="text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedItems.includes(i)}
                        onChange={(e) => handleSelectItem(i, e.target.checked)}
                      />
                    </td>
                    <td className="text-center">{d.id || (i+1+(page-1)*PAGE_SIZE)}</td>
                    <td className="text-center">{d.code}</td>
                    <td className="text-truncate" style={{maxWidth: 180}}>{d.name}</td>
                    <td className="text-center">{d.donateDate}</td>
                    <td className="text-center">
                      <span style={getStatusStyle(d.status)}>● {d.status}</span>
                    </td>
                    <td className="text-center">{d.blood}</td>
                    <td className="text-center">
                      <div style={{display: 'flex', gap: '6px', justifyContent: 'center'}}>
                          <button 
                            onClick={() => handleEdit(i)}
                            title="Chỉnh sửa"
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
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Popup thêm mới hoặc chỉnh sửa đơn hiến */}
          {(addMode || editIdx !== null) && (
            <div className="modal fade show" style={{display:'block',background:'rgba(0,0,0,0.3)'}} tabIndex="-1">
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header" style={{background:'#8fd19e'}}>
                    <h5 className="modal-title">{addMode ? 'Thêm đơn hiến' : 'Chỉnh sửa đơn hiến'}</h5>
                    <button type="button" className="btn-close" onClick={addMode ? handleCancelAdd : handleCancelEdit}></button>
                  </div>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <input 
                          className={`form-control ${validationErrors.code ? 'is-invalid' : ''}`} 
                          placeholder="Mã đơn nhận*" 
                          value={editData.code} 
                          onChange={e=>setEditData({...editData,code:e.target.value})} 
                        />
                        {validationErrors.code && <div className="invalid-feedback">{validationErrors.code}</div>}
                      </div>
                      <div className="col-md-6">
                        <input 
                          className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`} 
                          placeholder="Họ và tên*" 
                          value={editData.name} 
                          onChange={e=>setEditData({...editData,name:e.target.value})} 
                        />
                        {validationErrors.name && <div className="invalid-feedback">{validationErrors.name}</div>}
                      </div>
                      <div className="col-md-6">
                        <input 
                          className={`form-control ${validationErrors.donateDate ? 'is-invalid' : ''}`} 
                          placeholder="Ngày và giờ hiến*" 
                          value={editData.donateDate} 
                          onChange={e=>setEditData({...editData,donateDate:e.target.value})} 
                        />
                        {validationErrors.donateDate && <div className="invalid-feedback">{validationErrors.donateDate}</div>}
                      </div>
                      <div className="col-md-6">
                        <select className="form-control" value={editData.status} onChange={e=>setEditData({...editData,status:e.target.value})}>
                          {statuses.filter(s=>s!=="Tất cả").map(s=><option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <select className="form-control" value={editData.blood} onChange={e=>setEditData({...editData,blood:e.target.value})}>
                          {bloodTypes.filter(b=>b!=="Tất cả").map(b=><option key={b}>{b}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-success" onClick={addMode ? handleSaveAdd : handleSaveEdit}>Lưu</button>
                    <button className="btn btn-danger" onClick={addMode ? handleCancelAdd : handleCancelEdit}>Hủy</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Modal xác nhận xóa đơn lẻ */}
          {deleteIdx !== null && (
            <div className="modal fade show" style={{display:'block',background:'rgba(0,0,0,0.3)'}} tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Xác nhận xóa</h5>
                  </div>
                  <div className="modal-body">
                    <p>Bạn có chắc muốn xóa đơn hiến này không?</p>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-danger" onClick={handleConfirmDelete}>Xóa</button>
                    <button className="btn btn-secondary" onClick={handleCancelDelete}>Hủy</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Modal xác nhận xóa hàng loạt */}
          {showBulkDeleteModal && (
            <div className="modal fade show" style={{display:'block',background:'rgba(0,0,0,0.3)'}} tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Xác nhận xóa hàng loạt</h5>
                  </div>
                  <div className="modal-body">
                    <p>Bạn có chắc muốn xóa <strong>{selectedItems.length}</strong> đơn hiến đã chọn không?</p>
                    <p className="text-muted">Hành động này không thể hoàn tác.</p>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-danger" onClick={handleConfirmBulkDelete}>
                      Xóa {selectedItems.length} đơn
                    </button>
                    <button className="btn btn-secondary" onClick={handleCancelBulkDelete}>Hủy</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="donation-pagination">
            <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))}>{'⟨'}</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>{'⟩'}</button>
          </div>
        </main>
      </div>
    </div>
  );
} 