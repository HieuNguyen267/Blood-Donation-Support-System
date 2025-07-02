import React, { useState } from 'react';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DonorManagement.css';
import { getStatusStyle } from './utils'; // Import from shared utils

// Mock Data
const initialMatchingData = [
  { id: 'M001', requestId: 'REQ056', hospital: 'Bệnh viện Trung Ương', donor: 'Đậu Nguyễn Bảo Tuấn', bloodType: 'O+', matchDate: '2024-07-20', status: 'Đã đồng ý' },
  { id: 'M002', requestId: 'REQ056', hospital: 'Bệnh viện Trung Ương', donor: 'Lê Văn Hùng', bloodType: 'O+', matchDate: '2024-07-20', status: 'Chờ xác nhận' },
  { id: 'M003', requestId: 'REQ057', hospital: 'Bệnh viện Chợ Rẫy', donor: 'Trần Thị Mai', bloodType: 'A+', matchDate: '2024-07-19', status: 'Đã từ chối' },
  { id: 'M004', requestId: 'REQ058', hospital: 'Bệnh viện Bạch Mai', donor: 'Phạm Minh Tuấn', bloodType: 'B+', matchDate: '2024-07-18', status: 'Hoàn thành' },
  { id: 'M005', requestId: 'REQ059', hospital: 'Bệnh viện 108', donor: 'Nguyễn Thị Lan', bloodType: 'AB-', matchDate: '2024-07-18', status: 'Chờ xác nhận' },
  { id: 'M006', requestId: 'REQ060', hospital: 'Bệnh viện Việt Đức', donor: 'Đỗ Quang Vinh', bloodType: 'O+', matchDate: '2024-07-17', status: 'Đã đồng ý' },
];

const bloodTypes = ["Tất cả", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const statuses = ["Tất cả", "Đã đồng ý", "Chờ xác nhận", "Đã từ chối", "Hoàn thành"];

const MatchingManagement = () => {
  const [matchings, setMatchings] = useState(initialMatchingData);
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('Tất cả');
  const [statusFilter, setStatusFilter] = useState('Tất cả');

  const filteredMatchings = matchings.filter(m => 
    (m.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (bloodTypeFilter === 'Tất cả' || m.bloodType === bloodTypeFilter) &&
    (statusFilter === 'Tất cả' || m.status === statusFilter)
  );

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="donor-page-root">
          <h2 className="donor-title">Quản lý Matching</h2>
          <div className="donor-toolbar">
            <input 
              type="text" 
              className="donor-search"
              placeholder="🔍 Tìm kiếm theo ID, bệnh viện, người hiến..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select className="donor-filter" value={bloodTypeFilter} onChange={e => setBloodTypeFilter(e.target.value)}>
              {bloodTypes.map(b => <option key={b}>{b}</option>)}
            </select>
            <select className="donor-filter" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
            <button className="donor-filter-btn">⏷</button>
            <button className="donor-export">⭳ Xuất tệp</button>
          </div>

          <div className="donor-table-card">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-center">Matching ID</th>
                  <th className="text-center">Request ID</th>
                  <th className="text-center" style={{minWidth: 160}}>Tên bệnh viện</th>
                  <th className="text-center" style={{minWidth: 160}}>Tên người hiến</th>
                  <th className="text-center">Nhóm máu</th>
                  <th className="text-center">Ngày liên hệ</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatchings.length > 0 ? (
                  filteredMatchings.map(matching => (
                    <tr key={matching.id}>
                      <td className="text-center">{matching.id}</td>
                      <td className="text-center"><a href="#">{matching.requestId}</a></td>
                      <td>{matching.hospital}</td>
                      <td>{matching.donor}</td>
                      <td className="text-center">{matching.bloodType}</td>
                      <td className="text-center">{matching.matchDate}</td>
                      <td className="text-center">
                        <span style={getStatusStyle(matching.status)}>
                          ● {matching.status}
                        </span>
                      </td>
                      <td className="text-center">
                        <div style={{display: 'flex', gap: '6px', justifyContent: 'center'}}>
                          <button 
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-5">Không tìm thấy dữ liệu.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MatchingManagement; 