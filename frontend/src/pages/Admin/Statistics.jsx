import React from "react";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';

function getCurrentMonth() {
  const now = new Date();
  return now.getMonth() + 1;
}
function getCurrentYear() {
  return new Date().getFullYear();
}

function countDonorsInMonth(donors, month, year) {
  return donors.filter(d => {
    if (!d.last) return false;
    const date = new Date(d.last);
    return date.getMonth() + 1 === month && date.getFullYear() === year;
  }).length;
}
function countRequestsInMonth(requests, month, year) {
  return requests.filter(r => {
    if (!r.required_by) return false;
    const date = new Date(r.required_by);
    return date.getMonth() + 1 === month && date.getFullYear() === year;
  }).length;
}
function countEmergencyRequestsInMonth(requests, month, year) {
  return requests.filter(r => {
    if (!r.required_by) return false;
    const date = new Date(r.required_by);
    return date.getMonth() + 1 === month && date.getFullYear() === year && (r.is_emergency === true || r.type === 'emergency');
  }).length;
}

function countUniqueDonorsInMonth(donationProcesses, month, year) {
  // Đếm số người hiến duy nhất trong tháng/năm chọn
  const unique = new Set();
  donationProcesses.forEach(d => {
    if (!d.donateDate) return;
    const date = new Date(d.donateDate);
    if (date.getMonth() + 1 === month && date.getFullYear() === year) {
      // Ưu tiên mã người hiến, nếu không có thì dùng tên
      unique.add(d.donorId || d.name);
    }
  });
  return unique.size;
}

export default function Statistics() {
  // Lấy dữ liệu người hiến
  let donors = [];
  try {
    const local = localStorage.getItem('donors');
    if (local) donors = JSON.parse(local);
  } catch {}
  if (!donors || donors.length === 0) {
    donors = [
      { name: "A", last: "2024-07-01" },
      { name: "B", last: "2024-07-10" },
      { name: "C", last: "2024-06-15" },
    ];
  }
  // Lấy dữ liệu đơn yêu cầu máu
  let requests = [];
  try {
    const local = localStorage.getItem('blood_requests');
    if (local) requests = JSON.parse(local);
  } catch {}
  if (!requests || requests.length === 0) {
    requests = [
      { required_by: "2024-07-05T10:00" },
      { required_by: "2024-07-12T08:00" },
      { required_by: "2024-06-20T09:00" },
    ];
  }
  // Lấy dữ liệu quá trình hiến máu
  let donationProcesses = [];
  try {
    const local = localStorage.getItem('donation_processes');
    if (local) donationProcesses = JSON.parse(local);
  } catch {}
  if (!donationProcesses || donationProcesses.length === 0) {
    // fallback mẫu
    donationProcesses = [
      { name: "Nguyễn Duy Hiếu", donateDate: "2024-07-01 09:30", donorId: "D001" },
      { name: "Lữ Phước Nhật Tú", donateDate: "2024-07-10 08:30", donorId: "D002" },
      { name: "Nguyễn Gia Triệu", donateDate: "2024-06-15 15:35", donorId: "D003" },
      { name: "Nguyễn Duy Hiếu", donateDate: "2024-07-15 10:00", donorId: "D001" },
    ];
  }

  const [selectedMonth, setSelectedMonth] = React.useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = React.useState(getCurrentYear());

  const donorsCount = countUniqueDonorsInMonth(donationProcesses, selectedMonth, selectedYear);
  const requestsCount = countRequestsInMonth(requests, selectedMonth, selectedYear);
  const emergencyRequestsCount = countEmergencyRequestsInMonth(requests, selectedMonth, selectedYear);

  // Dữ liệu cho biểu đồ cột (7 ngày gần nhất)
  const days = Array.from({length: 7}, (_,i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6-i));
    return d;
  });
  const donorsByDay = days.map(day =>
    donors.filter(d => {
      if (!d.last) return false;
      const date = new Date(d.last);
      return date.toDateString() === day.toDateString();
    }).length
  );
  const requestsByDay = days.map(day =>
    requests.filter(r => {
      if (!r.required_by) return false;
      const date = new Date(r.required_by);
      return date.toDateString() === day.toDateString();
    }).length
  );

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="donor-page-root">
          <h2 className="donor-title">Thống kê tháng {selectedMonth}/{selectedYear}</h2>
          <div style={{display:'flex',gap:16,alignItems:'center',marginBottom:24}}>
            <label>Chọn tháng:</label>
            <select value={selectedMonth} onChange={e=>setSelectedMonth(Number(e.target.value))}>
              {[...Array(12)].map((_,i)=>(<option key={i+1} value={i+1}>{i+1}</option>))}
            </select>
            <label>Chọn năm:</label>
            <select value={selectedYear} onChange={e=>setSelectedYear(Number(e.target.value))}>
              {[...Array(6)].map((_,i)=>(<option key={2020+i} value={2020+i}>{2020+i}</option>))}
            </select>
          </div>
          <div className="row" style={{marginBottom:32}}>
            <div className="col-md-4">
              <div className="stat-card" style={{background:'#e0f7fa'}}>
                <div style={{fontSize:18, color:'#1976d2'}}>Người hiến máu trong tháng</div>
                <div style={{fontSize:36, fontWeight:700, color:'#1976d2'}}>{donorsCount}</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card" style={{background:'#fff7e0'}}>
                <div style={{fontSize:18, color:'#fb923c'}}>Đơn yêu cầu máu trong tháng</div>
                <div style={{fontSize:36, fontWeight:700, color:'#fb923c'}}>{requestsCount}</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card" style={{background:'#ffe0e0'}}>
                <div style={{fontSize:18, color:'#dc2626'}}>Đơn yêu cầu máu khẩn cấp trong tháng</div>
                <div style={{fontSize:36, fontWeight:700, color:'#dc2626'}}>{emergencyRequestsCount}</div>
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
        </main>
      </div>
    </div>
  );
} 