import React, { useState } from "react";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { getStatusStyle } from "./utils";

const accountsDataInit = [
  { account_id: 1, username: "admin", password_hash: "********", email: "admin@blood.vn", phone: "0909123456", role: "admin", is_active: true, created_at: "2024-01-01 08:00", updated_at: "2024-01-01 08:00" },
  { account_id: 2, username: "staff1", password_hash: "********", email: "staff1@blood.vn", phone: "0912345678", role: "staff", is_active: true, created_at: "2024-01-02 09:00", updated_at: "2024-01-02 09:00" },
  { account_id: 3, username: "facility1", password_hash: "********", email: "facility1@blood.vn", phone: "0923456789", role: "medical_facility", is_active: false, created_at: "2024-01-03 10:00", updated_at: "2024-01-03 10:00" },
  { account_id: 4, username: "donor1", password_hash: "********", email: "donor1@blood.vn", phone: "0934567890", role: "donor", is_active: true, created_at: "2024-01-04 11:00", updated_at: "2024-01-04 11:00" },
];

const roles = [
  { value: "admin", label: "Admin" },
  { value: "staff", label: "Staff" },
  { value: "medical_facility", label: "Cơ sở y tế" },
  { value: "donor", label: "Người hiến" },
];

const PAGE_SIZE = 8;

export default function AccountManagement() {
  const [accounts, setAccounts] = useState(accountsDataInit);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Filter logic
  const filtered = accounts.filter(a => a.username.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  React.useEffect(() => { setPage(1); }, [search]);

  // Validation
  const validateAccount = (data) => {
    const errors = {};
    if (!data.username?.trim()) errors.username = "Tên đăng nhập là bắt buộc";
    if (!data.email?.trim()) errors.email = "Email là bắt buộc";
    if (!data.role?.trim()) errors.role = "Vai trò là bắt buộc";
    if (!data.password_hash?.trim()) errors.password_hash = "Mật khẩu là bắt buộc";
    return errors;
  };

  // Edit logic
  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditData({...filtered[idx]});
    setValidationErrors({});
  };
  const handleSaveEdit = () => {
    const errors = validateAccount(editData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    const globalIdx = accounts.findIndex(a => a === filtered[editIdx]);
    const newAccounts = [...accounts];
    newAccounts[globalIdx] = editData;
    setAccounts(newAccounts);
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
    const globalIdx = accounts.findIndex(a => a === filtered[deleteIdx]);
    setAccounts(accounts.filter((_, i) => i !== globalIdx));
    setDeleteIdx(null);
  };
  const handleCancelDelete = () => { setDeleteIdx(null); };

  // Add logic
  const handleAdd = () => {
    setAddMode(true);
    setEditIdx(null);
    setEditData({
      account_id: Date.now(),
      username: '',
      password_hash: '',
      email: '',
      phone: '',
      role: '',
      is_active: true,
      created_at: new Date().toISOString().slice(0,16).replace('T',' '),
      updated_at: new Date().toISOString().slice(0,16).replace('T',' '),
    });
    setValidationErrors({});
  };
  const handleSaveAdd = () => {
    const errors = validateAccount(editData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setAccounts([{ ...editData, account_id: Date.now() }, ...accounts]);
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
          <h2 className="donor-title">Quản lý tài khoản</h2>
          <div className="donor-toolbar">
            <input className="donor-search" placeholder="🔍 Tìm kiếm tên đăng nhập hoặc email ..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <button className="donor-add" onClick={handleAdd}>+ Thêm tài khoản</button>
            <button className="donor-filter-btn">⏷</button>
            <button className="donor-export">⭳ Xuất tệp</button>
          </div>
          <div className="donor-table-card">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-center" style={{minWidth: 60}}>Mã</th>
                  <th className="text-center">Tên đăng nhập</th>
                  <th className="text-center">Email</th>
                  <th className="text-center">Số điện thoại</th>
                  <th className="text-center">Vai trò</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-center">Ngày tạo</th>
                  <th className="text-center">Ngày cập nhật</th>
                  <th className="text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((a, i) => {
                  const statusText = a.is_active ? 'Kích hoạt' : 'Khóa';
                  return (
                    <tr key={i}>
                      <td className="text-center">{a.account_id || (i+1+(page-1)*PAGE_SIZE)}</td>
                      <td className="text-truncate" style={{maxWidth: 140}}>{a.username}</td>
                      <td className="text-center">{a.email}</td>
                      <td className="text-center">{a.phone}</td>
                      <td className="text-center">{roles.find(r=>r.value===a.role)?.label || a.role}</td>
                      <td className="text-center">
                        <span style={getStatusStyle(statusText)}>
                          ● {statusText}
                        </span>
                      </td>
                      <td className="text-center">{a.created_at}</td>
                      <td className="text-center">{a.updated_at}</td>
                      <td className="text-center">
                        <button className="btn btn-sm btn-outline-primary me-1" title="Sửa" onClick={() => handleEdit(i)}><span className="donor-action edit">✏️</span></button>
                        <button className="btn btn-sm btn-outline-danger" title="Xóa" onClick={() => handleDelete(i)}><span className="donor-action delete">🗑️</span></button>
                      </td>
                    </tr>
                  )
                })}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center text-secondary">Không có dữ liệu phù hợp</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Popup thêm mới hoặc chỉnh sửa tài khoản */}
          {(addMode || editIdx !== null) && (
            <div className="modal fade show" style={{display:'block',background:'rgba(0,0,0,0.3)'}} tabIndex="-1">
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header" style={{background:'#8fd19e'}}>
                    <h5 className="modal-title">{addMode ? 'Thêm tài khoản' : 'Chỉnh sửa tài khoản'}</h5>
                    <button type="button" className="btn-close" onClick={addMode ? handleCancelAdd : handleCancelEdit}></button>
                  </div>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <input className={`form-control ${validationErrors.username ? 'is-invalid' : ''}`} placeholder="Tên đăng nhập*" value={editData.username} onChange={e=>setEditData({...editData,username:e.target.value})} disabled={!addMode} />
                        {validationErrors.username && <div className="invalid-feedback">{validationErrors.username}</div>}
                      </div>
                      <div className="col-md-6">
                        <input className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`} placeholder="Email*" value={editData.email} onChange={e=>setEditData({...editData,email:e.target.value})} disabled={!addMode} />
                        {validationErrors.email && <div className="invalid-feedback">{validationErrors.email}</div>}
                      </div>
                      <div className="col-md-6">
                        <input className="form-control" placeholder="Số điện thoại" value={editData.phone} onChange={e=>setEditData({...editData,phone:e.target.value})} disabled={!addMode} />
                      </div>
                      <div className="col-md-6">
                        <select className={`form-control ${validationErrors.role ? 'is-invalid' : ''}`} value={editData.role} onChange={e=>setEditData({...editData,role:e.target.value})} disabled={!addMode}>
                          <option value="">Chọn vai trò*</option>
                          {roles.map(r=><option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                        {validationErrors.role && <div className="invalid-feedback">{validationErrors.role}</div>}
                      </div>
                      <div className="col-md-6">
                        <input className={`form-control ${validationErrors.password_hash ? 'is-invalid' : ''}`} placeholder="Mật khẩu*" type="password" value={editData.password_hash} onChange={e=>setEditData({...editData,password_hash:e.target.value})} disabled={!addMode} />
                        {validationErrors.password_hash && <div className="invalid-feedback">{validationErrors.password_hash}</div>}
                      </div>
                      <div className="col-md-6">
                        <select className="form-control" value={editData.is_active ? 'true' : 'false'} onChange={e=>setEditData({...editData,is_active:e.target.value==='true'})}>
                          <option value="true">Kích hoạt</option>
                          <option value="false">Khóa</option>
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
                    <p>Bạn có chắc muốn xóa tài khoản này không?</p>
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