import React, { useState, useEffect } from 'react';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DonorManagement.css';
import { getStatusStyle } from './utils';
import { bloodRequestAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const MatchingManagement = () => {
  const navigate = useNavigate();
  const [matchings, setMatchings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('Tất cả');
  const [statusFilter, setStatusFilter] = useState('Tất cả');

  // Fetch data from API
  useEffect(() => {
    const fetchMatchingData = async () => {
      try {
        setLoading(true);
        const data = await bloodRequestAPI.getMatchingBloodForAdmin();
        setMatchings(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching matching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchingData();
  }, []);

  // Filter data
  const filteredMatchings = matchings.filter(m => {
    const matchesSearch = 
      (m.hospitalName && m.hospitalName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.donorName && m.donorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.matchingId && m.matchingId.toString().includes(searchTerm)) ||
      (m.requestId && m.requestId.toString().includes(searchTerm));
    
    const matchesBloodType = bloodTypeFilter === 'Tất cả' || 
      (m.requiredBloodGroup && m.requiredBloodGroup === bloodTypeFilter);
    
    const matchesStatus = statusFilter === 'Tất cả' || 
      (m.status && m.status === statusFilter);

    return matchesSearch && matchesBloodType && matchesStatus;
  });

  // Get unique blood types and statuses for filters
  const bloodTypes = ['Tất cả', ...new Set(matchings.map(m => m.requiredBloodGroup).filter(Boolean))];
  const statuses = ['Tất cả', ...new Set(matchings.map(m => m.status).filter(Boolean))];

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Format status for display
  const formatStatus = (status) => {
    if (!status) return 'Chưa xác định';
    const statusMap = {
      'contacting': 'Đang liên hệ',
      'contact_successful': 'Liên hệ thành công',
      'rejected': 'Đã từ chối',
      'accepted': 'Đã đồng ý',
      'completed': 'Hoàn thành'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="dashboard-root">
        <Header />
        <div className="dashboard-main">
          <Sidebar />
          <main className="donor-page-root">
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Đang tải dữ liệu...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-root">
        <Header />
        <div className="dashboard-main">
          <Sidebar />
          <main className="donor-page-root">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Lỗi!</h4>
              <p>Không thể tải dữ liệu: {error}</p>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Thử lại
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

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
            <select 
              className="donor-filter" 
              value={bloodTypeFilter} 
              onChange={e => setBloodTypeFilter(e.target.value)}
            >
              {bloodTypes.map(b => <option key={b}>{b}</option>)}
            </select>
            <select 
              className="donor-filter" 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
            >
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
                  <th className="text-center">Nhóm máu cần</th>
                  <th className="text-center">Nhóm máu người hiến</th>
                  <th className="text-center">Ngày liên hệ</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-center">Số lượng (ml)</th>
                  <th className="text-center">Khoảng cách (km)</th>
                  <th className="text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatchings.length > 0 ? (
                  filteredMatchings.map(matching => (
                    <tr key={matching.matchingId}>
                      <td className="text-center">{matching.matchingId}</td>
                      <td className="text-center">
                        <a href="#" style={{color: '#2563eb', textDecoration: 'none'}}>
                          {matching.requestId}
                        </a>
                      </td>
                      <td>{matching.hospitalName || '-'}</td>
                      <td>{matching.donorName || '-'}</td>
                      <td className="text-center">{matching.requiredBloodGroup || '-'}</td>
                      <td className="text-center">{matching.donorBloodGroup || '-'}</td>
                      <td className="text-center">{formatDate(matching.contactDate)}</td>
                      <td className="text-center">
                        <span style={getStatusStyle(formatStatus(matching.status))}>
                          ● {formatStatus(matching.status)}
                        </span>
                      </td>
                      <td className="text-center">{matching.quantityDonated || '-'}</td>
                      <td className="text-center">{matching.distanceKm !== null && matching.distanceKm !== undefined ? matching.distanceKm : '-'}</td>
                      <td className="text-center">
                        <div style={{display: 'flex', gap: '6px', justifyContent: 'center'}}>
                          <button 
                            title="Xem chi tiết"
                            onClick={() => navigate(`/admin/matching-detail/${matching.matchingId}`)}
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
                    <td colSpan="11" className="text-center py-5">
                      {searchTerm || bloodTypeFilter !== 'Tất cả' || statusFilter !== 'Tất cả' 
                        ? 'Không tìm thấy dữ liệu phù hợp với bộ lọc.' 
                        : 'Chưa có dữ liệu matching nào.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {matchings.length > 0 && (
            <div className="mt-3 text-muted text-center">
              Hiển thị {filteredMatchings.length} trong tổng số {matchings.length} bản ghi
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MatchingManagement; 