import React, { useState } from "react";
import './DonorManagement.css';
import Header from "../../Component/Admin/Header";
import Sidebar from "../../Component/Admin/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';

const donorsDataInit = [
  { name: "Đậu Nguyễn Bảo Tuấn", gender: "Nam", phone: "03627929786", staff: "Nguyễn Văn A", address: "abcdef", blood: "A+", age: 20, email: "abcde@gmail.com", last: "2024-07-07", amount: "120ml", role: "Donor", status: "Đạt chuẩn" },
  { name: "Nguyễn Anh Khoa", gender: "Nam", phone: "03634529786", staff: "Nguyễn Anh B", address: "abcdef", blood: "O+", age: 20, email: "abcde@gmail.com", last: "2024-01-04", amount: "125ml", role: "Donor", status: "Đang xét nghiệm" },
  { name: "Lữ Phước Nhật Tú", gender: "Nam", phone: "08627929786", staff: "Lê Tuấn C", address: "abcdef", blood: "AB+", age: 20, email: "abcde@gmail.com", last: "2024-01-06", amount: "150ml", role: "Donor", status: "Đạt chuẩn" },
  { name: "Nguyễn Duy Hiếu", gender: "Nam", phone: "07627929786", staff: "Nguyễn Anh B", address: "abcdef", blood: "B+", age: 20, email: "abcde@gmail.com", last: "2024-01-05", amount: "122ml", role: "Donor", status: "Không đạt chuẩn" },
  { name: "Nguyễn Duy Hiếu", gender: "Nam", phone: "04627929786", staff: "Huỳnh Nhật D", address: "abcdef", blood: "A+", age: 20, email: "abcde@gmail.com", last: "2024-11-09", amount: "130ml", role: "Donor", status: "Đạt chuẩn" },
  { name: "Nguyễn Duy Hiếu", gender: "Nam", phone: "03927929786", staff: "Lê Tuấn C", address: "abcdef", blood: "AB+", age: 20, email: "abcde@gmail.com", last: "2024-01-10", amount: "140ml", role: "Donor", status: "Đạt chuẩn" },
  { name: "Đậu Nguyễn Bảo Tuấn", gender: "Nam", phone: "03727929786", staff: "Nguyễn Văn A", address: "abcdef", blood: "O+", age: 20, email: "abcde@gmail.com", last: "2024-08-05", amount: "1350ml", role: "Donor", status: "Không đạt chuẩn" },
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
  };
  // Xử lý lưu chỉnh sửa
  const handleSaveEdit = () => {
    const globalIdx = donors.findIndex(d => d === filtered[editIdx]);
    const newDonors = [...donors];
    newDonors[globalIdx] = editData;
    setDonors(newDonors);
    setEditIdx(null);
    setEditData(null);
  };
  // Xử lý hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditIdx(null);
    setEditData(null);
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
      name: '', gender: 'Nam', phone: '', staff: '', address: '', blood: 'A+', age: '', email: '', last: '', amount: '', role: 'Donor', status: 'Đạt chuẩn'
    });
  };
  // Lưu thêm mới
  const handleSaveAdd = () => {
    setDonors([editData, ...donors]);
    setAddMode(false);
    setEditData(null);
  };
  // Hủy thêm mới
  const handleCancelAdd = () => {
    setAddMode(false);
    setEditData(null);
  };

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
            <button className="donor-add" onClick={handleAdd}>+ Thêm người hiến</button>
            <button className="donor-filter-btn">⏷</button>
            <button className="donor-export">⭳ Xuất tệp</button>
          </div>
          <div className="donor-table-card">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
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
                  <th className="text-center" style={{minWidth: 80}}>Vai trò</th>
                  <th className="text-center" style={{minWidth: 110}}>Trạng thái</th>
                  <th className="text-center" style={{minWidth: 90}}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((d, i) => (
                  <tr key={i}>
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
                    <td className="text-center">{d.role}</td>
                    <td className="text-center">
                      <span className={
                        d.status === "Đạt chuẩn" ? "badge bg-success" :
                        d.status === "Đang xét nghiệm" ? "badge bg-warning text-dark" :
                        "badge bg-danger"
                      }>
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
                        <input className="form-control" placeholder="Họ và tên*" value={editData.name} onChange={e=>setEditData({...editData,name:e.target.value})} />
                      </div>
                      <div className="col-md-6">
                        <input className="form-control" placeholder="Số điện thoại*" value={editData.phone} onChange={e=>setEditData({...editData,phone:e.target.value})} />
                      </div>
                      <div className="col-md-6">
                        <select className="form-control" value={editData.blood} onChange={e=>setEditData({...editData,blood:e.target.value})}>
                          {bloodTypes.filter(b=>b!=="Tất cả").map(b=><option key={b}>{b}</option>)}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <input className="form-control" placeholder="Tuổi*" value={editData.age} onChange={e=>setEditData({...editData,age:e.target.value})} />
                      </div>
                      <div className="col-md-6">
                        <input className="form-control" placeholder="Địa chỉ*" value={editData.address} onChange={e=>setEditData({...editData,address:e.target.value})} />
                      </div>
                      <div className="col-md-6">
                        <input className="form-control" placeholder="Số lượng*" value={editData.amount} onChange={e=>setEditData({...editData,amount:e.target.value})} />
                      </div>
                      <div className="col-md-6">
                        <input className="form-control" placeholder="Nhân viên phụ trách*" value={editData.staff} onChange={e=>setEditData({...editData,staff:e.target.value})} />
                      </div>
                      <div className="col-md-6">
                        <input className="form-control" placeholder="Email*" value={editData.email} onChange={e=>setEditData({...editData,email:e.target.value})} />
                      </div>
                      <div className="col-md-6">
                        <input className="form-control" placeholder="Lần hiến gần nhất*" value={editData.last} onChange={e=>setEditData({...editData,last:e.target.value})} />
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