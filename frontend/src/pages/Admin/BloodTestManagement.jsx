import React, { useState } from "react";
import './DonationManagement.css';
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { donationRegisterAPI } from '../../services/api';

const bloodTypes = ["Tất cả", "Rh NULL", "O-", "O+", "AB+", "AB-", "A+", "B-", "A-", "B+"];
const testStatuses = ["Tất cả", "Đạt chuẩn", "Đang xét nghiệm", "Đợi xét nghiệm", "Không đạt chuẩn"];

const PAGE_SIZE = 8;

export default function BloodTestManagement() {
  const [search, setSearch] = useState("");
  const [blood, setBlood] = useState("Tất cả");
  const [testStatus, setTestStatus] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState({});
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const navigate = useNavigate();
  const [bloodTests, setBloodTests] = useState([]);

  React.useEffect(() => {
    const fetchBloodTests = async () => {
      try {
        const data = await donationRegisterAPI.getAllDonationRegisters();
        // Lọc các đơn có trạng thái hoàn thành hoặc phù hợp kiểm tra máu
        setBloodTests(data.filter(d => d.processStatus === 'Hoàn thành' || d.status === 'Hoàn thành').map(d => ({
          code: d.code || d.donationRegisterId || '',
          name: d.donorName || d.name || '',
          donateDate: d.donationDate || '',
          completeDate: d.completionDate || '',
          amount: d.amount ? `${d.amount} ml` : '',
          blood: d.bloodGroup ? (d.bloodGroup.aboType + d.bloodGroup.rhFactor) : d.blood,
          testStatus: d.testStatus || 'Đợi xét nghiệm',
        })));
      } catch (error) {
        // Nếu lỗi thì fallback về dữ liệu mẫu
        setBloodTests([
          { code: "A001", name: "Nguyễn Duy Hiếu", donateDate: "11/4/2024, 09:30", completeDate: "11/4/2024, 10:30", amount: "120 ml", blood: "Rh NULL", testStatus: "Đang xét nghiệm" },
          { code: "A003", name: "Nguyễn Gia Triệu", donateDate: "4/11/2025, 15:35", completeDate: "4/11/2025, 16:35", amount: "120 ml", blood: "O+", testStatus: "Đạt chuẩn" },
          { code: "A005", name: "Nguyễn Anh Khoa", donateDate: "27/5/2025, 10:45", completeDate: "27/5/2025, 11:45", amount: "120 ml", blood: "AB-", testStatus: "Đợi xét nghiệm" },
        ]);
      }
    };
    fetchBloodTests();
  }, []);

  // Filter logic
  const filtered = bloodTests.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.code.toLowerCase().includes(search.toLowerCase());
    const matchBlood = blood === "Tất cả" || d.blood === blood;
    const matchTestStatus = testStatus === "Tất cả" || d.testStatus === testStatus;
    return matchSearch && matchBlood && matchTestStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  React.useEffect(() => { setPage(1); }, [search, blood, testStatus]);

  // Hàm cập nhật trạng thái xét nghiệm
  const handleEdit = (idx) => {
    const actualIdx = (page-1)*PAGE_SIZE + idx;
    setEditIdx(actualIdx);
    setEditData({...filtered[actualIdx]});
  };

  const handleSaveEdit = () => {
    // Cập nhật trong localStorage
    try {
      const allDonations = JSON.parse(localStorage.getItem('donations') || '[]');
      const donationIdx = allDonations.findIndex(d => d.code === editData.code);
      if (donationIdx !== -1) {
        allDonations[donationIdx] = { ...allDonations[donationIdx], testStatus: editData.testStatus };
        localStorage.setItem('donations', JSON.stringify(allDonations));
        
        // Cập nhật state local
        const updatedBloodTests = bloodTests.map(d => 
          d.code === editData.code ? { ...d, testStatus: editData.testStatus } : d
        );
        setBloodTests(updatedBloodTests);
        
        setToast({ show: true, type: 'success', message: 'Cập nhật trạng thái xét nghiệm thành công!' });
        setEditIdx(null);
      }
    } catch (error) {
      setToast({ show: true, type: 'error', message: 'Có lỗi xảy ra khi cập nhật!' });
    }
  };

  const handleCancelEdit = () => {
    setEditIdx(null);
    setEditData({});
  };

  const getTestStatusStyle = (status) => {
    switch(status) {
      case "Đạt chuẩn": return { color: "#10b981", fontWeight: "600" };
      case "Đang xét nghiệm": return { color: "#2563eb", fontWeight: "600" };
      case "Đợi xét nghiệm": return { color: "#f59e0b", fontWeight: "600" };
      case "Không đạt chuẩn": return { color: "#ef4444", fontWeight: "600" };
      default: return { color: "#6b7280", fontWeight: "600" };
    }
  };

  // Ẩn toast sau 2.5s
  React.useEffect(() => {
    if (toast.show) {
      const t = setTimeout(() => setToast({ ...toast, show: false }), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="donation-page-root">
          <h2 className="donation-title">Quản lý Kiểm tra máu</h2>
          <div className="donation-toolbar">
            <input className="donation-search" placeholder="🔍 Tìm kiếm mã đơn, người hiến ....."
              value={search} onChange={e => setSearch(e.target.value)} />
            <select className="donation-filter" value={blood} onChange={e => setBlood(e.target.value)}>
              {bloodTypes.map(b => <option key={b}>{b}</option>)}
            </select>
            <select className="donation-filter" value={testStatus} onChange={e => setTestStatus(e.target.value)}>
              {testStatuses.map(s => <option key={s}>{s}</option>)}
            </select>
            <button className="donation-filter-btn">⏷</button>
            <button className="donation-export">⭳ Xuất tệp</button>
          </div>
          <div className="donation-table-card">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-center" style={{minWidth: 60}}>STT</th>
                  <th className="text-center" style={{minWidth: 110}}>Mã đơn hiến</th>
                  <th className="text-center" style={{minWidth: 180}}>Họ và tên</th>
                  <th className="text-center" style={{minWidth: 160}}>Ngày hiến máu</th>
                  <th className="text-center" style={{minWidth: 160}}>Ngày hoàn thành</th>
                  <th className="text-center" style={{minWidth: 110}}>Số lượng (ml)</th>
                  <th className="text-center" style={{minWidth: 100}}>Nhóm máu</th>
                  <th className="text-center" style={{minWidth: 150}}>Trạng thái xét nghiệm</th>
                  <th className="text-center" style={{minWidth: 90}}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((d, i) => (
                  <tr key={i}>
                    <td className="text-center">{i+1+(page-1)*PAGE_SIZE}</td>
                    <td className="text-center">{d.code}</td>
                    <td className="text-truncate" style={{maxWidth: 180}}>{d.name}</td>
                    <td className="text-center">{d.donateDate}</td>
                    <td className="text-center">{d.completeDate}</td>
                    <td className="text-center">{d.amount}</td>
                    <td className="text-center">{d.blood}</td>
                    <td className="text-center">
                      <span style={getTestStatusStyle(d.testStatus)}>● {d.testStatus}</span>
                    </td>
                    <td className="text-center">
                      <div style={{display: 'flex', gap: '6px', justifyContent: 'center'}}>
                        <button 
                          onClick={() => handleEdit(i)}
                          title="Cập nhật trạng thái"
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
                      </div>
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center text-secondary">Không có dữ liệu phù hợp</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="donation-pagination">
              <button onClick={() => setPage(Math.max(1, page-1))} disabled={page === 1}>‹ Trước</button>
              <span style={{ color: '#666', fontSize: '16px' }}>Trang {page} / {totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages, page+1))} disabled={page === totalPages}>Sau ›</button>
            </div>
          )}

          {/* Modal cập nhật trạng thái xét nghiệm */}
          {editIdx !== null && (
            <div className="modal fade show" style={{display:'block',background:'rgba(0,0,0,0.3)'}} tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header" style={{background:'#8fd19e'}}>
                    <h5 className="modal-title">Cập nhật trạng thái xét nghiệm</h5>
                    <button type="button" className="btn-close" onClick={handleCancelEdit}></button>
                  </div>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label"><strong>Mã đơn hiến:</strong> {editData.code}</label>
                      </div>
                      <div className="col-12">
                        <label className="form-label"><strong>Người hiến:</strong> {editData.name}</label>
                      </div>
                      <div className="col-12">
                        <label className="form-label"><strong>Nhóm máu:</strong> {editData.blood}</label>
                      </div>
                      <div className="col-12">
                        <label className="form-label">Trạng thái xét nghiệm *</label>
                        <select 
                          className="form-control" 
                          value={editData.testStatus || "Đợi xét nghiệm"} 
                          onChange={e => setEditData({...editData, testStatus: e.target.value})}
                        >
                          <option value="Đợi xét nghiệm">Đợi xét nghiệm</option>
                          <option value="Đang xét nghiệm">Đang xét nghiệm</option>
                          <option value="Đạt chuẩn">Đạt chuẩn</option>
                          <option value="Không đạt chuẩn">Không đạt chuẩn</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-success" onClick={handleSaveEdit}>Cập nhật</button>
                    <button className="btn btn-secondary" onClick={handleCancelEdit}>Hủy</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Toast thông báo */}
          {toast.show && (
            <div className={`custom-toast ${toast.type}`}>{toast.message}</div>
          )}
        </main>
      </div>
    </div>
  );
} 