import React from "react";
import "./ReceiveBloodPage.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";

export default function ReceiveBloodPage() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi dữ liệu ở đây nếu cần
    navigate("/receiveblood-success");
  };

  return (
    <>
      <Header />
      <div className="receive-blood-container">
        <h2>Đăng ký nhận máu</h2>
        <div className="receive-blood-form">
          <p className="form-note">
            Vui lòng điền đầy đủ thông tin để đăng ký nhận máu của cơ sở y tế của bạn <span style={{color: "red"}}>(*)</span>
          </p>
          <form onSubmit={handleSubmit}>
            <label>Tên cơ sở</label>
            <input type="text" placeholder="Nhập tên cơ sở" required />

            <label>Người liên hệ</label>
            <input type="text" placeholder="Nhập tên người liên hệ" required />

            <label>Số điện thoại liên hệ</label>
            <input type="tel" placeholder="Nhập số điện thoại" required />

            <label>Nhóm máu cần</label>
            <select required>
              <option value="">Chọn nhóm máu</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>

            <label>Số lượng máu cần (ml)</label>
            <input type="number" placeholder="Nhập số lượng (ml)" required />

            <label>Ngày cần máu</label>
            <input type="date" required />

            <label>Mục đích sử dụng</label>
            <select required>
              <option value="">Chọn mục đích sử dụng</option>
              <option value="1">Cấp cứu</option>
              <option value="2">Điều trị</option>
              <option value="3">Khác</option>
            </select>

            <label>Ghi chú thêm</label>
            <textarea placeholder="Nhập thông tin bổ sung nếu cần..."></textarea>

            <button type="submit" className="submit-btn">Gửi yêu cầu</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}