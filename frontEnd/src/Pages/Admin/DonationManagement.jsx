import React, { useState } from "react";
import './DonationManagement.css';
import Header from "../../Component/Admin/Header";
import Sidebar from "../../Component/Admin/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { validateDonation, getStatusStyle } from './utils';

const donationDataInit = [
  { code: "A001", name: "Nguyễn Duy Hiếu", donateDate: "11/4/2024, 09:30", completeDate: "11/4/2024, 10:30", amount: "120 ml", status: "Xác nhận", blood: "Rh NULL" },
  { code: "A002", name: "Lữ Phước Nhật Tú", donateDate: "15/4/2024, 08:30", completeDate: "15/4/2024, 09:30", amount: "120 ml", status: "Chờ xác nhận", blood: "O-" },
  { code: "A003", name: "Nguyễn Gia Triệu", donateDate: "4/11/2025, 15:35", completeDate: "4/11/2025, 16:35", amount: "120 ml", status: "Xác nhận", blood: "O+" },
  { code: "A004", name: "Đậu Nguyễn Bảo Tuấn", donateDate: "27/5/2025, 10:30", completeDate: "27/5/2025, 11:30", amount: "120 ml", status: "Xác nhận", blood: "AB+" },
  { code: "A005", name: "Nguyễn Anh Khoa", donateDate: "27/5/2025, 10:45", completeDate: "27/5/2025, 11:45", amount: "120 ml", status: "Xác nhận", blood: "AB-" },
  { code: "A006", name: "Đoàn Nguyễn Thành Hòa", donateDate: "15/4/2024, 08:30", completeDate: "15/4/2024, 09:30", amount: "120 ml", status: "Từ chối", blood: "A+" },
  { code: "A007", name: "Nguyễn Trí Thông", donateDate: "15/4/2024, 08:30", completeDate: "15/4/2024, 09:30", amount: "120 ml", status: "Xác nhận", blood: "B-" },
  { code: "A008", name: "Nguyễn Văn Ớ", donateDate: "15/4/2024, 08:30", completeDate: "15/4/2024, 09:30", amount: "120 ml", status: "Từ chối", blood: "A-" },
  { code: "A009", name: "Nguyễn Công Chiến", donateDate: "27/5/2025, 10:45", completeDate: "27/5/2025, 11:45", amount: "120 ml", status: "Chờ xác nhận", blood: "B+" },
];

const bloodTypes = ["Tất cả", "Rh NULL", "O-", "O+", "AB+", "AB-", "A+", "B-", "A-", "B+"];
const statuses = ["Tất cả", "Xác nhận", "Chờ xác nhận", "Từ chối"];

const PAGE_SIZE = 8;

export default function DonationManagement() {
  const [donations, setDonations] = useState(donationDataInit);
  const [search, setSearch] = useState("");
  const [blood, setBlood] = useState("Tất cả");
  const [status, setStatus] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  // Filter logic
  const filtered = donations.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchBlood = blood === "Tất cả" || d.blood === blood;
    const matchStatus = status === "Tất cả" || d.status === status;
    return matchSearch && matchBlood && matchStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  React.useEffect(() => { setPage(1); }, [search, blood, status]);

  // Edit logic
  const handleEdit = (idx) => {
    const donation = filtered[idx];
    navigate(`/admin/donations/${donation.code}`);
  };
  const handleSaveEdit = () => {
    const errors = validateDonation(editData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    const globalIdx = donations.findIndex(d => d === filtered[editIdx]);
    const newDonations = [...donations];
    newDonations[globalIdx] = editData;
    setDonations(newDonations);
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
    const globalIdx = donations.findIndex(d => d === filtered[deleteIdx]);
    setDonations(donations.filter((_, i) => i !== globalIdx));
    setDeleteIdx(null);
  };
  const handleCancelDelete = () => { setDeleteIdx(null); };

  // Add logic
  const handleAdd = () => {
    setAddMode(true);
    setEditIdx(null);
    setEditData({
      code: '', name: '', donateDate: '', completeDate: '', amount: '', status: 'Xác nhận', blood: bloodTypes[1]
    });
    setValidationErrors({});
  };
  const handleSaveAdd = () => {
    const errors = validateDonation(editData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setDonations([editData, ...donations]);
    setAddMode(false);
    setEditData(null);
    setValidationErrors({});
  };
  const handleCancelAdd = () => {
    setAddMode(false);
    setEditData(null);
    setValidationErrors({});
  };

  // Lưu danh sách vào localStorage mỗi khi thay đổi
  React.useEffect(() => {
    localStorage.setItem('donations', JSON.stringify(donations));
  }, [donations]);

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="donation-page-root">
          <h2 className="donation-title">Quản lý đơn hiến</h2>
          <div className="donation-toolbar">
            <input className="donation-search" placeholder="🔍 Tìm kiếm người hiến ....."
              value={search} onChange={e => setSearch(e.target.value)} />
            <select className="donation-filter" value={blood} onChange={e => setBlood(e.target.value)}>
              {bloodTypes.map(b => <option key={b}>{b}</option>)}
            </select>
            <select className="donation-filter" value={status} onChange={e => setStatus(e.target.value)}>
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
            <button className="donation-filter-btn">⏷</button>
            <button className="donation-export">⭳ Xuất tệp</button>
          </div>
          <div className="donation-table-card">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-center" style={{minWidth: 60}}>Mã</th>
                  <th className="text-center" style={{minWidth: 110}}>Mã đơn nhận</th>
                  <th className="text-center" style={{minWidth: 180}}>Họ và tên</th>
                  <th className="text-center" style={{minWidth: 160}}>Ngày và giờ hiến</th>
                  <th className="text-center" style={{minWidth: 180}}>Ngày và giờ hoàn thành</th>
                  <th className="text-center" style={{minWidth: 110}}>Số lượng (ml)</th>
                  <th className="text-center" style={{minWidth: 120}}>Trạng thái</th>
                  <th className="text-center" style={{minWidth: 100}}>Nhóm máu</th>
                  <th className="text-center" style={{minWidth: 90}}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((d, i) => (
                  <tr key={i}>
                    <td className="text-center">{d.id || (i+1+(page-1)*PAGE_SIZE)}</td>
                    <td className="text-center">{d.code}</td>
                    <td className="text-truncate" style={{maxWidth: 180}}>{d.name}</td>
                    <td className="text-center">{d.donateDate}</td>
                    <td className="text-center">{d.completeDate}</td>
                    <td className="text-center">{d.amount}</td>
                    <td className="text-center">
                      <span style={getStatusStyle(d.status)}>● {d.status}</span>
                    </td>
                    <td className="text-center">{d.blood}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-primary me-1" title="Sửa" onClick={() => handleEdit(i)}><span className="donation-action edit">✏️</span></button>
                      <button className="btn btn-sm btn-outline-danger" title="Xóa" onClick={() => handleDelete(i)}><span className="donation-action delete">🗑️</span></button>
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center text-secondary">Không có dữ liệu phù hợp</td>
                  </tr>
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
                        <input 
                          className={`form-control ${validationErrors.completeDate ? 'is-invalid' : ''}`} 
                          placeholder="Ngày và giờ hoàn thành*" 
                          value={editData.completeDate} 
                          onChange={e=>setEditData({...editData,completeDate:e.target.value})} 
                        />
                        {validationErrors.completeDate && <div className="invalid-feedback">{validationErrors.completeDate}</div>}
                      </div>
                      <div className="col-md-6">
                        <input 
                          className={`form-control ${validationErrors.amount ? 'is-invalid' : ''}`} 
                          placeholder="Số lượng (ml)*" 
                          value={editData.amount} 
                          onChange={e=>setEditData({...editData,amount:e.target.value})} 
                        />
                        {validationErrors.amount && <div className="invalid-feedback">{validationErrors.amount}</div>}
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
          {/* Modal xác nhận xóa */}
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