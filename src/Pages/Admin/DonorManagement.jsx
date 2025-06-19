import React, { useState } from "react";
import './DonorManagement.css';
import Header from "../../Component/Admin/Header";
import Sidebar from "../../Component/Admin/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { validateDonor, getStatusBadge } from './utils';

const donorsDataInit = [
  { id: 1, name: "Đậu Nguyễn Bảo Tuấn", gender: "Nam", phone: "03627929786", staff: "Nguyễn Văn A", address: "abcdef", blood: "A+", age: 20, email: "abcde@gmail.com", last: "2024-07-07", amount: "120ml", role: "Donor", status: "Đạt chuẩn", ready: "Có" },
  { id: 2, name: "Nguyễn Anh Khoa", gender: "Nam", phone: "03634529786", staff: "Nguyễn Anh B", address: "abcdef", blood: "O+", age: 20, email: "abcde@gmail.com", last: "2024-01-04", amount: "125ml", role: "Donor", status: "Đang xét nghiệm", ready: "Không" },
  { id: 3, name: "Lữ Phước Nhật Tú", gender: "Nam", phone: "08627929786", staff: "Lê Tuấn C", address: "abcdef", blood: "AB+", age: 20, email: "abcde@gmail.com", last: "2024-01-06", amount: "150ml", role: "Donor", status: "Đạt chuẩn", ready: "Có" },
  { id: 4, name: "Nguyễn Duy Hiếu", gender: "Nam", phone: "07627929786", staff: "Nguyễn Anh B", address: "abcdef", blood: "B+", age: 20, email: "abcde@gmail.com", last: "2024-01-05", amount: "122ml", role: "Donor", status: "Không đạt chuẩn", ready: "Không" },
  { id: 5, name: "Nguyễn Duy Hiếu", gender: "Nam", phone: "04627929786", staff: "Huỳnh Nhật D", address: "abcdef", blood: "A+", age: 20, email: "abcde@gmail.com", last: "2024-11-09", amount: "130ml", role: "Donor", status: "Đạt chuẩn", ready: "Có" },
  { id: 6, name: "Nguyễn Duy Hiếu", gender: "Nam", phone: "03927929786", staff: "Lê Tuấn C", address: "abcdef", blood: "AB+", age: 20, email: "abcde@gmail.com", last: "2024-01-10", amount: "140ml", role: "Donor", status: "Đạt chuẩn", ready: "Không" },
  { id: 7, name: "Đậu Nguyễn Bảo Tuấn", gender: "Nam", phone: "03727929786", staff: "Nguyễn Văn A", address: "abcdef", blood: "O+", age: 20, email: "abcde@gmail.com", last: "2024-08-05", amount: "1350ml", role: "Donor", status: "Không đạt chuẩn", ready: "" },
  { id: 8, name: "Trần Thị Mai", gender: "Nữ", phone: "0912345678", staff: "Nguyễn Văn B", address: "Q1", blood: "A+", age: 25, email: "mai.tran@gmail.com", last: "2024-06-01", amount: "350ml", role: "Donor", status: "Đạt chuẩn", ready: "Có" },
  { id: 9, name: "Lê Văn Hùng", gender: "Nam", phone: "0923456789", staff: "Trần Thị C", address: "Q2", blood: "O-", age: 32, email: "hung.le@gmail.com", last: "2024-05-15", amount: "400ml", role: "Donor", status: "Đang xét nghiệm", ready: "Không" },
  { id: 10, name: "Phạm Minh Tuấn", gender: "Nam", phone: "0934567890", staff: "Lê Văn D", address: "Q3", blood: "B+", age: 28, email: "tuan.pham@gmail.com", last: "2024-04-20", amount: "300ml", role: "Donor", status: "Đạt chuẩn", ready: "Có" },
  { id: 11, name: "Nguyễn Thị Lan", gender: "Nữ", phone: "0945678901", staff: "Phạm Thị E", address: "Q4", blood: "AB-", age: 30, email: "lan.nguyen@gmail.com", last: "2024-03-10", amount: "250ml", role: "Donor", status: "Không đạt chuẩn", ready: "Không" },
  { id: 12, name: "Đỗ Quang Vinh", gender: "Nam", phone: "0956789012", staff: "Nguyễn Văn F", address: "Q5", blood: "O+", age: 35, email: "vinh.do@gmail.com", last: "2024-02-18", amount: "500ml", role: "Donor", status: "Đạt chuẩn", ready: "Có" },
  { id: 13, name: "Lý Thị Hồng", gender: "Nữ", phone: "0967890123", staff: "Trần Thị G", address: "Q6", blood: "A-", age: 27, email: "hong.ly@gmail.com", last: "2024-01-25", amount: "320ml", role: "Donor", status: "Đang xét nghiệm", ready: "" },
  { id: 14, name: "Vũ Văn Nam", gender: "Nam", phone: "0978901234", staff: "Lê Văn H", address: "Q7", blood: "B-", age: 29, email: "nam.vu@gmail.com", last: "2023-12-30", amount: "410ml", role: "Donor", status: "Đạt chuẩn", ready: "Có" },
  { id: 15, name: "Trịnh Thị Thu", gender: "Nữ", phone: "0989012345", staff: "Nguyễn Thị I", address: "Q8", blood: "AB+", age: 24, email: "thu.trinh@gmail.com", last: "2023-11-12", amount: "280ml", role: "Donor", status: "Không đạt chuẩn", ready: "Không" },
  { id: 16, name: "Ngô Văn Bình", gender: "Nam", phone: "0990123456", staff: "Phạm Văn J", address: "Q9", blood: "O-", age: 31, email: "binh.ngo@gmail.com", last: "2023-10-05", amount: "360ml", role: "Donor", status: "Đạt chuẩn", ready: "Có" },
  { id: 17, name: "Đặng Thị Kim", gender: "Nữ", phone: "0901234567", staff: "Lê Thị K", address: "Q10", blood: "A+", age: 26, email: "kim.dang@gmail.com", last: "2023-09-15", amount: "330ml", role: "Donor", status: "Đang xét nghiệm", ready: "Không" },
  { id: 18, name: "Bùi Văn Sơn", gender: "Nam", phone: "0912345670", staff: "Nguyễn Văn L", address: "Q11", blood: "B+", age: 34, email: "son.bui@gmail.com", last: "2023-08-20", amount: "390ml", role: "Donor", status: "Đạt chuẩn", ready: "Có" },
  { id: 19, name: "Phan Thị Yến", gender: "Nữ", phone: "0923456701", staff: "Trần Thị M", address: "Q12", blood: "AB-", age: 23, email: "yen.phan@gmail.com", last: "2023-07-10", amount: "270ml", role: "Donor", status: "Không đạt chuẩn", ready: "Không" },
  { id: 20, name: "Lâm Văn Phúc", gender: "Nam", phone: "0934567012", staff: "Lê Văn N", address: "Q1", blood: "O+", age: 36, email: "phuc.lam@gmail.com", last: "2023-06-18", amount: "420ml", role: "Donor", status: "Đạt chuẩn", ready: "Có" },
  { id: 21, name: "Trương Thị Hạnh", gender: "Nữ", phone: "0945670123", staff: "Nguyễn Thị O", address: "Q2", blood: "A-", age: 28, email: "hanh.truong@gmail.com", last: "2023-05-25", amount: "310ml", role: "Donor", status: "Đang xét nghiệm", ready: "" },
  { id: 22, name: "Hoàng Văn Tài", gender: "Nam", phone: "0956701234", staff: "Phạm Văn P", address: "Q3", blood: "B-", age: 33, email: "tai.hoang@gmail.com", last: "2023-04-30", amount: "430ml", role: "Donor", status: "Đạt chuẩn", ready: "Có" },
  { id: 23, name: "Đoàn Thị Hương", gender: "Nữ", phone: "0967012345", staff: "Lê Thị Q", address: "Q4", blood: "AB+", age: 27, email: "huong.doan@gmail.com", last: "2023-03-12", amount: "290ml", role: "Donor", status: "Không đạt chuẩn", ready: "Không" },
  { id: 24, name: "Nguyễn Văn Dũng", gender: "Nam", phone: "0970123456", staff: "Nguyễn Văn R", address: "Q5", blood: "O-", age: 30, email: "dung.nguyen@gmail.com", last: "2023-02-05", amount: "370ml", role: "Donor", status: "Đạt chuẩn", ready: "Có" },
  { id: 25, name: "Lê Thị Quỳnh", gender: "Nữ", phone: "0981234567", staff: "Trần Thị S", address: "Q6", blood: "A+", age: 25, email: "quynh.le@gmail.com", last: "2023-01-15", amount: "340ml", role: "Donor", status: "Đang xét nghiệm", ready: "Không" },
  { id: 26, name: "Phạm Văn Sơn", gender: "Nam", phone: "0992345678", staff: "Lê Văn T", address: "Q7", blood: "B+", age: 32, email: "son.pham@gmail.com", last: "2022-12-20", amount: "380ml", role: "Donor", status: "Đạt chuẩn", ready: "Có" },
  { id: 27, name: "Trần Thị Yến", gender: "Nữ", phone: "0903456789", staff: "Nguyễn Thị U", address: "Q8", blood: "AB-", age: 29, email: "yen.tran@gmail.com", last: "2022-11-10", amount: "260ml", role: "Donor", status: "Không đạt chuẩn", ready: "Không" },
  { id: 28, name: "Võ Văn Lâm", gender: "Nam", phone: "0914567890", staff: "Phạm Văn V", address: "Q9", blood: "O+", age: 35, email: "lam.vo@gmail.com", last: "2022-10-05", amount: "410ml", role: "Donor", status: "Đạt chuẩn", ready: "Có" },
  { id: 29, name: "Đinh Thị Hoa", gender: "Nữ", phone: "0925678901", staff: "Lê Thị W", address: "Q10", blood: "A-", age: 26, email: "hoa.dinh@gmail.com", last: "2022-09-15", amount: "320ml", role: "Donor", status: "Đang xét nghiệm", ready: "" },
  { id: 30, name: "Nguyễn Văn Phúc", gender: "Nam", phone: "0936789012", staff: "Nguyễn Văn X", address: "Q11", blood: "B-", age: 31, email: "phuc.nguyen@gmail.com", last: "2022-08-20", amount: "390ml", role: "Donor", status: "Đạt chuẩn", ready: "Có" },
  { id: 31, name: "Lê Thị Hồng", gender: "Nữ", phone: "0947890123", staff: "Trần Thị Y", address: "Q12", blood: "AB+", age: 24, email: "hong.le@gmail.com", last: "2022-07-10", amount: "270ml", role: "Donor", status: "Không đạt chuẩn", ready: "Không" },
];

const bloodTypes = ["Tất cả", "A+", "O+", "AB+", "B+"];
const statuses = ["Tất cả", "Đạt chuẩn", "Đang xét nghiệm", "Không đạt chuẩn"];

const statusColor = (status) => {
  if (status === "Đạt chuẩn") return { color: '#22c55e' };
  if (status === "Đang xét nghiệm") return { color: '#fb923c' };
  return { color: '#ef4444' };
};

const PAGE_SIZE = 5;

export default function DonorManagement() {
  const [donors, setDonors] = useState(donorsDataInit);
  const [search, setSearch] = useState("");
  const [blood, setBlood] = useState("Tất cả");
  const [status, setStatus] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const [editIdx, setEditIdx] = useState(null); // index của donor đang sửa
  const [editData, setEditData] = useState(null); // dữ liệu donor đang sửa
  const [deleteIdx, setDeleteIdx] = useState(null); // index của donor đang chờ xác nhận xóa
  const [addMode, setAddMode] = useState(false); // true nếu đang thêm mới
  const [validationErrors, setValidationErrors] = useState({}); // lưu lỗi validation

  // Filter logic
  const filtered = donors.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchBlood = blood === "Tất cả" || d.blood === blood;
    const matchStatus = status === "Tất cả" || d.status === status;
    return matchSearch && matchBlood && matchStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  // Reset page if filter/search changes
  React.useEffect(() => { setPage(1); }, [search, blood, status]);

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
      name: '', gender: 'Nam', phone: '', staff: '', address: '', blood: 'A+', age: '', email: '', last: '', amount: '', role: 'Donor', status: 'Đạt chuẩn', ready: ''
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
    localStorage.setItem('donors', JSON.stringify(donorsDataInit));
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
            <select className="donor-filter" value={blood} onChange={e => setBlood(e.target.value)}>
              {bloodTypes.map(b => <option key={b}>{b}</option>)}
            </select>
            <select className="donor-filter" value={status} onChange={e => setStatus(e.target.value)}>
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
            <button className="donor-filter-btn">⏷</button>
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
                  <th className="text-center" style={{minWidth: 140}}>Staff phụ trách</th>
                  <th className="text-center" style={{minWidth: 110}}>Địa chỉ</th>
                  <th className="text-center" style={{minWidth: 80}}>Loại máu</th>
                  <th className="text-center" style={{minWidth: 60}}>Tuổi</th>
                  <th className="text-center" style={{minWidth: 180}}>Email</th>
                  <th className="text-center" style={{minWidth: 110}}>Ngày cuối hiến</th>
                  <th className="text-center" style={{minWidth: 90}}>Số lượng</th>
                  <th className="text-center" style={{minWidth: 100}}>Sẵn sàng hiến máu</th>
                  <th className="text-center" style={{minWidth: 80}}>Vai trò</th>
                  <th className="text-center" style={{minWidth: 110}}>Trạng thái</th>
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
                    <td className="text-truncate" style={{maxWidth: 120}}>{d.staff}</td>
                    <td className="text-truncate" style={{maxWidth: 100}}>{d.address}</td>
                    <td className="text-center">{d.blood}</td>
                    <td className="text-center">{d.age}</td>
                    <td className="text-truncate" style={{maxWidth: 180}}>{d.email}</td>
                    <td className="text-center">{d.last}</td>
                    <td className="text-center">{d.amount}</td>
                    <td className="text-center">{d.ready || ''}</td>
                    <td className="text-center">{d.role}</td>
                    <td className="text-center">
                      <span className={getStatusBadge(d.status)}>
                        {d.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-primary me-1" title="Sửa" onClick={() => handleEdit(i)}><span className="donor-action edit">✏️</span></button>
                      <button className="btn btn-sm btn-outline-danger" title="Xóa" onClick={() => handleDelete(i)}><span className="donor-action delete">🗑️</span></button>
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={13} className="text-center text-secondary">Không có dữ liệu phù hợp</td>
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
                          className={`form-control ${validationErrors.amount ? 'is-invalid' : ''}`} 
                          placeholder="Số lượng*" 
                          value={editData.amount} 
                          onChange={e=>setEditData({...editData,amount:e.target.value})} 
                        />
                        {validationErrors.amount && <div className="invalid-feedback">{validationErrors.amount}</div>}
                      </div>
                      <div className="col-md-6">
                        <input 
                          className={`form-control ${validationErrors.staff ? 'is-invalid' : ''}`} 
                          placeholder="Nhân viên phụ trách*" 
                          value={editData.staff} 
                          onChange={e=>setEditData({...editData,staff:e.target.value})} 
                        />
                        {validationErrors.staff && <div className="invalid-feedback">{validationErrors.staff}</div>}
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
                          placeholder="Lần hiến gần nhất*" 
                          value={editData.last} 
                          onChange={e=>setEditData({...editData,last:e.target.value})} 
                        />
                        {validationErrors.last && <div className="invalid-feedback">{validationErrors.last}</div>}
                      </div>
                      <div className="col-md-6">
                        <select className="form-control" value={editData.ready || ''} onChange={e=>setEditData({...editData,ready:e.target.value})}>
                          <option value="">Sẵn sàng hiến máu?</option>
                          <option value="Có">Có</option>
                          <option value="Không">Không</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <select className="form-control" value={editData.status} onChange={e=>setEditData({...editData,status:e.target.value})}>
                          {statuses.filter(s=>s!=="Tất cả").map(s=><option key={s}>{s}</option>)}
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