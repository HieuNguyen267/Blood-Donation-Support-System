import React, { useState } from "react";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { getStatusBadge } from './utils';

const newsDataInit = [
  { title: "Hiến máu cứu người - Nghĩa cử cao đẹp", summary: "Phong trào hiến máu cứu người lan tỏa mạnh mẽ...", content: "Nội dung bài viết 1...", author: "Admin", date: "2024-07-01", status: "Công khai" },
  { title: "Ngày hội hiến máu toàn quốc", summary: "Sự kiện lớn thu hút hàng ngàn người tham gia...", content: "Nội dung bài viết 2...", author: "Nguyễn Văn A", date: "2024-06-20", status: "Công khai" },
  { title: "Thông báo lịch hiến máu tháng 8", summary: "Lịch hiến máu tháng 8 đã được cập nhật...", content: "Nội dung bài viết 3...", author: "Admin", date: "2024-06-15", status: "Ẩn" },
];

const statuses = ["Công khai", "Ẩn"];
const PAGE_SIZE = 5;

export default function NewsManagement() {
  const [news, setNews] = useState(newsDataInit);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [detailIdx, setDetailIdx] = useState(null);

  // Filter logic
  const filtered = news.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "Tất cả" || n.status === status;
    return matchSearch && matchStatus;
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  React.useEffect(() => { setPage(1); }, [search, status]);

  // Validation
  const validateNews = (data) => {
    const errors = {};
    if (!data.title?.trim()) errors.title = "Tiêu đề là bắt buộc";
    if (!data.summary?.trim()) errors.summary = "Tóm tắt là bắt buộc";
    if (!data.content?.trim()) errors.content = "Nội dung là bắt buộc";
    if (!data.author?.trim()) errors.author = "Tác giả là bắt buộc";
    if (!data.date?.trim()) errors.date = "Ngày đăng là bắt buộc";
    return errors;
  };

  // Edit logic
  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditData({...filtered[idx]});
    setValidationErrors({});
  };
  const handleSaveEdit = () => {
    const errors = validateNews(editData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    const globalIdx = news.findIndex(n => n === filtered[editIdx]);
    const newNews = [...news];
    newNews[globalIdx] = editData;
    setNews(newNews);
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
    const globalIdx = news.findIndex(n => n === filtered[deleteIdx]);
    setNews(news.filter((_, i) => i !== globalIdx));
    setDeleteIdx(null);
  };
  const handleCancelDelete = () => { setDeleteIdx(null); };

  // Add logic
  const handleAdd = () => {
    setAddMode(true);
    setEditIdx(null);
    setEditData({
      title: '', summary: '', content: '', author: '', date: '', status: 'Công khai'
    });
    setValidationErrors({});
  };
  const handleSaveAdd = () => {
    const errors = validateNews(editData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setNews([editData, ...news]);
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
          <h2 className="donor-title">Quản lý tin tức</h2>
          <div className="donor-toolbar">
            <input className="donor-search" placeholder="🔍 Tìm kiếm tiêu đề ..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <select className="donor-filter" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="Tất cả">Tất cả</option>
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
            <button className="donor-add" onClick={handleAdd}>+ Thêm tin tức</button>
            <button className="donor-filter-btn">⏷</button>
          </div>
          <div className="donor-table-card">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-center" style={{minWidth: 220}}>Tiêu đề</th>
                  <th className="text-center" style={{minWidth: 220}}>Tóm tắt</th>
                  <th className="text-center" style={{minWidth: 120}}>Tác giả</th>
                  <th className="text-center" style={{minWidth: 120}}>Ngày đăng</th>
                  <th className="text-center" style={{minWidth: 120}}>Trạng thái</th>
                  <th className="text-center" style={{minWidth: 90}}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((n, i) => (
                  <tr key={i}>
                    <td className="text-truncate" style={{maxWidth: 180, cursor:'pointer', color:'#1976d2', textDecoration:'underline'}} title={n.title} onClick={()=>setDetailIdx((page-1)*PAGE_SIZE+i)}>{n.title}</td>
                    <td className="text-truncate" style={{maxWidth: 260}} title={n.summary}>{n.summary}</td>
                    <td className="text-center">{n.author}</td>
                    <td className="text-center">{n.date}</td>
                    <td className="text-center">
                      <span className={getStatusBadge(n.status)}>{n.status}</span>
                    </td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-primary me-1" title="Sửa" onClick={() => handleEdit(i)}><span className="donor-action edit">✏️</span></button>
                      <button className="btn btn-sm btn-outline-danger" title="Xóa" onClick={() => handleDelete(i)}><span className="donor-action delete">🗑️</span></button>
                      <button className="btn btn-sm btn-outline-info ms-1" title="Xem chi tiết" onClick={()=>setDetailIdx((page-1)*PAGE_SIZE+i)}><span>👁️</span></button>
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-secondary">Không có dữ liệu phù hợp</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Popup thêm mới hoặc chỉnh sửa tin tức */}
          {(addMode || editIdx !== null) && (
            <div className="modal fade show" style={{display:'block',background:'rgba(0,0,0,0.3)'}} tabIndex="-1">
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header" style={{background:'#8fd19e'}}>
                    <h5 className="modal-title">{addMode ? 'Thêm tin tức' : 'Chỉnh sửa tin tức'}</h5>
                    <button type="button" className="btn-close" onClick={addMode ? handleCancelAdd : handleCancelEdit}></button>
                  </div>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-12">
                        <input 
                          className={`form-control ${validationErrors.title ? 'is-invalid' : ''}`} 
                          placeholder="Tiêu đề*" 
                          value={editData.title} 
                          onChange={e=>setEditData({...editData,title:e.target.value})} 
                        />
                        {validationErrors.title && <div className="invalid-feedback">{validationErrors.title}</div>}
                      </div>
                      <div className="col-md-12">
                        <textarea 
                          className={`form-control ${validationErrors.summary ? 'is-invalid' : ''}`} 
                          placeholder="Tóm tắt*" 
                          value={editData.summary} 
                          onChange={e=>setEditData({...editData,summary:e.target.value})} 
                          rows={2}
                        />
                        {validationErrors.summary && <div className="invalid-feedback">{validationErrors.summary}</div>}
                      </div>
                      <div className="col-md-12">
                        <textarea 
                          className={`form-control ${validationErrors.content ? 'is-invalid' : ''}`} 
                          placeholder="Nội dung*" 
                          value={editData.content} 
                          onChange={e=>setEditData({...editData,content:e.target.value})} 
                          rows={5}
                        />
                        {validationErrors.content && <div className="invalid-feedback">{validationErrors.content}</div>}
                      </div>
                      <div className="col-md-6">
                        <input 
                          className={`form-control ${validationErrors.author ? 'is-invalid' : ''}`} 
                          placeholder="Tác giả*" 
                          value={editData.author} 
                          onChange={e=>setEditData({...editData,author:e.target.value})} 
                        />
                        {validationErrors.author && <div className="invalid-feedback">{validationErrors.author}</div>}
                      </div>
                      <div className="col-md-6">
                        <input 
                          className={`form-control ${validationErrors.date ? 'is-invalid' : ''}`} 
                          placeholder="Ngày đăng*" 
                          type="date"
                          value={editData.date} 
                          onChange={e=>setEditData({...editData,date:e.target.value})} 
                        />
                        {validationErrors.date && <div className="invalid-feedback">{validationErrors.date}</div>}
                      </div>
                      <div className="col-md-6">
                        <select className="form-control" value={editData.status} onChange={e=>setEditData({...editData,status:e.target.value})}>
                          {statuses.map(s=><option key={s}>{s}</option>)}
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
                    <p>Bạn có chắc muốn xóa tin tức này không?</p>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-danger" onClick={handleConfirmDelete}>Xóa</button>
                    <button className="btn btn-secondary" onClick={handleCancelDelete}>Hủy</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Modal xem chi tiết tin tức */}
          {detailIdx !== null && news[detailIdx] && (
            <div className="modal fade show" style={{display:'block',background:'rgba(0,0,0,0.3)'}} tabIndex="-1">
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header" style={{background:'#e3eafc'}}>
                    <h5 className="modal-title">{news[detailIdx].title}</h5>
                    <button type="button" className="btn-close" onClick={()=>setDetailIdx(null)}></button>
                  </div>
                  <div className="modal-body">
                    <div style={{fontWeight:'bold', marginBottom:8}}>Tóm tắt:</div>
                    <div style={{marginBottom:16}}>{news[detailIdx].summary}</div>
                    <div style={{fontWeight:'bold', marginBottom:8}}>Nội dung:</div>
                    <div style={{whiteSpace:'pre-line'}}>{news[detailIdx].content}</div>
                    <div style={{marginTop:24, fontSize:14, color:'#888'}}>Tác giả: {news[detailIdx].author} | Ngày đăng: {news[detailIdx].date}</div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={()=>setDetailIdx(null)}>Đóng</button>
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