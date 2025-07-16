import React, { useState, useEffect } from "react";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchNewsList, createNews, updateNews } from "../../services/admin/news";
import { getStatusBadge } from './utils';

const statusMap = {
  public: { label: "Công khai", className: "badge bg-success" },
  hidden: { label: "Ẩn", className: "badge bg-danger" }
};

const newsDataInit = [
  { title: "Hiến máu cứu người - Nghĩa cử cao đẹp", summary: "Phong trào hiến máu cứu người lan tỏa mạnh mẽ...", content: "Nội dung bài viết 1...", author: "Admin", date: "2024-07-01", status: "Công khai" },
  { title: "Ngày hội hiến máu toàn quốc", summary: "Sự kiện lớn thu hút hàng ngàn người tham gia...", content: "Nội dung bài viết 2...", author: "Nguyễn Văn A", date: "2024-06-20", status: "Công khai" },
  { title: "Thông báo lịch hiến máu tháng 8", summary: "Lịch hiến máu tháng 8 đã được cập nhật...", content: "Nội dung bài viết 3...", author: "Admin", date: "2024-06-15", status: "Ẩn" },
];

const statuses = ["Công khai", "Ẩn"];
const PAGE_SIZE = 5;

const sortOptions = [
  { value: '', label: 'Sắp xếp theo...' },
  { value: 'date', label: 'Ngày đăng' },
  { value: 'status', label: 'Trạng thái' },
];
const statusOptions = ["Công khai", "Ẩn"];
const orderOptions = [
  { value: 'desc', label: 'Mới nhất' },
  { value: 'asc', label: 'Cũ nhất' }
];

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8080/admin/news/upload-image', {
    method: 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    body: formData
  });
  if (!response.ok) throw new Error('Upload ảnh thất bại');
  return await response.text();
};

const getStaffId = () => {
  // Lấy staffId từ localStorage hoặc context, ví dụ:
  return parseInt(localStorage.getItem('staffId'), 10) || 1; // fallback 1 nếu chưa có
};

export default function NewsManagement() {
  const [news, setNews] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [detailIdx, setDetailIdx] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState(statusOptions[0]);

  useEffect(() => {
    fetchNewsList().then(setNews);
  }, []);

  // Filter logic
  let filtered = news.filter(n => n.title.toLowerCase().includes(search.toLowerCase()));
  if (sortBy === 'status') {
    filtered = filtered.filter(n => n.status === filterStatus);
  }
  if (sortBy === 'date') {
    filtered = filtered.sort((a, b) => sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date));
  }
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
    const item = filtered[idx];
    setEditIdx(idx);
    setEditData({
      title: item.title || "",
      summary: item.brief || "",
      content: item.content || "",
      author: item.authorName || "",
      date: item.createdAt ? item.createdAt.slice(0, 10) : "",
      status: item.status === "public" ? "Công khai" : "Ẩn"
    });
    setValidationErrors({});
  };
  const handleSaveEdit = async () => {
    const errors = validateNews(editData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    try {
      const globalIdx = news.findIndex(n => n === filtered[editIdx]);
      const newsId = news[globalIdx].newsId;
      await updateNews(newsId, {
        title: editData.title,
        brief: editData.summary,
        content: editData.content,
        imageUrl: editData.imageUrl,
        authorName: editData.author,
        status: editData.status === 'Công khai' ? 'public' : 'hidden',
        staffId: getStaffId()
      });
      const newsList = await fetchNewsList();
      setNews(newsList);
      setEditIdx(null);
      setEditData(null);
      setValidationErrors({});
    } catch (err) {
      alert('Lỗi khi cập nhật tin tức');
    }
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
  const handleSaveAdd = async () => {
    const errors = validateNews(editData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    try {
      await createNews({
        title: editData.title,
        brief: editData.summary,
        content: editData.content,
        imageUrl: editData.imageUrl,
        authorName: editData.author,
        status: editData.status === 'Công khai' ? 'public' : 'hidden',
        staffId: getStaffId()
      });
      const newsList = await fetchNewsList();
      setNews(newsList);
      setAddMode(false);
      setEditData(null);
      setValidationErrors({});
    } catch (err) {
      alert('Lỗi khi thêm tin tức');
    }
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
            <select className="donor-filter" value={sortBy} onChange={e => { setSortBy(e.target.value); setSortOrder('desc'); }}>
              {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            {sortBy === 'status' && (
              <select className="donor-filter" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
            {sortBy === 'date' && (
              <select className="donor-filter" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                {orderOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            )}
            <button className="donor-add" onClick={handleAdd}>+ Thêm tin tức</button>
            <button className="donor-filter-btn">⏷</button>
          </div>
          <div className="donor-table-card">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-center">ID</th>
                  <th className="text-center">Tiêu đề</th>
                  <th className="text-center">Tóm tắt</th>
                  <th className="text-center">Tác giả</th>
                  <th className="text-center">Ngày đăng</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((n, i) => (
                  <tr key={n.newsId}>
                    <td className="text-center">{n.newsId}</td>
                    <td className="text-truncate" style={{maxWidth: 180, cursor:'pointer', color:'#1976d2', textDecoration:'underline'}} title={n.title} onClick={()=>setDetailIdx((page-1)*PAGE_SIZE+i)}>{n.title}</td>
                    <td className="text-truncate" style={{maxWidth: 260}} title={n.brief}>{n.brief}</td>
                    <td className="text-center">{n.authorName}</td>
                    <td className="text-center">{new Date(n.createdAt).toLocaleDateString()}</td>
                    <td className="text-center">
                      <span className={statusMap[n.status]?.className || "badge bg-secondary"}>
                        {statusMap[n.status]?.label || n.status}
                      </span>
                    </td>
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
                        
                        <button 
                          onClick={() => setDetailIdx((page-1)*PAGE_SIZE+i)}
                          title="Xem chi tiết"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            boxShadow: '0 1px 3px rgba(37, 99, 235, 0.2)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#1d4ed8';
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 2px 6px rgba(37, 99, 235, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#2563eb';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 1px 3px rgba(37, 99, 235, 0.2)';
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </button>
                      </div>
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
                      <div className="col-md-12">
                        <input
                          className="form-control"
                          placeholder="URL ảnh minh họa"
                          value={editData.imageUrl || ''}
                          onChange={e => setEditData({...editData, imageUrl: e.target.value})}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control mt-2"
                          onChange={async e => {
                            const file = e.target.files[0];
                            if (file) {
                              try {
                                const url = await uploadImage(file);
                                setEditData({...editData, imageUrl: url});
                              } catch (err) {
                                alert('Upload ảnh thất bại');
                              }
                            }
                          }}
                        />
                        {editData.imageUrl && (
                          <div style={{marginTop:8, textAlign:'center'}}>
                            <img src={editData.imageUrl} alt="preview" style={{maxWidth: '100%', maxHeight: 180, borderRadius: 8, border: '1px solid #eee'}} />
                          </div>
                        )}
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
                    <div style={{marginBottom:16}}>{news[detailIdx].brief}</div>
                    <div style={{fontWeight:'bold', marginBottom:8}}>Nội dung:</div>
                    <div style={{whiteSpace:'pre-line'}}>{news[detailIdx].content}</div>
                    <div style={{marginTop:24, fontSize:14, color:'#888'}}>Tác giả: {news[detailIdx].authorName} | Ngày đăng: {news[detailIdx].createdAt ? new Date(news[detailIdx].createdAt).toLocaleDateString() : ''}</div>
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