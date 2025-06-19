import React, { useState } from "react";
import Header from "../../Component/Admin/Header";
import Sidebar from "../../Component/Admin/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';

const facilitiesDataInit = [
  { facility_id: 1, account_id: 101, facility_name: "BV Chợ Rẫy", facility_type: "hospital", license_number: "CR123456", address: "201B Nguyễn Chí Thanh, Q.5, TP.HCM", phone: "02838554137", email: "info@choray.vn", created_at: "2024-01-01 08:00", updated_at: "2024-01-01 08:00" },
  { facility_id: 2, account_id: 102, facility_name: "BV 115", facility_type: "hospital", license_number: "BV115789", address: "527 Sư Vạn Hạnh, Q.10, TP.HCM", phone: "02838653232", email: "contact@bv115.vn", created_at: "2024-01-02 09:00", updated_at: "2024-01-02 09:00" },
  { facility_id: 3, account_id: 103, facility_name: "Trung tâm cấp cứu 115", facility_type: "emergency_center", license_number: "CC115001", address: "35 Trần Hưng Đạo, Q.1, TP.HCM", phone: "02838200315", email: "cc115@hcm.vn", created_at: "2024-01-03 10:00", updated_at: "2024-01-03 10:00" },
  { facility_id: 4, account_id: 104, facility_name: "Ngân hàng máu HCM", facility_type: "blood_bank", license_number: "NBM2024", address: "118 Hồng Bàng, Q.5, TP.HCM", phone: "02839557979", email: "bloodbank@hcm.vn", created_at: "2024-01-04 11:00", updated_at: "2024-01-04 11:00" },
];

const facilityTypes = [
  { value: "hospital", label: "Bệnh viện" },
  { value: "clinic", label: "Phòng khám" },
  { value: "emergency_center", label: "Trung tâm cấp cứu" },
  { value: "blood_bank", label: "Ngân hàng máu" },
];

const PAGE_SIZE = 8;

export default function MedicalFacilityManagement() {
  const [facilities, setFacilities] = useState(facilitiesDataInit);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Filter logic
  const filtered = facilities.filter(f => f.facility_name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  React.useEffect(() => { setPage(1); }, [search]);

  // Validation
  const validateFacility = (data) => {
    const errors = {};
    if (!data.facility_name?.trim()) errors.facility_name = "Tên cơ sở là bắt buộc";
    if (!data.facility_type?.trim()) errors.facility_type = "Loại cơ sở là bắt buộc";
    if (!data.license_number?.trim()) errors.license_number = "Số giấy phép là bắt buộc";
    if (!data.address?.trim()) errors.address = "Địa chỉ là bắt buộc";
    if (!data.phone?.trim()) errors.phone = "Số điện thoại là bắt buộc";
    return errors;
  };

  // Edit logic
  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditData({...filtered[idx]});
    setValidationErrors({});
  };
  const handleSaveEdit = () => {
    const errors = validateFacility(editData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    const globalIdx = facilities.findIndex(f => f === filtered[editIdx]);
    const newFacilities = [...facilities];
    newFacilities[globalIdx] = editData;
    setFacilities(newFacilities);
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
    const globalIdx = facilities.findIndex(f => f === filtered[deleteIdx]);
    setFacilities(facilities.filter((_, i) => i !== globalIdx));
    setDeleteIdx(null);
  };
  const handleCancelDelete = () => { setDeleteIdx(null); };

  // Add logic
  const handleAdd = () => {
    setAddMode(true);
    setEditIdx(null);
    setEditData({
      facility_id: Date.now(),
      account_id: '',
      facility_name: '',
      facility_type: '',
      license_number: '',
      address: '',
      phone: '',
      email: '',
      created_at: new Date().toISOString().slice(0,16).replace('T',' '),
      updated_at: new Date().toISOString().slice(0,16).replace('T',' '),
    });
    setValidationErrors({});
  };
  const handleSaveAdd = () => {
    const errors = validateFacility(editData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setFacilities([{ ...editData, facility_id: Date.now() }, ...facilities]);
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
          <h2 className="donor-title">Quản lý cơ sở y tế</h2>
          <div className="donor-toolbar">
            <input className="donor-search" placeholder="🔍 Tìm kiếm tên cơ sở ..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <button className="donor-add" onClick={handleAdd}>+ Thêm cơ sở y tế</button>
            <button className="donor-filter-btn">⏷</button>
          </div>
          <div className="donor-table-card">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-center" style={{minWidth: 60}}>Mã</th>
                  <th className="text-center">Tên cơ sở</th>
                  <th className="text-center">Loại</th>
                  <th className="text-center">Số giấy phép</th>
                  <th className="text-center">Địa chỉ</th>
                  <th className="text-center">Số điện thoại</th>
                  <th className="text-center">Email</th>
                  <th className="text-center">Ngày tạo</th>
                  <th className="text-center">Ngày cập nhật</th>
                  <th className="text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((f, i) => (
                  <tr key={i}>
                    <td className="text-center">{f.facility_id || (i+1+(page-1)*PAGE_SIZE)}</td>
                    <td className="text-truncate" style={{maxWidth: 180}}>{f.facility_name}</td>
                    <td className="text-center">{facilityTypes.find(t=>t.value===f.facility_type)?.label || f.facility_type}</td>
                    <td className="text-center">{f.license_number}</td>
                    <td className="text-truncate" style={{maxWidth: 200}}>{f.address}</td>
                    <td className="text-center">{f.phone}</td>
                    <td className="text-center">{f.email}</td>
                    <td className="text-center">{f.created_at}</td>
                    <td className="text-center">{f.updated_at}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-primary me-1" title="Sửa" onClick={() => handleEdit(i)}><span className="donor-action edit">✏️</span></button>
                      <button className="btn btn-sm btn-outline-danger" title="Xóa" onClick={() => handleDelete(i)}><span className="donor-action delete">🗑️</span></button>
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center text-secondary">Không có dữ liệu phù hợp</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Popup thêm mới hoặc chỉnh sửa cơ sở y tế */}
          {(addMode || editIdx !== null) && (
            <div className="modal fade show" style={{display:'block',background:'rgba(0,0,0,0.3)'}} tabIndex="-1">
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header" style={{background:'#8fd19e'}}>
                    <h5 className="modal-title">{addMode ? 'Thêm cơ sở y tế' : 'Chỉnh sửa cơ sở y tế'}</h5>
                    <button type="button" className="btn-close" onClick={addMode ? handleCancelAdd : handleCancelEdit}></button>
                  </div>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <input className={`form-control ${validationErrors.facility_name ? 'is-invalid' : ''}`} placeholder="Tên cơ sở*" value={editData.facility_name} onChange={e=>setEditData({...editData,facility_name:e.target.value})} />
                        {validationErrors.facility_name && <div className="invalid-feedback">{validationErrors.facility_name}</div>}
                      </div>
                      <div className="col-md-6">
                        <select className={`form-control ${validationErrors.facility_type ? 'is-invalid' : ''}`} value={editData.facility_type} onChange={e=>setEditData({...editData,facility_type:e.target.value})}>
                          <option value="">Chọn loại cơ sở*</option>
                          {facilityTypes.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                        {validationErrors.facility_type && <div className="invalid-feedback">{validationErrors.facility_type}</div>}
                      </div>
                      <div className="col-md-6">
                        <input className={`form-control ${validationErrors.license_number ? 'is-invalid' : ''}`} placeholder="Số giấy phép*" value={editData.license_number} onChange={e=>setEditData({...editData,license_number:e.target.value})} />
                        {validationErrors.license_number && <div className="invalid-feedback">{validationErrors.license_number}</div>}
                      </div>
                      <div className="col-md-6">
                        <input className={`form-control ${validationErrors.address ? 'is-invalid' : ''}`} placeholder="Địa chỉ*" value={editData.address} onChange={e=>setEditData({...editData,address:e.target.value})} />
                        {validationErrors.address && <div className="invalid-feedback">{validationErrors.address}</div>}
                      </div>
                      <div className="col-md-6">
                        <input className={`form-control ${validationErrors.phone ? 'is-invalid' : ''}`} placeholder="Số điện thoại*" value={editData.phone} onChange={e=>setEditData({...editData,phone:e.target.value})} />
                        {validationErrors.phone && <div className="invalid-feedback">{validationErrors.phone}</div>}
                      </div>
                      <div className="col-md-6">
                        <input className="form-control" placeholder="Email" value={editData.email} onChange={e=>setEditData({...editData,email:e.target.value})} />
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
                    <p>Bạn có chắc muốn xóa cơ sở y tế này không?</p>
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