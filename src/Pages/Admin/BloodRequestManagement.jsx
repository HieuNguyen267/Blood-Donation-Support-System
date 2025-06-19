import React, { useState } from "react";
import Header from "../../Component/Admin/Header";
import Sidebar from "../../Component/Admin/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const urgencyLevels = ["routine", "urgent", "emergency", "critical"];
const statuses = ["pending", "partially_fulfilled", "fulfilled", "cancelled", "expired"];
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Rh NULL"];
const facilities = ["BV Chợ Rẫy", "BV 115", "BV Nhi Đồng 1", "BV Huyết học"];

const requestDataInit = [
  {
    request_id: 1,
    facility_id: 1,
    facility_name: "BV Chợ Rẫy",
    blood_group_id: 1,
    blood_group: "A+",
    quantity_requested: 500,
    urgency_level: "urgent",
    patient_info: "Nguyễn Văn A, 45 tuổi, Nam",
    required_by: "2024-07-10T10:00",
    quantity_fulfilled: 200,
    request_status: "partially_fulfilled",
    special_requirements: "Không truyền máu đông lạnh",
    contact_person: "Bác sĩ B",
    contact_phone: "0909123456",
    notes: "Cần gấp cho ca mổ",
    manager: "Nguyễn Quang Huy",
    delivery_person: "Lê Văn Tài"
  },
  {
    request_id: 2,
    facility_id: 2,
    facility_name: "BV 115",
    blood_group_id: 2,
    blood_group: "O-",
    quantity_requested: 300,
    urgency_level: "routine",
    patient_info: "Trần Thị B, 30 tuổi, Nữ",
    required_by: "2024-07-12T08:00",
    quantity_fulfilled: 0,
    request_status: "pending",
    special_requirements: "Truyền chậm",
    contact_person: "Bác sĩ C",
    contact_phone: "0912345678",
    notes: "",
    manager: "Trần Văn Cường",
    delivery_person: ""
  },
  {
    request_id: 3,
    facility_id: 3,
    facility_name: "BV Nhi Đồng 1",
    blood_group_id: 3,
    blood_group: "B+",
    quantity_requested: 700,
    urgency_level: "emergency",
    patient_info: "Lê Thị D, 5 tuổi, Nữ",
    required_by: "2024-07-11T14:00",
    quantity_fulfilled: 0,
    request_status: "pending",
    special_requirements: "Truyền cho trẻ nhỏ",
    contact_person: "Bác sĩ D",
    contact_phone: "0932123456",
    notes: "",
    manager: "Phạm Minh Tuấn",
    delivery_person: "Nguyễn Văn Bình"
  },
  {
    request_id: 4,
    facility_id: 4,
    facility_name: "BV Huyết học",
    blood_group_id: 4,
    blood_group: "AB-",
    quantity_requested: 400,
    urgency_level: "critical",
    patient_info: "Phạm Văn E, 60 tuổi, Nam",
    required_by: "2024-07-09T09:00",
    quantity_fulfilled: 0,
    request_status: "pending",
    special_requirements: "",
    contact_person: "Bác sĩ E",
    contact_phone: "0945123456",
    notes: "Bệnh nhân ung thư máu",
    manager: "Lê Thị Hồng",
    delivery_person: ""
  },
  {
    request_id: 5,
    facility_id: 1,
    facility_name: "BV Chợ Rẫy",
    blood_group_id: 5,
    blood_group: "O+",
    quantity_requested: 600,
    urgency_level: "urgent",
    patient_info: "Ngô Văn F, 35 tuổi, Nam",
    required_by: "2024-07-13T16:00",
    quantity_fulfilled: 600,
    request_status: "fulfilled",
    special_requirements: "",
    contact_person: "Bác sĩ F",
    contact_phone: "0956123456",
    notes: "",
    manager: "Nguyễn Văn Hùng",
    delivery_person: "Trần Văn Hòa"
  },
  {
    request_id: 6,
    facility_id: 2,
    facility_name: "BV 115",
    blood_group_id: 6,
    blood_group: "B-",
    quantity_requested: 350,
    urgency_level: "routine",
    patient_info: "Đặng Thị G, 28 tuổi, Nữ",
    required_by: "2024-07-14T10:00",
    quantity_fulfilled: 0,
    request_status: "pending",
    special_requirements: "",
    contact_person: "Bác sĩ G",
    contact_phone: "0967123456",
    notes: "",
    manager: "Lê Văn Phúc",
    delivery_person: ""
  },
  {
    request_id: 7,
    facility_id: 3,
    facility_name: "BV Nhi Đồng 1",
    blood_group_id: 7,
    blood_group: "AB+",
    quantity_requested: 800,
    urgency_level: "critical",
    patient_info: "Trần Văn H, 12 tuổi, Nam",
    required_by: "2024-07-15T11:00",
    quantity_fulfilled: 200,
    request_status: "partially_fulfilled",
    special_requirements: "",
    contact_person: "Bác sĩ H",
    contact_phone: "0978123456",
    notes: "",
    manager: "Nguyễn Thị Mai",
    delivery_person: ""
  },
  {
    request_id: 8,
    facility_id: 4,
    facility_name: "BV Huyết học",
    blood_group_id: 8,
    blood_group: "O-",
    quantity_requested: 450,
    urgency_level: "urgent",
    patient_info: "Lê Văn I, 50 tuổi, Nam",
    required_by: "2024-07-16T13:00",
    quantity_fulfilled: 0,
    request_status: "pending",
    special_requirements: "",
    contact_person: "Bác sĩ I",
    contact_phone: "0989123456",
    notes: "",
    manager: "Phạm Văn Lâm",
    delivery_person: ""
  },
  {
    request_id: 9,
    facility_id: 1,
    facility_name: "BV Chợ Rẫy",
    blood_group_id: 9,
    blood_group: "Rh NULL",
    quantity_requested: 1000,
    urgency_level: "emergency",
    patient_info: "Nguyễn Thị K, 22 tuổi, Nữ",
    required_by: "2024-07-17T15:00",
    quantity_fulfilled: 0,
    request_status: "pending",
    special_requirements: "",
    contact_person: "Bác sĩ K",
    contact_phone: "0990123456",
    notes: "Trường hợp hiếm",
    manager: "Lê Thị Lan",
    delivery_person: ""
  },
  {
    request_id: 10,
    facility_id: 2,
    facility_name: "BV 115",
    blood_group_id: 1,
    blood_group: "A+",
    quantity_requested: 550,
    urgency_level: "urgent",
    patient_info: "Phạm Văn L, 40 tuổi, Nam",
    required_by: "2024-07-18T09:00",
    quantity_fulfilled: 0,
    request_status: "pending",
    special_requirements: "",
    contact_person: "Bác sĩ L",
    contact_phone: "0901123456",
    notes: "",
    manager: "Nguyễn Văn Minh",
    delivery_person: ""
  },
  {
    request_id: 11,
    facility_id: 3,
    facility_name: "BV Nhi Đồng 1",
    blood_group_id: 2,
    blood_group: "O-",
    quantity_requested: 600,
    urgency_level: "critical",
    patient_info: "Lê Thị M, 8 tuổi, Nữ",
    required_by: "2024-07-19T10:00",
    quantity_fulfilled: 0,
    request_status: "pending",
    special_requirements: "",
    contact_person: "Bác sĩ M",
    contact_phone: "0911123456",
    notes: "",
    manager: "Trần Văn Phát",
    delivery_person: ""
  },
  {
    request_id: 12,
    facility_id: 4,
    facility_name: "BV Huyết học",
    blood_group_id: 3,
    blood_group: "B+",
    quantity_requested: 700,
    urgency_level: "urgent",
    patient_info: "Nguyễn Văn N, 55 tuổi, Nam",
    required_by: "2024-07-20T11:00",
    quantity_fulfilled: 0,
    request_status: "pending",
    special_requirements: "",
    contact_person: "Bác sĩ N",
    contact_phone: "0922123456",
    notes: "",
    manager: "Lê Thị Ngọc",
    delivery_person: ""
  },
  {
    request_id: 13,
    facility_id: 1,
    facility_name: "BV Chợ Rẫy",
    blood_group_id: 4,
    blood_group: "AB-",
    quantity_requested: 400,
    urgency_level: "routine",
    patient_info: "Phạm Văn O, 65 tuổi, Nam",
    required_by: "2024-07-21T12:00",
    quantity_fulfilled: 0,
    request_status: "pending",
    special_requirements: "",
    contact_person: "Bác sĩ O",
    contact_phone: "0933123456",
    notes: "",
    manager: "Nguyễn Văn Phúc",
    delivery_person: ""
  },
  {
    request_id: 14,
    facility_id: 2,
    facility_name: "BV 115",
    blood_group_id: 5,
    blood_group: "O+",
    quantity_requested: 500,
    urgency_level: "urgent",
    patient_info: "Trần Thị P, 32 tuổi, Nữ",
    required_by: "2024-07-22T13:00",
    quantity_fulfilled: 0,
    request_status: "pending",
    special_requirements: "",
    contact_person: "Bác sĩ P",
    contact_phone: "0944123456",
    notes: "",
    manager: "Lê Thị Quỳnh",
    delivery_person: ""
  },
  {
    request_id: 15,
    facility_id: 3,
    facility_name: "BV Nhi Đồng 1",
    blood_group_id: 6,
    blood_group: "B-",
    quantity_requested: 350,
    urgency_level: "critical",
    patient_info: "Nguyễn Văn Q, 10 tuổi, Nam",
    required_by: "2024-07-23T14:00",
    quantity_fulfilled: 0,
    request_status: "pending",
    special_requirements: "",
    contact_person: "Bác sĩ Q",
    contact_phone: "0955123456",
    notes: "",
    manager: "Phạm Văn Sơn",
    delivery_person: ""
  },
  {
    request_id: 16,
    facility_id: 4,
    facility_name: "BV Huyết học",
    blood_group_id: 7,
    blood_group: "AB+",
    quantity_requested: 800,
    urgency_level: "urgent",
    patient_info: "Lê Thị R, 25 tuổi, Nữ",
    required_by: "2024-07-24T15:00",
    quantity_fulfilled: 0,
    request_status: "pending",
    special_requirements: "",
    contact_person: "Bác sĩ R",
    contact_phone: "0966123456",
    notes: "",
    manager: "Nguyễn Văn Tùng",
    delivery_person: ""
  },
  {
    request_id: 17,
    facility_id: 1,
    facility_name: "BV Chợ Rẫy",
    blood_group_id: 8,
    blood_group: "O-",
    quantity_requested: 450,
    urgency_level: "routine",
    patient_info: "Phạm Văn S, 70 tuổi, Nam",
    required_by: "2024-07-25T16:00",
    quantity_fulfilled: 0,
    request_status: "pending",
    special_requirements: "",
    contact_person: "Bác sĩ S",
    contact_phone: "0977123456",
    notes: "",
    manager: "Lê Thị Vân",
    delivery_person: ""
  },
  {
    request_id: 18,
    facility_id: 2,
    facility_name: "BV 115",
    blood_group_id: 9,
    blood_group: "Rh NULL",
    quantity_requested: 1000,
    urgency_level: "emergency",
    patient_info: "Nguyễn Thị T, 18 tuổi, Nữ",
    required_by: "2024-07-26T17:00",
    quantity_fulfilled: 0,
    request_status: "pending",
    special_requirements: "",
    contact_person: "Bác sĩ T",
    contact_phone: "0988123456",
    notes: "",
    manager: "Nguyễn Văn Xuyên",
    delivery_person: ""
  },
  {
    request_id: 19,
    facility_id: 3,
    facility_name: "BV Nhi Đồng 1",
    blood_group_id: 1,
    blood_group: "A+",
    quantity_requested: 550,
    urgency_level: "urgent",
    patient_info: "Lê Văn U, 15 tuổi, Nam",
    required_by: "2024-07-27T18:00",
    quantity_fulfilled: 0,
    request_status: "pending",
    special_requirements: "",
    contact_person: "Bác sĩ U",
    contact_phone: "0999123456",
    notes: "",
    manager: "Trần Thị Yến",
    delivery_person: ""
  },
  {
    request_id: 20,
    facility_id: 4,
    facility_name: "BV Huyết học",
    blood_group_id: 2,
    blood_group: "O-",
    quantity_requested: 600,
    urgency_level: "critical",
    patient_info: "Nguyễn Văn V, 38 tuổi, Nam",
    required_by: "2024-07-28T19:00",
    quantity_fulfilled: 0,
    request_status: "pending",
    special_requirements: "",
    contact_person: "Bác sĩ V",
    contact_phone: "0902123456",
    notes: "",
    manager: "Lê Văn Dũng",
    delivery_person: ""
  }
];

const PAGE_SIZE = 5;

export default function BloodRequestManagement() {
  const [requests, setRequests] = useState(requestDataInit);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  // Filter logic
  const filtered = requests.filter(r => {
    const matchSearch = r.facility_name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "Tất cả" || r.request_status === status;
    return matchSearch && matchStatus;
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  React.useEffect(() => { setPage(1); }, [search, status]);

  // Validation
  const validateRequest = (data) => {
    const errors = {};
    if (!data.facility_name?.trim()) errors.facility_name = "Cơ sở y tế là bắt buộc";
    if (!data.blood_group?.trim()) errors.blood_group = "Nhóm máu là bắt buộc";
    if (!data.quantity_requested?.toString().trim()) errors.quantity_requested = "Số lượng yêu cầu là bắt buộc";
    if (!data.urgency_level?.trim()) errors.urgency_level = "Mức độ khẩn cấp là bắt buộc";
    if (!data.required_by?.trim()) errors.required_by = "Ngày cần là bắt buộc";
    if (!data.contact_person?.trim()) errors.contact_person = "Người liên hệ là bắt buộc";
    if (!data.contact_phone?.trim()) errors.contact_phone = "SĐT liên hệ là bắt buộc";
    if (!data.manager?.trim()) errors.manager = "Người phụ trách là bắt buộc";
    return errors;
  };

  // Edit logic
  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditData({...filtered[idx]});
    setValidationErrors({});
  };
  const handleSaveEdit = () => {
    const errors = validateRequest(editData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    const globalIdx = requests.findIndex(r => r === filtered[editIdx]);
    const newRequests = [...requests];
    newRequests[globalIdx] = editData;
    setRequests(newRequests);
    setEditIdx(null);
    setEditData(null);
    setValidationErrors({});
  };
  const handleCancelEdit = () => {
    setEditIdx(null);
    setEditData(null);
    setValidationErrors({});
  };
  // Delete logic
  const handleDelete = (idx) => { setDeleteIdx(idx); };
  const handleConfirmDelete = () => {
    const globalIdx = requests.findIndex(r => r === filtered[deleteIdx]);
    setRequests(requests.filter((_, i) => i !== globalIdx));
    setDeleteIdx(null);
  };
  const handleCancelDelete = () => { setDeleteIdx(null); };

  // Add logic
  const handleAdd = () => {
    setAddMode(true);
    setEditIdx(null);
    setEditData({
      facility_name: '', blood_group: '', quantity_requested: '', urgency_level: '', patient_info: '', required_by: '', quantity_fulfilled: 0, request_status: 'pending', special_requirements: '', contact_person: '', contact_phone: '', notes: '', manager: '', delivery_person: ''
    });
    setValidationErrors({});
  };
  const handleSaveAdd = () => {
    const errors = validateRequest(editData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setRequests([{ ...editData, request_id: Date.now() }, ...requests]);
    setAddMode(false);
    setEditData(null);
    setValidationErrors({});
  };
  const handleCancelAdd = () => {
    setAddMode(false);
    setEditData(null);
    setValidationErrors({});
  };

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="donor-page-root">
          <h2 className="donor-title">Quản lý đơn yêu cầu máu</h2>
          <div className="donor-toolbar">
            <input className="donor-search" placeholder="🔍 Tìm kiếm cơ sở y tế ..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <select className="donor-filter" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="Tất cả">Tất cả</option>
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
            <button className="donor-filter-btn">⏷</button>
            <button className="donor-export">⭳ Xuất tệp</button>
          </div>
          <div className="donor-table-card">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-center" style={{minWidth: 60}}>Mã</th>
                  <th className="text-center">Cơ sở y tế</th>
                  <th className="text-center">Nhóm máu</th>
                  <th className="text-center">Số lượng (ml)</th>
                  <th className="text-center">Mức độ</th>
                  <th className="text-center">Ngày cần</th>
                  <th className="text-center">Người liên hệ</th>
                  <th className="text-center">SĐT liên hệ</th>
                  <th className="text-center">Người phụ trách</th>
                  <th className="text-center">Người vận chuyển</th>
                  <th className="text-center">Ghi chú</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((r, i) => (
                  <tr key={i}>
                    <td className="text-center">{r.request_id || (i+1+(page-1)*PAGE_SIZE)}</td>
                    <td className="text-center">{r.facility_name}</td>
                    <td className="text-center">{r.blood_group}</td>
                    <td className="text-center">{r.quantity_requested}</td>
                    <td className="text-center">{r.urgency_level}</td>
                    <td className="text-center">{r.required_by?.replace('T', ' ')}</td>
                    <td className="text-center">{r.contact_person}</td>
                    <td className="text-center">{r.contact_phone}</td>
                    <td className="text-center">{r.manager}</td>
                    <td className="text-center">{r.delivery_person}</td>
                    <td className="text-center">{r.notes}</td>
                    <td className="text-center">{r.request_status}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-primary me-1" title="Sửa" onClick={() => handleEdit(i)}><span className="donor-action edit">✏️</span></button>
                      <button className="btn btn-sm btn-outline-danger me-1" title="Xóa" onClick={() => handleDelete(i)}><span className="donor-action delete">🗑️</span></button>
                      {( (r.urgency_level === 'emergency' || r.urgency_level === 'critical') && r.quantity_fulfilled < r.quantity_requested ) && (
                        <button className="btn btn-sm btn-warning" title="Yêu cầu máu khẩn cấp" onClick={() => navigate(`/admin/emergency-donor-matching/${r.request_id}`, { state: { request: r } })}>
                          🚨 Yêu cầu máu khẩn cấp
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center text-secondary">Không có dữ liệu phù hợp</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Popup thêm mới hoặc chỉnh sửa đơn yêu cầu máu */}
          {(addMode || editIdx !== null) && (
            <div className="modal fade show" style={{display:'block',background:'rgba(0,0,0,0.3)'}} tabIndex="-1">
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header" style={{background:'#8fd19e'}}>
                    <h5 className="modal-title">{addMode ? 'Thêm đơn yêu cầu máu' : 'Chỉnh sửa đơn yêu cầu máu'}</h5>
                    <button type="button" className="btn-close" onClick={addMode ? handleCancelAdd : handleCancelEdit}></button>
                  </div>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <select className={`form-control ${validationErrors.facility_name ? 'is-invalid' : ''}`} value={editData.facility_name} onChange={e=>setEditData({...editData,facility_name:e.target.value})}>
                          <option value="">Chọn cơ sở y tế*</option>
                          {facilities.map(f=><option key={f}>{f}</option>)}
                        </select>
                        {validationErrors.facility_name && <div className="invalid-feedback">{validationErrors.facility_name}</div>}
                      </div>
                      <div className="col-md-6">
                        <select className={`form-control ${validationErrors.blood_group ? 'is-invalid' : ''}`} value={editData.blood_group} onChange={e=>setEditData({...editData,blood_group:e.target.value})}>
                          <option value="">Chọn nhóm máu*</option>
                          {bloodGroups.map(bg=><option key={bg}>{bg}</option>)}
                        </select>
                        {validationErrors.blood_group && <div className="invalid-feedback">{validationErrors.blood_group}</div>}
                      </div>
                      <div className="col-md-6">
                        <input className={`form-control ${validationErrors.quantity_requested ? 'is-invalid' : ''}`} placeholder="Số lượng (ml)*" type="number" min={1} value={editData.quantity_requested} onChange={e=>setEditData({...editData,quantity_requested:e.target.value})} />
                        {validationErrors.quantity_requested && <div className="invalid-feedback">{validationErrors.quantity_requested}</div>}
                      </div>
                      <div className="col-md-6">
                        <select className={`form-control ${validationErrors.urgency_level ? 'is-invalid' : ''}`} value={editData.urgency_level} onChange={e=>setEditData({...editData,urgency_level:e.target.value})}>
                          <option value="">Chọn mức độ khẩn cấp*</option>
                          {urgencyLevels.map(u=><option key={u}>{u}</option>)}
                        </select>
                        {validationErrors.urgency_level && <div className="invalid-feedback">{validationErrors.urgency_level}</div>}
                      </div>
                      <div className="col-md-12">
                        <input className={`form-control ${validationErrors.required_by ? 'is-invalid' : ''}`} type="datetime-local" placeholder="Ngày cần*" value={editData.required_by} onChange={e=>setEditData({...editData,required_by:e.target.value})} />
                        {validationErrors.required_by && <div className="invalid-feedback">{validationErrors.required_by}</div>}
                      </div>
                      <div className="col-md-12">
                        <textarea className="form-control" placeholder="Thông tin bệnh nhân" value={editData.patient_info} onChange={e=>setEditData({...editData,patient_info:e.target.value})} rows={2} />
                      </div>
                      <div className="col-md-12">
                        <textarea className="form-control" placeholder="Yêu cầu đặc biệt" value={editData.special_requirements} onChange={e=>setEditData({...editData,special_requirements:e.target.value})} rows={2} />
                      </div>
                      <div className="col-md-6">
                        <input className={`form-control ${validationErrors.contact_person ? 'is-invalid' : ''}`} placeholder="Người liên hệ*" value={editData.contact_person} onChange={e=>setEditData({...editData,contact_person:e.target.value})} />
                        {validationErrors.contact_person && <div className="invalid-feedback">{validationErrors.contact_person}</div>}
                      </div>
                      <div className="col-md-6">
                        <input className={`form-control ${validationErrors.contact_phone ? 'is-invalid' : ''}`} placeholder="SĐT liên hệ*" value={editData.contact_phone} onChange={e=>setEditData({...editData,contact_phone:e.target.value})} />
                        {validationErrors.contact_phone && <div className="invalid-feedback">{validationErrors.contact_phone}</div>}
                      </div>
                      <div className="col-md-6">
                        <input className={`form-control ${validationErrors.manager ? 'is-invalid' : ''}`} placeholder="Người phụ trách*" value={editData.manager} onChange={e=>setEditData({...editData,manager:e.target.value})} />
                        {validationErrors.manager && <div className="invalid-feedback">{validationErrors.manager}</div>}
                      </div>
                      <div className="col-md-6">
                        <input className="form-control" placeholder="Người vận chuyển" value={editData.delivery_person} onChange={e=>setEditData({...editData,delivery_person:e.target.value})} />
                      </div>
                      <div className="col-md-12">
                        <textarea className="form-control" placeholder="Ghi chú" value={editData.notes} onChange={e=>setEditData({...editData,notes:e.target.value})} rows={2} />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-success" onClick={addMode ? handleSaveAdd : handleSaveEdit}>Lưu</button>
                    <button className="btn btn-danger" onClick={addMode ? handleCancelAdd : handleCancelEdit}>Hủy</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Modal xác nhận xóa */}
          {deleteIdx !== null && (
            <div className="modal fade show" style={{display:'block',background:'rgba(0,0,0,0.3)'}} tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Xác nhận xóa</h5>
                  </div>
                  <div className="modal-body">
                    <p>Bạn có chắc muốn xóa đơn yêu cầu máu này không?</p>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-danger" onClick={handleConfirmDelete}>Xóa</button>
                    <button className="btn btn-secondary" onClick={handleCancelDelete}>Hủy</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="donor-pagination">
            <button disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))}>{'⟨'}</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>{'⟩'}</button>
          </div>
        </main>
      </div>
    </div>
  );
} 