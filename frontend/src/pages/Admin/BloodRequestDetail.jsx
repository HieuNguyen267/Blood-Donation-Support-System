import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './DonationDetail.css';
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import { bloodRequestAPI } from '../../services/api';
import { bloodStockAPI } from '../../services/api';

const fallbackRequests = [
  {
    request_id: 1,
    facility_name: "BV Chợ Rẫy",
    blood_group: "A+",
    quantity_requested: 500,
    urgency_level: "urgent",
    patient_info: "Nguyễn Văn A, 45 tuổi, Nam",
    required_by: "2024-07-10T10:00",
    quantity_fulfilled: 200,
    request_status: "Đang xử lý",
    special_requirements: "Không truyền máu đông lạnh",
    contact_person: "Bác sĩ B",
    contact_phone: "0909123456",
    notes: "Cần gấp cho ca mổ",
    manager: "Nguyễn Quang Huy",
    delivery_person: "Lê Văn Tài"
  }
];

const BLOOD_COMPATIBILITY = {
  "O-": ["O-"],
  "O+": ["O-", "O+"],
  "A-": ["O-", "A-"],
  "A+": ["O-", "O+", "A-", "A+"],
  "B-": ["O-", "B-"],
  "B+": ["O-", "O+", "B-", "B+"],
  "AB-": ["O-", "A-", "B-", "AB-"],
  "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  "Rh NULL": ["Rh NULL"],
  "Bombay": ["Bombay"]
};

export default function BloodRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [currentRequest, setCurrentRequest] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isStatusUpdated, setIsStatusUpdated] = useState(false);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [deliveryPerson, setDeliveryPerson] = useState('');
  const [isDeliveryUpdated, setIsDeliveryUpdated] = useState(false);
  const [bloodStock, setBloodStock] = useState([]);
  const [sendBloodRows, setSendBloodRows] = useState([{ group: '', amount: '' }]);
  const [deliveryName, setDeliveryName] = useState('');
  
  // Thêm state để lưu thông tin máu đã gửi
  const [sentBloodInfo, setSentBloodInfo] = useState(null);
  const [isBloodSent, setIsBloodSent] = useState(false);

  // Hàm parse thông tin máu đã gửi từ DB
  const parseBloodFullfilled = (bloodFullfilled) => {
    if (!bloodFullfilled) return null;
    
    try {
      // Giả sử format: "A+:500,B+:300" hoặc JSON string
      if (bloodFullfilled.startsWith('{')) {
        // JSON format
        return JSON.parse(bloodFullfilled);
      } else {
        // CSV format: "A+:500,B+:300"
        const rows = bloodFullfilled.split(',').map(item => {
          const [group, amount] = item.split(':');
          return { group: group.trim(), amount: amount.trim() };
        });
        return { bloodRows: rows };
      }
    } catch (error) {
      console.error('Error parsing bloodFullfilled:', error);
      return null;
    }
  };

  // Kiểm tra xem đã gửi máu chưa dựa trên DB
  const checkBloodSentFromDB = () => {
    if (currentRequest?.bloodFullfilled) {
      const parsed = parseBloodFullfilled(currentRequest.bloodFullfilled);
      if (parsed) {
        setSentBloodInfo({
          bloodRows: parsed.bloodRows || parsed,
          deliveryPerson: currentRequest.deliveryPerson,
          sentAt: currentRequest.updatedAt ? new Date(currentRequest.updatedAt).toLocaleString('vi-VN') : 'Không xác định'
        });
        setIsBloodSent(true);
        return true;
      }
    }
    return false;
  };

  // Luôn fetch chi tiết từ backend
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        console.log('Fetching blood request detail for ID:', id);
        const data = await bloodRequestAPI.getRequestById(id);
        console.log('Blood request detail data:', data);
        setCurrentRequest(data);
        
        // Kiểm tra thông tin máu đã gửi từ DB
        if (data?.bloodFullfilled) {
          checkBloodSentFromDB();
        }
      } catch (e) {
        console.error('Error fetching blood request detail:', e);
        setCurrentRequest(null);
      }
    };
    fetchDetail();
    setSelectedStatus('');
    setIsStatusUpdated(false);
    setShowDeliveryForm(false);
    setDeliveryPerson('');
    setIsDeliveryUpdated(false);
  }, [id]);

  useEffect(() => {
    bloodStockAPI.getStock().then(setBloodStock).catch(() => setBloodStock([]));
  }, []);

  // Xử lý chọn trạng thái
  const handleStatusChange = (status) => {
    // Kiểm tra nếu đã hoàn thành thì không cho cập nhật
    if (isCompleted) {
      setToast({ show: true, type: 'info', message: 'Yêu cầu đã hoàn thành!' });
      return;
    }
    if (!isStatusUpdated) {
    setSelectedStatus(status);
    }
  };

  // Hàm cập nhật trạng thái
  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      setToast({ show: true, type: 'error', message: 'Vui lòng chọn trạng thái!' });
      return;
    }
    try {
      const updated = await bloodRequestAPI.updateStatus(id, selectedStatus);
      setCurrentRequest(updated);
      setToast({ show: true, type: 'success', message: `Đã cập nhật trạng thái: ${selectedStatus}` });
      setIsStatusUpdated(true);
      if (selectedStatus === 'Xác nhận') {
        setShowDeliveryForm(true);
      }
    } catch (e) {
      setToast({ show: true, type: 'error', message: 'Cập nhật trạng thái thất bại!' });
    }
  };


  // Hàm cập nhật người vận chuyển
  const handleDeliveryUpdate = () => {
    if (!deliveryPerson.trim()) {
      setToast({ show: true, type: 'error', message: 'Vui lòng nhập tên người vận chuyển!' });
      return;
    }
    
    let requests = fallbackRequests;
    try {
      const local = localStorage.getItem('bloodRequests');
      if (local) requests = JSON.parse(local);
    } catch {}
    const idx = requests.findIndex(r => r.request_id?.toString() === id);
    if (idx !== -1) {
      requests[idx] = { ...requests[idx], delivery_person: deliveryPerson };
      localStorage.setItem('bloodRequests', JSON.stringify(requests));
      setCurrentRequest(requests[idx]);
      setToast({ show: true, type: 'success', message: 'Đã cập nhật người vận chuyển thành công!' });
      setIsDeliveryUpdated(true);
      setShowDeliveryForm(false);
    }
  };

  // Hàm lấy danh sách nhóm máu có thể truyền
  const getCompatibleBloodGroups = () => {
    if (!currentRequest?.bloodGroup) return [];
    if (currentRequest?.isCompatible === false) return [currentRequest.bloodGroup];
    return BLOOD_COMPATIBILITY[currentRequest.bloodGroup] || [currentRequest.bloodGroup];
  };

  // Hàm xử lý gửi máu
  const handleSendBlood = async () => {
    // Validate tổng lượng máu không vượt quá số lượng cần
    const totalAmount = sendBloodRows.reduce((sum, row) => sum + Number(row.amount || 0), 0);
    if (totalAmount > (currentRequest?.quantityRequested || 0)) {
      setToast({ show: true, type: 'error', message: 'Tổng lượng máu gửi đi không được vượt quá số lượng cần!' });
      return;
    }
    // Validate từng dòng
    for (const row of sendBloodRows) {
      if (!row.group || !row.amount || isNaN(row.amount) || Number(row.amount) <= 0) {
        setToast({ show: true, type: 'error', message: 'Vui lòng chọn nhóm máu và nhập lượng máu hợp lệ!' });
        return;
      }
      // Kiểm tra không vượt quá kho
      const stock = bloodStock.find(s => (s.bloodGroupName || s.group) === row.group);
      const available = stock ? (stock.volume || stock.amount || 0) : 0;
      if (Number(row.amount) > available) {
        setToast({ show: true, type: 'error', message: `Lượng máu gửi đi của nhóm ${row.group} vượt quá số lượng trong kho!` });
        return;
      }
    }
    if (!deliveryName.trim()) {
      setToast({ show: true, type: 'error', message: 'Vui lòng nhập tên người vận chuyển!' });
      return;
    }
    // Gửi API cập nhật processing_status
    try {
      // Gọi API cập nhật processing_status thành 'in transit' và lưu thông tin gửi máu
      await bloodRequestAPI.updateRequest(currentRequest.requestId, {
        processingStatus: 'in transit',
        deliveryPerson: deliveryName,
        sentBlood: sendBloodRows // tuỳ backend, có thể cần sửa lại key
      });
      setToast({ show: true, type: 'success', message: 'Đã gửi máu thành công!' });
      setCurrentRequest({ ...currentRequest, processingStatus: 'Đang vận chuyển', deliveryPerson: deliveryName });
      
      // Tải lại stock mới nhất từ DB
      const newStock = await bloodStockAPI.getStock();
      setBloodStock(newStock);
      
      // Reload trang để lấy thông tin mới từ DB
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      setToast({ show: true, type: 'error', message: 'Gửi máu thất bại!' });
    }
  };

  // Thêm hàm hoàn tất yêu cầu
  const handleCompleteRequest = async () => {
    try {
      await bloodRequestAPI.updateProcessingStatus(currentRequest.requestId, 'completed');
      setCurrentRequest({ ...currentRequest, processingStatus: 'Hoàn thành' });
      setToast({ show: true, type: 'success', message: 'Yêu cầu đã được hoàn tất!' });
    } catch (e) {
      setToast({ show: true, type: 'error', message: 'Cập nhật trạng thái hoàn tất thất bại!' });
    }
  };

  // Hàm báo toast khi đã gửi máu
  const showSentToast = () => {
    setToast({ show: true, type: 'info', message: 'Yêu cầu này đã được gửi máu, đang vận chuyển!' });
  };

  // Hàm báo toast khi đã hoàn thành
  const showCompletedToast = () => {
    setToast({ show: true, type: 'info', message: 'Yêu cầu này đã hoàn thành!' });
  };

  // Ẩn toast sau 2.5s
  React.useEffect(() => {
    if (toast.show) {
      const t = setTimeout(() => setToast({ ...toast, show: false }), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Hàm kiểm tra có thể gửi máu không
  const canSendBlood = currentRequest?.processingStatus === 'Chờ xử lí';
  const canComplete = currentRequest?.processingStatus === 'Đang vận chuyển';
  const isCompleted = currentRequest?.processingStatus === 'Hoàn thành';

  // Hàm tính tổng lượng máu sẵn có cho các nhóm phù hợp
  const getTotalAvailableBlood = () => {
    return getCompatibleBloodGroups().reduce((sum, group) => {
      const stock = bloodStock.find(s => (s.bloodGroupName || s.group) === group);
      return sum + (stock ? (stock.volume || stock.amount || 0) : 0);
    }, 0);
  };

  // Hàm cập nhật emergency_status
  const handleRequestEmergency = async () => {
    try {
      await bloodRequestAPI.updateEmergencyStatus(currentRequest.requestId, 'pending');
      setCurrentRequest({ ...currentRequest, emergencyStatus: 'pending' });
      navigate(`/admin/emergency-process/${currentRequest.requestId}`);
    } catch (e) {
      setToast({ show: true, type: 'error', message: 'Không thể cập nhật trạng thái khẩn cấp!' });
    }
  };

  // Mapping trạng thái emergency_status sang tiếng Việt
  const getEmergencyStatusVN = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending': return 'Chờ liên hệ';
      case 'contacting': return 'Đang liên hệ';
      case 'contact successful': return 'Liên hệ thành công';
      case 'completed': return 'Hoàn thành';
      default: return status;
    }
  };

  // Hàm lấy style cho mọi loại trạng thái
  const getStatusStyle = (status) => {
    if (!status) return { color: '#6b7280', fontWeight: '600' };
    const s = status.toLowerCase();
    // emergency_status
    if (s === 'chờ liên hệ') return { color: '#f59e0b', fontWeight: '600' }; // cam
    if (s === 'đang liên hệ') return { color: '#3b82f6', fontWeight: '600' }; // xanh dương
    if (s === 'liên hệ thành công' || s === 'hoàn thành') return { color: '#059669', fontWeight: '600' }; // xanh lá
    // request_status
    
    return { color: '#6b7280', fontWeight: '600' };
  };

  // Mapping trạng thái sang class màu sắc
  const getStatusClass = (status) => {
    if (!status) return 'status-gray';
    const s = status.toLowerCase();
    if (s === 'chờ liên hệ') return 'status-orange';
    if (s === 'đang liên hệ') return 'status-blue';
    if (s === 'liên hệ thành công' || s === 'hoàn thành') return 'status-green';
    if (s === 'chờ xác nhận') return 'status-orange';
    if (s === 'từ chối') return 'status-red';
    if (s === 'xác nhận') return 'status-green';
    // processing_status
    if (s === 'chờ xử lí') return 'status-orange';
    if (s === 'đang vận chuyển') return 'status-blue';
    return 'status-gray';
  };

  // Xác định trạng thái để đổi nút
  const emergencyVN = getEmergencyStatusVN(currentRequest?.emergencyStatus);
  const showViewEmergencyBtn = [
    'Chờ liên hệ',
    'Đang liên hệ',
    'Hoàn thành'
  ].includes(emergencyVN);

  // Chỉ hiển thị nút yêu cầu khẩn cấp khi mức độ là "Khẩn cấp"
  const showEmergencyRequestBtn = currentRequest?.isEmergency === true;

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="donation-detail-root">
          <h2 className="donation-detail-title">Chi tiết yêu cầu máu - #{currentRequest?.requestId}</h2>
          {/* Sửa layout: 2 cột song song */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: 32, alignItems: 'flex-start' }}>
            {/* Cột trái: Thông tin yêu cầu máu */}
            <div style={{ flex: 1, minWidth: 350 }}>
            <div className="donation-detail-table">
              <div className="donation-detail-section-title">Thông tin yêu cầu máu</div>
              <table>
                <tbody>
                    <tr><td>Cơ sở y tế :</td><td>{currentRequest?.facilityName}</td></tr>
                    {/* Thông tin bệnh nhân: chỉ hiển thị khi khẩn cấp */}
                    {currentRequest?.isEmergency && (
                      <tr><td>Thông tin bệnh nhân :</td><td>{currentRequest?.patientInfo}</td></tr>
                    )}
                    <tr><td>Yêu cầu tương hợp :</td><td>{currentRequest?.isCompatible === true ? "Có" : currentRequest?.isCompatible === false ? "Không" : ""}</td></tr>
                    <tr><td>Nhóm máu :</td><td>{currentRequest?.bloodGroup}</td></tr>
                    <tr><td>Số lượng cần :</td><td>{currentRequest?.quantityRequested} ml</td></tr>
                    <tr><td>Mức độ :</td>
                      <td>
                        <span style={{
                          color: currentRequest?.isEmergency ? '#dc2626' : '#059669',
                          fontWeight: '600',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          backgroundColor: currentRequest?.isEmergency ? '#fef2f2' : '#f0fdf4',
                          border: `1px solid ${currentRequest?.isEmergency ? '#fecaca' : '#bbf7d0'}`
                        }}>
                          {currentRequest?.isEmergency ? "Khẩn cấp" : "Bình thường"}
                        </span>
                      </td>
                    </tr>
                    <tr><td>Thời gian cần :</td><td>{currentRequest?.requiredBy?.replace('T', ' ')}</td></tr>
                    <tr><td>Người liên hệ :</td><td>{currentRequest?.contactPerson}</td></tr>
                    <tr><td>SĐT liên hệ :</td><td>{currentRequest?.contactPhone}</td></tr>
                    <tr><td>Người phụ trách :</td><td>{currentRequest?.fullName}</td></tr>
                    <tr><td>Người vận chuyển :</td><td>{currentRequest?.deliveryPerson}</td></tr>
                    <tr><td>Ghi chú :</td><td>{currentRequest?.specialRequirements}</td></tr>
                    <tr><td>Ghi chú của nhân viên :</td><td>{currentRequest?.notes}</td></tr>
                    <tr>
                      <td>Trạng thái :</td>
                      <td>
                        <span className={getStatusClass(
                          currentRequest?.emergencyStatus
                            ? getEmergencyStatusVN(currentRequest?.emergencyStatus)
                            : (currentRequest?.requestStatus === 'Xác nhận' && currentRequest?.processingStatus)
                              ? currentRequest?.processingStatus
                              : currentRequest?.requestStatus
                        )}>
                          {
                            currentRequest?.emergencyStatus
                              ? getEmergencyStatusVN(currentRequest?.emergencyStatus)
                              : (currentRequest?.requestStatus === 'Xác nhận' && currentRequest?.processingStatus)
                                ? currentRequest?.processingStatus
                                : currentRequest?.requestStatus
                          }
                        </span>
                      </td>
                    </tr>
                </tbody>
              </table>
              </div>
            </div>
            {/* Cột phải: bảng cập nhật trạng thái/gửi máu + bảng lượng máu sẵn có */}
            <div style={{ flex: 1, minWidth: 400, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Nếu trạng thái là Xác nhận, render form gửi máu, ngược lại render bảng cập nhật trạng thái */}
              {currentRequest?.requestStatus === 'Xác nhận' ? (
                <div className="donation-detail-table" style={{ maxWidth: 480, margin: '0 auto', width: '100%' }}>
                  <div className="donation-detail-section-title">Gửi máu</div>
                  <form onSubmit={e => { e.preventDefault(); if (canSendBlood) handleSendBlood(); }}>
                    {sendBloodRows.map((row, idx) => (
                      <div key={idx} className="send-blood-row">
                        <select
                          className="send-blood-select"
                          value={row.group}
                          onChange={e => {
                            if (!canSendBlood) { showSentToast(); return; }
                            const newGroup = e.target.value;
                            // Tính tổng lượng máu cho newGroup nếu dòng idx đổi sang newGroup
                            let totalForGroup = 0;
                            sendBloodRows.forEach((r, i) => {
                              if (i === idx) {
                                if (newGroup) totalForGroup += Number(sendBloodRows[idx].amount || 0);
                              } else {
                                if (r.group === newGroup) totalForGroup += Number(r.amount || 0);
                              }
                            });
                            const stock = bloodStock.find(s => (s.bloodGroupName || s.group) === newGroup);
                            const available = stock ? (stock.volume || stock.amount || 0) : 0;
                            if (totalForGroup > available) {
                              setToast({ show: true, type: 'error', message: `Tổng lượng máu gửi đi của nhóm ${newGroup} vượt quá số lượng trong kho!` });
                              return;
                            }
                            // Nếu hợp lệ thì cập nhật group
                            const newRows = [...sendBloodRows];
                            newRows[idx].group = newGroup;
                            setSendBloodRows(newRows);
                          }}
                          required
                          style={!canSendBlood ? { background: '#f3f4f6', cursor: 'not-allowed', color: '#9ca3af' } : {}}
                        >
                          <option value="">Chọn nhóm máu</option>
                          {getCompatibleBloodGroups().map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                        <input
                          className="send-blood-input"
                          type="number"
                          min={1}
                          max={(() => {
                            const stock = bloodStock.find(s => (s.bloodGroupName || s.group) === row.group);
                            return stock ? (stock.volume || stock.amount || 0) : 0;
                          })()}
                          value={row.amount}
                          onChange={e => {
                            if (!canSendBlood) { showSentToast(); return; }
                            const value = e.target.value;
                            const group = row.group;
                            // Tính tổng lượng máu của tất cả dòng (nếu thay đổi dòng idx thành value mới)
                            let total = 0;
                            sendBloodRows.forEach((r, i) => {
                              if (i === idx) total += Number(value || 0);
                              else total += Number(r.amount || 0);
                            });
                            if (total > (currentRequest?.quantityRequested || 0)) {
                              setToast({ show: true, type: 'error', message: 'Tổng lượng máu gửi đi không được vượt quá số lượng cần!' });
                              return;
                            }
                            // Kiểm tra tổng cho từng nhóm máu như hiện tại
                            let totalForGroup = 0;
                            sendBloodRows.forEach((r, i) => {
                              if (i === idx) {
                                if (r.group === group) totalForGroup += Number(value || 0);
                              } else {
                                if (r.group === group) totalForGroup += Number(r.amount || 0);
                              }
                            });
                            const stock = bloodStock.find(s => (s.bloodGroupName || s.group) === group);
                            const available = stock ? (stock.volume || stock.amount || 0) : 0;
                            if (totalForGroup > available) {
                              setToast({ show: true, type: 'error', message: `Tổng lượng máu gửi đi của nhóm ${group} vượt quá số lượng trong kho!` });
                              return;
                            }
                            const newRows = [...sendBloodRows];
                            newRows[idx].amount = value;
                            setSendBloodRows(newRows);
                          }}
                          placeholder="Lượng máu (ml)"
                          required
                          readOnly={!canSendBlood}
                          style={!canSendBlood ? { background: '#f3f4f6', cursor: 'not-allowed', color: '#9ca3af' } : {}}
                        />
                        {currentRequest?.isCompatible !== false && sendBloodRows.length > 1 && (
                          <button type="button" className="send-blood-remove" onClick={() => {
                            if (!canSendBlood) { showSentToast(); return; }
                            setSendBloodRows(sendBloodRows.filter((_, i) => i !== idx));
                          }}
                            style={!canSendBlood ? { background: '#f3f4f6', cursor: 'not-allowed', color: '#9ca3af' } : {}}
                          >✕</button>
                        )}
                      </div>
                    ))}
                    {currentRequest?.isCompatible !== false && (
                      <button type="button" className="send-blood-add" onClick={() => {
                        if (!canSendBlood) { showSentToast(); return; }
                        setSendBloodRows([...sendBloodRows, { group: '', amount: '' }]);
                      }}
                        style={!canSendBlood ? { background: '#f3f4f6', cursor: 'not-allowed', color: '#9ca3af' } : {}}
                      >+ Thêm nhóm máu</button>
                    )}
                    <div style={{ margin: '12px 0' }}>
                      <input
                        type="text"
                        value={deliveryName}
                        onChange={e => {
                          if (!canSendBlood) { showSentToast(); return; }
                          setDeliveryName(e.target.value);
                        }}
                        placeholder="Tên người vận chuyển"
                        style={!canSendBlood ? { background: '#f3f4f6', cursor: 'not-allowed', color: '#9ca3af', width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' } : { width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }}
                        required
                        readOnly={!canSendBlood}
                      />
                    </div>
                    <button
                      type="submit"
                      style={!canSendBlood
                        ? { width: '100%', padding: '12px 0', background: '#e5e7eb', color: '#9ca3af', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 16, marginTop: 8, cursor: 'not-allowed' }
                        : { width: '100%', padding: '12px 0', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 16, marginTop: 8 }}
                      onClick={e => {
                        if (isCompleted) {
                          e.preventDefault(); showCompletedToast();
                        } else if (!canSendBlood) {
                          e.preventDefault(); showSentToast();
                        }
                      }}
                    >Gửi máu</button>
                  </form>
                  {/* Nếu không phải Chờ xử lí thì hiện nút hoàn tất */}
                  {(!canSendBlood) && (
                <button 
                      onClick={e => {
                        if (isCompleted) {
                          e.preventDefault(); showCompletedToast();
                        } else {
                          handleCompleteRequest();
                        }
                      }}
                      style={isCompleted
                        ? { width: '100%', padding: '12px 0', background: '#e5e7eb', color: '#9ca3af', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 16, marginTop: 16, cursor: 'not-allowed' }
                        : { width: '100%', padding: '12px 0', background: '#059669', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 16, marginTop: 16 }}
                    >Yêu cầu đã hoàn tất</button>
                  )}
                  
                  {/* Hiển thị thông tin máu đã gửi */}
                  {isBloodSent && sentBloodInfo && (
                    <div style={{
                      marginTop: '24px', 
                      padding: '16px', 
                      backgroundColor: '#f0fdf4', 
                      borderRadius: '8px', 
                      border: '1px solid #bbf7d0' 
                    }}>
                      <h6 style={{ color: '#059669', marginBottom: '12px', fontWeight: '600' }}>
                        ✅ Thông tin máu đã gửi
                      </h6>
                      <div style={{ marginBottom: '8px' }}>
                        <strong>Người vận chuyển:</strong> {sentBloodInfo.deliveryPerson || 'Chưa có thông tin'}
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <strong>Thời gian gửi:</strong> {sentBloodInfo.sentAt || 'Không xác định'}
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <strong>Chi tiết máu đã gửi:</strong>
                    </div>
                    <div style={{
                        backgroundColor: '#ffffff', 
                        padding: '12px', 
                      borderRadius: '6px',
                        border: '1px solid #d1fae5' 
                      }}>
                        {sentBloodInfo.bloodRows && sentBloodInfo.bloodRows.length > 0 ? (
                          <>
                            {sentBloodInfo.bloodRows.map((row, idx) => (
                              <div key={idx} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                marginBottom: '4px',
                                padding: '4px 0'
                              }}>
                                <span style={{ fontWeight: '500' }}>Nhóm máu {row.group}:</span>
                                <span style={{ color: '#059669', fontWeight: '600' }}>{row.amount} ml</span>
                              </div>
                            ))}
                            <hr style={{ margin: '8px 0', borderColor: '#d1fae5' }} />
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              fontWeight: '600',
                              color: '#059669'
                            }}>
                              <span>Tổng cộng:</span>
                              <span>{sentBloodInfo.bloodRows.reduce((sum, row) => sum + Number(row.amount || 0), 0)} ml</span>
                            </div>
                          </>
                        ) : (
                          <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
                            Không có thông tin chi tiết
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="donation-detail-table" style={{ maxWidth: 480, margin: '0 auto', width: '100%' }}>
              <div className="donation-detail-section-title">Cập nhật trạng thái yêu cầu</div>
              <div style={{padding: '24px'}}>
                <label className="form-label" style={{
                  fontWeight: '500', 
                  marginBottom: '16px', 
                  color: '#374151',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  textAlign: 'center',
                  display: 'block'
                }}>
                  Cập nhật trạng thái
                </label>
                <div style={{display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap'}}>
                    {/* Nút Xác nhận */}
                  <div 
                      onClick={() => handleStatusChange('Xác nhận')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 20px',
                      borderRadius: '12px',
                        border: selectedStatus === 'Xác nhận' ? '2px solid #059669' : '2px solid #e5e7eb',
                        backgroundColor: selectedStatus === 'Xác nhận' ? '#f0fdf4' : '#ffffff',
                          cursor: (isStatusUpdated || isCompleted) ? 'default' : 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      minWidth: '140px',
                        boxShadow: selectedStatus === 'Xác nhận' ? '0 4px 12px rgba(5, 150, 105, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.05)',
                        userSelect: 'none',
                          opacity: (isStatusUpdated && selectedStatus !== 'Xác nhận') || isCompleted ? 0.5 : 1
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                        backgroundColor: selectedStatus === 'Xác nhận' ? '#059669' : '#e5e7eb',
                      marginRight: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease-in-out'
                    }}>
                        {selectedStatus === 'Xác nhận' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                      )}
                    </div>
                    <span style={{
                        color: selectedStatus === 'Xác nhận' ? '#059669' : '#6b7280',
                      fontWeight: '500',
                      fontSize: '14px'
                    }}>
                        Xác nhận
                    </span>
                  </div>
                    {/* Nút Từ chối - Ẩn khi trạng thái là "Đang yêu cầu máu khẩn cấp" */}
                      {currentRequest?.requestStatus !== 'Đang yêu cầu máu khẩn cấp' && (
                        <div
                          onClick={() => {
                            if (currentRequest?.isEmergency) {
                              setToast({ show: true, type: 'error', message: 'Đây là trường hợp khẩn cấp, không thể từ chối' });
                              return;
                            }
                            handleStatusChange('Từ chối');
                          }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 20px',
                      borderRadius: '12px',
                          border: selectedStatus === 'Từ chối' ? '2px solid #dc2626' : '2px solid #e5e7eb',
                          backgroundColor: selectedStatus === 'Từ chối' ? '#fef2f2' : '#ffffff',
                            cursor: (currentRequest?.isEmergency || isStatusUpdated || isCompleted) ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      minWidth: '140px',
                          boxShadow: selectedStatus === 'Từ chối' ? '0 4px 12px rgba(220, 38, 38, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.05)',
                          userSelect: 'none',
                            opacity: (isStatusUpdated && selectedStatus !== 'Từ chối') || currentRequest?.isEmergency || isCompleted ? 0.5 : 1
                    }}
                  >
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                        backgroundColor: selectedStatus === 'Từ chối' ? '#dc2626' : '#e5e7eb',
                      marginRight: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease-in-out'
                    }}>
                        {selectedStatus === 'Từ chối' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <path d="M18 6L6 18M6 6l12 12"></path>
                        </svg>
                      )}
                    </div>
                    <span style={{
                        color: selectedStatus === 'Từ chối' ? '#dc2626' : '#6b7280',
                      fontWeight: '500',
                      fontSize: '14px'
                    }}>
                        Từ chối
                    </span>
                  </div>
                    )}
                </div>
                    {!isStatusUpdated && !isCompleted && (
                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <button 
                    onClick={handleStatusUpdate}
                    disabled={!selectedStatus}
                    style={{
                      padding: '14px 32px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: selectedStatus ? '#2563eb' : '#e5e7eb',
                      color: selectedStatus ? '#ffffff' : '#9ca3af',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: selectedStatus ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s ease-in-out',
                      boxShadow: selectedStatus ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      minWidth: '200px'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedStatus) {
                        e.target.style.backgroundColor = '#1d4ed8';
                        e.target.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedStatus) {
                        e.target.style.backgroundColor = '#2563eb';
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    Cập nhật
                  </button>
                    </div>
                  )}
                    {(isStatusUpdated || isCompleted) && (
                    <div style={{
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      padding: '14px 32px',
                        color: isCompleted ? '#dc2626' : '#059669',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px'}}>
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                        {isCompleted ? 'Yêu cầu đã hoàn thành' : 'Trạng thái đã được cập nhật'}
                    </div>
                  )}
                </div>
              </div>
              )}
              {/* Bảng lượng máu sẵn có luôn nằm dưới cùng cột phải */}
              <div className="donation-detail-table" style={{ maxWidth: 480, margin: '0 auto', width: '100%' }}>
                <div className="donation-detail-section-title">Lượng máu sẵn có trong kho cho nhóm máu phù hợp</div>
                <table>
                  <thead>
                    <tr>
                      <th>Nhóm máu</th>
                      <th>Lượng máu trong kho</th>
                      <th>So với yêu cầu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCompatibleBloodGroups().map(group => {
                      const stock = bloodStock.find(s => (s.bloodGroupName || s.group) === group);
                      const available = stock ? (stock.volume || stock.amount || 0) : 0;
                      const enough = available >= (currentRequest?.quantityRequested || 0);
                      return (
                        <tr key={group}>
                          <td>{group}</td>
                          <td>{available} ml</td>
                          <td style={{color: enough ? '#059669' : '#dc2626', fontWeight: 600}}>
                            {enough ? 'Đủ' : 'Thiếu'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {/* Nút yêu cầu khẩn cấp hoặc xem quá trình */}
                <div style={{ marginTop: 24, textAlign: 'center' }}>
                  {showViewEmergencyBtn ? (
                      <button 
                        style={{
                        padding: '14px 32px',
                        borderRadius: '12px',
                          border: 'none',
                        background: '#2563eb',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: 16,
                        boxShadow: '0 2px 8px rgba(37,99,235,0.08)',
                        cursor: 'pointer'
                      }}
                      onClick={() => navigate(`/admin/emergency-process/${currentRequest?.requestId}`)}
                    >
                      Xem yêu cầu khẩn cấp
                      </button>
                  ) : showEmergencyRequestBtn ? (
                      <button 
                        style={{
                        padding: '14px 32px',
                        borderRadius: '12px',
                        border: 'none',
                        background: '#f59e0b',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: 16,
                        boxShadow: '0 2px 8px rgba(245,158,11,0.08)',
                        cursor: 'pointer'
                      }}
                      onClick={handleRequestEmergency}
                    >
                      Yêu cầu khẩn cấp
                      </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Toast thông báo */}
      {toast.show && (
        <div
          className={`custom-toast ${toast.type}`}
          style={{
            background:
              toast.type === 'success' ? '#e0fbe6'
              : toast.type === 'error' ? '#fee2e2'
              : toast.type === 'info' ? '#e0e7ff'
              : '#f3f4f6',
            color:
              toast.type === 'success' ? '#15803d'
              : toast.type === 'error' ? '#dc2626'
              : toast.type === 'info' ? '#2563eb'
              : '#374151',
            fontWeight: 600,
            fontSize: 18,
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
            padding: '20px 32px',
            position: 'fixed',
            top: 24,
            right: 32,
            zIndex: 9999,
            minWidth: 320,
            textAlign: 'center',
            opacity: 1,
            transition: 'opacity 0.3s',
          }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
} 