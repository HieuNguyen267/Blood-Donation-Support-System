import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../../Component/Admin/Header";
import Sidebar from "../../Component/Admin/Sidebar";

export default function EmergencyProcess() {
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

  // Dữ liệu mẫu cho những người hiến đã chấp nhận
  const [acceptedDonors] = useState([
    {
      id: 1,
      name: "Nguyễn Văn D",
      blood_group: "A+",
      phone: "0909123123",
      address: "Q1, TP.HCM",
      age: 30,
      accepted_time: "2024-07-09 14:30",
      status: "Đã xác nhận",
      quantity: 350,
      arrival_time: "2024-07-09 16:00"
    },
    {
      id: 2,
      name: "Trần Thị E",
      blood_group: "A+",
      phone: "0912345678",
      address: "Q3, TP.HCM",
      age: 25,
      accepted_time: "2024-07-09 15:15",
      status: "Đang di chuyển",
      quantity: 400,
      arrival_time: "2024-07-09 17:30"
    },
    {
      id: 3,
      name: "Lê Văn F",
      blood_group: "A+",
      phone: "0987654321",
      address: "Q5, TP.HCM",
      age: 28,
      accepted_time: "2024-07-09 15:45",
      status: "Đã xác nhận",
      quantity: 300,
      arrival_time: "2024-07-09 18:00"
    }
  ]);

  // Tính tổng số lượng đã được chấp nhận
  const totalAccepted = acceptedDonors.reduce((sum, donor) => sum + donor.quantity, 0);
  const remainingNeeded = request.quantity_requested - totalAccepted;

  // Hàm trả về màu sắc cho trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "Đã xác nhận": return "text-success fw-bold";
      case "Đang di chuyển": return "text-warning fw-bold";
      case "Đã đến": return "text-primary fw-bold";
      case "Đã hiến": return "text-success fw-bold";
      default: return "text-secondary";
    }
  };

  // Hàm trả về badge cho trạng thái
  const getStatusBadge = (status) => {
    switch (status) {
      case "Đã xác nhận": return "badge bg-success";
      case "Đang di chuyển": return "badge bg-warning text-dark";
      case "Đã đến": return "badge bg-primary";
      case "Đã hiến": return "badge bg-success";
      default: return "badge bg-secondary";
    }
  };

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="donor-page-root">
          <h2 className="donor-title">Quá trình yêu cầu máu khẩn cấp</h2>
          
          {/* Thông tin đơn yêu cầu */}
          <div className="card p-3 mb-3">
            <div className="row">
              <div className="col-md-8">
                <h5 className="text-danger fw-bold">🚨 Đơn yêu cầu #{request.request_id}</h5>
                <div className="row">
                  <div className="col-md-6">
                    <span>Cơ sở y tế: <b>{request.facility_name}</b></span><br/>
                    <span>Nhóm máu: <b className="text-danger">{request.blood_group}</b></span><br/>
                    <span>Mức độ: <b className="text-danger">{request.urgency_level}</b></span>
                  </div>
                  <div className="col-md-6">
                    <span>Số lượng cần: <b>{request.quantity_requested} ml</b></span><br/>
                    <span>Ngày cần: <b>{request.required_by?.replace('T',' ')}</b></span><br/>
                    <span>Liên hệ: <b>{request.contact_person} ({request.contact_phone})</b></span>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card bg-light">
                  <div className="card-body text-center">
                    <h6 className="text-muted">Tiến độ</h6>
                    <div className="progress mb-2">
                      <div 
                        className="progress-bar bg-success" 
                        style={{width: `${(totalAccepted/request.quantity_requested)*100}%`}}
                      ></div>
                    </div>
                    <small>
                      <span className="text-success fw-bold">{totalAccepted} ml</span> / {request.quantity_requested} ml
                    </small>
                    {remainingNeeded > 0 && (
                      <div className="mt-2">
                        <small className="text-danger">Còn thiếu: {remainingNeeded} ml</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bảng người hiến đã chấp nhận */}
          <div className="card p-3 mb-3">
            <h5 className="text-success">✅ Những người hiến đã chấp nhận</h5>
            <div className="table-responsive">
              <table className="table table-hover table-bordered">
                <thead className="table-light">
                  <tr>
                    <th className="text-center">STT</th>
                    <th className="text-center">Họ và tên</th>
                    <th className="text-center">Nhóm máu</th>
                    <th className="text-center">Tuổi</th>
                    <th className="text-center">SĐT</th>
                    <th className="text-center">Địa chỉ</th>
                    <th className="text-center">Thời gian chấp nhận</th>
                    <th className="text-center">Số lượng (ml)</th>
                    <th className="text-center">Thời gian đến</th>
                    <th className="text-center">Trạng thái</th>
                    <th className="text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {acceptedDonors.length > 0 ? acceptedDonors.map((donor, idx) => (
                    <tr key={donor.id}>
                      <td className="text-center">{idx + 1}</td>
                      <td className="text-center fw-bold">{donor.name}</td>
                      <td className="text-center">
                        <span className="badge bg-danger">{donor.blood_group}</span>
                      </td>
                      <td className="text-center">{donor.age}</td>
                      <td className="text-center">{donor.phone}</td>
                      <td className="text-center">{donor.address}</td>
                      <td className="text-center">{donor.accepted_time}</td>
                      <td className="text-center fw-bold text-success">{donor.quantity}</td>
                      <td className="text-center">{donor.arrival_time}</td>
                      <td className="text-center">
                        <span className={getStatusBadge(donor.status)}>
                          {donor.status}
                        </span>
                      </td>
                      <td className="text-center">
                        <button className="btn btn-sm btn-outline-primary me-1" title="Gọi điện">
                          📞
                        </button>
                        <button className="btn btn-sm btn-outline-success me-1" title="Xác nhận đến">
                          ✅
                        </button>
                        <button className="btn btn-sm btn-outline-info" title="Xem chi tiết">
                          👁️
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={11} className="text-center text-secondary">
                        Chưa có người hiến nào chấp nhận
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Thống kê nhanh - Giao diện mới */}
          <div className="row mb-4 g-3">
            <div className="col-md-3">
              <div className="stat-card bg-primary-soft">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h6>Tổng người chấp nhận</h6>
                  <h4>{acceptedDonors.length}</h4>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card bg-success-soft">
                <div className="stat-icon">🩸</div>
                <div className="stat-info">
                  <h6>Tổng máu đã có</h6>
                  <h4>{totalAccepted} <small>ml</small></h4>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card bg-warning-soft">
                <div className="stat-icon">⚠️</div>
                <div className="stat-info">
                  <h6>Còn thiếu</h6>
                  <h4>{remainingNeeded > 0 ? remainingNeeded : 0} <small>ml</small></h4>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-card bg-info-soft">
                <div className="stat-icon">📈</div>
                <div className="stat-info">
                  <h6>Tiến độ</h6>
                  <h4>{request.quantity_requested > 0 ? Math.round((totalAccepted/request.quantity_requested)*100) : 0}<small>%</small></h4>
                </div>
              </div>
            </div>
          </div>

          {/* Nút hành động - Giao diện mới */}
          <div className="d-flex gap-2">
            <button className="btn-modern btn-warning" onClick={() => navigate(`/admin/emergency-donor-matching/${requestId}`, { state: { request } })}>
              🔍 Tìm thêm người hiến
            </button>
            <button className="btn-modern btn-success" onClick={() => navigate(`/admin/blood-request-management`)}>
              ✅ Hoàn thành quá trình
            </button>
            <button className="btn-modern btn-secondary" onClick={() => navigate(-1)}>
              ← Quay lại
            </button>
          </div>
        </main>
      </div>
    </div>
  );
} 