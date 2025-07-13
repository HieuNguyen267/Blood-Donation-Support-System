import React, { useState } from "react";
import './DonationDetail.css';
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import { useParams } from 'react-router-dom';
import { adminDonationRegisterAPI } from '../../services/admin/donationRegister';
import { adminStaffAPI } from '../../services/admin/adminStaff';
import { certificateAPI } from '../../services/api';

const fallbackDonations = [
  { code: "A001", name: "Nguyễn Duy Hiếu", donateDate: "11/4/2024, 09:30", amount: "120 ml", status: "Xác nhận", blood: "Rh NULL", processStatus: "Đang xử lý" },
  { code: "A003", name: "Nguyễn Gia Triệu", donateDate: "4/11/2025, 15:35", amount: "120 ml", status: "Xác nhận", blood: "O+", processStatus: "Hoàn thành" },
  { code: "A004", name: "Đậu Nguyễn Bảo Tuấn", donateDate: "27/5/2025, 10:30", amount: "120 ml", status: "Xác nhận", blood: "AB+", processStatus: "Đang xử lý" },
  { code: "A005", name: "Nguyễn Anh Khoa", donateDate: "27/5/2025, 10:45", amount: "120 ml", status: "Xác nhận", blood: "AB-", processStatus: "Hoàn thành" },
  { code: "A007", name: "Nguyễn Trí Thông", donateDate: "15/4/2024, 08:30", amount: "120 ml", status: "Xác nhận", blood: "B-", processStatus: "Tạm dừng" },
];

// Mapping enum sang tiếng Việt cho khảo sát y tế
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

export default function DonationProcessDetail() {
  const { id } = useParams();
  
  // Lấy danh sách đơn hiến từ localStorage nếu có, nếu không thì dùng fallback
  let donations = fallbackDonations;
  try {
    const local = localStorage.getItem('donations');
    if (local) {
      const allDonations = JSON.parse(local);
      // Chỉ lấy những đơn có trạng thái "Xác nhận"
      donations = allDonations
        .filter(d => d.status === "Xác nhận")
        .map(d => ({
          ...d,
          processStatus: d.processStatus || "Đang xử lý"
        }));
    }
  } catch {}
  
  const donation = donations.find(d => d.code === id) || fallbackDonations[0];

  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(donation);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [currentDonation, setCurrentDonation] = useState(donation);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [isBloodQuantityUpdated, setIsBloodQuantityUpdated] = useState(false);
  const [isStatusUpdated, setIsStatusUpdated] = useState(false);
  const [isHealthInfoUpdated, setIsHealthInfoUpdated] = useState(false);
  const [survey, setSurvey] = useState(null);
  const [certificateNote, setCertificateNote] = useState("");
  const [certificateIssued, setCertificateIssued] = useState(false);
  const [certificateInfo, setCertificateInfo] = useState(null);
  
  // Khi id thay đổi, load dữ liệu từ API
  React.useEffect(() => { 
    const fetchDonationDetail = async () => {
      try {
        const data = await adminDonationRegisterAPI.getDonationRegisterDetailById(id);
        
        // Map dữ liệu API sang format UI
        const mappedDonation = {
          code: id,
          name: data.donorName || '-',
          donateDate: data.timeSlot || (data.appointmentDate ? new Date(data.appointmentDate).toLocaleDateString('vi-VN') : '-'),
          amount: data.quantity ? `${data.quantity} ml` : '-',
          status: data.status === 'confirmed' ? 'Xác nhận' : 
                  data.status === 'pending' ? 'Chờ xác nhận' : 
                  data.status === 'Not meeting health requirements' ? 'Từ chối' : data.status,
          blood: data.bloodGroup || '-',
          healthResult: data.healthCheckResult || '',
          processStatus: data.donationStatus === 'completed' ? 'Hoàn thành' :
                        data.donationStatus === 'deferred' ? 'Tạm dừng' :
                        data.donationStatus === 'processing' ? 'Đang xử lý' : 'Đang xử lý',
          staffNotes: data.staffNotes || '' // Thêm staffNotes từ API
        };
        
        setCurrentDonation(mappedDonation);
        setEditData(mappedDonation);
        
        // Check trạng thái đã cập nhật
        setIsBloodQuantityUpdated(!!data.quantity && data.quantity > 0);
        setIsHealthInfoUpdated(!!data.healthCheckResult);
        setIsStatusUpdated(data.donationStatus === 'completed' || data.donationStatus === 'deferred');
        
        // Lấy khảo sát y tế nếu có
        setSurvey(data.preDonationSurvey || null);
        
      } catch (error) {
        console.error('Error fetching donation detail:', error);
        // Fallback to dummy data
    setEditData(donation); 
    setCurrentDonation(donation);
        setIsBloodQuantityUpdated(false);
        setIsStatusUpdated(false);
        setIsHealthInfoUpdated(false);
        setSurvey(null);
      }
    };
    
    fetchDonationDetail();
    setSelectedStatus('');
  }, [id]);

  // Khi load trang, kiểm tra certificate đã cấp chưa
  React.useEffect(() => {
    const checkCertificate = async () => {
      try {
        const certs = await certificateAPI.getCertificatesByRegisterId(id);
        if (certs && certs.length > 0) {
          setCertificateIssued(true);
          setCertificateInfo(certs[0]);
          console.log('Certificate already issued:', certs[0]);
        } else {
          setCertificateIssued(false);
          setCertificateInfo(null);
          console.log('No certificate found for register:', id);
        }
      } catch (error) {
        console.error('Error checking certificate:', error);
        setCertificateIssued(false);
        setCertificateInfo(null);
      }
    };
    checkCertificate();
  }, [id]);

  // Kiểm tra lại certificate khi trạng thái thay đổi thành "Hoàn thành"
  React.useEffect(() => {
    if (currentDonation.processStatus === "Hoàn thành") {
      const checkCertificate = async () => {
        try {
          const certs = await certificateAPI.getCertificatesByRegisterId(id);
          if (certs && certs.length > 0) {
            setCertificateIssued(true);
            setCertificateInfo(certs[0]);
            console.log('Certificate found after status change:', certs[0]);
          } else {
            setCertificateIssued(false);
            setCertificateInfo(null);
            console.log('No certificate found after status change');
          }
        } catch (error) {
          console.error('Error checking certificate after status change:', error);
          setCertificateIssued(false);
          setCertificateInfo(null);
        }
      };
      checkCertificate();
    }
  }, [currentDonation.processStatus, id]);

  // Validate dữ liệu
  const validate = () => {
    if (!editData.amount) {
      setToast({ show: true, type: 'error', message: 'Vui lòng nhập lượng máu!' });
      return false;
    }
    if (isNaN(parseInt(editData.amount)) || parseInt(editData.amount) <= 0) {
      setToast({ show: true, type: 'error', message: 'Số lượng phải là số dương!' });
      return false;
    }
    return true;
  };

  // Hàm lưu chỉnh sửa thông tin sức khỏe
  const handleSaveHealthInfo = async () => {
    if (!editData.healthResult || !editData.healthResult.trim()) {
      setToast({ show: true, type: 'error', message: 'Vui lòng nhập kết quả kiểm tra sức khỏe!' });
      return;
    }
    
    try {
      // Gọi API để cập nhật health_check_result vào database
      await adminDonationRegisterAPI.updateHealthCheckResult(id, editData.healthResult);
      
      // Cập nhật state local
      const updatedDonation = { ...currentDonation, healthResult: editData.healthResult };
      setCurrentDonation(updatedDonation);
      setIsHealthInfoUpdated(true);
        setToast({ show: true, type: 'success', message: 'Cập nhật thông tin sức khỏe thành công!' });
        setShowEdit(false);
    } catch (error) {
      console.error('Error updating health check result:', error);
      setToast({ show: true, type: 'error', message: 'Có lỗi xảy ra khi cập nhật thông tin sức khỏe!' });
    }
  };

  // Hàm lưu chỉnh sửa lượng máu
  const handleSaveBloodQuantity = async () => {
    if (!validate()) return;
    
    try {
      // Gọi API để cập nhật quantity_ml vào database
      const quantityValue = parseInt(editData.amount.replace(/\D/g, '')); // Lấy số từ string như "120 ml" -> 120
      await adminDonationRegisterAPI.updateBloodQuantity(id, quantityValue);
      
      // Cập nhật state local
      const updatedDonation = { ...currentDonation, amount: editData.amount };
      setCurrentDonation(updatedDonation);
      setIsBloodQuantityUpdated(true);
        setToast({ show: true, type: 'success', message: 'Cập nhật lượng máu thành công!' });
        setShowEdit(false);
    } catch (error) {
      console.error('Error updating blood quantity:', error);
      setToast({ show: true, type: 'error', message: 'Có lỗi xảy ra khi cập nhật lượng máu!' });
    }
  };

  // Cập nhật trạng thái quá trình
  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      setToast({ show: true, type: 'error', message: 'Vui lòng chọn trạng thái!' });
      return;
    }

    // Kiểm tra nếu chọn "Hoàn thành" nhưng chưa cập nhật lượng máu
    if (selectedStatus === 'Hoàn thành' && !isBloodQuantityUpdated) {
      setToast({ show: true, type: 'error', message: 'Vui lòng cập nhật lượng máu trước khi hoàn thành!' });
      return;
    }

    if (selectedStatus === 'Gặp sự cố' && !incidentDescription.trim()) {
      setToast({ show: true, type: 'error', message: 'Vui lòng mô tả sự cố đã gặp!' });
      return;
    }

    try {
      // Lấy thông tin staff hiện tại
      const accountId = localStorage.getItem('accountId');
      let staffId = null;
      
      if (accountId) {
        try {
          const staffInfo = await adminStaffAPI.getByAccountId(accountId);
          console.log('Staff info from API:', staffInfo);
          // Sử dụng staffId từ API response
          if (staffInfo && staffInfo.staffId) {
            staffId = staffInfo.staffId;
            console.log('Using staffId from API:', staffId);
          } else {
            throw new Error('Staff info không hợp lệ');
          }
        } catch (error) {
          console.error('Error getting staff info:', error);
          setToast({ show: true, type: 'error', message: 'Không thể lấy thông tin staff. Vui lòng liên hệ quản trị viên.' });
          return; // Dừng thực hiện nếu không lấy được staff info
        }
      } else {
        console.error('No accountId found in localStorage');
        setToast({ show: true, type: 'error', message: 'Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại.' });
        return; // Dừng thực hiện nếu không có accountId
      }
      
      console.log('Final staffId being sent:', staffId);
      console.log('staffId type:', typeof staffId);
      console.log('staffId value:', staffId);

      // Map UI status sang database status
      let donationStatus = '';
      if (selectedStatus === 'Hoàn thành') donationStatus = 'completed';
      else if (selectedStatus === 'Gặp sự cố') donationStatus = 'deferred';
      else if (selectedStatus === 'Tạm dừng') donationStatus = 'deferred';
      else donationStatus = 'processing';

      // Gọi API để cập nhật donation_status vào database
      console.log('Sending request with staffId:', staffId);
      
      await adminDonationRegisterAPI.updateDonationProcessStatus(
        id, 
        donationStatus, 
        selectedStatus === 'Gặp sự cố' ? incidentDescription : null,
        staffId
      );

      // Cập nhật state local
        const updatedDonation = {
        ...currentDonation,
          processStatus: selectedStatus,
          incidentDescription: selectedStatus === 'Gặp sự cố' ? incidentDescription : undefined
        };
        setCurrentDonation(updatedDonation);
        setToast({ show: true, type: 'success', message: `Đã cập nhật trạng thái: ${selectedStatus}` });
      setIsStatusUpdated(true);
        
        setIncidentDescription('');
        setShowIncidentForm(false);
    } catch (error) {
      console.error('Error updating donation process status:', error);
      let errorMessage = 'Có lỗi xảy ra khi cập nhật trạng thái!';
      
      if (error.message && error.message.includes('Staff ID is required')) {
        errorMessage = 'Không thể xác định thông tin nhân viên. Vui lòng liên hệ quản trị viên.';
      } else if (error.message && error.message.includes('Staff not found')) {
        errorMessage = 'Không tìm thấy thông tin nhân viên. Vui lòng liên hệ quản trị viên.';
      } else if (error.message && error.message.includes('Không tìm thấy thông tin staff')) {
        errorMessage = 'Không tìm thấy thông tin nhân viên. Vui lòng liên hệ quản trị viên.';
      }
      
      setToast({ show: true, type: 'error', message: errorMessage });
    }
  };

  // Xử lý khi chọn trạng thái
  const handleStatusChange = (status) => {
    // Không cho phép thay đổi trạng thái nếu đã cập nhật
    if (isStatusUpdated) {
      return;
    }
    
    // Kiểm tra nếu chọn "Hoàn thành" nhưng chưa cập nhật lượng máu
    if (status === 'Hoàn thành' && !isBloodQuantityUpdated) {
      setToast({ show: true, type: 'warning', message: 'Vui lòng cập nhật lượng máu trước khi chọn hoàn thành!' });
      return;
    }
    
    setSelectedStatus(status);
    if (status === 'Gặp sự cố') {
      setShowIncidentForm(true);
    } else {
      setShowIncidentForm(false);
      setIncidentDescription('');
    }
  };

  // Ẩn toast sau 2.5s
  React.useEffect(() => {
    if (toast.show) {
      const t = setTimeout(() => setToast({ ...toast, show: false }), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const getProcessStatusStyle = (status) => {
    switch(status) {
      case "Đang xử lý": return { color: "#f59e0b", fontWeight: "600" };
      case "Hoàn thành": return { color: "#10b981", fontWeight: "600" };
      case "Gặp sự cố": return { color: "#ef4444", fontWeight: "600" };
      case "Tạm dừng": return { color: "#ef4444", fontWeight: "600" };
      default: return { color: "#6b7280", fontWeight: "600" };
    }
  };

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="donation-detail-root">
          <h2 className="donation-detail-title">Chi tiết quá trình hiến</h2>
          <div className="donation-detail-content" style={{ display: 'flex', flexDirection: 'row', gap: 32, alignItems: 'flex-start', marginLeft: 0 }}>
            {/* Cột trái: Thông tin + Khảo sát */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 480, maxWidth: 520 }}>
              {/* Bảng thông tin đơn hiến */}
              <div className="donation-detail-table">
                <div className="donation-detail-section-title">Thông tin đơn hiến</div>
                <table>
                  <tbody>
                    <tr><td>Họ và tên :</td><td>{currentDonation.name}</td></tr>
                    <tr><td>Ngày và giờ hiến :</td><td>{currentDonation.donateDate}</td></tr>
                    <tr><td>Số lượng (ml) :</td><td>{currentDonation.amount}</td></tr>
                    <tr><td>Trạng thái đơn hiến :</td><td>{currentDonation.status}</td></tr>
                    <tr><td>Trạng thái xử lý :</td><td style={getProcessStatusStyle(currentDonation.processStatus)}>{currentDonation.processStatus}</td></tr>
                    <tr><td>Nhóm máu :</td><td>{currentDonation.blood}</td></tr>
                    <tr><td>Kết quả kiểm tra sức khỏe :</td><td>{currentDonation.healthResult || 'Chưa cập nhật'}</td></tr>
                    <tr><td>Ghi chú của nhân viên :</td><td>{currentDonation.staffNotes || 'Không có ghi chú'}</td></tr>
                  </tbody>
                </table>
                <button 
                  className="btn-edit-info" 
                  style={{
                    marginTop: 24, 
                    width: '100%',
                    opacity: isStatusUpdated ? 0.6 : 1,
                    cursor: isStatusUpdated ? 'not-allowed' : 'pointer'
                  }} 
                  onClick={() => {
                    if (!isStatusUpdated) {
                      setShowEdit(true);
                    }
                  }}
                  disabled={isStatusUpdated}
                >
                  {isHealthInfoUpdated ? '🩸 Cập nhật lượng máu đã hiến' : '🏥 Cập nhật thông tin sức khỏe'}
                </button>
                {isStatusUpdated ? (
                  <div style={{
                    marginTop: 8,
                    padding: '8px 12px',
                    backgroundColor: '#e5e7eb',
                    border: '1px solid #9ca3af',
                    borderRadius: '6px',
                    color: '#6b7280',
                    fontSize: '12px',
                    fontWeight: '500',
                    textAlign: 'center'
                  }}>
                    🔒 Không thể cập nhật lượng máu sau khi đã cập nhật trạng thái
                  </div>
                ) : isBloodQuantityUpdated ? (
                  <div style={{
                    marginTop: 8,
                    padding: '8px 12px',
                    backgroundColor: '#d1fae5',
                    border: '1px solid #059669',
                    borderRadius: '6px',
                    color: '#059669',
                    fontSize: '12px',
                    fontWeight: '500',
                    textAlign: 'center'
                  }}>
                    ✓ Lượng máu đã được cập nhật - Có thể chọn trạng thái hoàn thành
                  </div>
                ) : (
                  <div style={{
                    marginTop: 8,
                    padding: '8px 12px',
                    backgroundColor: '#fef3c7',
                    border: '1px solid #f59e0b',
                    borderRadius: '6px',
                    color: '#92400e',
                    fontSize: '12px',
                    fontWeight: '500',
                    textAlign: 'center'
                  }}>
                    ⚠ Cần cập nhật lượng máu trước khi có thể hoàn thành quá trình
                  </div>
                )}
              </div>

              {/* Bảng khảo sát sức khỏe */}
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

            {/* Cột phải: Bảng cập nhật trạng thái */}
            <div style={{ minWidth: 340, maxWidth: 400, flex: '0 0 360px' }}>
              <div className="donation-detail-table">
                <div className="donation-detail-section-title">Cập nhật trạng thái quá trình</div>
                <div style={{padding: '24px'}}>
                  <div className="row g-4">
                    <div className="col-md-8">
                      <label className="form-label" style={{
                        fontWeight: '500', 
                        marginBottom: '16px', 
                        color: '#374151',
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Cập nhật trạng thái
                      </label>
                      <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
                        {/* Nút Hoàn thành */}
                        <div 
                          onClick={() => handleStatusChange('Hoàn thành')}
                          title={!isBloodQuantityUpdated ? 'Vui lòng cập nhật lượng máu trước khi chọn hoàn thành' : ''}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 20px',
                            borderRadius: '12px',
                            border: selectedStatus === 'Hoàn thành' ? '2px solid #059669' : '2px solid #e5e7eb',
                            backgroundColor: selectedStatus === 'Hoàn thành' ? '#f0fdf4' : '#ffffff',
                            cursor: (isBloodQuantityUpdated && !isStatusUpdated) ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s ease-in-out',
                            minWidth: '140px',
                            boxShadow: selectedStatus === 'Hoàn thành' ? '0 4px 12px rgba(5, 150, 105, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.05)',
                            userSelect: 'none',
                            opacity: (isBloodQuantityUpdated && !isStatusUpdated) ? 1 : (isStatusUpdated && selectedStatus !== 'Hoàn thành' ? 0.5 : 0.6)
                          }}
                          onMouseEnter={(e) => {
                            if (selectedStatus !== 'Hoàn thành' && isBloodQuantityUpdated) {
                              e.target.style.borderColor = '#d1d5db';
                              e.target.style.backgroundColor = '#f9fafb';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedStatus !== 'Hoàn thành' && isBloodQuantityUpdated) {
                              e.target.style.borderColor = '#e5e7eb';
                              e.target.style.backgroundColor = '#ffffff';
                            }
                          }}
                        >
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: selectedStatus === 'Hoàn thành' ? '#059669' : '#e5e7eb',
                            marginRight: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease-in-out'
                          }}>
                            {selectedStatus === 'Hoàn thành' && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                <polyline points="20,6 9,17 4,12"></polyline>
                              </svg>
                            )}
                          </div>
                          <span style={{
                            color: selectedStatus === 'Hoàn thành' ? '#059669' : '#6b7280',
                            fontWeight: '500',
                            fontSize: '14px'
                          }}>
                            Hoàn thành
                          </span>
                        </div>

                        {/* Nút Gặp sự cố */}
                        <div 
                          onClick={() => handleStatusChange('Gặp sự cố')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 20px',
                            borderRadius: '12px',
                            border: selectedStatus === 'Gặp sự cố' ? '2px solid #dc2626' : '2px solid #e5e7eb',
                            backgroundColor: selectedStatus === 'Gặp sự cố' ? '#fef2f2' : '#ffffff',
                            cursor: isStatusUpdated ? 'default' : 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            minWidth: '140px',
                            boxShadow: selectedStatus === 'Gặp sự cố' ? '0 4px 12px rgba(220, 38, 38, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.05)',
                            userSelect: 'none',
                            opacity: isStatusUpdated && selectedStatus !== 'Gặp sự cố' ? 0.5 : 1
                          }}
                          onMouseEnter={(e) => {
                            if (selectedStatus !== 'Gặp sự cố') {
                              e.target.style.borderColor = '#d1d5db';
                              e.target.style.backgroundColor = '#f9fafb';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedStatus !== 'Gặp sự cố') {
                              e.target.style.borderColor = '#e5e7eb';
                              e.target.style.backgroundColor = '#ffffff';
                            }
                          }}
                        >
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: selectedStatus === 'Gặp sự cố' ? '#dc2626' : '#e5e7eb',
                            marginRight: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease-in-out'
                          }}>
                            {selectedStatus === 'Gặp sự cố' && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.694-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                              </svg>
                            )}
                          </div>
                          <span style={{
                            color: selectedStatus === 'Gặp sự cố' ? '#dc2626' : '#6b7280',
                            fontWeight: '500',
                            fontSize: '14px'
                          }}>
                            Gặp sự cố
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4" style={{display: 'flex', alignItems: 'flex-end'}}>
                      {!isStatusUpdated ? (
                        <button 
                          onClick={handleStatusUpdate}
                          disabled={!selectedStatus}
                          style={{
                            width: '100%',
                            padding: '14px 24px',
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
                            letterSpacing: '0.5px'
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
                          width: '100%',
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center',
                          padding: '14px 24px',
                          color: '#059669',
                          fontWeight: '600',
                          fontSize: '14px'
                        }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px'}}>
                            <path d="M20 6L9 17l-5-5"></path>
                          </svg>
                          Trạng thái đã được cập nhật
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Form mô tả sự cố */}
                  {showIncidentForm && (
                    <div style={{marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '8px'}}>
                      <label className="form-label" style={{fontWeight: '600', marginBottom: '8px', color: '#856404'}}>
                        Mô tả sự cố đã gặp: <span style={{color: '#dc3545'}}>*</span>
                      </label>
                      <textarea 
                        className="form-control" 
                        rows="3"
                        placeholder="Vui lòng mô tả chi tiết sự cố đã xảy ra trong quá trình hiến máu..."
                        value={incidentDescription}
                        onChange={(e) => setIncidentDescription(e.target.value)}
                        style={{borderColor: '#ffc107'}}
                      />
                    </div>
                  )}
                  
                  {/* Hiển thị sự cố hiện tại nếu có */}
                  {currentDonation.incidentDescription && (
                    <div style={{marginTop: '20px', padding: '15px', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '8px'}}>
                      <label className="form-label" style={{fontWeight: '600', marginBottom: '8px', color: '#721c24'}}>
                        Sự cố đã ghi nhận:
                      </label>
                      <p style={{margin: 0, color: '#721c24'}}>{currentDonation.incidentDescription}</p>
                    </div>
                  )}

                  {/* Bảng cấp chứng nhận - chỉ hiển thị khi trạng thái là "Hoàn thành" */}
                  {currentDonation.processStatus === "Hoàn thành" && (
                    <div style={{marginTop: '24px'}}>
                      <div className="donation-detail-section-title">Cấp chứng nhận</div>
                      <div style={{padding: '20px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px'}}>
                        {certificateIssued ? (
                          // Hiển thị thông tin chứng nhận đã cấp
                          <div style={{textAlign: 'center'}}>
                            <div style={{
                              width: '60px',
                              height: '60px',
                              borderRadius: '50%',
                              backgroundColor: '#10b981',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto 16px'
                            }}>
                              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            </div>
                            <h5 style={{color: '#059669', marginBottom: '8px', fontWeight: '600'}}>
                              Chứng nhận đã được cấp
                            </h5>
                            <p style={{color: '#6b7280', marginBottom: '16px', fontSize: '14px'}}>
                              Số chứng nhận: <strong>{certificateInfo?.certificateNumber}</strong>
                            </p>
                            <div style={{
                              padding: '12px',
                              backgroundColor: '#ecfdf5',
                              border: '1px solid #d1fae5',
                              borderRadius: '8px',
                              fontSize: '13px',
                              color: '#065f46'
                            }}>
                              <div><strong>Ngày cấp:</strong> {certificateInfo?.issuedDate}</div>
                              <div><strong>Người cấp:</strong> {certificateInfo?.issuedByStaffName}</div>
                              {certificateInfo?.notes && (
                                <div><strong>Ghi chú:</strong> {certificateInfo.notes}</div>
                              )}
                            </div>
                          </div>
                        ) : (
                          // Form cấp chứng nhận
                          <div>
                            <div style={{marginBottom: '16px'}}>
                              <label className="form-label" style={{
                                fontWeight: '600',
                                marginBottom: '8px',
                                color: '#374151',
                                fontSize: '14px'
                              }}>
                                Ghi chú khi cấp chứng nhận: <span style={{color: '#dc3545'}}>*</span>
                              </label>
                              <textarea
                                className="form-control"
                                rows="3"
                                placeholder="Nhập ghi chú khi cấp chứng nhận (bắt buộc)..."
                                value={certificateNote}
                                onChange={(e) => setCertificateNote(e.target.value)}
                                style={{
                                  borderColor: certificateNote ? '#10b981' : '#d1d5db',
                                  borderWidth: '2px',
                                  resize: 'none'
                                }}
                              />
                            </div>
                            <button
                              onClick={async () => {
                                if (!certificateNote.trim()) {
                                  setToast({
                                    show: true,
                                    type: 'error',
                                    message: 'Vui lòng nhập ghi chú khi cấp chứng nhận!'
                                  });
                                  return;
                                }

                                // Lấy thông tin staff hiện tại
                                const accountId = localStorage.getItem('accountId');
                                let staffId = null;
                                
                                if (accountId) {
                                  try {
                                    const staffInfo = await adminStaffAPI.getByAccountId(accountId);
                                    if (staffInfo && staffInfo.staffId) {
                                      staffId = staffInfo.staffId;
                                    } else {
                                      throw new Error('Staff info không hợp lệ');
                                    }
                                  } catch (error) {
                                    console.error('Error getting staff info:', error);
                                    setToast({ 
                                      show: true, 
                                      type: 'error', 
                                      message: 'Không thể lấy thông tin staff. Vui lòng liên hệ quản trị viên.' 
                                    });
                                    return;
                                  }
                                } else {
                                  setToast({ 
                                    show: true, 
                                    type: 'error', 
                                    message: 'Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại.' 
                                  });
                                  return;
                                }

                                try {
                                  const result = await certificateAPI.createCertificateFromRegister(id, staffId, certificateNote);
                                  setCertificateIssued(true);
                                  setCertificateInfo(result);
                                  setToast({
                                    show: true,
                                    type: 'success',
                                    message: 'Cấp chứng nhận thành công!'
                                  });
                                } catch (error) {
                                  let errorMessage = 'Có lỗi xảy ra khi cấp chứng nhận!';
                                  if (error.response?.data?.message) {
                                    errorMessage = error.response.data.message;
                                  } else if (error.message && error.message.includes('Đã cấp chứng nhận')) {
                                    errorMessage = 'Chứng nhận đã được cấp cho quá trình hiến này!';
                                  }
                                  setToast({
                                    show: true,
                                    type: 'error',
                                    message: errorMessage
                                  });
                                }
                              }}
                              disabled={!certificateNote.trim()}
                              style={{
                                width: '100%',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: certificateNote.trim() ? '#10b981' : '#e5e7eb',
                                color: certificateNote.trim() ? '#ffffff' : '#9ca3af',
                                fontWeight: '600',
                                fontSize: '14px',
                                cursor: certificateNote.trim() ? 'pointer' : 'not-allowed',
                                transition: 'all 0.2s ease-in-out'
                              }}
                              onMouseEnter={(e) => {
                                if (certificateNote.trim()) {
                                  e.target.style.backgroundColor = '#059669';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (certificateNote.trim()) {
                                  e.target.style.backgroundColor = '#10b981';
                                }
                              }}
                            >
                              🏆 Cấp chứng nhận
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
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
                <h5 className="modal-title">
                  {isHealthInfoUpdated ? 'Cập nhật lượng máu đã hiến' : 'Cập nhật thông tin sức khỏe'}
                </h5>
                <button type="button" className="btn-close" onClick={()=>setShowEdit(false)}></button>
              </div>
              <div className="modal-body">
                {!isHealthInfoUpdated ? (
                  // Form cập nhật thông tin sức khỏe
                  <div className="row g-3">
                    <div className="col-md-6">
                      <input className="form-control" placeholder="Họ và tên" value={editData.name} disabled style={{backgroundColor: '#f8f9fa'}} />
                    </div>
                    <div className="col-md-6">
                      <input className="form-control" placeholder="Ngày và giờ hiến" value={editData.donateDate} disabled style={{backgroundColor: '#f8f9fa'}} />
                    </div>
                    <div className="col-md-6">
                      <input className="form-control" placeholder="Nhóm máu" value={editData.blood} disabled style={{backgroundColor: '#f8f9fa'}} />
                    </div>
                    <div className="col-md-6">
                      <select className="form-control" value={editData.processStatus} disabled style={{backgroundColor: '#f8f9fa'}}>
                        <option value="Đang xử lý">Đang xử lý</option>
                        <option value="Hoàn thành">Hoàn thành</option>
                        <option value="Tạm dừng">Tạm dừng</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label" style={{fontWeight: '600', marginBottom: '8px', color: '#374151'}}>
                        Kết quả kiểm tra sức khỏe: <span style={{color: '#dc3545'}}>*</span>
                      </label>
                      <textarea 
                        className="form-control" 
                        rows="4"
                        placeholder="Nhập kết quả kiểm tra sức khỏe của người hiến máu..."
                        value={editData.healthResult || ''}
                        onChange={e => setEditData({...editData, healthResult: e.target.value})}
                        style={{borderColor: '#28a745', borderWidth: '2px'}}
                      />
                    </div>
                  </div>
                ) : (
                  // Form cập nhật lượng máu
                  <div className="row g-3">
                    <div className="col-md-6">
                      <input className="form-control" placeholder="Họ và tên" value={editData.name} disabled style={{backgroundColor: '#f8f9fa'}} />
                    </div>
                    <div className="col-md-6">
                      <input className="form-control" placeholder="Ngày và giờ hiến" value={editData.donateDate} disabled style={{backgroundColor: '#f8f9fa'}} />
                    </div>
                    <div className="col-md-6">
                      <input className="form-control" placeholder="Ngày và giờ hoàn thành" value={editData.completeDate} disabled style={{backgroundColor: '#f8f9fa'}} />
                    </div>
                    <div className="col-md-6">
                      <div style={{position: 'relative'}}>
                        <input 
                          className="form-control" 
                          placeholder="Số lượng máu đã hiến*" 
                          type="number" 
                          min="50" 
                          max="500" 
                          value={editData.amount ? editData.amount.replace(' ml', '') : ''} 
                          onChange={e => {
                            const value = e.target.value;
                            setEditData({...editData, amount: value ? `${value} ml` : ''});
                          }} 
                          style={{borderColor: '#28a745', borderWidth: '2px', paddingRight: '40px'}} 
                        />
                        <span style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#6b7280',
                          fontWeight: '500',
                          pointerEvents: 'none'
                        }}>ml</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <input className="form-control" placeholder="Nhóm máu" value={editData.blood} disabled style={{backgroundColor: '#f8f9fa'}} />
                    </div>
                    <div className="col-md-6">
                      <select className="form-control" value={editData.processStatus} disabled style={{backgroundColor: '#f8f9fa'}}>
                        <option value="Đang xử lý">Đang xử lý</option>
                        <option value="Hoàn thành">Hoàn thành</option>
                        <option value="Tạm dừng">Tạm dừng</option>
                      </select>
                    </div>
                  </div>
                )}
                <div className="mt-3">
                  <small className="text-muted">
                    {!isHealthInfoUpdated ? 
                      '* Vui lòng nhập kết quả kiểm tra sức khỏe trước khi cập nhật lượng máu' : 
                      '* Chỉ có thể chỉnh sửa lượng máu đã hiến'
                    }
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={isHealthInfoUpdated ? handleSaveBloodQuantity : handleSaveHealthInfo}>
                  {isHealthInfoUpdated ? 'Cập nhật lượng máu' : 'Cập nhật thông tin sức khỏe'}
                </button>
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