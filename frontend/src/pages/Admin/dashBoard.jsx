import React, { useEffect, useState } from "react";
import './dashboard.css';
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import StatCard from "../../Component/Admin/StatCard";
import ChartPlaceholder from "../../Component/Admin/ChartPlaceholder";
import SummaryCard from "../../Component/Admin/SummaryCard";
import DonationStats from "../../Component/Admin/DonationStats";
import Table from "../../Component/Admin/Table";
import { analyticsAPI } from '../../services/api';

export default function AdminDashBoard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    analyticsAPI.getDashboardAnalytics()
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="dashboard-content">
          <div className="dashboard-row dashboard-row-cards">
            {loading ? (
              <div>Đang tải thống kê...</div>
            ) : error ? (
              <div style={{color: 'red'}}>Lỗi: {error}</div>
            ) : stats ? (
              <>
                <StatCard icon="👤" color="#22c55e" title="Tổng người hiến" value={stats.totalDonors} />
                <StatCard icon="📅" color="#7c3aed" title="Tổng đăng ký hiến" value={stats.totalRegistrations} />
                <StatCard icon="🩸" color="#ef4444" title="Tổng yêu cầu máu" value={stats.totalRequests} />
                <StatCard icon="🏥" color="#0ea5e9" title="Cơ sở y tế" value={stats.totalFacilities} />
                <StatCard icon="⚠️" color="#facc15" title="Yêu cầu khẩn cấp" value={stats.urgentRequests} />
                <StatCard icon="📆" color="#a21caf" title="Sự kiện sắp tới" value={stats.upcomingEvents} />
              </>
            ) : null}
          </div>
          <div className="dashboard-row dashboard-row-charts">
            <ChartPlaceholder />
            <div className="dashboard-sidecards">
              <SummaryCard />
              <DonationStats />
            </div>
          </div>
          <div className="dashboard-row dashboard-row-table">
            <Table />
          </div>
        </main>
      </div>
    </div>
  );
}