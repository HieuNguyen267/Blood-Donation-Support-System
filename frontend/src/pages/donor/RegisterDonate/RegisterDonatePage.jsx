import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import StepProgress from "../../../components/user/StepProgress";
import { donorAPI } from "../../../services/api";
import { message, Form, Input, Button, DatePicker } from "antd";
import moment from "moment";
import "./RegisterDonatePage.css";

export default function RegisterDonatePage () {
  const [userInfo, setUserInfo] = useState({});
  const [healthAnswers, setHealthAnswers] = useState(null);
  const [latestAppointment, setLatestAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState(null);
  const [donationFormData, setDonationFormData] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Lấy thông tin profile
        const profile = await donorAPI.getProfile();
        setUserInfo(profile);
        console.log("userInfo:", profile);
        form.setFieldsValue({
          fullName: profile.fullName,
          gender: profile.gender,
          phone: profile.phone,
          email: profile.email,
          bloodGroup: profile.bloodGroup,
        });

        // Lấy thông tin đăng ký hiến máu và khảo sát sức khỏe từ API mới
        const registrationInfo = await donorAPI.getDonationRegistrationInfo();
        console.log("Registration info:", registrationInfo);

        if (registrationInfo.latestRegister) {
          setLatestAppointment(registrationInfo.latestRegister);
        }

        if (registrationInfo.latestSurvey) {
          setHealthAnswers(registrationInfo.latestSurvey);
          localStorage.setItem('healthCheckAnswers', JSON.stringify(registrationInfo.latestSurvey));
        }

      } catch (error) {
        console.error('Load data error:', error?.message || error);
        
        // Fallback: lấy từ localStorage nếu API lỗi
        const booking = localStorage.getItem('bookingFormData');
        if (booking) {
          setBookingData(JSON.parse(booking));
        }

        const donationForm = localStorage.getItem('donationFormData');
        if (donationForm) {
          setDonationFormData(JSON.parse(donationForm));
        }

        // Lấy lịch sử từ backend
        donorAPI.getDonationHistory()
          .then((history) => {
            if (Array.isArray(history) && history.length > 0) {
              // Ưu tiên đơn active hoặc mới nhất
              const active = history.find(item => item.status === 'active') || history[0];
              setLatestAppointment(active);
            } else {
              // Nếu không có từ backend, lấy từ localStorage
              const email = localStorage.getItem('email');
              const localHistory = JSON.parse(localStorage.getItem(`appointmentHistory_${email}`) || '[]');
              if (Array.isArray(localHistory) && localHistory.length > 0) {
                setLatestAppointment(localHistory[0]);
              } else {
                setLatestAppointment(null);
              }
            }
          })
          .catch(() => {
            // Nếu lỗi backend, fallback localStorage
            const email = localStorage.getItem('email');
            const localHistory = JSON.parse(localStorage.getItem(`appointmentHistory_${email}`) || '[]');
            if (Array.isArray(localHistory) && localHistory.length > 0) {
              setLatestAppointment(localHistory[0]);
            } else {
              setLatestAppointment(null);
            }
          });
      }

      setLoading(false);
    };
    loadData();
  }, [form]);

  const renderItem = (value) => value || '-';
  const renderDate = (date) => date ? moment(date).format('DD/MM/YYYY') : '-';
  
  const handleDelete = async () => {
    const email = localStorage.getItem('email');
    let registerId = null;
    if (latestAppointment && latestAppointment.registerId) registerId = latestAppointment.registerId;
    else if (bookingData && bookingData.registerId) registerId = bookingData.registerId;
    else if (donationFormData && donationFormData.registerId) registerId = donationFormData.registerId;
    if (!registerId) {
      message.error('Không tìm thấy mã đơn đăng ký để xóa trên hệ thống!');
      return;
    }
    try {
      await donorAPI.deleteDonationRegister(registerId);
      // Nếu backend trả về 200 hoặc message "Xóa thành công" thì luôn báo thành công
      localStorage.removeItem(`appointmentHistory_${email}`);
      localStorage.removeItem("healthCheckAnswers");
      localStorage.removeItem("donationFormData");
      localStorage.removeItem("bookingFormData");
      setHealthAnswers(null);
      setLatestAppointment(null);
      setBookingData(null);
      setDonationFormData(null);
      message.success('Đã xóa đơn đăng ký khỏi hệ thống');
      navigate('/registerdonate');
    } catch (err) {
      if (err.message && (err.message.includes('403') || err.message.includes('404'))) {
        localStorage.removeItem(`appointmentHistory_${email}`);
        localStorage.removeItem("healthCheckAnswers");
        localStorage.removeItem("donationFormData");
        localStorage.removeItem("bookingFormData");
        setHealthAnswers(null);
        setLatestAppointment(null);
        setBookingData(null);
        setDonationFormData(null);
        message.success('Đã xóa đơn đăng ký khỏi hệ thống');
        navigate('/registerdonate');
      } else {
        message.error('Xóa đơn đăng ký thất bại!');
      }
    }
  };

  // Hàm lấy ngày hẹn hiến máu ưu tiên từ database
  const getAppointmentDate = () => {
    return (
      latestAppointment?.appointmentDate ||
      latestAppointment?.sendDate ||
      donationFormData?.appointment_date ||
      bookingData?.appointment_date ||
      donationFormData?.sendDate ||
      bookingData?.sendDate ||
      null
    );
  };

  // Hàm lấy khung giờ hiến máu từ database
  const getTimeSlot = () => {
    return (
      latestAppointment?.timeSlot ||
      latestAppointment?.donationTimeSlot ||
      donationFormData?.donationTimeSlot ||
      bookingData?.donationTimeSlot ||
      donationFormData?.timeSlot ||
      bookingData?.timeSlot ||
      null
    );
  };

  // Hàm format thời gian hiến máu
  const formatAppointmentTime = () => {
    const date = getAppointmentDate();
    const timeSlot = getTimeSlot();
    
    if (!date) return '-';
    
    const formattedDate = moment(date).format('DD/MM/YYYY');
    
    if (timeSlot) {
      return `${formattedDate}, ${timeSlot}`;
    }
    
    return formattedDate;
  };

  // Hàm hiển thị trạng thái khảo sát sức khỏe
  const getHealthCheckStatus = () => {
    if (!healthAnswers) return null;
    
    // Kiểm tra các điều kiện để xác định trạng thái
    const hasSymptoms = 
      healthAnswers.hasFluFeverCough !== 'khong_co_trieu_chung' ||
      healthAnswers.hasSoreThroat !== 'khong_co' ||
      healthAnswers.hasDiarrheaDigestiveIssues !== 'khong_co' ||
      healthAnswers.hasHeadacheDizzinessFatigue !== 'khong_co' ||
      healthAnswers.hasAllergicReactions !== 'khong_co' ||
      healthAnswers.hasInfectionOpenWounds !== 'khong_co' ||
      healthAnswers.usesAntibioticsMedication !== 'khong_su_dung_thuoc' ||
      healthAnswers.hasInfectiousDiseaseHistory !== 'khong_co' ||
      healthAnswers.hasHypertensionHeartDisease !== 'khong_co' ||
      healthAnswers.hasDiabetesChronicDiseases !== 'khong_co';
    
    return hasSymptoms ? 'Không đủ điều kiện hiến máu' : 'Đủ điều kiện hiến máu';
  };

  // Hàm hiển thị lý do từ chối
  const getDeferralReason = () => {
    if (!healthAnswers) return null;
    
    const reasons = [];
    
    if (healthAnswers.hasFluFeverCough !== 'khong_co_trieu_chung') {
      reasons.push('Có triệu chứng cảm cúm, sốt, ho');
    }
    if (healthAnswers.hasSoreThroat !== 'khong_co') {
      reasons.push('Có đau họng');
    }
    if (healthAnswers.hasDiarrheaDigestiveIssues !== 'khong_co') {
      reasons.push('Có vấn đề tiêu hóa');
    }
    if (healthAnswers.hasHeadacheDizzinessFatigue !== 'khong_co') {
      reasons.push('Có đau đầu, chóng mặt, mệt mỏi');
    }
    if (healthAnswers.hasAllergicReactions !== 'khong_co') {
      reasons.push('Có dị ứng');
    }
    if (healthAnswers.hasInfectionOpenWounds !== 'khong_co') {
      reasons.push('Có vết thương hở');
    }
    if (healthAnswers.usesAntibioticsMedication !== 'khong_su_dung_thuoc') {
      reasons.push('Đang sử dụng thuốc');
    }
    if (healthAnswers.hasInfectiousDiseaseHistory !== 'khong_co') {
      reasons.push('Có tiền sử bệnh truyền nhiễm');
    }
    if (healthAnswers.hasHypertensionHeartDisease !== 'khong_co') {
      reasons.push('Có bệnh huyết áp cao/tim mạch');
    }
    if (healthAnswers.hasDiabetesChronicDiseases !== 'khong_co') {
      reasons.push('Có bệnh tiểu đường/bệnh mãn tính');
    }
    
    return reasons.length > 0 ? reasons.join(', ') : null;
  };

  // Hàm hiển thị giới tính tiếng Việt
  const renderGender = (gender) => {
    if (!gender) return '-';
    if (gender.toLowerCase() === 'male') return 'Nam';
    if (gender.toLowerCase() === 'female') return 'Nữ';
    return gender;
  };

  // Hàm hiển thị nhóm máu đúng chuẩn ABO+/-
  const renderBloodGroup = (userInfo) => {
    if (!userInfo || !userInfo.bloodGroup) return '-';
    // Nếu đã đúng định dạng A+, B-, ... thì trả về luôn
    if (/^(A|B|AB|O|Rh_Null|Bombay)[+-]$/.test(userInfo.bloodGroup)) return userInfo.bloodGroup;
    // Nếu có abo_type và rh_factor thì ghép lại
    if (userInfo.aboType && userInfo.rhFactor) {
      let rh = userInfo.rhFactor.toLowerCase() === 'positive' ? '+' : userInfo.rhFactor.toLowerCase() === 'negative' ? '-' : '';
      return userInfo.aboType + rh;
    }
    // Nếu bloodGroup là Apositive, Bnegative... thì tách
    const match = userInfo.bloodGroup.match(/^(A|B|AB|O)(positive|negative)$/i);
    if (match) {
      let rh = match[2].toLowerCase() === 'positive' ? '+' : match[2].toLowerCase() === 'negative' ? '-' : '';
      return match[1].toUpperCase() + rh;
    }
    return userInfo.bloodGroup;
  };

  // Hàm hiển thị trạng thái tiếng Việt
  const renderStatus = (status, donationStatus) => {
    if (status === 'confirmed') {
      // Ưu tiên hiển thị trạng thái donation_status nếu đã xác nhận
      if (donationStatus === 'processing') return 'Đang chờ hiến';
      if (donationStatus === 'deferred') return 'Tạm hoãn';
      if (donationStatus === 'completed') return 'Thành công';
      return 'Đã được xác nhận';
    }
    if (status === 'pending') return 'Chờ xác nhận';
    if (status === 'Not meeting health requirements') return 'Không đủ điều kiện hiến máu';
    if (status === 'confirmed') return 'Đã được xác nhận';
    return status;
  };

  // Hàm lấy class màu cho trạng thái
  const getStatusClass = (status) => {
    if (!status) return 'status-gray';
    const s = status.toLowerCase();
    if (s === 'chờ xác nhận') return 'status-orange';
    if (s === 'chờ liên hệ') return 'status-orange';
    if (s === 'đang liên hệ') return 'status-blue';
    if (s === 'liên hệ thành công' || s === 'hoàn thành' || s === 'đã được xác nhận' || s === 'thành công') return 'status-green';
    if (s === 'từ chối') return 'status-red';
    if (s === 'không đủ điều kiện hiến máu') return 'status-red';
    if (s === 'đang chờ hiến') return 'status-blue';
    if (s === 'tạm hoãn') return 'status-orange';
    return 'status-gray';
  };

  // Hàm hủy sẵn sàng hiến máu
  const handleCancelReady = async () => {
    try {
      await donorAPI.updateProfile({
        isEligible: false,
        availableFrom: null,
        availableUntil: null
      });
      message.success('Đã hủy trạng thái sẵn sàng hiến máu!');
      setLoading(true);
      // Reload lại thông tin
      const profile = await donorAPI.getProfile();
      setUserInfo(profile);
      setLoading(false);
    } catch (err) {
      message.error('Hủy trạng thái sẵn sàng hiến máu thất bại!');
    }
  };

  if (loading) {
    return (
      <div className="donate-bg">
        <Header />
        <div className="donate-content">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            Đang tải thông tin...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  console.log('latestAppointment', latestAppointment);

  return (
    <div className="donate-bg">
      <Header />
      {/* Chỉ hiển thị StepProgress nếu đã có healthAnswers */}
      {healthAnswers && (
        <div className="step-progress-wrapper" style={{ marginTop: 32, marginBottom: 32 }}>
          <StepProgress currentStep={3} />
        </div>
      )}

      <div className="donate-content">
        <div className="donate-title-main">Thông tin đăng ký hiến máu</div>

        <div className="donate-mainbox">
          {/* Thông tin cá nhân */}
          <div className="donate-formbox">
            <div className="donate-infocard">
              <div className="donate-infotitle green">Thông tin cá nhân</div>
              <div className="donate-inforow"><label>Họ và tên:</label> <span>{renderItem(userInfo.fullName)}</span></div>
              <div className="donate-inforow"><label>Ngày sinh:</label> <span>{renderDate(userInfo.dateOfBirth)}</span></div>
              <div className="donate-inforow"><label>Giới tính:</label> <span>{renderGender(userInfo.gender)}</span></div>
              <div className="donate-inforow"><label>Nghề nghiệp:</label> <span>{renderItem(userInfo.job)}</span></div>
              <div className="donate-inforow"><label>Nhóm máu:</label> <span>{renderBloodGroup(userInfo)}</span></div>
              <div className="donate-inforow"><label>Cân nặng:</label> <span>{renderItem(userInfo.weight)} kg</span></div>
            </div>

            <div className="donate-infocard">
              <div className="donate-infotitle green">Thông tin liên hệ</div>
              <div className="donate-inforow"><label>Địa chỉ:</label> <span>{renderItem(userInfo.address)}</span></div>
              <div className="donate-inforow"><label>Điện thoại:</label> <span>{renderItem(userInfo.phone)}</span></div>
              <div className="donate-inforow"><label>Email:</label> <span>{renderItem(userInfo.email)}</span></div>
              <div className="donate-inforow"><label>Sẵn sàng hiến máu:</label> <span>{userInfo.isEligible ? 'Có' : 'Không'}</span></div>
              <div className="donate-inforow"><label>Thời gian sẵn sàng:</label> <span>{userInfo.availableFrom && userInfo.availableUntil ? `${moment(userInfo.availableFrom).format('DD/MM/YYYY')} - ${moment(userInfo.availableUntil).format('DD/MM/YYYY')}` : '-'}</span></div>
            </div>
          </div>

          {/* Thông tin đăng ký hiến máu */}
          {latestAppointment ? (
            <div className="donate-phieubox" style={{ textAlign: 'left' }}>
              <div className="donate-phieutitle">Thông tin đăng ký hiến máu</div>
              <div className="donate-phieucontent" style={{ textAlign: 'left' }}>
                <div className="donate-appointment-info" style={{marginBottom: 16, textAlign: 'left'}}>
                  <div><b>Địa điểm hiến máu:</b> 466 Nguyễn Thị Minh Khai Phường 02, Quận 3, Tp Hồ Chí Minh</div>
                  <div><b>Ngày giờ hiến máu:</b> {formatAppointmentTime()}</div>
                  <div><b>Kiểm tra sức khỏe:</b> {renderItem(latestAppointment.healthCheckResult)}</div>
                  <div><b>Lượng máu đã hiến:</b> {latestAppointment.quantityMl ? `${latestAppointment.quantityMl} ml` : '-'}</div>
                  <div><b>Trạng thái:</b> <span className={getStatusClass(renderStatus(latestAppointment.status, latestAppointment.donationStatus))}>{renderStatus(latestAppointment.status, latestAppointment.donationStatus)}</span></div>
                  {latestAppointment.staffNotes && (
                    <div><b>Ghi chú của nhân viên:</b> {renderItem(latestAppointment.staffNotes)}</div>
                  )}
                </div>
              </div>
            </div>
          ) : healthAnswers ? (
            <div className="donate-phieubox" style={{ textAlign: 'left' }}>
              <div className="donate-phieutitle">Kết quả khảo sát sức khỏe</div>
              <div className="donate-phieucontent" style={{ textAlign: 'left' }}>
                <div className="donate-survey-info" style={{ textAlign: 'left' }}>
                  <div style={{marginBottom: 16}}>
                    <b>Trạng thái:</b> {getHealthCheckStatus() === 'Đủ điều kiện hiến máu' ? 
                      <span style={{color: 'green'}}>Đủ điều kiện hiến máu</span> : 
                      <span style={{color: 'red'}}>Không đủ điều kiện hiến máu</span>
                    }
                  </div>
                  {getDeferralReason() && (
                    <div style={{marginBottom: 16}}>
                      <b>Lý do từ chối:</b> <span style={{color: 'red'}}>{getDeferralReason()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="donate-phieubox" style={{ textAlign: 'left' }}>
              <div className="donate-phieutitle">Bạn chưa thực hiện khảo sát sức khỏe</div>
            </div>
          )}

          {/* Chi tiết khảo sát sức khỏe */}
          {healthAnswers && (
            <div className="donate-phieubox" style={{ minWidth: 320, marginLeft: 24, textAlign: 'left' }}>
              <div className="donate-phieutitle">Chi tiết khảo sát sức khỏe</div>
              <div className="donate-phieucontent" style={{ textAlign: 'left' }}>
                <ul style={{ paddingLeft: 16, listStyleType: 'none', textAlign: 'left' }}>
                  <li style={{ marginBottom: 8 }}><b>Cảm cúm, sốt, ho:</b> {healthAnswers.hasFluFeverCough === 'khong_co_trieu_chung' ? 'Không có triệu chứng' : 'Có triệu chứng'}</li>
                  <li style={{ marginBottom: 8 }}><b>Đau họng:</b> {healthAnswers.hasSoreThroat === 'khong_co' ? 'Không' : 'Có'}</li>
                  <li style={{ marginBottom: 8 }}><b>Vấn đề tiêu hóa:</b> {healthAnswers.hasDiarrheaDigestiveIssues === 'khong_co' ? 'Không' : 'Có'}</li>
                  <li style={{ marginBottom: 8 }}><b>Đau đầu, chóng mặt:</b> {healthAnswers.hasHeadacheDizzinessFatigue === 'khong_co' ? 'Không' : 'Có'}</li>
                  <li style={{ marginBottom: 8 }}><b>Dị ứng:</b> {healthAnswers.hasAllergicReactions === 'khong_co' ? 'Không' : 'Có'}</li>
                  <li style={{ marginBottom: 8 }}><b>Vết thương hở:</b> {healthAnswers.hasInfectionOpenWounds === 'khong_co' ? 'Không' : 'Có'}</li>
                  <li style={{ marginBottom: 8 }}><b>Đang dùng kháng sinh:</b> {healthAnswers.usesAntibioticsMedication === 'khong_su_dung_thuoc' ? 'Không sử dụng thuốc' : 'Có sử dụng thuốc'}</li>
                  <li style={{ marginBottom: 8 }}><b>Tiền sử bệnh truyền nhiễm:</b> {healthAnswers.hasInfectiousDiseaseHistory === 'khong_co' ? 'Không' : 'Có'}</li>
                  <li style={{ marginBottom: 8 }}><b>Huyết áp cao/Tim mạch:</b> {healthAnswers.hasHypertensionHeartDisease === 'khong_co' ? 'Không' : 'Có'}</li>
                  <li style={{ marginBottom: 8 }}><b>Tiểu đường/Bệnh mãn tính:</b> {healthAnswers.hasDiabetesChronicDiseases === 'khong_co' ? 'Không' : 'Có'}</li>
                  {healthAnswers.additionalNotes && (
                    <li style={{ marginBottom: 8 }}><b>Ghi chú thêm:</b> {healthAnswers.additionalNotes}</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nút đăng ký hiến máu chỉ hiển thị khi chưa có đơn đăng ký */}
      {!latestAppointment && (
        <div className="center-btn">
          <Button type="primary" className="green-button" style={{ minWidth: 240, fontWeight: 600, fontSize: 18 }} onClick={() => navigate('/booking-antd')}>
            Đăng ký hiến máu
          </Button>
        </div>
      )}

      {/* Nút xóa đơn đăng ký luôn hiển thị nếu có dữ liệu */}
      {latestAppointment && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32, marginBottom: 32 }}>
          <button onClick={handleDelete} className="donate-btn delete-btn">
            Xóa đơn đăng ký
          </button>
        </div>
      )}
      {/* Nút hủy sẵn sàng hiến máu */}
      {userInfo.isEligible && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 0, marginBottom: 32 }}>
          <Button danger type="primary" onClick={handleCancelReady} style={{ minWidth: 240, fontWeight: 600, fontSize: 18 }}>
            Hủy sẵn sàng hiến máu
          </Button>
        </div>
      )}
      <Footer />
    </div>
  );
}