import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./ReceiveBloodSuccess.css";

export default function ReceiveBloodSuccess() {
  return (
    <>
      <Header />
      <div className="receive-blood-success-container">
        <div className="success-icon">✅</div>
        <h2>Gửi yêu cầu thành công!</h2>
        <p>
          Yêu cầu nhận máu của bạn đã được ghi nhận.<br />
          Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.<br />
          Cảm ơn bạn đã sử dụng hệ thống!
        </p>
        <a href="/" className="back-home-btn">Về trang chủ</a>
      </div>
      <Footer />
    </>
  );
} 