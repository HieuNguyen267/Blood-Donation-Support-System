import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import StepProgress from "../../components/StepProgress";
import "./RegisterDonatePage.css";

export default function RegisterDonatePage() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const formData = localStorage.getItem("donationFormData");
    if (formData) {
      const parsedData = JSON.parse(formData);
      setInfo(parsedData);

      // ✅ Xoá sau khi load để không hiển thị nữa khi vào lại
      localStorage.removeItem("donationFormData");
    }
  }, []);

  return (
    <div className="donate-bg">
      <Header />

      <div className="donate-content">
        <div className="donate-title-main">Thông tin đăng ký hiến máu</div>

        <div className="step-progress-wrapper" style={{ marginBottom: "40px" }}>
          <StepProgress currentStep={0} />
        </div>

        <div className="donate-mainbox">
          {/* Thông tin cá nhân */}
          <div className="donate-formbox">
            <div className="donate-infocard">
              <div className="donate-infotitle green">Thông tin cá nhân</div>
              {["Họ và tên", "Số CMND", "Số hộ chiếu", "Ngày sinh", "Giới tính", "Nghề nghiệp", "Đơn vị", "Nhóm máu"].map((label, index) => (
                <div className="donate-inforow" key={index}>
                  <label>{label}:</label>
                  <div className="donate-placeholder" />
                </div>
              ))}
            </div>

            <div className="donate-infocard">
              <div className="donate-infotitle green">Thông tin liên hệ</div>
              {["Địa chỉ liên hệ", "Điện thoại di động", "Điện thoại bàn", "Email"].map((label, index) => (
                <div className="donate-inforow" key={index}>
                  <label>{label}:</label>
                  <div className="donate-placeholder" />
                </div>
              ))}
            </div>
          </div>

          {/* Phiếu đăng ký */}
          <div className="donate-phieubox">
            <div className="donate-phieutitle">Phiếu đăng ký hiến máu</div>
            <div className="donate-phieucontent">
              {info ? (
                <div className="donate-phieuinfo">
                  <p><strong>Họ tên:</strong> {info.fullName}</p>
                  <p><strong>SĐT:</strong> {info.phone}</p>
                  <p><strong>Email:</strong> {info.email}</p>
                  <p><strong>Nhóm máu:</strong> {info.sampleGroup}</p>
                  <p><strong>Lượng máu muốn hiến:</strong> {info.sampleQuantity} ml</p>
                  <p><strong>Lần hiến máu gần nhất:</strong> {info.donateLast}</p>
                  <p><strong>Thời điểm sẵn sàng:</strong> {info.sendTime}</p>
                  <p><strong>Tình trạng sức khỏe:</strong> {info.status}</p>
                </div>
              ) : (
                <>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/685/685352.png"
                    alt="Empty"
                    style={{ width: "80px", marginTop: "10px" }}
                  />
                  <div style={{ marginTop: "10px", fontWeight: "bold" }}>
                    Chưa có phiếu đăng ký hiến máu
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Nút đăng ký */}
        <div className="donate-btn-wrap">
          <Link to="/registerdonateform">
            <button className="donate-btn">Đăng ký hiến máu</button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
