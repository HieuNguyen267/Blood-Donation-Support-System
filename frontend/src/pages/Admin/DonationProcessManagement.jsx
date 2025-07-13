import React, { useState } from "react";
import './DonationManagement.css';
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { donationRegisterAPI } from '../../services/api';
import { adminDonationProcessAPI } from '../../services/admin/donationProcess';

// Mapping donation_status sang tiếng Việt
const DONATION_STATUS_MAPPING = {
  'processing': 'Đang xử lý',
  'deferred': 'Tạm dừng',
  'completed': 'Hoàn thành'
};
const DONATION_STATUS_FILTERS = [
  { value: '', label: 'Trạng thái' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'deferred', label: 'Tạm dừng' },
  { value: 'completed', label: 'Hoàn thành' }
];

const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "Rh NULL", "Bombay"];
const processStatuses = ["Tất cả", "Đang xử lý", "Hoàn thành", "Tạm dừng"];

const PAGE_SIZE = 8;

const sortOptions = [
  { value: '', label: 'Sắp xếp theo...' },
  { value: 'code', label: 'Mã đơn nhận' },
  { value: 'name', label: 'Họ và tên' },
  { value: 'donateDate', label: 'Ngày và giờ hiến' },
  { value: 'completeDate', label: 'Ngày và giờ hoàn thành' },
  { value: 'processStatus', label: 'Trạng thái xử lý' },
  { value: 'blood', label: 'Nhóm máu' },
];
const orderOptions = [
  { value: 'asc', label: 'Tăng dần' },
  { value: 'desc', label: 'Giảm dần' }
];

const processStatusOptions = [
  { value: 'Đang xử lý', label: 'Đang xử lý' },
  { value: 'Hoàn thành', label: 'Hoàn thành' },
  { value: 'Tạm dừng', label: 'Tạm dừng' },
];

export default function DonationProcessManagement() {
  const [search, setSearch] = useState("");
  const [blood, setBlood] = useState("Tất cả");
  const [donationStatus, setDonationStatus] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const [confirmedDonations, setConfirmedDonations] = useState([]);

  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const [filterProcessStatus, setFilterProcessStatus] = useState(processStatusOptions[0].value);
  const [filterBlood, setFilterBlood] = useState(bloodTypes[0]);

  React.useEffect(() => {
    const fetchDonations = async () => {
      try {
        const data = await adminDonationProcessAPI.getAllForProcessManagement();
        setConfirmedDonations(
          data
            .filter(d => ['processing', 'deferred', 'completed'].includes(d.donation_status || d.donationStatus))
            .map(d => ({
              id: d.register_id || d.registerId,
              code: (d.register_id || d.registerId)?.toString() || '',
              name: d.donor_name || d.donorName || '',
              donateDate: d.appointmentTime || (d.appointment_date ? new Date(d.appointment_date).toLocaleDateString('vi-VN') : (d.appointmentDate ? new Date(d.appointmentDate).toLocaleDateString('vi-VN') : '')),
              amount: (d.quantity_ml ?? d.quantityMl ?? '') !== '' ? `${d.quantity_ml ?? d.quantityMl} ml` : '',
              blood: d.blood_group || d.bloodGroup || '',
              donationStatus: d.donation_status || d.donationStatus || '',
              staffName: d.staff_name || d.staffName || '',
            }))
        );
      } catch (error) {
        setConfirmedDonations([]);
      }
    };
    fetchDonations();
  }, []);

  // Filter logic
  let filtered = confirmedDonations.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  if (donationStatus) {
    filtered = filtered.filter(d => d.donationStatus === donationStatus);
  }
  if (blood !== 'Tất cả') {
    filtered = filtered.filter(d => d.blood === blood);
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
  if (sortBy === 'completeDate') {
    filtered = filtered.sort((a, b) => sortOrder === 'asc' ? new Date(a.completeDate) - new Date(b.completeDate) : new Date(b.completeDate) - new Date(a.completeDate));
  }

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  React.useEffect(() => { setPage(1); }, [search, blood, donationStatus]);

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
          <div className="donation-toolbar" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <input className="donation-search" placeholder="🔍 Tìm kiếm người hiến ....."
              value={search} onChange={e => setSearch(e.target.value)} style={{ height: 40, minWidth: 220 }} />
            <select className="donation-filter" value={donationStatus} onChange={e => setDonationStatus(e.target.value)} style={{ height: 40 }}>
              {DONATION_STATUS_FILTERS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <select className="donation-filter" value={blood} onChange={e => setBlood(e.target.value)} style={{ height: 40 }}>
              <option value="Tất cả">Nhóm máu</option>
              {bloodTypes.filter(opt => opt !== 'Tất cả').map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            <button className="donation-filter-btn" style={{ height: 40, padding: '0 12px' }}>⏷</button>
            <button className="donation-export" style={{ height: 40 }}>⭳ Xuất tệp</button>
          </div>
          <div className="donation-table-card">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-center" style={{minWidth: 60}}>Mã</th>
                  <th className="text-center" style={{minWidth: 110}}>Mã đơn nhận</th>
                  <th className="text-center" style={{minWidth: 180}}>Họ và tên</th>
                  <th className="text-center" style={{minWidth: 160}}>Ngày và giờ hiến</th>
                  <th className="text-center" style={{minWidth: 110}}>Số lượng (ml)</th>
                  <th className="text-center" style={{minWidth: 120}}>Trạng thái</th>
                  <th className="text-center" style={{minWidth: 100}}>Nhóm máu</th>
                  <th className="text-center" style={{minWidth: 150}}>Staff phụ trách</th>
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
                    <td className="text-center">{d.amount}</td>
                    <td className="text-center">
                      <span style={getProcessStatusStyle(DONATION_STATUS_MAPPING[d.donationStatus])}>● {DONATION_STATUS_MAPPING[d.donationStatus]}</span>
                    </td>
                    <td className="text-center">{d.blood}</td>
                    <td className="text-center">{d.staffName || '-'}</td>
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