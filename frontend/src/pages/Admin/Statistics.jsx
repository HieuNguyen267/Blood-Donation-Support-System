import React, { useEffect, useState } from "react";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { donorAPI } from '../../services/api';
import { bloodRequestAPI } from '../../services/api';

function getCurrentMonth() {
  const now = new Date();
  return now.getMonth() + 1;
}
function getCurrentYear() {
  return new Date().getFullYear();
}

export default function Statistics() {
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      donorAPI.getAllDonors(),
      bloodRequestAPI.getRequests()
    ])
      .then(([donorData, requestData]) => {
        setDonors(donorData || []);
        setRequests(requestData || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Đếm số người hiến máu trong tháng
  function countDonorsThisMonth(donors) {
    const month = getCurrentMonth();
    const year = getCurrentYear();
    return donors.filter(d => {
      if (!d.lastDonationDate && !d.last) return false;
      const dateStr = d.lastDonationDate || d.last;
      const date = new Date(dateStr);
      return date.getMonth() + 1 === month && date.getFullYear() === year;
    }).length;
  }
  // Đếm số đơn yêu cầu máu trong tháng
  function countRequestsThisMonth(requests) {
    const month = getCurrentMonth();
    const year = getCurrentYear();
    return requests.filter(r => {
      if (!r.requiredBy && !r.required_by) return false;
      const dateStr = r.requiredBy || r.required_by;
      const date = new Date(dateStr);
      return date.getMonth() + 1 === month && date.getFullYear() === year;
    }).length;
  }

  // Dữ liệu cho biểu đồ cột (7 ngày gần nhất)
  const days = Array.from({length: 7}, (_,i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6-i));
    d.setHours(0,0,0,0);
    return d;
  });
  const donorsByDay = days.map(day =>
    donors.filter(d => {
      if (!d.lastDonationDate && !d.last) return false;
      const dateStr = d.lastDonationDate || d.last;
      const date = new Date(dateStr);
      date.setHours(0,0,0,0);
      return date.getTime() === day.getTime();
    }).length
  );
  const requestsByDay = days.map(day =>
    requests.filter(r => {
      if (!r.requiredBy && !r.required_by) return false;
      const dateStr = r.requiredBy || r.required_by;
      const date = new Date(dateStr);
      date.setHours(0,0,0,0);
      return date.getTime() === day.getTime();
    }).length
  );

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="donor-page-root">
          <h2 className="donor-title">Thống kê tháng {getCurrentMonth()}/{getCurrentYear()}</h2>
          {loading ? (
            <div>Đang tải dữ liệu...</div>
          ) : error ? (
            <div style={{color:'red'}}>Lỗi: {error}</div>
          ) : (
            <>
              <div className="row" style={{marginBottom:32}}>
                <div className="col-md-6">
                  <div className="stat-card" style={{background:'#e0f7fa'}}>
                    <div style={{fontSize:18, color:'#1976d2'}}>Người hiến máu trong tháng</div>
                    <div style={{fontSize:36, fontWeight:700, color:'#1976d2'}}>{countDonorsThisMonth(donors)}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="stat-card" style={{background:'#fff7e0'}}>
                    <div style={{fontSize:18, color:'#fb923c'}}>Đơn yêu cầu máu trong tháng</div>
                    <div style={{fontSize:36, fontWeight:700, color:'#fb923c'}}>{countRequestsThisMonth(requests)}</div>
                  </div>
                </div>
              </div>
              <div className="card p-4" style={{maxWidth:600, margin:'0 auto'}}>
                <h5 style={{marginBottom:24}}>Biểu đồ 7 ngày gần nhất</h5>
                <div style={{display:'flex', gap:12, alignItems:'flex-end', height:180}}>
                  {days.map((day, i) => (
                    <div key={i} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center'}}>
                      <div style={{height:donorsByDay[i]*30, width:18, background:'#1976d2', borderRadius:4, marginBottom:4}} title={`Người hiến: ${donorsByDay[i]}`}></div>
                      <div style={{height:requestsByDay[i]*30, width:18, background:'#fb923c', borderRadius:4, marginBottom:4}} title={`Đơn yêu cầu: ${requestsByDay[i]}`}></div>
                      <div style={{fontSize:12, color:'#888'}}>{day.getDate()}/{day.getMonth()+1}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:'flex', justifyContent:'center', gap:24, marginTop:16}}>
                  <span style={{display:'inline-flex',alignItems:'center',gap:4}}><span style={{width:14,height:14,background:'#1976d2',display:'inline-block',borderRadius:2}}></span> Người hiến</span>
                  <span style={{display:'inline-flex',alignItems:'center',gap:4}}><span style={{width:14,height:14,background:'#fb923c',display:'inline-block',borderRadius:2}}></span> Đơn yêu cầu</span>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
} 