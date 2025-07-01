import React, { useState, useEffect } from 'react';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DonorManagement.css';
import { getStatusStyle } from './utils';
import { matchingAPI } from '../../services/api';

const bloodTypes = ["Tất cả", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const statuses = ["Tất cả", "Đã đồng ý", "Chờ xác nhận", "Đã từ chối", "Hoàn thành"];

const MatchingManagement = () => {
  const [matchings, setMatchings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('Tất cả');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    matchingAPI.getAllMatchings()
      .then(data => {
        // Map dữ liệu từ backend sang format FE cần
        const mapped = (data || []).map(m => ({
          id: m.matchingId,
          requestId: m.requestId,
          hospital: m.hospitalName || '', // cần backend trả về hoặc FE phải join thêm
          donor: m.donorName,
          bloodType: m.bloodType || '', // cần backend trả về hoặc FE phải join thêm
          matchDate: m.notificationSentAt ? m.notificationSentAt.split('T')[0] : '',
          status: m.donorResponse || 'Chờ xác nhận',
        }));
        setMatchings(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredMatchings = matchings.filter(m => 
    (m.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.id.toString().toLowerCase().includes(searchTerm.toLowerCase())) &&
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
            {loading ? (
              <div>Đang tải dữ liệu...</div>
            ) : (
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
                        <button className="btn btn-sm btn-outline-primary">Xem</button>
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
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MatchingManagement; 