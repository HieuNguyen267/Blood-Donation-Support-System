import React, { useState } from "react";
import './DonorManagement.css';
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { validateDonor, getStatusStyle } from './utils';
import { donorAPI } from '../../services/api';

const donorsDataInit = [
  { id: 1, name: "Đậu Nguyễn Bảo Tuấn", gender: "Nam", phone: "03627929786", address: "abcdef", blood: "A+", age: 20, email: "abcde@gmail.com", last: "2024-07-07", totalDonation: 5, ready: "Có" },
  { id: 2, name: "Nguyễn Anh Khoa", gender: "Nam", phone: "03634529786", address: "abcdef", blood: "O+", age: 20, email: "abcde@gmail.com", last: "2024-01-04", totalDonation: 3, ready: "Không" },
  { id: 3, name: "Lữ Phước Nhật Tú", gender: "Nam", phone: "08627929786", address: "abcdef", blood: "AB+", age: 20, email: "abcde@gmail.com", last: "2024-01-06", totalDonation: 7, ready: "Có" },
  { id: 4, name: "Nguyễn Duy Hiếu", gender: "Nam", phone: "07627929786", address: "abcdef", blood: "B+", age: 20, email: "abcde@gmail.com", last: "2024-01-05", totalDonation: 2, ready: "Không" },
  { id: 5, name: "Nguyễn Duy Hiếu", gender: "Nam", phone: "04627929786", address: "abcdef", blood: "A+", age: 20, email: "abcde@gmail.com", last: "2024-11-09", totalDonation: 8, ready: "Có" },
];

const sortOptions = [
  { value: '', label: 'Sắp xếp theo...' },
  { value: 'blood', label: 'Nhóm máu' },
  { value: 'name', label: 'Tên' },
  { value: 'id', label: 'Mã' },
  { value: 'totalDonation', label: 'Tổng số lần hiến' },
  { value: 'ready', label: 'Sẵn sàng hiến máu' },
];
const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "Rh NULL", "Bombay"];
const readyOptions = ["Có", "Không"];
const orderOptions = [
  { value: 'asc', label: 'Tăng dần' },
  { value: 'desc', label: 'Giảm dần' }
];

export default function DonorManagement() {
  const [donors, setDonors] = useState(donorsDataInit);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterBlood, setFilterBlood] = useState(bloodTypes[0]);
  const [filterReady, setFilterReady] = useState(readyOptions[0]);

  const PAGE_SIZE = 5;

  // Filter logic
  let filtered = donors.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  if (sortBy === 'blood') {
    filtered = filtered.filter(d => d.blood === filterBlood);
  }
  if (sortBy === 'ready') {
    filtered = filtered.filter(d => (d.ready || '') === filterReady);
  }
  if (sortBy === 'name') {
    filtered = filtered.sort((a, b) => sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
  }
  if (sortBy === 'id') {
    filtered = filtered.sort((a, b) => sortOrder === 'asc' ? (a.id - b.id) : (b.id - a.id));
  }
  if (sortBy === 'totalDonation') {
    filtered = filtered.sort((a, b) => sortOrder === 'asc' ? (a.totalDonation - b.totalDonation) : (b.totalDonation - a.totalDonation));
  }

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  // Reset page if filter/search changes
  React.useEffect(() => { setPage(1); }, [search, sortBy, sortOrder, filterBlood, filterReady]);

  // Xử lý mở popup sửa
  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditData({...filtered[idx]});
    setValidationErrors({});
  };
  
  // Xử lý lưu chỉnh sửa
  const handleSaveEdit = () => {
    const errors = validateDonor(editData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    const globalIdx = donors.findIndex(d => d === filtered[editIdx]);
    const newDonors = [...donors];
    newDonors[globalIdx] = editData;
    setDonors(newDonors);
    setEditIdx(null);
    setEditData(null);
    setValidationErrors({});
  };
  
  // Xử lý hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditIdx(null);
    setEditData(null);
    setValidationErrors({});
  };
  
  // Xử lý mở modal xác nhận xóa
  const handleDelete = (idx) => {
    setDeleteIdx(idx);
  };
  
  // Xác nhận xóa
  const handleConfirmDelete = () => {
    const globalIdx = donors.findIndex(d => d === filtered[deleteIdx]);
    const newDonors = donors.filter((_, i) => i !== globalIdx);
    setDonors(newDonors);
    setDeleteIdx(null);
  };
  
  // Hủy xóa
  const handleCancelDelete = () => {
    setDeleteIdx(null);
  };

  // Xử lý mở popup thêm mới
  const handleAdd = () => {
    setAddMode(true);
    setEditIdx(null);
    setEditData({
      name: '', gender: 'Nam', phone: '', address: '', blood: 'A+', age: '', email: '', last: '', totalDonation: 0, ready: 'Có'
    });
    setValidationErrors({});
  };
  
  // Lưu thêm mới
  const handleSaveAdd = () => {
    const errors = validateDonor(editData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setDonors([editData, ...donors]);
    setAddMode(false);
    setEditData(null);
    setValidationErrors({});
  };
  
  // Hủy thêm mới
  const handleCancelAdd = () => {
    setAddMode(false);
    setEditData(null);
    setValidationErrors({});
  };

  React.useEffect(() => {
    const fetchDonors = async () => {
      try {
        const data = await donorAPI.getAllDonors();
        // Map dữ liệu backend về đúng format
        setDonors(data.map(d => ({
          id: d.id,
          name: d.fullName,
          gender: d.gender,
          phone: d.phone,
          address: d.address,
          blood: d.bloodGroup,
          age: d.age,
          email: d.email,
          last: d.lastDonationDate,
          totalDonation: d.totalDonations,
          ready: d.isEligible
        })));
      } catch (error) {
        console.error('Error fetching donors:', error);
        // Nếu lỗi thì fallback về dữ liệu mẫu
        setDonors(donorsDataInit);
      }
    };
    fetchDonors();
  }, []);

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="donor-page-root">
          <h2 className="donor-title">Quản lý người hiến</h2>
          <div className="donor-toolbar">
            <input className="donor-search" placeholder="🔍 Tìm kiếm người hiến ....."
              value={search} onChange={e => setSearch(e.target.value)} />
            <select className="donor-filter" value={sortBy} onChange={e => { setSortBy(e.target.value); setSortOrder('asc'); }}>
              {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            {sortBy === 'blood' && (
              <select className="donor-filter" value={filterBlood} onChange={e => setFilterBlood(e.target.value)}>
                {bloodTypes.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            )}
            {sortBy === 'ready' && (
              <select className="donor-filter" value={filterReady} onChange={e => setFilterReady(e.target.value)}>
                {readyOptions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            )}
            {(sortBy === 'name' || sortBy === 'id' || sortBy === 'totalDonation') && (
              <select className="donor-filter" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                {orderOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            )}
            <button className="donor-export">⭳ Xuất tệp</button>
          </div>
          <div className="donor-table-card">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-center" style={{minWidth: 60}}>Mã</th>
                  <th className="text-center" style={{minWidth: 160}}>Họ và tên</th>
                  <th className="text-center" style={{minWidth: 90}}>Giới tính</th>
                  <th className="text-center" style={{minWidth: 120}}>Số điện thoại</th>
                  <th className="text-center" style={{minWidth: 110, maxWidth: 400}}>Địa chỉ</th>
                  <th className="text-center" style={{minWidth: 80}}>Loại máu</th>
                  <th className="text-center" style={{minWidth: 60}}>Tuổi</th>
                  <th className="text-center" style={{minWidth: 180, maxWidth: 400}}>Email</th>
                  <th className="text-center" style={{minWidth: 110}}>Ngày cuối hiến</th>
                  <th className="text-center" style={{minWidth: 110}}>Tổng số lần hiến</th>
                  <th className="text-center" style={{minWidth: 100}}>Sẵn sàng hiến máu</th>
                  <th className="text-center" style={{minWidth: 90}}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((d, i) => (
                  <tr key={i}>
                    <td className="text-center">{d.id || (i+1+(page-1)*PAGE_SIZE)}</td>
                    <td className="text-truncate" style={{maxWidth: 180}}>{d.name}</td>
                    <td className="text-center">{d.gender}</td>
                    <td className="text-center">{d.phone}</td>
                    <td className="text-center" style={{maxWidth: 400, wordBreak: 'break-all'}}>{d.address}</td>
                    <td className="text-center">{d.blood}</td>
                    <td className="text-center">{d.age}</td>
                    <td className="text-center" style={{maxWidth: 400, wordBreak: 'break-all'}}>{d.email}</td>
                    <td className="text-center">{d.last}</td>
                    <td className="text-center">{d.totalDonation || 0}</td>
                    <td className="text-center">{d.ready || ''}</td>
                    <td className="text-center">
                      <div style={{display: 'flex', gap: '6px', justifyContent: 'center'}}>
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
                    <td colSpan={12} className="text-center text-secondary">Không có dữ liệu phù hợp</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Popup thêm mới hoặc chỉnh sửa donor */}
          {(addMode || editIdx !== null) && (
            <div className="modal fade show" style={{display:'block',background:'rgba(0,0,0,0.3)'}} tabIndex="-1">
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header" style={{background:'#8fd19e'}}>
                    <h5 className="modal-title">{addMode ? 'Thêm người hiến' : 'Chỉnh sửa người hiến'}</h5>
                    <button type="button" className="btn-close" onClick={addMode ? handleCancelAdd : handleCancelEdit}></button>
                  </div>
                  <div className="modal-body">
                    <div className="row g-3">
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
                        <select className="form-control" value={editData.gender} onChange={e=>setEditData({...editData,gender:e.target.value})}>
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <input 
                          className={`form-control ${validationErrors.phone ? 'is-invalid' : ''}`} 
                          placeholder="Số điện thoại*" 
                          value={editData.phone} 
                          onChange={e=>setEditData({...editData,phone:e.target.value})} 
                        />
                        {validationErrors.phone && <div className="invalid-feedback">{validationErrors.phone}</div>}
                      </div>
                      <div className="col-md-6">
                        <select className="form-control" value={editData.blood} onChange={e=>setEditData({...editData,blood:e.target.value})}>
                          {bloodTypes.filter(b=>b!=="Tất cả").map(b=><option key={b}>{b}</option>)}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <input 
                          className={`form-control ${validationErrors.age ? 'is-invalid' : ''}`} 
                          placeholder="Tuổi*" 
                          value={editData.age} 
                          onChange={e=>setEditData({...editData,age:e.target.value})} 
                        />
                        {validationErrors.age && <div className="invalid-feedback">{validationErrors.age}</div>}
                      </div>
                      <div className="col-md-6">
                        <input 
                          className={`form-control ${validationErrors.address ? 'is-invalid' : ''}`} 
                          placeholder="Địa chỉ*" 
                          value={editData.address} 
                          onChange={e=>setEditData({...editData,address:e.target.value})} 
                        />
                        {validationErrors.address && <div className="invalid-feedback">{validationErrors.address}</div>}
                      </div>
                      <div className="col-md-6">
                        <input 
                          className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`} 
                          placeholder="Email*" 
                          value={editData.email} 
                          onChange={e=>setEditData({...editData,email:e.target.value})} 
                        />
                        {validationErrors.email && <div className="invalid-feedback">{validationErrors.email}</div>}
                      </div>
                      <div className="col-md-6">
                        <input 
                          className={`form-control ${validationErrors.last ? 'is-invalid' : ''}`} 
                          placeholder="Ngày cuối hiến (YYYY-MM-DD)" 
                          value={editData.last} 
                          onChange={e=>setEditData({...editData,last:e.target.value})} 
                        />
                        {validationErrors.last && <div className="invalid-feedback">{validationErrors.last}</div>}
                      </div>
                      <div className="col-md-6">
                        <input 
                          className={`form-control ${validationErrors.totalDonation ? 'is-invalid' : ''}`} 
                          placeholder="Tổng số lần hiến*" 
                          value={editData.totalDonation} 
                          onChange={e=>setEditData({...editData,totalDonation:parseInt(e.target.value) || 0})} 
                        />
                        {validationErrors.totalDonation && <div className="invalid-feedback">{validationErrors.totalDonation}</div>}
                      </div>
                      <div className="col-md-6">
                        <select className="form-control" value={editData.ready || ''} onChange={e=>setEditData({...editData,ready:e.target.value})}>
                          <option value="">Sẵn sàng hiến máu?</option>
                          <option value="Có">Có</option>
                          <option value="Không">Không</option>
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
          {/* Modal xác nhận xóa */}
          {deleteIdx !== null && (
            <div className="modal fade show" style={{display:'block',background:'rgba(0,0,0,0.3)'}} tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Xác nhận xóa</h5>
                  </div>
                  <div className="modal-body">
                    <p>Bạn có chắc muốn xóa người hiến này không?</p>
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