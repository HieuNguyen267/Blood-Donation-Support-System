import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../../components/user/Footer";
import MedicalFacilityHeader from "../../../components/user/MedicalFacilityHeader";
import "./ReceiveBloodPage.css";

export default function ReceiveBloodPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    facilityName: '',
    contactPerson: '',
    contactPhone: '',
    bloodType: '',
    quantity: '',
    dateNeeded: '',
    purpose: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingRequests = JSON.parse(localStorage.getItem('medicalRequests')) || [];
    const newRequest = { ...formData, id: new Date().getTime(), status: 'Đang chờ xác nhận' };
    const updatedRequests = [...existingRequests, newRequest];
    localStorage.setItem('medicalRequests', JSON.stringify(updatedRequests));
    navigate('/medical-facility/request-history');
  };

  return (
    <>
      <MedicalFacilityHeader />
      <main className="container receive-blood-container">
        <h2>Đăng ký nhận máu</h2>
        <div className="receive-blood-form">
          <p className="form-note">
            Vui lòng điền đầy đủ thông tin để đăng ký nhận máu của cơ sở y tế của bạn <span style={{color: "red"}}>(*)</span>
          </p>
          <form onSubmit={handleSubmit}>
            <label>Tên cơ sở</label>
            <input type="text" name="facilityName" placeholder="Nhập tên cơ sở" value={formData.facilityName} onChange={handleChange} required />

            <label>Người liên hệ</label>
            <input type="text" name="contactPerson" placeholder="Nhập tên người liên hệ" value={formData.contactPerson} onChange={handleChange} required />

            <label>Số điện thoại liên hệ</label>
            <input type="tel" name="contactPhone" placeholder="Nhập số điện thoại" value={formData.contactPhone} onChange={handleChange} required />

            <label>Nhóm máu cần</label>
            <select name="bloodType" value={formData.bloodType} onChange={handleChange} required>
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
            <input type="number" name="quantity" placeholder="Nhập số lượng (ml)" value={formData.quantity} onChange={handleChange} required />

            <label>Ngày cần máu</label>
            <input type="date" name="dateNeeded" value={formData.dateNeeded} onChange={handleChange} required />

            <label>Mục đích sử dụng</label>
            <select name="purpose" value={formData.purpose} onChange={handleChange} required>
              <option value="">Chọn mục đích sử dụng</option>
              <option value="Cấp cứu">Cấp cứu</option>
              <option value="Điều trị">Điều trị</option>
              <option value="Khác">Khác</option>
            </select>

            <label>Ghi chú thêm</label>
            <textarea name="notes" placeholder="Nhập thông tin bổ sung nếu cần..." value={formData.notes} onChange={handleChange}></textarea>

            <button type="submit" className="submit-btn">Gửi yêu cầu</button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}