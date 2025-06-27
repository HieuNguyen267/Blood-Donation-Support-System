import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import StepProgress from "../../../components/user/StepProgress";
import { donorAPI } from "../../../services/api";
import { message, Form, Input, Button } from "antd";
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
    // Đọc lịch sử đúng key theo email
    const email = localStorage.getItem('email');
    const history = JSON.parse(localStorage.getItem(`appointmentHistory_${email}`)) || [];
    if (history.length > 0) {
      setLatestAppointment(history[0]); // Lấy lịch hẹn mới nhất
    } else {
      setLatestAppointment(null);
    }
    // Giữ lại logic load profile nếu cần
    const loadProfile = async () => {
      try {
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
      } catch (error) {
        console.error('Load profile error:', error?.message || error);
      }
    };
    loadProfile();

    const storedHealthAnswers = localStorage.getItem("healthCheckAnswers");
    if (storedHealthAnswers) {
      setHealthAnswers(JSON.parse(storedHealthAnswers));
    }

    const booking = localStorage.getItem('bookingFormData');
    if (booking) {
      setBookingData(JSON.parse(booking));
    }

    const donationForm = localStorage.getItem('donationFormData');
    if (donationForm) {
      setDonationFormData(JSON.parse(donationForm));
    }

    setLoading(false);
  }, [form]);

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
          {(bookingData || latestAppointment || donationFormData) ? (
            <div className="donate-phieubox">
              <div className="donate-phieutitle">Thông tin đăng ký hiến máu</div>
              <div className="donate-phieucontent">
                {/* Ưu tiên bookingData */}
                {bookingData && (
                  <div className="donate-appointment-info" style={{marginBottom: 16}}>
                    <div><b>Địa điểm hiến máu:</b> {bookingData.address || '-'}</div>
                    <div><b>Khung giờ hiến máu:</b> {bookingData.timeSlot || bookingData.donationTimeSlot || '-'}</div>
                    <div><b>Số lượng máu muốn hiến:</b> {bookingData.quantity ? `${bookingData.quantity} ml` : '-'}</div>
                    {bookingData.note && <div><b>Ghi chú:</b> {bookingData.note}</div>}
                  </div>
                )}
                {/* Nếu không có bookingData thì đến donationFormData */}
                {!bookingData && donationFormData && (
                  <div className="donate-appointment-info" style={{marginBottom: 16}}>
                    <div><b>Địa điểm hiến máu:</b> {donationFormData.address || '-'}</div>
                    {donationFormData.readyTimeRange ? (
                      <div><b>Khoảng thời gian sẵn sàng:</b> {Array.isArray(donationFormData.readyTimeRange) ? donationFormData.readyTimeRange.map(date => moment(date).format('DD/MM/YYYY')).join(' - ') : '-'}</div>
                    ) : (
                      <div><b>Khung giờ hiến máu:</b> {donationFormData.timeSlot || donationFormData.donationTimeSlot || '-'}</div>
                    )}
                    <div><b>Số lượng máu muốn hiến:</b> {donationFormData.quantity ? `${donationFormData.quantity} ml` : '-'}</div>
                  </div>
                )}
                {/* Nếu không có cả hai thì đến latestAppointment */}
                {!bookingData && !donationFormData && latestAppointment && (
                  <div className="donate-appointment-info" style={{marginBottom: 16}}>
                    <div><b>Địa điểm hiến máu:</b> {latestAppointment.address || '-'}</div>
                    <div><b>Khung giờ:</b> {latestAppointment.donationTimeSlot || '-'}</div>
                    <div><b>Số lượng máu muốn hiến:</b> {latestAppointment.quantity ? `${latestAppointment.quantity} ml` : '-'}</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="donate-phieubox">
              <div className="donate-phieutitle">Thông tin đăng ký hiến máu</div>
              <div className="donate-phieucontent">
                <span style={{ color: '#888' }}>Bạn chưa có đơn đăng ký hiến máu nào.</span>
                <div style={{ marginTop: 24 }}>
                  <Button type="primary" className="green-button" onClick={() => navigate('/registerdonateform')}>
                    Đăng ký hiến máu
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Nút xóa đơn đăng ký luôn hiển thị nếu có dữ liệu */}
      {(bookingData || latestAppointment || donationFormData) && (
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