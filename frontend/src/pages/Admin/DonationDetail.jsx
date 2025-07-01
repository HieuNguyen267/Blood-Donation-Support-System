import React, { useState, useEffect } from "react";
import './DonationDetail.css';
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import { useParams } from 'react-router-dom';
import { donationRegisterAPI } from "../../services/api";

export default function DonationDetail() {
  const { id } = useParams();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    setLoading(true);
    console.log('ID chi tiết:', id);
    donationRegisterAPI.getDonationRegisterById(id)
      .then(data => {
        console.log('Dữ liệu đơn hiến:', data);
        setDonation({
          id: data.id || data.donationRegisterId || data.registerId,
          code: data.code || data.donationRegisterCode || data.id || data.donationRegisterId || data.registerId,
          name: data.donorName || data.name || "",
          donateDate: data.donationDate || data.donateDate || "",
          completeDate: data.completionDate || data.completionDate || "",
          amount: data.amount || data.quantity || "",
          status: data.status || "Xác nhận",
          blood: data.bloodGroup || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
        setEditData({
          id: data.id || data.donationRegisterId || data.registerId,
          code: data.code || data.donationRegisterCode || data.id || data.donationRegisterId || data.registerId,
          name: data.donorName || data.name || "",
          donateDate: data.donationDate || data.donateDate || "",
          completeDate: data.completionDate || data.completionDate || "",
          amount: data.amount || data.quantity || "",
          status: data.status || "Xác nhận",
          blood: data.bloodGroup || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi lấy chi tiết đơn hiến:', err);
        setDonation(null);
        setLoading(false);
      });
  }, [id]);

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
  const handleSaveEdit = async () => {
    if (!validate()) return;
    try {
      await donationRegisterAPI.updateDonationRegister(editData.id, {
        code: editData.code,
        donorName: editData.name,
        donationDate: editData.donateDate,
        completionDate: editData.completeDate,
        amount: editData.amount,
        status: editData.status,
        bloodGroup: editData.blood,
      });
      setDonation({ ...editData });
      setToast({ show: true, type: 'success', message: 'Lưu thành công!' });
      setShowEdit(false);
    } catch (e) {
      setToast({ show: true, type: 'error', message: 'Lỗi khi cập nhật đơn hiến: ' + e.message });
    }
  };

  // Xác nhận đơn
  const handleConfirm = async () => {
    await updateStatus('Xác nhận');
  };
  // Từ chối đơn
  const handleReject = async () => {
    await updateStatus('Từ chối');
  };
  // Hàm cập nhật trạng thái
  const updateStatus = async (newStatus) => {
    try {
      await donationRegisterAPI.updateDonationRegister(donation.id, { ...donation, status: newStatus });
      setDonation({ ...donation, status: newStatus });
      setToast({ show: true, type: 'success', message: `Đã cập nhật trạng thái: ${newStatus}` });
    } catch (e) {
      setToast({ show: true, type: 'error', message: 'Lỗi khi cập nhật trạng thái: ' + e.message });
    }
  };

  // Ẩn toast sau 2.5s
  useEffect(() => {
    if (toast.show) {
      const t = setTimeout(() => setToast({ ...toast, show: false }), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!donation) return <div>Không tìm thấy đơn hiến!</div>;

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
                  <tr><td>Họ và tên :</td><td>{donation.name}</td></tr>
                  <tr><td>Ngày và giờ hiến :</td><td>{donation.donateDate}</td></tr>
                  <tr><td>Ngày và giờ hoàn thành :</td><td>{donation.completeDate}</td></tr>
                  <tr><td>Số lượng (ml) :</td><td>{donation.amount}</td></tr>
                  <tr><td>Trạng thái :</td><td>{donation.status}</td></tr>
                  <tr><td>Nhóm máu :</td><td>{donation.blood}</td></tr>
                </tbody>
              </table>
              <button className="btn-edit-info" style={{marginTop: 24, width: '100%'}} onClick={()=>setShowEdit(true)}>✏️ Chỉnh sửa thông tin</button>
            </div>
            <div className="donation-detail-statusbox">
              <div className="donation-detail-status-title">Trạng thái :
                <span className={`donation-detail-status-label ${donation.status === 'Chờ xác nhận' ? 'waiting' : donation.status === 'Xác nhận' ? 'confirmed' : 'rejected'}`}>
                  <span className="dot"/> {donation.status}
                </span>
              </div>
              {/* Chỉ hiện nút khi trạng thái là Chờ xác nhận */}
              {donation.status === 'Chờ xác nhận' && (
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
                <div className="donation-detail-status-history-desc">{donation.status}</div>
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