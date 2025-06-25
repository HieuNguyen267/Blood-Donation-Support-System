import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import StepProgress from "../../../components/user/StepProgress";
import { donorAPI } from "../../../services/api";
import { message } from "antd";
import moment from "moment";
import "./RegisterDonatePage.css";

// Lấy cấu trúc câu hỏi từ trang kiểm tra sức khỏe
const healthQuestions = [
  { label: "Bạn có đang bị cảm, sốt hoặc ho không?", name: "camSotHo", options: [ { label: "Không có triệu chứng", value: "none" }, { label: "Sốt nhẹ", value: "sotnhe" }, { label: "Ho khan", value: "hokhan" }, { label: "Sốt cao, ho nhiều", value: "sotcao" }, ], },
  { label: "Bạn có đang bị đau họng hoặc viêm họng không?", name: "dauHong", options: [ { label: "Không có", value: "none" }, { label: "Đau nhẹ", value: "daunhe" }, { label: "Viêm họng nặng", value: "viemhong" }, ], },
  { label: "Bạn có đang bị tiêu chảy hoặc rối loạn tiêu hóa không?", name: "tieuChay", options: [ { label: "Không có", value: "none" }, { label: "Tiêu chảy nhẹ", value: "tieuchay" }, { label: "Rối loạn tiêu hóa kéo dài", value: "roiloan" }, ], },
  { label: "Bạn có đang bị đau đầu, chóng mặt hoặc mệt mỏi bất thường không?", name: "dauDau", options: [ { label: "Không có", value: "none" }, { label: "Đau đầu nhẹ", value: "daudau" }, { label: "Chóng mặt, mệt mỏi nhiều", value: "chongmat" }, ], },
  { label: "Bạn có đang bị dị ứng nghiêm trọng hoặc phát ban không?", name: "diUng", options: [ { label: "Không có", value: "none" }, { label: "Dị ứng nhẹ", value: "nhe" }, { label: "Dị ứng nặng/phát ban", value: "nang" }, ], },
  { label: "Bạn có đang bị nhiễm trùng hoặc vết thương hở không?", name: "nhiemTrung", options: [ { label: "Không có", value: "none" }, { label: "Vết thương nhỏ đã lành", value: "lanh" }, { label: "Nhiễm trùng/vết thương hở", value: "nhiemtrung" }, ], },
  { label: "Bạn có đang sử dụng thuốc kháng sinh hoặc thuốc điều trị bệnh không?", name: "thuoc", options: [ { label: "Không sử dụng thuốc", value: "none" }, { label: "Thuốc cảm cúm thông thường", value: "camcum" }, { label: "Kháng sinh/điều trị bệnh mãn tính", value: "khangsinh" }, ], },
  { label: "Bạn có tiền sử mắc các bệnh truyền nhiễm như viêm gan B, C, HIV không?", name: "truyenNhiem", options: [ { label: "Không có", value: "none" }, { label: "Đã điều trị ổn định", value: "onDinh" }, { label: "Đang điều trị", value: "dangDieuTri" }, ], },
  { label: "Bạn có đang bị cao huyết áp hoặc bệnh tim mạch không?", name: "huyetAp", options: [ { label: "Không có", value: "none" }, { label: "Huyết áp cao đã kiểm soát", value: "kiemsoat" }, { label: "Huyết áp cao chưa kiểm soát/bệnh tim", value: "caochua" }, ], },
  { label: "Bạn có đang bị bệnh tiểu đường hoặc các bệnh mãn tính khác không?", name: "tieuDuong", options: [ { label: "Không có", value: "none" }, { label: "Tiểu đường kiểm soát tốt", value: "kiemsoat" }, { label: "Tiểu đường không kiểm soát/bệnh mãn tính khác", value: "khongkiemsoat" }, ], },
];

export default function RegisterDonatePage () {
  const [info, setInfo] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [healthAnswers, setHealthAnswers] = useState(null);
  const [latestAppointment, setLatestAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [maxBloodVolume, setMaxBloodVolume] = useState(450);
  const [bookingData, setBookingData] = useState(null);
  const [donationFormData, setDonationFormData] = useState(null);

  useEffect(() => {
    // Không cần loadData nữa vì chúng ta sẽ đọc trực tiếp từ localStorage
    const history = JSON.parse(localStorage.getItem("appointmentHistory")) || [];
    if (history.length > 0) {
      setLatestAppointment(history[0]); // Lấy lịch hẹn mới nhất
    }
    
    // Giữ lại logic load profile nếu cần
    const loadProfile = async () => {
      try {
        const profile = await donorAPI.getProfile();
        setUserInfo(profile);
      } catch (error) {
        console.error('Load profile error:', error);
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
  }, []);

  const renderItem = (value) => value || '-';
  const renderDate = (date) => date ? moment(date).format('DD/MM/YYYY') : '-';
  
  const handleDelete = async () => {
    try {
    // Xóa dữ liệu khảo sát sức khỏe
    localStorage.removeItem("healthCheckAnswers");
    // Xóa lịch hẹn gần nhất
    localStorage.removeItem("appointmentHistory");
    // Xóa phiếu đăng ký tạm (nếu có)
    localStorage.removeItem("donationFormData");
    localStorage.removeItem("bookingFormData");
      
    setHealthAnswers(null);
    setLatestAppointment(null);
    setBookingData(null);
    setDonationFormData(null);
      
      message.success('Đã xóa đơn đăng ký thành công');
      window.location.href = '/registerdonate';
    } catch (error) {
      console.error('Delete error:', error);
      message.error('Xóa đơn đăng ký thất bại');
    }
  }

  const calculateMaxBloodVolume = (weight, gender) => {
    console.log("Tính maxBloodVolume với:", weight, gender);
    if (!weight || !gender) return 450;
    const w = parseFloat(weight);
    if (isNaN(w)) return 450;
    if (gender === "Nam") {
      return Math.min(w * 8, w * 9, 450);
    } else {
      return Math.min(w * 7, w * 9, 450);
    }
  };

  const handleFormChange = (changedValues, allValues) => {
    if ("sendTime" in changedValues) {
      setIsDateSelected(!!changedValues.sendTime);
    }
    if ("weight" in changedValues || "gender" in changedValues) {
      const max = calculateMaxBloodVolume(allValues.weight, allValues.gender);
      setMaxBloodVolume(max);
      // Nếu giá trị hiện tại vượt quá max, reset lại
      if (allValues.sampleQuantity && parseInt(allValues.sampleQuantity) > max) {
        form.setFieldsValue({ sampleQuantity: undefined });
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

      <div className="donate-content">
        <div className="donate-title-main">Thông tin đăng ký hiến máu</div>

        {/* Thêm StepProgress */}
        <div className="step-progress-wrapper" style={{ marginTop: 32, marginBottom: 32 }}>
          <StepProgress />
        </div>

        <div className="donate-mainbox">
          {/* Thông tin cá nhân */}
          <div className="donate-formbox">
            <div className="donate-infocard">
              <div className="donate-infotitle green">Thông tin cá nhân</div>
              <div className="donate-inforow"><label>Họ và tên:</label> <span>{renderItem(userInfo.fullName)}</span></div>
              <div className="donate-inforow"><label>Lần cuối hiến máu:</label> <span>{renderDate(userInfo.lastDonationDate)}</span></div>
              <div className="donate-inforow"><label>Ngày sinh:</label> <span>{renderDate(userInfo.dob)}</span></div>
              <div className="donate-inforow"><label>Giới tính:</label> <span>{renderItem(userInfo.gender)}</span></div>
              <div className="donate-inforow"><label>Nghề nghiệp:</label> <span>{renderItem(userInfo.occupation)}</span></div>
              <div className="donate-inforow"><label>Nhóm máu:</label> <span>{renderItem(userInfo.bloodType)}</span></div>
            </div>

            <div className="donate-infocard">
              <div className="donate-infotitle green">Thông tin liên hệ</div>
              <div className="donate-inforow"><label>Địa chỉ liên hệ:</label> <span>{renderItem(userInfo.address)}</span></div>
              <div className="donate-inforow"><label>Điện thoại di động:</label> <span>{renderItem(userInfo.phone)}</span></div>
              <div className="donate-inforow"><label>Email:</label> <span>{renderItem(userInfo.email)}</span></div>
            </div>
          </div>

          {/* Thông tin đăng ký hiến máu */}
          {(bookingData || latestAppointment || donationFormData) && (
            <div className="donate-phieubox">
              <div className="donate-phieutitle">Thông tin đăng ký hiến máu</div>
              <div className="donate-phieucontent">
                {/* Thông tin từ form đăng ký sẵn sàng hiến máu */}
                {donationFormData && (
                  <div className="donate-appointment-info" style={{marginBottom: 16}}>
                    <div><b>Địa điểm hiến máu:</b> {donationFormData.address || '-'}</div>
                    <div><b>Ngày hiến máu:</b> {donationFormData.sendTime ? moment(donationFormData.sendTime).format('DD/MM/YYYY') : '-'}</div>
                    <div><b>Khung giờ:</b> {donationFormData.donationTimeSlot || '-'}</div>
                    <div><b>Cân nặng:</b> {donationFormData.weight || '-'} kg</div>
                    <div><b>Nhóm máu:</b> {donationFormData.sampleGroup || '-'}</div>
                    <div><b>Lần hiến máu gần nhất:</b> {donationFormData.donateLast ? moment(donationFormData.donateLast).format('DD/MM/YYYY') : '-'}</div>
                    {donationFormData.status && <div><b>Tình trạng sức khỏe:</b> {donationFormData.status}</div>}
                  </div>
                )}

                {/* Thông tin từ form đặt lịch */}
                {bookingData && (
                  <div className="donate-appointment-info" style={{marginBottom: 16}}>
                    <div><b>Địa điểm hiến máu:</b> {bookingData.location || '-'}</div>
                    <div><b>Ngày hiến máu:</b> {bookingData.date ? moment(bookingData.date).format('DD/MM/YYYY') : '-'}</div>
                    <div><b>Nhóm máu:</b> {bookingData.bloodGroup || '-'}</div>
                    <div><b>Khung giờ:</b> {bookingData.timeSlot || '-'}</div>
                    {bookingData.note && <div><b>Ghi chú:</b> {bookingData.note}</div>}
                  </div>
                )}

                {/* Thông tin từ lịch hẹn cũ */}
                {latestAppointment && !bookingData && !donationFormData && (
                  <div className="donate-appointment-info" style={{marginBottom: 16}}>
                    <div><b>Địa điểm hiến máu:</b> {latestAppointment.address || '-'}</div>
                    <div><b>Ngày hiến máu:</b> {latestAppointment.sendDate || '-'}</div>
                    <div><b>Khung giờ:</b> {latestAppointment.donationTimeSlot || '-'}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Phiếu khảo sát sức khỏe */}
          <div className="donate-phieubox">
            <div className="donate-phieutitle">Phiếu khảo sát sức khỏe</div>
            <div className="donate-phieucontent">
              {healthAnswers ? (
                <div className="health-answers-list">
                  {healthQuestions.map((q, index) => {
                    const answerValues = healthAnswers[q.name];
                    const answerLabel = answerValues && answerValues.length > 0
                      ? answerValues.map(val => q.options.find(opt => opt.value === val)?.label || val).join(', ')
                      : "Chưa trả lời";

                    return (
                      <div className="health-answer-item" key={q.name}>
                        <div className="health-question-text">{index + 1}. {q.label}</div>
                        <div className="health-answer-text">▸ {answerLabel}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-content-placeholder">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/685/685352.png"
                    alt="Empty"
                    style={{ width: "80px", marginTop: "10px" }}
                  />
                  <div style={{ marginTop: "10px", fontWeight: "bold" }}>
                    Chưa có thông tin khảo sát sức khỏe
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Nút xóa đơn đăng ký luôn hiển thị nếu có dữ liệu */}
        {(latestAppointment || healthAnswers || bookingData || donationFormData) && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32, marginBottom: 32 }}>
            <button onClick={handleDelete} className="donate-btn delete-btn">
              Xóa đơn đăng ký
            </button>
          </div>
        )}

        {/* Nút đăng ký */}
        {!(bookingData || latestAppointment || healthAnswers || donationFormData) && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
            <button
              style={{ minWidth: 200, fontWeight: 600, fontSize: 16, background: '#52c41a', borderColor: '#52c41a', color: '#fff', boxShadow: '0 2px 6px #0001' }}
              onClick={() => window.location.href = '/registerdonateform'}
            >
              Đăng ký hiến máu
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
