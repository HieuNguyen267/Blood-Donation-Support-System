import React, { useEffect, useState } from "react";
import './ChartPlaceholder.css';
import { adminDonationRegisterAPI } from '../../../services/admin/donationRegister';
import { bloodRequestAPI } from '../../../services/api';
import moment from 'moment';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MONTHS = [
  'Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 10, fontSize: 14, color: '#222', boxShadow: '0 2px 8px #0001' }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
        <div style={{ color: '#2563eb' }}>Đơn hiến: <b>{payload[0].value}</b></div>
        <div style={{ color: '#10b981' }}>Đơn yêu cầu: <b>{payload[1].value}</b></div>
      </div>
    );
  }
  return null;
};

const ChartPlaceholder = () => {
  const [data, setData] = useState([]);
  const year = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donations, requests] = await Promise.all([
          adminDonationRegisterAPI.getAllForManagement(),
          bloodRequestAPI.getAllAdminBloodRequests()
        ]);
        const now = moment();
        const year = now.year();
        // Đếm số đơn hiến theo tháng
        const donationCounts = Array(12).fill(0);
        donations.forEach(d => {
          let dateStr = d.appointmentTime || d.appointmentDate || d.donateDate;
          if (!dateStr) return;
          let date = moment(dateStr, [moment.ISO_8601, 'YYYY-MM-DD', 'YYYY-MM-DD HH:mm', 'DD/MM/YYYY', 'DD/MM/YYYY HH:mm']);
          if (!date.isValid() || date.year() !== year) return;
          donationCounts[date.month()]++;
        });
        // Đếm số đơn yêu cầu máu theo tháng
        const requestCounts = Array(12).fill(0);
        requests.forEach(r => {
          let dateStr = r.requiredBy || r.required_by;
          if (!dateStr) return;
          let date = moment(dateStr, [moment.ISO_8601, 'YYYY-MM-DD', 'YYYY-MM-DD HH:mm', 'DD/MM/YYYY', 'DD/MM/YYYY HH:mm']);
          if (!date.isValid() || date.year() !== year) return;
          requestCounts[date.month()]++;
        });
        // Tạo dữ liệu cho biểu đồ
        const chartData = MONTHS.map((m, i) => ({
          month: m,
          "Đơn hiến": donationCounts[i],
          "Đơn yêu cầu": requestCounts[i]
        }));
        setData(chartData);
      } catch (e) {
        setData([]);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="chart-placeholder" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 24 }}>
      <div className="chart-title" style={{ fontWeight: 600, fontSize: 18, color: '#222', marginBottom: 16 }}>Tỉ lệ hiến máu và yêu cầu nhận máu (Năm {year})</div>
      <div className="chart-content">
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={data} barGap={2} barCategoryGap={8} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <XAxis dataKey="month" axisLine={{ stroke: '#e5e7eb' }} tickLine={false} style={{ fontSize: 14, fill: '#222' }} />
            <YAxis allowDecimals={false} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} style={{ fontSize: 14, fill: '#222' }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
            <Bar dataKey="Đơn hiến" fill="#60a5fa" radius={[6, 6, 0, 0]} maxBarSize={56} />
            <Bar dataKey="Đơn yêu cầu" fill="#6ee7b7" radius={[6, 6, 0, 0]} maxBarSize={56} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartPlaceholder; 