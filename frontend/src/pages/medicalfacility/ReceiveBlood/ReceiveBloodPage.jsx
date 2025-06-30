import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../../components/user/Footer";
import MedicalFacilityHeader from "../../../components/user/MedicalFacilityHeader";
import "./ReceiveBloodPage.css";
import { bloodRequestAPI } from '../../../services/api';

export default function ReceiveBloodPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contactPerson: '',
    contactPhone: '',
    bloodGroupId: '',
    quantity: '',
    dateNeeded: '',
    notes: '',
    urgencyLevel: 'normal',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Kiểm tra ngày cần máu không được là quá khứ
    const today = new Date();
    today.setHours(0,0,0,0);
    const selectedDate = new Date(formData.dateNeeded);
    if (selectedDate < today) {
      alert('Ngày cần máu không được là quá khứ.');
      setLoading(false);
      return;
    }

    try {
      // Lấy facilityId từ thông tin đăng nhập
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const facilityId = userInfo.facilityId;
      console.log('DEBUG userInfo:', userInfo);
      console.log('DEBUG facilityId:', facilityId);

      if (!facilityId) {
        alert('Không tìm thấy thông tin cơ sở y tế. Vui lòng đăng nhập lại.');
        return;
      }

      const requestData = {
        facilityId: facilityId,
        bloodGroupId: Number(formData.bloodGroupId),
        quantityRequested: Number(formData.quantity),
        requiredBy: formData.dateNeeded ? formData.dateNeeded + 'T00:00:00' : null,
        contactPerson: formData.contactPerson,
        contactPhone: formData.contactPhone,
        notes: formData.notes,
        urgencyLevel: formData.urgencyLevel,
      };

      await bloodRequestAPI.createRequest(requestData);
      alert('Đã gửi yêu cầu nhận máu thành công!');
      navigate('/medical-facility/request-history');
    } catch (err) {
      console.error('Lỗi khi gửi yêu cầu:', err);
      alert('Gửi yêu cầu thất bại: ' + (err.message || 'Lỗi không xác định'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MedicalFacilityHeader />
      <main className="container receive-blood-container">
        <h2>Nhận máu</h2>
        <div className="receive-blood-form">
          <p className="form-note">
            Vui lòng điền đầy đủ thông tin để đăng ký nhận máu của cơ sở y tế của bạn <span style={{color: "red"}}>(*)</span>
          </p>
          <form onSubmit={handleSubmit}>
            <label>Người liên hệ</label>
            <input 
              type="text" 
              name="contactPerson" 
              placeholder="Nhập tên người liên hệ" 
              value={formData.contactPerson} 
              onChange={handleChange} 
              required 
            />

            <label>Số điện thoại liên hệ</label>
            <input 
              type="tel" 
              name="contactPhone" 
              placeholder="Nhập số điện thoại" 
              value={formData.contactPhone} 
              onChange={handleChange} 
              required 
            />

            <label>Nhóm máu cần</label>
            <select 
              name="bloodGroupId" 
              value={formData.bloodGroupId} 
              onChange={handleChange} 
              required
            >
              <option value="">Chọn nhóm máu</option>
              <option value="1">A+</option>
              <option value="2">A-</option>
              <option value="3">B+</option>
              <option value="4">B-</option>
              <option value="5">O+</option>
              <option value="6">O-</option>
              <option value="7">AB+</option>
              <option value="8">AB-</option>
            </select>

            <label>Số lượng máu cần (ml)</label>
            <input 
              type="number" 
              name="quantity" 
              placeholder="Nhập số lượng (ml)" 
              value={formData.quantity} 
              onChange={handleChange} 
              required 
              min={50}
              max={500}
              step={50}
            />

            <label>Ngày cần máu</label>
            <input 
              type="date" 
              name="dateNeeded" 
              value={formData.dateNeeded} 
              onChange={handleChange} 
              required 
              min={new Date().toISOString().split('T')[0]}
            />

            <label>Mức độ khẩn cấp</label>
            <select
              name="urgencyLevel"
              value={formData.urgencyLevel}
              onChange={handleChange}
              required
            >
              <option value="normal">Bình thường</option>
              <option value="urgent">Khẩn cấp</option>
            </select>

            <label>Ghi chú thêm</label>
            <textarea 
              name="notes" 
              placeholder="Nhập thông tin bổ sung nếu cần..." 
              value={formData.notes} 
              onChange={handleChange}
            ></textarea>

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={loading}
            >
              {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}