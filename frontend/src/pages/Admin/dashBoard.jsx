import React, { useEffect, useState } from "react";
import './dashboard.css';
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import StatCard from "../../components/admin/StatCard";
import ChartPlaceholder from "../../components/admin/ChartPlaceholder";
import SummaryCard from "../../components/admin/SummaryCard";
import DonationStats from "../../components/admin/DonationStats";
import Table from "../../components/admin/Table/EmergencyBloodRequestTable";
import { useAdmin } from '../../contexts/AdminContext';
import { adminDonationRegisterAPI } from '../../services/admin/donationRegister';
import moment from 'moment';
import { bloodRequestAPI } from '../../services/api';

export default function AdminDashBoard() {
  const { adminInfo, loading } = useAdmin();

  const [monthlyDonationCount, setMonthlyDonationCount] = useState(0);
  const [monthlyBloodRequestCount, setMonthlyBloodRequestCount] = useState(0);
  const [monthlyEmergencyRequestCount, setMonthlyEmergencyRequestCount] = useState(0);

  useEffect(() => {
    const fetchMonthlyDonations = async () => {
      try {
        const data = await adminDonationRegisterAPI.getAllForManagement();
        const now = moment();
        const currentMonth = now.month(); // 0-based
        const currentYear = now.year();
        const count = data.filter(d => {
          // d.appointmentDate hoặc d.appointmentTime hoặc d.donateDate
          let dateStr = d.appointmentTime || d.appointmentDate || d.donateDate;
          if (!dateStr) return false;
          // Chuẩn hóa dateStr về dạng YYYY-MM-DD nếu có thể
          let date = moment(dateStr, [moment.ISO_8601, 'DD/MM/YYYY', 'YYYY-MM-DD', 'YYYY-MM-DD HH:mm', 'DD/MM/YYYY HH:mm']);
          if (!date.isValid()) return false;
          return date.month() === currentMonth && date.year() === currentYear;
        }).length;
        setMonthlyDonationCount(count);
      } catch (e) {
        setMonthlyDonationCount(0);
      }
    };
    const fetchMonthlyBloodRequests = async () => {
      try {
        const data = await bloodRequestAPI.getAllAdminBloodRequests();
        const now = moment();
        const currentMonth = now.month();
        const currentYear = now.year();
        const count = data.filter(r => {
          let dateStr = r.requiredBy || r.required_by;
          if (!dateStr) return false;
          let date = moment(dateStr, [moment.ISO_8601, 'YYYY-MM-DD', 'YYYY-MM-DD HH:mm', 'DD/MM/YYYY', 'DD/MM/YYYY HH:mm']);
          if (!date.isValid()) return false;
          return date.month() === currentMonth && date.year() === currentYear;
        }).length;
        setMonthlyBloodRequestCount(count);
        // Đếm số đơn khẩn cấp trong tháng
        const emergencyCount = data.filter(r => {
          let dateStr = r.requiredBy || r.required_by;
          if (!dateStr) return false;
          let date = moment(dateStr, [moment.ISO_8601, 'YYYY-MM-DD', 'YYYY-MM-DD HH:mm', 'DD/MM/YYYY', 'DD/MM/YYYY HH:mm']);
          if (!date.isValid()) return false;
          const isCurrentMonth = date.month() === currentMonth && date.year() === currentYear;
          // isEmergency có thể là boolean hoặc string
          const isEmergency = r.isEmergency === true || r.isEmergency === 'true' || r.is_emergency === true || r.is_emergency === 'true';
          return isCurrentMonth && isEmergency;
        }).length;
        setMonthlyEmergencyRequestCount(emergencyCount);
      } catch (e) {
        setMonthlyBloodRequestCount(0);
      }
    };
    fetchMonthlyDonations();
    fetchMonthlyBloodRequests();
  }, []);

  // Debug log
  console.log('Dashboard adminInfo from context:', adminInfo);

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="dashboard-content">
          <div className="dashboard-row dashboard-row-cards">
            <StatCard icon="🩸" color="#7c3aed" title="Số đơn hiến trong tháng" value={monthlyDonationCount} />
            <StatCard icon="📝" color="#fb923c" title="Số đơn yêu cầu máu trong tháng" value={monthlyBloodRequestCount} />
            <StatCard icon="🚨" color="#22c55e" title="Số đơn yêu cầu khẩn cấp trong tháng " value={monthlyEmergencyRequestCount} />
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