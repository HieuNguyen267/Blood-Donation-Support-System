import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";

export default function EmergencyDonorMatching() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy dữ liệu đơn từ location.state nếu có
  const request = location.state?.request || {
    request_id: requestId,
    facility_name: "BV Chợ Rẫy",
    blood_group: "A+",
    quantity_requested: 1000,
    urgency_level: "emergency",
    contact_person: "Bác sĩ B",
    contact_phone: "0909123456",
    required_by: "2024-07-10T10:00",
  };

  // Lấy danh sách người hiến từ localStorage hoặc mẫu
  let donors = [];
  try {
    const local = localStorage.getItem('donors');
    if (local) donors = JSON.parse(local);
  } catch {}
  if (!donors || donors.length === 0) {
    donors = [
      { name: "Nguyễn Văn D", blood: "A+", phone: "0909123123", ready: "Có", address: "Q1", age: 30 },
      { name: "Trần Thị E", blood: "A+", phone: "0912345678", ready: "Có", address: "Q3", age: 25 },
      { name: "Lê Văn F", blood: "A+", phone: "0987654321", ready: "Không", address: "Q5", age: 28 },
    ];
  }
  // Lọc người hiến sẵn sàng và cùng nhóm máu
  const matchedDonors = donors.filter(d => d.ready === 'Có' && d.blood === request.blood_group);

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="donor-page-root">
          <h2 className="donor-title">Tìm người hiến máu khẩn cấp</h2>
          <div className="card p-3 mb-3">
            <b>Đơn yêu cầu #{request.request_id}</b><br/>
            <span>Cơ sở y tế: <b>{request.facility_name}</b></span><br/>
            <span>Nhóm máu: <b>{request.blood_group}</b></span><br/>
            <span>Số lượng cần: <b>{request.quantity_requested} ml</b></span><br/>
            <span>Ngày cần: <b>{request.required_by.replace('T',' ')}</b></span><br/>
            <span>Người liên hệ: <b>{request.contact_person} ({request.contact_phone})</b></span>
          </div>
          <div className="card p-3">
            <h5>Danh sách người hiến phù hợp (gần nhất)</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Nhóm máu</th>
                  <th>Tuổi</th>
                  <th>Địa chỉ</th>
                  <th>SĐT</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {matchedDonors.length > 0 ? matchedDonors.map((d, idx) => (
                  <tr key={idx}>
                    <td>{d.name}</td>
                    <td>{d.blood}</td>
                    <td>{d.age || ''}</td>
                    <td>{d.address || ''}</td>
                    <td>{d.phone}</td>
                    <td><button className="btn btn-success btn-sm">Liên hệ</button></td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="text-center text-secondary">Không có người hiến phù hợp</td></tr>
                )}
              </tbody>
            </table>
            <button className="btn btn-secondary mt-2" onClick={()=>navigate(-1)}>Quay lại</button>
          </div>
        </main>
      </div>
    </div>
  );
} 