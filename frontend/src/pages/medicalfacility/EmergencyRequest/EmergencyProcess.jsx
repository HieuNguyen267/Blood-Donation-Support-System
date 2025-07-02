import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import MedicalFacilityHeader from '../../../components/user/MedicalFacilityHeader';
import Footer from "../../../components/user/Footer";
import { Card, Badge, Button, Tooltip, Modal, Select, message } from 'antd';
import { PhoneOutlined, EyeOutlined, UserOutlined, TeamOutlined, ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined, LineChartOutlined } from '@ant-design/icons';
import "./EmergencyProcess.css";

export default function EmergencyProcess() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Dữ liệu mẫu
  const request = location.state?.request || {
    request_id: requestId,
    facility_name: "BV Chợ Rẫy",
    blood_group: "A+",
    quantity_requested: 1000,
    urgency_level: "Khẩn cấp",
    contact_person: "Bác sĩ B",
    contact_phone: "0909123456",
    required_by: "2024-07-10T10:00",
  };

  const [acceptedDonors, setAcceptedDonors] = useState([
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

  const [editingDonor, setEditingDonor] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [incidentNote, setIncidentNote] = useState('');

  const statusOptions = [
    { value: 'Đã xác nhận', label: 'Đã xác nhận' },
    { value: 'Tạm dừng', label: 'Tạm dừng' },
  ];

  const totalAccepted = acceptedDonors.reduce((sum, donor) => sum + donor.quantity, 0);
  const remainingNeeded = request.quantity_requested - totalAccepted;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Đã xác nhận': return <Badge color="#52c41a" text="Đã xác nhận" />;
      case 'Tạm dừng': return <Badge color="#faad14" text="Tạm dừng" />;
      case 'Đã đến': return <Badge color="#1890ff" text="Đã đến" />;
      case 'Đã hiến': return <Badge color="#722ed1" text="Đã hiến" />;
      default: return <Badge color="#bfbfbf" text={status} />;
    }
  };

  const handleEditStatus = (donor) => {
    setEditingDonor(donor);
    setNewStatus(donor.status);
    setIncidentNote('');
    setModalVisible(true);
  };

  const handleSaveStatus = () => {
    if (newStatus === 'Tạm dừng' && !incidentNote.trim()) {
      message.error('Vui lòng nhập mô tả sự cố khi tạm dừng!');
      return;
    }
    setAcceptedDonors(prev => prev.map(d =>
      d.id === editingDonor.id ? { ...d, status: newStatus, incidentNote: newStatus === 'Tạm dừng' ? incidentNote : undefined } : d
    ));
    setModalVisible(false);
    message.success('Cập nhật trạng thái thành công!');
  };

  return (
    <div className="medical-facility-page">
      <MedicalFacilityHeader />
      <main className="container mt-4 emergency-process-main">
        <Card className="emergency-process-card" bordered={false}>
          <h2 className="text-center mb-2 process-title">
            <ExclamationCircleOutlined style={{color:'#e53935', marginRight:8}} />
            Quá trình nhận máu khẩn cấp
          </h2>
          <div className="process-desc text-center mb-4">
            Theo dõi tiến độ và thông tin các người hiến máu đã xác nhận hỗ trợ cho cơ sở y tế của bạn.
          </div>
          <div className="row g-3 mb-4">
            <div className="col-md-8">
              <Card className="request-info-card" title={<span><UserOutlined /> Thông tin yêu cầu</span>}>
                <div className="row">
                  <div className="col-6">
                    <div><b>Cơ sở y tế:</b> {request.facility_name}</div>
                    <div><b>Nhóm máu:</b> <span className="badge bg-danger">{request.blood_group}</span></div>
                    <div><b>Mức độ:</b> <span className="badge bg-warning text-dark">{request.urgency_level}</span></div>
                  </div>
                  <div className="col-6">
                    <div><b>Số lượng cần:</b> <span className="text-danger fw-bold">{request.quantity_requested} ml</span></div>
                    <div><b>Ngày cần:</b> {request.required_by?.replace('T',' ')}</div>
                    <div><b>Liên hệ:</b> {request.contact_person} ({request.contact_phone})</div>
                  </div>
                </div>
              </Card>
            </div>
            <div className="col-md-4">
              <Card className="progress-card" title={<span><ClockCircleOutlined /> Tiến độ</span>}>
                <div className="progress-bar-outer">
                  <div className="progress-bar-inner" style={{width: `${(totalAccepted/request.quantity_requested)*100}%`}}></div>
                </div>
                <div className="progress-label mt-2">
                  <span className="text-success fw-bold">{totalAccepted} ml</span> / {request.quantity_requested} ml
                </div>
                {remainingNeeded > 0 && (
                  <div className="mt-2">
                    <span className="text-danger">Còn thiếu: {remainingNeeded} ml</span>
                  </div>
                )}
              </Card>
            </div>
          </div>

          <Card className="donor-list-card" title={<span><TeamOutlined /> Danh sách người hiến đã xác nhận</span>}>
            <div className="table-responsive">
              <table className="table table-hover table-bordered donor-table">
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
                    <th className="text-center">Thao tác</th>
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
                      <td className="text-center">{getStatusBadge(donor.status === 'Đang di chuyển' ? 'Tạm dừng' : donor.status)}</td>
                      <td className="text-center">
                        <div className="donor-action-btns">
                          <Tooltip title="Chỉnh sửa trạng thái">
                            <Button shape="circle" icon={<CheckCircleOutlined />} style={{color:'#faad14', borderColor:'#faad14'}} onClick={() => handleEditStatus(donor)} />
                          </Tooltip>
                          <Tooltip title="Xem chi tiết">
                            <Button shape="circle" icon={<EyeOutlined />} style={{color:'#2563eb', borderColor:'#2563eb'}} />
                          </Tooltip>
                        </div>
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
          </Card>

          <div className="row mt-4 g-3">
            <div className="col-md-3 col-6">
              <Card className="stat-card bg-primary-soft" bordered={false}>
                <div className="stat-icon"><TeamOutlined /></div>
                <div className="stat-info">
                  <h6>Tổng người chấp nhận</h6>
                  <h4>{acceptedDonors.length}</h4>
                </div>
              </Card>
            </div>
            <div className="col-md-3 col-6">
              <Card className="stat-card bg-success-soft" bordered={false}>
                <div className="stat-icon"><CheckCircleOutlined /></div>
                <div className="stat-info">
                  <h6>Tổng máu đã có</h6>
                  <h4>{totalAccepted} <small>ml</small></h4>
                </div>
              </Card>
            </div>
            <div className="col-md-3 col-6">
              <Card className="stat-card bg-warning-soft" bordered={false}>
                <div className="stat-icon"><ExclamationCircleOutlined /></div>
                <div className="stat-info">
                  <h6>Còn thiếu</h6>
                  <h4>{remainingNeeded > 0 ? remainingNeeded : 0} <small>ml</small></h4>
                </div>
              </Card>
            </div>
            <div className="col-md-3 col-6">
              <Card className="stat-card bg-info-soft" bordered={false}>
                <div className="stat-icon"><LineChartOutlined /></div>
                <div className="stat-info">
                  <h6>Tiến độ</h6>
                  <h4>{request.quantity_requested > 0 ? Math.round((totalAccepted/request.quantity_requested)*100) : 0}<small>%</small></h4>
                </div>
              </Card>
            </div>
          </div>

          <div className="d-flex gap-2 mt-4 justify-content-center">
            <Button type="default" size="large" onClick={() => navigate(-1)}>
              ← Quay lại
            </Button>
          </div>
        </Card>
      </main>
      <Footer />
      <Modal
        title={`Chỉnh sửa trạng thái cho ${editingDonor?.name}`}
        open={modalVisible}
        onOk={handleSaveStatus}
        onCancel={() => setModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Select
          style={{ width: '100%' }}
          value={newStatus}
          onChange={setNewStatus}
          options={statusOptions}
        />
        <div style={{marginTop:8, color:'#888', fontSize:13}}>
          Chỉ có thể chuyển trạng thái giữa "Đã xác nhận" và "Tạm dừng".
        </div>
        {newStatus === 'Tạm dừng' && (
          <div style={{marginTop:16}}>
            <label style={{fontWeight:500}}>Mô tả sự cố <span style={{color:'red'}}>*</span></label>
            <textarea
              style={{width:'100%', minHeight:60, marginTop:4, borderRadius:4, border:'1px solid #ccc', padding:8, resize:'vertical'}}
              placeholder="Nhập mô tả lý do tạm dừng..."
              value={incidentNote}
              onChange={e => setIncidentNote(e.target.value)}
              required
            />
          </div>
        )}
      </Modal>
    </div>
  );
} 