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
  const [lastDonationDate, setLastDonationDate] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    donorAPI.getProfile().then((profile) => {
      setUserInfo(profile);
      console.log("userInfo:", profile);
      if (profile.donorId) {
        donorAPI.getLatestSurvey(profile.donorId)
          .then((latestSurvey) => {
            if (latestSurvey) {
              setHealthAnswers(latestSurvey);
              localStorage.setItem('healthCheckAnswers', JSON.stringify(latestSurvey));
            }
          })
          .catch(() => {});
      }
    });

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

    setLoading(false);
  }, []);

  const renderItem = (value) => value || '-';
  const renderDate = (date) => date ? moment(date).format('DD/MM/YYYY') : '-';
  
  const handleDelete = async () => {
    const email = localStorage.getItem('email');
    let registerId = null;
    if (bookingData && bookingData.registerId) registerId = bookingData.registerId;
    else if (latestAppointment && latestAppointment.registerId) registerId = latestAppointment.registerId;
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

  // Hàm lấy ngày hẹn hiến máu ưu tiên từ localStorage
  const getAppointmentDate = () => {
    return (
      latestAppointment?.sendDate ||
      latestAppointment?.appointment_date ||
      donationFormData?.appointment_date ||
      bookingData?.appointment_date ||
      donationFormData?.sendDate ||
      bookingData?.sendDate ||
      null
    );
  };
  // Hàm lấy khung giờ hiến máu ưu tiên từ localStorage
  const getTimeSlot = () => {
    return (
      latestAppointment?.donationTimeSlot ||
      latestAppointment?.timeSlot ||
      donationFormData?.donationTimeSlot ||
      bookingData?.donationTimeSlot ||
      donationFormData?.timeSlot ||
      bookingData?.timeSlot ||
      null
    );
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
              <div className="donate-inforow"><label>Giới tính:</label> <span>{renderItem(userInfo.gender)}</span></div>
              <div className="donate-inforow"><label>Nghề nghiệp:</label> <span>{renderItem(userInfo.job)}</span></div>
              <div className="donate-inforow"><label>Nhóm máu:</label> <span>{renderItem(userInfo.bloodGroup)}</span></div>
            </div>

            <div className="donate-infocard">
              <div className="donate-infotitle green">Thông tin liên hệ</div>
              <div className="donate-inforow"><label>Địa chỉ:</label> <span>{renderItem(userInfo.address)}</span></div>
              <div className="donate-inforow"><label>Điện thoại:</label> <span>{renderItem(userInfo.phone)}</span></div>
              <div className="donate-inforow"><label>Email:</label> <span>{renderItem(userInfo.email)}</span></div>
            </div>
          </div>

          {/* Thông tin đăng ký hiến máu */}
          {latestAppointment ? (
            <div className="donate-phieubox">
              <div className="donate-phieutitle">Thông tin đăng ký hiến máu</div>
              <div className="donate-phieucontent">
                <div className="donate-appointment-info" style={{marginBottom: 16}}>
                  <div><b>Địa điểm hiến máu:</b> 466 Nguyễn Thị Minh Khai Phường 02, Quận 3, Tp Hồ Chí Minh</div>
                  <div><b>Ngày hẹn hiến máu:</b> {renderDate(getAppointmentDate())}</div>
                  <div><b>Khung giờ hiến máu:</b> {renderItem(getTimeSlot())}</div>
                </div>
              </div>
            </div>
          ) : healthAnswers ? (
            <div className="donate-phieubox">
              <div className="donate-phieutitle">Kết quả khảo sát sức khỏe</div>
              <div className="donate-phieucontent">
                <div className="donate-survey-info">
                  <div style={{marginBottom: 16}}>
                    <b>Trạng thái:</b> {healthAnswers.overallEligibility === 'du_dieu_kien' ? 
                      <span style={{color: 'green'}}>Đủ điều kiện hiến máu</span> : 
                      <span style={{color: 'red'}}>Không đủ điều kiện hiến máu</span>
                    }
                  </div>
                  {healthAnswers.deferralReason && (
                    <div style={{marginBottom: 16}}>
                      <b>Lý do từ chối:</b> <span style={{color: 'red'}}>{healthAnswers.deferralReason}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="donate-phieubox">
              <div className="donate-phieutitle">Bạn chưa thực hiện khảo sát sức khỏe</div>
            </div>
          )}

          {/* Kết quả khảo sát sức khỏe */}
          {healthAnswers && (
            <div className="donate-phieubox" style={{ minWidth: 320, marginLeft: 24 }}>
              <div className="donate-phieutitle">Chi tiết khảo sát sức khỏe</div>
              <div className="donate-phieucontent">
                <ul style={{ paddingLeft: 16, listStyleType: 'none' }}>
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
      <Footer />
    </div>
  );
}