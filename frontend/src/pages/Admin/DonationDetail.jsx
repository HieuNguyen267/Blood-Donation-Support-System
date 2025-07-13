import React, { useState } from "react";
import './DonationDetail.css';
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import { useParams } from 'react-router-dom';
import { adminDonationRegisterAPI } from '../../services/admin/donationRegister';
import { getStatusStyle } from './utils';

const STATUS_MAPPING = {
  'pending': 'Chờ xác nhận',
  'confirmed': 'Xác nhận',
  'Not meeting health requirements': 'Từ chối'
};

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

// Thêm hàm mapDonationDetail để chuyển đổi dữ liệu API sang format hiển thị
function mapDonationDetail(data) {
  return {
    name: data.fullName || data.donorName || '-',
    donateDate: data.timeSlot || (data.appointmentDate ? new Date(data.appointmentDate).toLocaleString() : '-'),
    completeDate: data.completeDate ? new Date(data.completeDate).toLocaleString() : '-',
    amount: data.quantityMl || data.quantity || data.amount || '-',
    status: STATUS_MAPPING[data.status] || data.status || '-',
    blood: data.bloodGroup || data.blood || '-'
  };
}

export default function DonationDetail() {
  const { id } = useParams();
  // Lấy danh sách đơn hiến từ localStorage nếu có, nếu không thì dùng fallback
  let donations = fallbackDonations;
  try {
    const local = localStorage.getItem('donations');
    if (local) donations = JSON.parse(local);
  } catch {}
  const donation = donations.find(d => d.code === id) || fallbackDonations[0];


  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [currentDonation, setCurrentDonation] = useState(null);
  const [survey, setSurvey] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isStatusUpdated, setIsStatusUpdated] = useState(false);
  // Fetch donation detail from API
  React.useEffect(() => { 
    async function fetchDetail() {
      try {
        const data = await adminDonationRegisterAPI.getDonationRegisterDetailById(id);
        const mappedDonation = mapDonationDetail(data);
        setCurrentDonation(mappedDonation);
        setSurvey(data.preDonationSurvey || null);
        
        // Kiểm tra nếu trạng thái không phải "Chờ xác nhận" thì đã được cập nhật
        if (mappedDonation?.status && mappedDonation.status !== 'Chờ xác nhận') {
          setIsStatusUpdated(true);
          setSelectedStatus(mappedDonation.status);
        } else {
          setIsStatusUpdated(false);
        }
      } catch (e) {
        setCurrentDonation(null);
        setSurvey(null);
    setIsStatusUpdated(false);
      }
    }
    fetchDetail();
  }, [id]);

  // Mapping enum sang tiếng Việt
  const surveyMapping = {
    hasFluFeverCough: {
      khong_co_trieu_chung: 'Không có triệu chứng',
      sot_nhe: 'Sốt nhẹ',
      ho_khan: 'Ho khan',
      sot_cao_ho_nhieu: 'Sốt cao, ho nhiều'
    },
    hasSoreThroat: {
      khong_co: 'Không có',
      dau_nhe: 'Đau nhẹ',
      viem_hong_nang: 'Viêm họng nặng'
    },
    hasDiarrheaDigestiveIssues: {
      khong_co: 'Không có',
      tieu_chay_nhe: 'Tiêu chảy nhẹ',
      roi_loan_tieu_hoa_keo_dai: 'Rối loạn tiêu hóa kéo dài'
    },
    hasHeadacheDizzinessFatigue: {
      khong_co: 'Không có',
      dau_dau_nhe: 'Đau đầu nhẹ',
      chong_mat_met_moi_nhieu: 'Chóng mặt, mệt mỏi nhiều'
    },
    hasAllergicReactions: {
      khong_co: 'Không có',
      di_ung_nhe: 'Dị ứng nhẹ',
      di_ung_nang_phat_ban: 'Dị ứng nặng, phát ban'
    },
    hasInfectionOpenWounds: {
      khong_co: 'Không có',
      vet_thuong_nho_da_lanh: 'Vết thương nhỏ đã lành',
      nhiem_trung_vet_thuong_ho: 'Nhiễm trùng, vết thương hở'
    },
    usesAntibioticsMedication: {
      khong_su_dung_thuoc: 'Không sử dụng thuốc',
      thuoc_cam_cum_thong_thuong: 'Thuốc cảm cúm thông thường',
      khang_sinh_dieu_tri_benh_man_tinh: 'Kháng sinh/thuốc điều trị bệnh mạn tính'
    },
    hasInfectiousDiseaseHistory: {
      khong_co: 'Không có',
      da_dieu_tri_on_dinh: 'Đã điều trị ổn định',
      dang_dieu_tri: 'Đang điều trị'
    },
    hasHypertensionHeartDisease: {
      khong_co: 'Không có',
      huyet_ap_cao_kiem_soat_tot: 'Huyết áp cao kiểm soát tốt',
      huyet_ap_cao_chua_kiem_soat_benh_tim_mach: 'Huyết áp cao chưa kiểm soát/bệnh tim mạch'
    },
    hasDiabetesChronicDiseases: {
      khong_co: 'Không có',
      tieu_duong_kiem_soat_tot: 'Tiểu đường kiểm soát tốt',
      tieu_duong_khong_kiem_soat_benh_man_tinh_khac: 'Tiểu đường không kiểm soát/bệnh mạn tính khác'
    },
    overallEligibility: {
      du_dieu_kien: 'Đủ điều kiện',
      khong_du_dieu_kien: 'Không đủ điều kiện'
    }
  };

  // Xử lý chọn trạng thái
  const handleStatusChange = (status) => {
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
      // Map lại status về giá trị backend mong muốn
      let backendStatus = '';
      if (selectedStatus === 'Xác nhận') backendStatus = 'confirmed';
      else if (selectedStatus === 'Từ chối') backendStatus = 'Not meeting health requirements';
      else backendStatus = 'pending';

      await adminDonationRegisterAPI.updateDonationStatus(id, backendStatus);
      setToast({ show: true, type: 'success', message: `Đã cập nhật trạng thái: ${selectedStatus}` });
      setIsStatusUpdated(true);
      
      // Reload lại chi tiết đơn hiến để lấy dữ liệu mới nhất
      const data = await adminDonationRegisterAPI.getDonationRegisterDetailById(id);
      const mappedDonation = mapDonationDetail(data);
      setCurrentDonation(mappedDonation);
      
      // Đảm bảo selectedStatus được set đúng với trạng thái mới
      setSelectedStatus(mappedDonation.status);
    } catch (e) {
      setToast({ show: true, type: 'error', message: 'Cập nhật trạng thái thất bại!' });
    }
  };

  // Hàm lấy style cho trạng thái
  const getStatusStyle = (status) => {
    const styles = {
      'Xác nhận': { color: '#059669', fontWeight: '600' },
      'Chờ xác nhận': { color: '#f59e0b', fontWeight: '600' },
      'Từ chối': { color: '#dc2626', fontWeight: '600' }
    };
    return styles[status] || { color: '#6b7280', fontWeight: '600' };
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
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="donation-detail-table">
              <div className="donation-detail-section-title">Thông tin đơn hiến</div>
              <table>
                <tbody>
                      <tr><td>Họ và tên :</td><td>{currentDonation?.name}</td></tr>
                      <tr><td>Ngày và giờ hiến :</td><td>{currentDonation?.donateDate}</td></tr>
                      <tr><td>Số lượng (ml) :</td><td>{currentDonation?.amount}</td></tr>
                      <tr><td>Trạng thái :</td><td style={getStatusStyle(currentDonation?.status)}>{currentDonation?.status}</td></tr>
                      <tr><td>Nhóm máu :</td><td>{currentDonation?.blood}</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="donation-detail-table">
                  <div className="donation-detail-section-title">Khảo sát sức khỏe</div>
                  {survey ? (
                    <table>
                      <tbody>
                        <tr><td>Bạn có đang bị cảm, sốt hoặc ho không?</td><td>{surveyMapping.hasFluFeverCough[survey.hasFluFeverCough]}</td></tr>
                        <tr><td>Bạn có đang bị đau họng hoặc viêm họng không?</td><td>{surveyMapping.hasSoreThroat[survey.hasSoreThroat]}</td></tr>
                        <tr><td>Bạn có đang bị tiêu chảy hoặc rối loạn tiêu hóa không?</td><td>{surveyMapping.hasDiarrheaDigestiveIssues[survey.hasDiarrheaDigestiveIssues]}</td></tr>
                        <tr><td>Bạn có đang bị đau đầu, chóng mặt hoặc mệt mỏi bất thường không?</td><td>{surveyMapping.hasHeadacheDizzinessFatigue[survey.hasHeadacheDizzinessFatigue]}</td></tr>
                        <tr><td>Bạn có đang bị dị ứng nghiêm trọng hoặc phát ban không?</td><td>{surveyMapping.hasAllergicReactions[survey.hasAllergicReactions]}</td></tr>
                        <tr><td>Bạn có đang bị nhiễm trùng hoặc vết thương hở không?</td><td>{surveyMapping.hasInfectionOpenWounds[survey.hasInfectionOpenWounds]}</td></tr>
                        <tr><td>Bạn có đang sử dụng thuốc kháng sinh hoặc thuốc điều trị bệnh không?</td><td>{surveyMapping.usesAntibioticsMedication[survey.usesAntibioticsMedication]}</td></tr>
                        <tr><td>Bạn có tiền sử mắc các bệnh truyền nhiễm như viêm gan B, C, HIV không?</td><td>{surveyMapping.hasInfectiousDiseaseHistory[survey.hasInfectiousDiseaseHistory]}</td></tr>
                        <tr><td>Bạn có đang bị cao huyết áp hoặc bệnh tim mạch không?</td><td>{surveyMapping.hasHypertensionHeartDisease[survey.hasHypertensionHeartDisease]}</td></tr>
                        <tr><td>Bạn có đang bị bệnh tiểu đường hoặc các bệnh mãn tính khác không?</td><td>{surveyMapping.hasDiabetesChronicDiseases[survey.hasDiabetesChronicDiseases]}</td></tr>
                        <tr><td>Ghi chú khác:</td><td>{survey.additionalNotes || '-'}</td></tr>
                        {survey.deferralReason && <tr><td>Lý do tạm hoãn:</td><td>{survey.deferralReason}</td></tr>}
                </tbody>
              </table>
                  ) : (
                    <div style={{textAlign: 'center', color: '#888', padding: '16px'}}>Chưa có dữ liệu khảo sát</div>
                  )}
                </div>
            </div>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            {/* Bảng cập nhật trạng thái */}
                <div className="donation-detail-table" style={{ marginTop: 24, maxWidth: 380, width: '100%', marginLeft: 'auto', marginRight: 'auto', padding: '12px 0' }}>
              <div className="donation-detail-section-title">Cập nhật trạng thái đơn hiến</div>
                  <div style={{ padding: '16px' }}>
                <label className="form-label" style={{
                  fontWeight: '500', 
                      marginBottom: '12px',
                  color: '#374151',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  textAlign: 'center',
                  display: 'block'
                }}>
                  Cập nhật trạng thái
                </label>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '18px' }}>
                  {/* Nút Xác nhận */}
                  <div 
                    onClick={() => handleStatusChange('Xác nhận')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                          padding: '8px 12px',
                          borderRadius: '10px',
                      border: selectedStatus === 'Xác nhận' ? '2px solid #059669' : '2px solid #e5e7eb',
                      backgroundColor: selectedStatus === 'Xác nhận' ? '#f0fdf4' : '#ffffff',
                      cursor: isStatusUpdated ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease-in-out',
                          minWidth: '90px',
                          boxShadow: selectedStatus === 'Xác nhận' ? '0 2px 8px rgba(5, 150, 105, 0.10)' : '0 1px 2px rgba(0, 0, 0, 0.03)',
                      userSelect: 'none',
                      opacity: isStatusUpdated && selectedStatus !== 'Xác nhận' ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (selectedStatus !== 'Xác nhận' && !isStatusUpdated) {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.backgroundColor = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedStatus !== 'Xác nhận' && !isStatusUpdated) {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.backgroundColor = '#ffffff';
                      }
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
                  {/* Nút Từ chối */}
                  <div 
                    onClick={() => handleStatusChange('Từ chối')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                          padding: '8px 12px',
                          borderRadius: '10px',
                      border: selectedStatus === 'Từ chối' ? '2px solid #dc2626' : '2px solid #e5e7eb',
                      backgroundColor: selectedStatus === 'Từ chối' ? '#fef2f2' : '#ffffff',
                      cursor: isStatusUpdated ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease-in-out',
                          minWidth: '90px',
                          boxShadow: selectedStatus === 'Từ chối' ? '0 2px 8px rgba(220, 38, 38, 0.10)' : '0 1px 2px rgba(0, 0, 0, 0.03)',
                      userSelect: 'none',
                      opacity: isStatusUpdated && selectedStatus !== 'Từ chối' ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (selectedStatus !== 'Từ chối' && !isStatusUpdated) {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.backgroundColor = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedStatus !== 'Từ chối' && !isStatusUpdated) {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.backgroundColor = '#ffffff';
                      }
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
                </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {!isStatusUpdated ? (
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
                  ) : (
                    <div style={{
                      padding: '14px 32px',
                      borderRadius: '12px',
                      backgroundColor: '#f0f9ff',
                      color: '#0369a1',
                      fontWeight: '600',
                      fontSize: '14px',
                      border: '2px solid #7dd3fc',
                      textAlign: 'center',
                      minWidth: '200px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}>
                      <span>✓</span>
                      <span>Trạng thái đã được cập nhật</span>
                    </div>
                  )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Toast thông báo */}
      {toast.show && (
        <div className={`custom-toast ${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
} 