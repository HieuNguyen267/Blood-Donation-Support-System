import React from "react";
import "./index.css";
import { UserCircle } from "lucide-react";

export default function Header() {
  return (
    <div className="header-wrapper">
      <div className="header-top">
        <div className="logo-title">
          <img src="/blood-icon.png" alt="Logo" className="logo" />
          <span className="title">Hiến máu tình nguyện</span>
        </div>
        <div className="user-section">
          <a href="/login" className="login-link">
            <UserCircle size={20} />
            <span>Đăng nhập</span>
          </a>
        </div>
      </div>
      <nav className="header-nav">
        <a href="/">TRANG CHỦ</a>
        <a href="#">LỊCH HẸN CỦA BẠN</a>
        <a href="#">LỊCH SỬ ĐẶT HẸN</a>
        <a href="#">CHỨNG NHẬN</a>
        <a href="#">HỎI ĐÁP</a>
        <a href="#">TIN TỨC</a>
        <a href="#">LIÊN HỆ</a>
      </nav>
    </div>
  );
}
