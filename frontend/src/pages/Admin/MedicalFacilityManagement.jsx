import React, { useState } from "react";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { adminMedicalFacilityAPI } from '../../services/admin/medicalFacility';

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

const sortOptions = [
  { value: '', label: 'Sắp xếp theo...' },
  { value: 'created_at', label: 'Ngày tạo' },
  { value: 'updated_at', label: 'Ngày cập nhật' },
];
const orderOptions = [
  { value: 'desc', label: 'Mới nhất' },
  { value: 'asc', label: 'Cũ nhất' }
];

export default function MedicalFacilityManagement() {
  const [facilities, setFacilities] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter logic
  let filtered = facilities.filter(f => (f.facility_name || '').toLowerCase().includes(search.toLowerCase()));
  if (sortBy === 'created_at') {
    filtered = filtered.sort((a, b) => sortOrder === 'asc' ? new Date(a.created_at) - new Date(b.created_at) : new Date(b.created_at) - new Date(a.created_at));
  }
  if (sortBy === 'updated_at') {
    filtered = filtered.sort((a, b) => sortOrder === 'asc' ? new Date(a.updated_at) - new Date(b.updated_at) : new Date(b.updated_at) - new Date(a.updated_at));
  }
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  React.useEffect(() => {
    adminMedicalFacilityAPI.getAll().then(data => {
      console.log('Raw API data:', data);
      setFacilities(data.map(f => ({
        ...f,
        facility_id: f.facilityId || f.facility_id || '',
        facility_name: f.facilityName || f.facility_name || '',
        license_number: f.licenseNumber || f.license_number || '',
        address: f.address || '',
        phone: f.phone || '',
        email: f.email || '',
        created_at: f.createdAt || f.created_at || '',
        updated_at: f.updatedAt || f.updated_at || '',
      })));
    });
  }, []);
  React.useEffect(() => { setPage(1); }, [search]);

  // Validation
  const validateFacility = (data) => {
    const errors = {};
    if (!data.facility_name?.trim()) errors.facility_name = "Tên cơ sở là bắt buộc";
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
  const handleSaveEdit = async () => {
    const errors = validateFacility(editData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    console.log('Edit data:', editData);
    console.log('Facility ID:', editData.facility_id);
    
    // Tạo data để gửi lên backend (camelCase)
    const dataToSend = {
      facilityName: editData.facility_name,
      licenseNumber: editData.license_number,
      address: editData.address,
      phone: editData.phone,
      email: editData.email
    };
    console.log('Data to send to backend:', dataToSend);
    
    try {
      await adminMedicalFacilityAPI.update(editData.facility_id, dataToSend);
      // Reload list
      const data = await adminMedicalFacilityAPI.getAll();
      setFacilities(data.map(f => ({
        ...f,
        facility_id: f.facilityId || f.facility_id || '',
        facility_name: f.facilityName || f.facility_name || '',
        license_number: f.licenseNumber || f.license_number || '',
        address: f.address || '',
        phone: f.phone || '',
        email: f.email || '',
        created_at: f.createdAt || f.created_at || '',
        updated_at: f.updatedAt || f.updated_at || '',
      })));
      setEditIdx(null);
      setEditData(null);
      setValidationErrors({});
    } catch (err) {
      setValidationErrors({ api: err.message });
    }
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
      license_number: '',
      address: '',
      phone: '',
      email: '',
      created_at: new Date().toISOString().slice(0,16).replace('T',' '),
      updated_at: new Date().toISOString().slice(0,16).replace('T',' '),
    });
    setValidationErrors({});
  };
  const handleSaveAdd = async () => {
    const errors = validateFacility(editData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    // Tạo data để gửi lên backend (camelCase)
    const dataToSend = {
      facilityName: editData.facility_name,
      licenseNumber: editData.license_number,
      address: editData.address,
      phone: editData.phone,
      email: editData.email
    };
    console.log('Data to send to backend (create):', dataToSend);
    
    try {
      await adminMedicalFacilityAPI.create(dataToSend);
      // Reload list
      const data = await adminMedicalFacilityAPI.getAll();
      setFacilities(data.map(f => ({
        ...f,
        facility_id: f.facilityId || f.facility_id || '',
        facility_name: f.facilityName || f.facility_name || '',
        license_number: f.licenseNumber || f.license_number || '',
        address: f.address || '',
        phone: f.phone || '',
        email: f.email || '',
        created_at: f.createdAt || f.created_at || '',
        updated_at: f.updatedAt || f.updated_at || '',
      })));
      setAddMode(false);
      setEditData(null);
      setValidationErrors({});
    } catch (err) {
      setValidationErrors({ api: err.message });
    }
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
            <select className="donor-filter" value={sortBy} onChange={e => { setSortBy(e.target.value); setSortOrder('desc'); }}>
              {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            {sortBy && (
              <select className="donor-filter" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                {orderOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            )}
            <button className="donor-add" onClick={handleAdd}>+ Thêm cơ sở y tế</button>
            <button className="donor-filter-btn">⏷</button>
          </div>
          <div className="donor-table-card">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-center" style={{minWidth: 60}}>Mã</th>
                  <th className="text-center">Tên cơ sở</th>
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
                    <td className="text-center">{f.license_number}</td>
                    <td style={{whiteSpace: 'pre-line', wordBreak: 'break-word', width: `${Math.max(180, (f.address?.length || 0) * 8)}px`}}>{f.address}</td>
                    <td className="text-center">{f.phone}</td>
                    <td style={{whiteSpace: 'pre-line', wordBreak: 'break-word', width: `${Math.max(180, (f.email?.length || 0) * 8)}px`}}>{f.email}</td>
                    <td className="text-center">{f.created_at}</td>
                    <td className="text-center">{f.updated_at}</td>
                    <td className="text-center">
                      <div style={{display: 'flex', gap: '6px', justifyContent: 'center'}}>
                        <button 
                          onClick={() => handleEdit(i)}
                          title="Chỉnh sửa"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#059669',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            boxShadow: '0 1px 3px rgba(5, 150, 105, 0.2)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#047857';
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 2px 6px rgba(5, 150, 105, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#059669';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 1px 3px rgba(5, 150, 105, 0.2)';
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(i)}
                          title="Xóa"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#dc2626',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            boxShadow: '0 1px 3px rgba(220, 38, 38, 0.2)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#b91c1c';
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 2px 6px rgba(220, 38, 38, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#dc2626';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 1px 3px rgba(220, 38, 38, 0.2)';
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
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
                    {validationErrors.api && <div className="text-danger w-100 mt-2">{validationErrors.api}</div>}
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