import React, { useState } from "react";
import Header from "../../Component/Admin/Header";
import Sidebar from "../../Component/Admin/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import './BloodStorageManagement.css';

const bloodDataInit = [
  { code: "BP001", group: "Rh NULL", collect: "11/4/2024, 10:30", expire: "11/4/2027, 09:30", amount: 12, status: "Mới", quality: "Tốt", temp: "2 -6 °C" },
  { code: "BP002", group: "O-", collect: "15/4/2024, 09:30", expire: "15/4/2028, 08:30", amount: 15, status: "Đang sử dụng", quality: "Tốt", temp: "6-10 °C" },
  { code: "BP003", group: "O+", collect: "4/11/2025, 16:35", expire: "4/11/2028, 15:35", amount: 20, status: "Mới", quality: "Tốt", temp: "20-24 °C" },
  { code: "BP004", group: "AB+", collect: "27/5/2025, 11:30", expire: "27/5/2028, 10:30", amount: 25, status: "Hết hạn", quality: "Đã tiêu huỷ", temp: "4 °C" },
  { code: "BP005", group: "AB-", collect: "27/5/2025, 11:45", expire: "27/5/2028, 10:45", amount: 35, status: "Mới", quality: "Tốt", temp: "4 °C" },
  { code: "BP006", group: "A+", collect: "15/4/2024, 09:30", expire: "15/4/2027, 08:30", amount: 30, status: "Đang sử dụng", quality: "Tốt", temp: "2 -6 °C" },
  { code: "BP007", group: "B-", collect: "15/4/2024, 09:30", expire: "15/4/2028, 08:30", amount: 16, status: "Mới", quality: "Tốt", temp: "6 °C" },
  { code: "BP008", group: "A-", collect: "27/5/2025, 11:45", expire: "27/5/2028, 10:45", amount: 18, status: "Hết hạn", quality: "Đã đông", temp: "2 -6 °C" },
  { code: "BP009", group: "B+", collect: "27/5/2025, 11:45", expire: "27/5/2028, 10:45", amount: 10, status: "Mới", quality: "Tốt", temp: "10 °C" },
];

const statusColors = {
  "Mới": "success",
  "Đang sử dụng": "primary",
  "Hết hạn": "danger"
};
const qualityColors = {
  "Tốt": "success",
  "Đã tiêu huỷ": "danger",
  "Đã đông": "warning"
};

const PAGE_SIZE = 8;

export default function BloodStorageManagement() {
  const [data, setData] = useState(bloodDataInit);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteIdx, setDeleteIdx] = useState(null);

  // Filter logic (chỉ search theo nhóm máu)
  const filtered = data.filter(d => d.group.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  React.useEffect(() => { setPage(1); }, [search]);

  // Edit logic
  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditData({...filtered[idx]});
  };
  const handleSaveEdit = () => {
    const globalIdx = data.findIndex(d => d === filtered[editIdx]);
    const newData = [...data];
    newData[globalIdx] = editData;
    setData(newData);
    setEditIdx(null);
    setEditData(null);
  };
  const handleCancelEdit = () => {
    setEditIdx(null);
    setEditData(null);
  };
  // Delete logic
  const handleDelete = (idx) => { setDeleteIdx(idx); };
  const handleConfirmDelete = () => {
    const globalIdx = data.findIndex(d => d === filtered[deleteIdx]);
    setData(data.filter((_, i) => i !== globalIdx));
    setDeleteIdx(null);
  };
  const handleCancelDelete = () => { setDeleteIdx(null); };

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="blood-page-root">
          <div className="blood-header">
            <h2 className="blood-title">Quản lý kho máu</h2>
            <div className="blood-subtitle">Chi tiết kho máu</div>
          </div>
          <div className="blood-toolbar">
            <input className="blood-search" placeholder="🔍 Tìm kiếm nhóm máu ....." value={search} onChange={e=>setSearch(e.target.value)} />
            <select className="blood-filter"><option>Tất cả</option></select>
            <select className="blood-filter"><option>Tất cả</option></select>
            <button className="blood-add">+ Thêm đơn vị máu</button>
            <button className="blood-filter-btn">⏷</button>
            <button className="blood-export">⭳ Xuất tệp</button>
          </div>
          <div className="donor-table-card">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-center">Mã đơn nhận</th>
                  <th className="text-center">Nhóm máu</th>
                  <th className="text-center">Ngày và giờ thu thập</th>
                  <th className="text-center">Ngày và giờ hết hạn</th>
                  <th className="text-center">Số lượng trong kho</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-center">Chất lượng</th>
                  <th className="text-center">Phạm vi nhiệt độ</th>
                  <th className="text-center"><span role="img" aria-label="temp">🌡️</span></th>
                  <th className="text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((d, i) => (
                  <tr key={i}>
                    <td className="text-center">{d.code}</td>
                    <td className="text-center">{d.group}</td>
                    <td className="text-center">{d.collect}</td>
                    <td className="text-center">{d.expire}</td>
                    <td className="text-center">{d.amount}</td>
                    <td className="text-center">
                      <span className={`fw-bold text-${statusColors[d.status]||'secondary'}`}>{d.status}</span>
                    </td>
                    <td className="text-center">
                      <span className={`fw-bold text-${qualityColors[d.quality]||'secondary'}`}>{d.quality}</span>
                    </td>
                    <td className="text-center">{d.temp}</td>
                    <td className="text-center"><span role="img" aria-label="temp">🌡️</span></td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-primary me-1" title="Sửa" onClick={()=>handleEdit(i)}><span className="donor-action edit">✏️</span></button>
                      <button className="btn btn-sm btn-outline-danger" title="Xóa" onClick={()=>handleDelete(i)}><span className="donor-action delete">🗑️</span></button>
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr><td colSpan={10} className="text-center text-secondary">Không có dữ liệu phù hợp</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Popup chỉnh sửa */}
          {editIdx !== null && (
            <div className="modal fade show" style={{display:'block',background:'rgba(0,0,0,0.3)'}} tabIndex="-1">
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header" style={{background:'#8fd19e'}}>
                    <h5 className="modal-title">Chỉnh sửa kho máu</h5>
                    <button type="button" className="btn-close" onClick={handleCancelEdit}></button>
                  </div>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <input className="form-control" placeholder="Mã đơn nhận" value={editData.code} onChange={e=>setEditData({...editData,code:e.target.value})} />
                      </div>
                      <div className="col-md-6">
                        <input className="form-control" placeholder="Nhóm máu" value={editData.group} onChange={e=>setEditData({...editData,group:e.target.value})} />
                      </div>
                      <div className="col-md-6">
                        <input className="form-control" placeholder="Ngày và giờ thu thập" value={editData.collect} onChange={e=>setEditData({...editData,collect:e.target.value})} />
                      </div>
                      <div className="col-md-6">
                        <input className="form-control" placeholder="Ngày và giờ hết hạn" value={editData.expire} onChange={e=>setEditData({...editData,expire:e.target.value})} />
                      </div>
                      <div className="col-md-6">
                        <input className="form-control" placeholder="Số lượng trong kho" value={editData.amount} onChange={e=>setEditData({...editData,amount:e.target.value})} />
                      </div>
                      <div className="col-md-6">
                        <input className="form-control" placeholder="Trạng thái" value={editData.status} onChange={e=>setEditData({...editData,status:e.target.value})} />
                      </div>
                      <div className="col-md-6">
                        <input className="form-control" placeholder="Chất lượng" value={editData.quality} onChange={e=>setEditData({...editData,quality:e.target.value})} />
                      </div>
                      <div className="col-md-6">
                        <input className="form-control" placeholder="Phạm vi nhiệt độ" value={editData.temp} onChange={e=>setEditData({...editData,temp:e.target.value})} />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-success" onClick={handleSaveEdit}>Lưu</button>
                    <button className="btn btn-danger" onClick={handleCancelEdit}>Hủy</button>
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
                    <p>Bạn có chắc muốn xóa đơn vị máu này không?</p>
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