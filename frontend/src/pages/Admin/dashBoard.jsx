import React from "react";
import './dashboard.css';
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import StatCard from "../../Component/Admin/StatCard";
import ChartPlaceholder from "../../Component/Admin/ChartPlaceholder";
import SummaryCard from "../../Component/Admin/SummaryCard";
import DonationStats from "../../Component/Admin/DonationStats";
import Table from "../../Component/Admin/Table";

export default function AdminDashBoard() {
  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="dashboard-content">
          <div className="dashboard-row dashboard-row-cards">
            <StatCard icon="📅" color="#7c3aed" title="Appointments" value="650" />
            <StatCard icon="🛠️" color="#fb923c" title="Operations" value="54" />
            <StatCard icon="👤" color="#22c55e" title="New Patients" value="129" />
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