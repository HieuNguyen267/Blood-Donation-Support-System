import React, { useState } from "react";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { getStatusStyle } from "./utils";
import { accountAPI } from '../../services/api';

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

const sortOptions = [
  { value: '', label: 'Sắp xếp theo...' },
  { value: 'role', label: 'Vai trò' },
  { value: 'status', label: 'Trạng thái' },
  { value: 'created_at', label: 'Ngày tạo' },
  { value: 'updated_at', label: 'Ngày cập nhật' },
];
const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'staff', label: 'Staff' },
  { value: 'medical_facility', label: 'Cơ sở y tế' },
  { value: 'donor', label: 'Người hiến' },
];
const statusOptions = [
  { value: 'active', label: 'Kích hoạt' },
  { value: 'inactive', label: 'Khóa' },
];
const orderOptions = [
  { value: 'desc', label: 'Mới nhất' },
  { value: 'asc', label: 'Cũ nhất' }
];

export default function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState(null);
  // Thay đổi state lưu id tài khoản cần xóa
  const [deleteId, setDeleteId] = React.useState(null);
  const [addMode, setAddMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterRole, setFilterRole] = useState(roleOptions[0].value);
  const [filterStatus, setFilterStatus] = useState(statusOptions[0].value);

  // Filter logic
  let filtered = accounts.filter(a => a.username.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()));
  if (sortBy === 'role') {
    filtered = filtered.filter(a => a.role === filterRole);
  }
  if (sortBy === 'status') {
    filtered = filtered.filter(a => (filterStatus === 'active' ? a.is_active : !a.is_active));
  }
  if (sortBy === 'created_at') {
    filtered = filtered.sort((a, b) => sortOrder === 'asc' ? new Date(a.created_at) - new Date(b.created_at) : new Date(b.created_at) - new Date(a.created_at));
  }
  if (sortBy === 'updated_at') {
    filtered = filtered.sort((a, b) => sortOrder === 'asc' ? new Date(a.updated_at) - new Date(b.updated_at) : new Date(b.updated_at) - new Date(a.updated_at));
  }
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  React.useEffect(() => { setPage(1); }, [search]);

  // Validation
  const validateAccount = (data) => {
    const errors = {};
    if (!data.email?.trim()) errors.email = "Email là bắt buộc";
    if (!data.role?.trim()) errors.role = "Vai trò là bắt buộc";
    if (!data.passwordHash?.trim()) errors.passwordHash = "Mật khẩu là bắt buộc";
    // KHÔNG kiểm tra username
    return errors;
  };

  // Edit logic
  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditData({...filtered[idx]});
    setValidationErrors({});
  };
  const handleSaveEdit = async () => {
    try {
      // Chỉ cập nhật trạng thái
      await accountAPI.updateAccount(editData.account_id, {
        is_active: editData.is_active === 1 ? 1 : 0
      });
      // Reload lại danh sách tài khoản
      const data = await accountAPI.getAccounts();
      setAccounts(data.map(a => ({
        account_id: a.accountId || a.account_id || '',
        username: a.username || '',
        password_hash: '********',
        email: a.email || '',
        phone: a.phone || '',
        role: a.role || '',
        is_active: a.isActive !== undefined ? a.isActive : (a.is_active !== undefined ? a.is_active : true),
        created_at: a.createdAt || a.created_at || '',
        updated_at: a.updatedAt || a.updated_at || '',
      })));
      setEditIdx(null);
      setEditData(null);
      setValidationErrors({});
    } catch (error) {
      alert('Cập nhật trạng thái tài khoản thất bại!');
    }
  };
  const handleCancelEdit = () => {
    setEditIdx(null);
    setEditData(null);
    setValidationErrors({});
  };
  // Delete logic
  // Khi bấm nút xóa, truyền account_id
  const handleDelete = (accountId) => { setDeleteId(accountId); };
  // Khi xác nhận xóa, xóa theo account_id
  const handleConfirmDelete = async () => {
    try {
      await accountAPI.deleteAccount(deleteId);
      setAccounts(accounts.filter(a => a.account_id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      alert('Xóa tài khoản thất bại!');
    }
  };
  const handleCancelDelete = () => { setDeleteId(null); };

  // Add logic
  const handleAdd = () => {
    setAddMode(true);
    setEditIdx(null);
    setEditData({
      account_id: Date.now(),
      passwordHash: '',
      email: '',
      phone: '',
      role: '',
      is_active: 1, // LUÔN mặc định là 1 (Kích hoạt)
      created_at: new Date().toISOString().slice(0,16).replace('T',' '),
      updated_at: new Date().toISOString().slice(0,16).replace('T',' '),
    });
    setValidationErrors({});
  };
  const handleSaveAdd = async () => {
    const errors = validateAccount(editData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    try {
      await accountAPI.createAccount({
        email: editData.email,
        passwordHash: editData.passwordHash,
        role: editData.role,
        is_active: editData.is_active === 1 ? 1 : 0
      });
      const data = await accountAPI.getAccounts();
      setAccounts(data.map(a => ({
        account_id: a.accountId || a.account_id || '',
        password_hash: '********',
        email: a.email || '',
        phone: a.phone || '',
        role: a.role || '',
        is_active: a.isActive !== undefined ? a.isActive : (a.is_active !== undefined ? a.is_active : true),
        created_at: a.createdAt || a.created_at || '',
        updated_at: a.updatedAt || a.updated_at || '',
      })));
      setAddMode(false);
      setEditData(null);
      setValidationErrors({});
      
      // Refresh trang sau khi thêm tài khoản thành công
      window.location.reload();
    } catch (error) {
      alert('Thêm tài khoản thất bại!');
    }
  };
  const handleCancelAdd = () => {
    setAddMode(false);
    setEditData(null);
    setValidationErrors({});
  };

  React.useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await accountAPI.getAccounts();
        setAccounts(data.map(a => ({
          account_id: a.accountId || a.account_id || '',
          username: a.username || '',
          password_hash: '********',
          email: a.email || '',
          phone: a.phone || '',
          role: a.role || '',
          is_active: a.isActive !== undefined ? a.isActive : (a.is_active !== undefined ? a.is_active : true),
          created_at: a.createdAt || a.created_at || '',
          updated_at: a.updatedAt || a.updated_at || '',
        })));
      } catch (error) {
        setAccounts([
          { account_id: 1, username: "admin", password_hash: "********", email: "admin@blood.vn", phone: "0909123456", role: "admin", is_active: true, created_at: "2024-01-01 08:00", updated_at: "2024-01-01 08:00" },
          { account_id: 2, username: "staff1", password_hash: "********", email: "staff1@blood.vn", phone: "0912345678", role: "staff", is_active: true, created_at: "2024-01-02 09:00", updated_at: "2024-01-02 09:00" },
          { account_id: 3, username: "facility1", password_hash: "********", email: "facility1@blood.vn", phone: "0923456789", role: "medical_facility", is_active: false, created_at: "2024-01-03 10:00", updated_at: "2024-01-03 10:00" },
          { account_id: 4, username: "donor1", password_hash: "********", email: "donor1@blood.vn", phone: "0934567890", role: "donor", is_active: true, created_at: "2024-01-04 11:00", updated_at: "2024-01-04 11:00" },
        ]);
      }
    };
    fetchAccounts();
  }, []);

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
            <select className="donor-filter" value={sortBy} onChange={e => { setSortBy(e.target.value); setSortOrder('desc'); }}>
              {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            {sortBy === 'role' && (
              <select className="donor-filter" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
                {roleOptions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            )}
            {sortBy === 'status' && (
              <select className="donor-filter" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            )}
            {(sortBy === 'created_at' || sortBy === 'updated_at') && (
              <select className="donor-filter" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                {orderOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            )}
            <button className="donor-add" onClick={handleAdd}>+ Thêm tài khoản</button>
          </div>
          <div className="donor-table-card">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-center" style={{minWidth: 60}}>Mã</th>
                  <th className="text-center">Email</th>
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
                      <td className="text-center">{a.email}</td>
                      <td className="text-center">{roles.find(r=>r.value===a.role)?.label || a.role}</td>
                      <td className="text-center">
                        <span style={getStatusStyle(statusText)}>
                          ● {statusText}
                        </span>
                      </td>
                      <td className="text-center">{a.created_at}</td>
                      <td className="text-center">{a.updated_at}</td>
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
                            onClick={() => handleDelete(a.account_id)}
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
                  )
                })}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-secondary">Không có dữ liệu phù hợp</td>
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
                      {/* Email chỉ hiển thị, không cho sửa khi edit, cho nhập khi add */}
                      <div className="col-md-6">
                        <input className="form-control" placeholder="Email" value={editData.email} 
                          disabled={!addMode} onChange={e=>setEditData({...editData,email:e.target.value})} />
                      </div>
                      {/* Vai trò chỉ hiển thị, không cho sửa khi edit, cho nhập khi add */}
                      <div className="col-md-6">
                        <select className="form-control" value={editData.role} 
                          disabled={!addMode} onChange={e=>setEditData({...editData,role:e.target.value})}>
                          <option value="">Chọn vai trò*</option>
                          {roles.map(r=><option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                      </div>
                      {/* Mật khẩu chỉ hiển thị, không cho sửa khi edit, cho nhập khi add */}
                      <div className="col-md-6">
                        <input className="form-control" placeholder="Mật khẩu" type="password" value={editData.passwordHash}
                          disabled={!addMode} onChange={e=>setEditData({...editData,passwordHash:e.target.value})} />
                        {validationErrors.passwordHash && <div className="text-danger small">{validationErrors.passwordHash}</div>}
                      </div>
                      {/* Chỉ hiện ô tên đăng nhập khi chỉnh sửa */}
                      {!addMode && (
                        <div className="col-md-6">
                          <input className="form-control" placeholder="Tên đăng nhập" value={editData.username} disabled />
                        </div>
                      )}
                      {/* Chỉ cho phép chỉnh sửa trạng thái */}
                      <div className="col-md-6">
                        <select
                          className="form-control"
                          value={editData.is_active === 1 ? '1' : '0'}
                          onChange={e => setEditData({ ...editData, is_active: e.target.value === '1' ? 1 : 0 })}
                          disabled={editIdx === null} // chỉ cho chỉnh khi đang edit
                        >
                          <option value="1">Kích hoạt</option>
                          <option value="0">Khóa</option>
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
          {deleteId !== null && (
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