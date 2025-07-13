import React, { useState } from "react";
import './DonationManagement.css';
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { bloodCheckAPI } from '../../services/api';
import { getStatusStyle } from './utils';

const bloodTypes = ["Tất cả", "Rh NULL", "O-", "O+", "AB+", "AB-", "A+", "B-", "A-", "B+"];
const testStatuses = ["Tất cả", "Đạt chuẩn", "Đang xét nghiệm", "Đợi xét nghiệm", "Không đạt chuẩn"];

const PAGE_SIZE = 8;

const sortOptions = [
  { value: '', label: 'Sắp xếp theo...' },
  { value: 'code', label: 'Mã đơn hiến' },
  { value: 'name', label: 'Họ và tên' },
  { value: 'donateDate', label: 'Ngày hiến máu' },
  { value: 'blood', label: 'Nhóm máu' },
  { value: 'testStatus', label: 'Trạng thái xét nghiệm' },
];
const testStatusOptions = [
  { value: 'Đợi xét nghiệm', label: 'Đợi xét nghiệm' },
  { value: 'Đạt chuẩn', label: 'Đạt chuẩn' },
  { value: 'Không đạt chuẩn', label: 'Không đạt chuẩn' },
];
const orderOptions = [
  { value: 'asc', label: 'Tăng dần' },
  { value: 'desc', label: 'Giảm dần' }
];

export default function BloodTestManagement() {
  const [search, setSearch] = useState("");
  const [blood, setBlood] = useState("Tất cả");
  const [testStatus, setTestStatus] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const navigate = useNavigate();
  const [bloodTests, setBloodTests] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterTestStatus, setFilterTestStatus] = useState(testStatusOptions[0].value);

  // Helper functions to format data
  const formatAppointmentTime = (appointmentDate, startTime, endTime) => {
    if (!appointmentDate) return '';
    const dateStr = appointmentDate;
    if (startTime && endTime) {
      // Format time to show only hours and minutes (HH:mm)
      const formatTime = (timeStr) => {
        if (!timeStr) return '';
        // If time is in format HH:mm:ss, take only HH:mm
        if (timeStr.includes(':')) {
          const parts = timeStr.split(':');
          return `${parts[0]}:${parts[1]}`;
        }
        return timeStr;
      };
      
      const formattedStartTime = formatTime(startTime);
      const formattedEndTime = formatTime(endTime);
      
      return `${dateStr}, ${formattedStartTime} - ${formattedEndTime}`;
    }
    return dateStr;
  };

  const formatBloodGroup = (aboType, rhFactor) => {
    if (!aboType || !rhFactor) return '';
    const rhSymbol = rhFactor.toLowerCase() === 'positive' ? '+' : 
                     rhFactor.toLowerCase() === 'negative' ? '-' : rhFactor;
    return aboType + rhSymbol;
  };

  const formatStatus = (status) => {
    if (!status) return 'Chờ xét nghiệm';
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Chờ xét nghiệm';
      case 'approved':
        return 'Đạt chuẩn';
      case 'rejected':
        return 'Không đạt chuẩn';
      default:
        return status;
    }
  };



  React.useEffect(() => {
    const fetchBloodTests = async () => {
      try {
        const data = await bloodCheckAPI.getAllBloodChecks();
        setBloodTests(data.map(d => ({
          code: d.bloodCheckId?.toString() || '',
          name: d.donorName || '',
          donateDate: formatAppointmentTime(d.appointmentDate, d.startTime, d.endTime),
          amount: d.quantityMl ? `${d.quantityMl} ml` : '',
          blood: formatBloodGroup(d.aboType, d.rhFactor),
          testStatus: formatStatus(d.status),
          staffName: d.staffName || '',
        })));
      } catch (error) {
        console.error('Error fetching blood checks:', error);
        // Nếu lỗi thì fallback về dữ liệu mẫu
        setBloodTests([
          { code: "1", name: "Nguyễn Duy Hiếu", donateDate: "2024-04-11, 09:30 - 10:30", amount: "120 ml", blood: "A+", testStatus: "Đang xét nghiệm", staffName: "Nguyễn Văn A" },
          { code: "2", name: "Nguyễn Gia Triệu", donateDate: "2024-11-04, 15:35 - 16:35", amount: "120 ml", blood: "O+", testStatus: "Đạt chuẩn", staffName: "Trần Thị B" },
          { code: "3", name: "Nguyễn Anh Khoa", donateDate: "2024-05-27, 10:45 - 11:45", amount: "120 ml", blood: "AB-", testStatus: "Chờ xét nghiệm", staffName: "Lê Văn C" },
        ]);
      }
    };
    fetchBloodTests();
  }, []);

  // Filter logic
  let filtered = bloodTests.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.code.toLowerCase().includes(search.toLowerCase()));
  if (sortBy === 'testStatus') {
    filtered = filtered.filter(d => d.testStatus === filterTestStatus);
  }
  if (sortBy === 'code') {
    filtered = filtered.sort((a, b) => sortOrder === 'asc' ? (a.code > b.code ? 1 : -1) : (a.code < b.code ? 1 : -1));
  }
  if (sortBy === 'name') {
    filtered = filtered.sort((a, b) => sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
  }
  if (sortBy === 'donateDate') {
    filtered = filtered.sort((a, b) => sortOrder === 'asc' ? new Date(a.donateDate) - new Date(b.donateDate) : new Date(b.donateDate) - new Date(a.donateDate));
  }
  if (sortBy === 'blood') {
    filtered = filtered.sort((a, b) => sortOrder === 'asc' ? a.blood.localeCompare(b.blood) : b.blood.localeCompare(a.blood));
  }

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  React.useEffect(() => { setPage(1); }, [search, blood, testStatus]);

  const getTestStatusStyle = (status) => {
    return getStatusStyle(status);
  };



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
            <select className="donation-filter" value={sortBy} onChange={e => { setSortBy(e.target.value); setSortOrder('asc'); }}>
              {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            {sortBy === 'testStatus' && (
              <select className="donation-filter" value={filterTestStatus} onChange={e => setFilterTestStatus(e.target.value)}>
                {testStatusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            )}
            {(sortBy === 'code' || sortBy === 'name' || sortBy === 'donateDate' || sortBy === 'blood') && (
              <select className="donation-filter" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                {orderOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            )}
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
                  <th className="text-center" style={{minWidth: 110}}>Số lượng (ml)</th>
                  <th className="text-center" style={{minWidth: 100}}>Nhóm máu</th>
                  <th className="text-center" style={{minWidth: 150}}>Trạng thái xét nghiệm</th>
                  <th className="text-center" style={{minWidth: 150}}>Staff phụ trách</th>
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
                    <td className="text-center">{d.amount}</td>
                    <td className="text-center">{d.blood}</td>
                    <td className="text-center">
                      <span style={getTestStatusStyle(d.testStatus)}>● {d.testStatus}</span>
                    </td>
                    <td className="text-center">{d.staffName}</td>
                    <td className="text-center">
                      <div style={{display: 'flex', gap: '6px', justifyContent: 'center'}}>
                        <button 
                          onClick={() => navigate(`/admin/blood-checks/${d.code}`)}
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