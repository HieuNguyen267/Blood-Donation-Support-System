import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './DonationDetail.css';
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function DonationProcessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [processStatus, setProcessStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch donation process details
    setTimeout(() => {
      const mockDonation = {
        id: id,
        code: "DP001",
        donorName: "Nguyễn Duy Hiếu",
        donationDate: "11/4/2024, 09:30",
        bloodType: "O+",
        amount: "450ml",
        processStatus: "Đang xử lý",
        steps: [
          { step: "Đăng ký", status: "Hoàn thành", time: "09:00", notes: "Đăng ký thành công" },
          { step: "Kiểm tra sức khỏe", status: "Hoàn thành", time: "09:15", notes: "Sức khỏe tốt" },
          { step: "Lấy máu", status: "Đang thực hiện", time: "09:30", notes: "Đang tiến hành" },
          { step: "Kiểm tra máu", status: "Chờ thực hiện", time: "", notes: "" },
          { step: "Lưu trữ", status: "Chờ thực hiện", time: "", notes: "" }
        ],
        history: [
          { time: "09:00", action: "Bắt đầu quá trình hiến máu", user: "Admin" },
          { time: "09:15", action: "Hoàn thành kiểm tra sức khỏe", user: "Y tá Lan" },
          { time: "09:30", action: "Bắt đầu lấy máu", user: "Bác sĩ Minh" }
        ]
      };
      setDonation(mockDonation);
      setProcessStatus(mockDonation.processStatus);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleSave = () => {
    // Save process updates
    console.log("Saving process updates:", { processStatus, notes });
    alert("Cập nhật thành công!");
  };

  const getStepStatusColor = (status) => {
    switch(status) {
      case "Hoàn thành": return "#10b981";
      case "Đang thực hiện": return "#f59e0b";
      case "Chờ thực hiện": return "#6b7280";
      default: return "#6b7280";
    }
  };

  const getStepIcon = (status) => {
    switch(status) {
      case "Hoàn thành": return "✓";
      case "Đang thực hiện": return "⏱";
      case "Chờ thực hiện": return "○";
      default: return "○";
    }
  };

  if (loading) {
    return (
      <div className="dashboard-root">
        <Header />
        <div className="dashboard-main">
          <Sidebar />
          <main className="donation-detail-page">
            <div className="loading-spinner">Đang tải...</div>
          </main>
        </div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="dashboard-root">
        <Header />
        <div className="dashboard-main">
          <Sidebar />
          <main className="donation-detail-page">
            <div className="error-message">Không tìm thấy thông tin quá trình hiến máu</div>
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
        <main className="donation-detail-page">
          <div className="detail-header">
            <button 
              onClick={() => navigate('/admin/donation-process')}
              className="btn btn-outline-secondary"
            >
              ← Quay lại
            </button>
            <h2>Chi tiết quá trình hiến máu - {donation.code}</h2>
          </div>

          <div className="detail-content">
            {/* Donor Information */}
            <div className="info-card">
              <h3>Thông tin người hiến</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Họ và tên:</label>
                  <span>{donation.donorName}</span>
                </div>
                <div className="info-item">
                  <label>Nhóm máu:</label>
                  <span>{donation.bloodType}</span>
                </div>
                <div className="info-item">
                  <label>Ngày hiến:</label>
                  <span>{donation.donationDate}</span>
                </div>
                <div className="info-item">
                  <label>Số lượng:</label>
                  <span>{donation.amount}</span>
                </div>
              </div>
            </div>

            {/* Process Steps */}
            <div className="process-card">
              <h3>Tiến trình hiến máu</h3>
              <div className="process-timeline">
                {donation.steps.map((step, index) => (
                  <div key={index} className="timeline-item">
                    <div 
                      className="timeline-icon"
                      style={{ 
                        backgroundColor: getStepStatusColor(step.status),
                        color: 'white'
                      }}
                    >
                      {getStepIcon(step.status)}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-title">{step.step}</div>
                      <div className="timeline-status" style={{ color: getStepStatusColor(step.status) }}>
                        {step.status}
                      </div>
                      {step.time && <div className="timeline-time">Thời gian: {step.time}</div>}
                      {step.notes && <div className="timeline-notes">Ghi chú: {step.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Process Controls */}
            <div className="control-card">
              <h3>Cập nhật quá trình</h3>
              <div className="control-form">
                <div className="form-group">
                  <label>Trạng thái quá trình:</label>
                  <select 
                    className="form-control"
                    value={processStatus}
                    onChange={(e) => setProcessStatus(e.target.value)}
                  >
                    <option value="Đang xử lý">Đang xử lý</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                    <option value="Tạm dừng">Tạm dừng</option>
                    <option value="Hủy bỏ">Hủy bỏ</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Ghi chú thêm:</label>
                  <textarea 
                    className="form-control"
                    rows="4"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Nhập ghi chú về quá trình hiến máu..."
                  />
                </div>
                <div className="form-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={handleSave}
                  >
                    Lưu cập nhật
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/admin/donation-process')}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>

            {/* Process History */}
            <div className="history-card">
              <h3>Lịch sử hoạt động</h3>
              <div className="history-list">
                {donation.history.map((entry, index) => (
                  <div key={index} className="history-item">
                    <div className="history-time">{entry.time}</div>
                    <div className="history-action">{entry.action}</div>
                    <div className="history-user">bởi {entry.user}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 