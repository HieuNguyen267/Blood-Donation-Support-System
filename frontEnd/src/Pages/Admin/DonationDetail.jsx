import React, { useState } from "react";
import './DonationDetail.css';
import Header from "../../Component/Admin/Header";
import Sidebar from "../../Component/Admin/Sidebar";
import { useParams } from 'react-router-dom';

const fallbackDonations = [
  { code: "A001", name: "Nguyễn Duy Hiếu", donateDate: "11/4/2024, 09:30", completeDate: "11/4/2024, 10:30", amount: "120 ml", status: "Xác nhận", blood: "Rh NULL" },
  { code: "A002", name: "Lữ Phước Nhật Tú", donateDate: "15/4/2024, 08:30", completeDate: "15/4/2024, 09:30", amount: "120 ml", status: "Chờ xác nhận", blood: "O-" },
  { code: "A003", name: "Nguyễn Gia Triệu", donateDate: "4/11/2025, 15:35", completeDate: "4/11/2025, 16:35", amount: "120 ml", status: "Xác nhận", blood: "O+" },
  { code: "A004", name: "Đậu Nguyễn Bảo Tuấn", donateDate: "27/5/2025, 10:30", completeDate: "27/5/2025, 11:30", amount: "120 ml", status: "Xác nhận", blood: "AB+" },
  { code: "A005", name: "Nguyễn Anh Khoa", donateDate: "27/5/2025, 10:45", completeDate: "27/5/2025, 11:45", amount: "120 ml", status: "Xác nhận", blood: "AB-" },
  { code: "A006", name: "Đoàn Nguyễn Thành Hòa", donateDate: "15/4/2024, 08:30", completeDate: "15/4/2024, 09:30", amount: "120 ml", status: "Từ chối", blood: "A+" },
  { code: "A007", name: "Nguyễn Tri Thông", donateDate: "15/4/2024, 08:30", completeDate: "15/4/2024, 09:30", amount: "120 ml", status: "Xác nhận", blood: "B-" },
  { code: "A008", name: "Nguyễn Văn Ớ", donateDate: "15/4/2024, 08:30", completeDate: "15/4/2024, 09:30", amount: "120 ml", status: "Từ chối", blood: "A-" },
  { code: "A009", name: "Nguyễn Công Chiến", donateDate: "27/5/2025, 10:45", completeDate: "27/5/2025, 11:45", amount: "120 ml", status: "Chờ xác nhận", blood: "B+" },
];

export default function DonationDetail() {
  const { id } = useParams();
  // Lấy danh sách đơn hiến từ localStorage nếu có, nếu không thì dùng fallback
  let donations = fallbackDonations;
  try {
    const local = localStorage.getItem('donations');
    if (local) donations = JSON.parse(local);
  } catch {}
  const donation = donations.find(d => d.code === id) || fallbackDonations[0];

  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(donation);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [currentDonation, setCurrentDonation] = useState(donation);
  // Khi id thay đổi, cập nhật editData và currentDonation
  React.useEffect(() => { setEditData(donation); setCurrentDonation(donation); }, [id]);

  // Validate dữ liệu
  const validate = () => {
    if (!editData.name || !editData.donateDate || !editData.completeDate || !editData.amount || !editData.blood) {
      setToast({ show: true, type: 'error', message: 'Vui lòng nhập đầy đủ thông tin!' });
      return false;
    }
    if (isNaN(parseInt(editData.amount)) || parseInt(editData.amount) <= 0) {
      setToast({ show: true, type: 'error', message: 'Số lượng phải là số dương!' });
      return false;
    }
    return true;
  };

  // Hàm lưu chỉnh sửa
  const handleSaveEdit = () => {
    if (!validate()) return;
    let donations = fallbackDonations;
    try {
      const local = localStorage.getItem('donations');
      if (local) donations = JSON.parse(local);
    } catch {}
    const idx = donations.findIndex(d => d.code === id);
    if (idx !== -1) {
      donations[idx] = { ...donations[idx], ...editData };
      localStorage.setItem('donations', JSON.stringify(donations));
      setCurrentDonation(donations[idx]);
      setToast({ show: true, type: 'success', message: 'Lưu thành công!' });
      setShowEdit(false);
    } else {
      setToast({ show: true, type: 'error', message: 'Không tìm thấy đơn hiến!' });
    }
  };

  // Xác nhận đơn
  const handleConfirm = () => {
    updateStatus('Xác nhận');
  };
  // Từ chối đơn
  const handleReject = () => {
    updateStatus('Từ chối');
  };
  // Hàm cập nhật trạng thái
  const updateStatus = (newStatus) => {
    let donations = fallbackDonations;
    try {
      const local = localStorage.getItem('donations');
      if (local) donations = JSON.parse(local);
    } catch {}
    const idx = donations.findIndex(d => d.code === id);
    if (idx !== -1) {
      donations[idx] = { ...donations[idx], status: newStatus };
      localStorage.setItem('donations', JSON.stringify(donations));
      setCurrentDonation(donations[idx]);
      setToast({ show: true, type: 'success', message: `Đã cập nhật trạng thái: ${newStatus}` });
    }
  };

  // Ẩn toast sau 2.5s
  React.useEffect(() => {
    if (toast.show) {
      const t = setTimeout(() => setToast({ ...toast, show: false }), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="donation-detail-root">
          <h2 className="donation-detail-title">Chi tiết đơn hiến</h2>
          <div className="donation-detail-content">
            <div className="donation-detail-table">
              <div className="donation-detail-section-title">Thông tin chung</div>
              <table>
                <tbody>
                  <tr><td>Họ và tên :</td><td>{currentDonation.name}</td></tr>
                  <tr><td>Ngày và giờ hiến :</td><td>{currentDonation.donateDate}</td></tr>
                  <tr><td>Ngày và giờ hoàn thành :</td><td>{currentDonation.completeDate}</td></tr>
                  <tr><td>Số lượng (ml) :</td><td>{currentDonation.amount}</td></tr>
                  <tr><td>Trạng thái :</td><td>{currentDonation.status}</td></tr>
                  <tr><td>Nhóm máu :</td><td>{currentDonation.blood}</td></tr>
                </tbody>
              </table>
              <button className="btn-edit-info" style={{marginTop: 24, width: '100%'}} onClick={()=>setShowEdit(true)}>✏️ Chỉnh sửa thông tin</button>
            </div>
            <div className="donation-detail-statusbox">
              <div className="donation-detail-status-title">Trạng thái :
                <span className={`donation-detail-status-label ${currentDonation.status === 'Chờ xác nhận' ? 'waiting' : currentDonation.status === 'Xác nhận' ? 'confirmed' : 'rejected'}`}>
                  <span className="dot"/> {currentDonation.status}
                </span>
              </div>
              {/* Chỉ hiện nút khi trạng thái là Chờ xác nhận */}
              {currentDonation.status === 'Chờ xác nhận' && (
                <div className="donation-detail-status-actions">
                  <button className="btn-cancel" onClick={handleReject}>✖ Hủy đơn</button>
                  <button className="btn-confirm" onClick={handleConfirm}>✔ Xác nhận</button>
                </div>
              )}
              <div className="donation-detail-status-history">
                <div className="donation-detail-status-history-title">Lịch sử trạng thái</div>
                <div className="donation-detail-status-history-item">
                  <span className="clock">🕒</span> 15:25 23.04.2024
                </div>
                <div className="donation-detail-status-history-desc">{currentDonation.status}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Modal chỉnh sửa thông tin */}
      {showEdit && (
        <div className="modal fade show" style={{display:'block',background:'rgba(0,0,0,0.3)'}} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{background:'#8fd19e'}}>
                <h5 className="modal-title">Chỉnh sửa thông tin đơn hiến</h5>
                <button type="button" className="btn-close" onClick={()=>setShowEdit(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <input className="form-control" placeholder="Họ và tên*" value={editData.name} onChange={e=>setEditData({...editData,name:e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <input className="form-control" placeholder="Ngày và giờ hiến*" value={editData.donateDate} onChange={e=>setEditData({...editData,donateDate:e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <input className="form-control" placeholder="Ngày và giờ hoàn thành*" value={editData.completeDate} onChange={e=>setEditData({...editData,completeDate:e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <input className="form-control" placeholder="Số lượng (ml)*" value={editData.amount} onChange={e=>setEditData({...editData,amount:e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <select className="form-control" value={editData.status} onChange={e=>setEditData({...editData,status:e.target.value})}>
                      <option>Xác nhận</option>
                      <option>Chờ xác nhận</option>
                      <option>Từ chối</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <input className="form-control" placeholder="Nhóm máu*" value={editData.blood} onChange={e=>setEditData({...editData,blood:e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={handleSaveEdit}>Lưu</button>
                <button className="btn btn-danger" onClick={()=>setShowEdit(false)}>Hủy</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Toast thông báo */}
      {toast.show && (
        <div className={`custom-toast ${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
} 