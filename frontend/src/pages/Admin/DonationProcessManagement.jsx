import React, { useState } from "react";
import './DonationManagement.css';
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
// Import không cần thiết, đã có function riêng
// import { getStatusStyle } from './utils';

const bloodTypes = ["Tất cả", "Rh NULL", "O-", "O+", "AB+", "AB-", "A+", "B-", "A-", "B+"];
const processStatuses = ["Tất cả", "Đang xử lý", "Hoàn thành", "Tạm dừng"];

const PAGE_SIZE = 8;

export default function DonationProcessManagement() {
  const [search, setSearch] = useState("");
  const [blood, setBlood] = useState("Tất cả");
  const [processStatus, setProcessStatus] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // Lấy dữ liệu từ localStorage hoặc fallback data
  const getConfirmedDonations = () => {
    const fallbackData = [
      { code: "A001", name: "Nguyễn Duy Hiếu", donateDate: "11/4/2024, 09:30", completeDate: "11/4/2024, 10:30", amount: "120 ml", status: "Xác nhận", blood: "Rh NULL", processStatus: "Đang xử lý" },
      { code: "A003", name: "Nguyễn Gia Triệu", donateDate: "4/11/2025, 15:35", completeDate: "4/11/2025, 16:35", amount: "120 ml", status: "Xác nhận", blood: "O+", processStatus: "Hoàn thành" },
      { code: "A004", name: "Đậu Nguyễn Bảo Tuấn", donateDate: "27/5/2025, 10:30", completeDate: "27/5/2025, 11:30", amount: "120 ml", status: "Xác nhận", blood: "AB+", processStatus: "Đang xử lý" },
      { code: "A005", name: "Nguyễn Anh Khoa", donateDate: "27/5/2025, 10:45", completeDate: "27/5/2025, 11:45", amount: "120 ml", status: "Xác nhận", blood: "AB-", processStatus: "Hoàn thành" },
      { code: "A007", name: "Nguyễn Trí Thông", donateDate: "15/4/2024, 08:30", completeDate: "15/4/2024, 09:30", amount: "120 ml", status: "Xác nhận", blood: "B-", processStatus: "Tạm dừng" },
    ];

    try {
      const storedDonations = localStorage.getItem('donations');
      if (storedDonations) {
        const allDonations = JSON.parse(storedDonations);
        // Chỉ lấy những đơn có trạng thái "Xác nhận" và thêm processStatus nếu chưa có
        return allDonations
          .filter(d => d.status === "Xác nhận")
          .map(d => ({
            ...d,
            processStatus: d.processStatus || "Đang xử lý"
          }));
      }
    } catch (error) {
      console.error('Error loading donations from localStorage:', error);
    }
    
    return fallbackData;
  };

  const [confirmedDonations, setConfirmedDonations] = useState(getConfirmedDonations());

  // Cập nhật dữ liệu khi có thay đổi trong localStorage
  React.useEffect(() => {
    const handleStorageChange = () => {
      setConfirmedDonations(getConfirmedDonations());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Filter logic
  const filtered = confirmedDonations.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchBlood = blood === "Tất cả" || d.blood === blood;
    const matchProcessStatus = processStatus === "Tất cả" || d.processStatus === processStatus;
    return matchSearch && matchBlood && matchProcessStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  React.useEffect(() => { setPage(1); }, [search, blood, processStatus]);

  // Edit process - dẫn đến trang chi tiết quá trình hiến
  const handleEdit = (idx) => {
    const donation = filtered[idx];
    navigate(`/admin/donation-process/${donation.code}`);
  };

  const getProcessStatusStyle = (status) => {
    switch(status) {
      case "Đang xử lý": return { color: "#f59e0b", fontWeight: "600" };
      case "Hoàn thành": return { color: "#10b981", fontWeight: "600" };
      case "Tạm dừng": return { color: "#ef4444", fontWeight: "600" };
      default: return { color: "#6b7280", fontWeight: "600" };
    }
  };

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="donation-page-root">
          <h2 className="donation-title">Quản lý quá trình hiến</h2>
          <div className="donation-toolbar">
            <input className="donation-search" placeholder="🔍 Tìm kiếm người hiến ....."
              value={search} onChange={e => setSearch(e.target.value)} />
            <select className="donation-filter" value={blood} onChange={e => setBlood(e.target.value)}>
              {bloodTypes.map(b => <option key={b}>{b}</option>)}
            </select>
            <select className="donation-filter" value={processStatus} onChange={e => setProcessStatus(e.target.value)}>
              {processStatuses.map(s => <option key={s}>{s}</option>)}
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
                  <th className="text-center" style={{minWidth: 120}}>Trạng thái xử lý</th>
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
                      <span style={getProcessStatusStyle(d.processStatus)}>● {d.processStatus}</span>
                    </td>
                    <td className="text-center">{d.blood}</td>
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
        </main>
      </div>
    </div>
  );
} 