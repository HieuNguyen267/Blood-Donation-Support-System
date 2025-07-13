import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../../components/user/Footer";
import MedicalFacilityHeader from "../../../components/user/MedicalFacilityHeader";
import "./ReceiveBloodPage.css";
import { bloodGroupAPI, mfBloodRequestAPI } from '../../../services/api';
import { message } from 'antd';

function ReceiveBloodPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contactPerson: '',
    contactPhone: '',
    bloodGroupId: '',
    quantity: '',
    notes: '',
    requireMatching: 'no', // Thêm trường này
  });
  const [bloodGroups, setBloodGroups] = useState([]);

  useEffect(() => {
    async function fetchBloodGroups() {
      try {
        const res = await bloodGroupAPI.getBloodGroups();
        setBloodGroups(res);
      } catch (err) {
        setBloodGroups([]);
      }
    }
    fetchBloodGroups();
  }, []);

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

    try {
      // Lấy facilityId từ userInfo hoặc localStorage
      let userInfo = null;
      try {
        userInfo = JSON.parse(localStorage.getItem('userInfo'));
      } catch {}
      let facilityId = userInfo?.facilityId || localStorage.getItem('facilityId');
      if (!facilityId) {
        alert('Không tìm thấy thông tin cơ sở y tế. Vui lòng đăng nhập lại.');
        return;
      }

      const requestData = {
        facilityId: facilityId, // Long
        bloodGroupId: Number(formData.bloodGroupId),
        quantityRequested: Number(formData.quantity),
        requestStatus: 'PENDING',
        compatibilityRequirement: formData.notes,
        requiredBy: new Date().toISOString(), // Set ngày hiện tại
        // Các trường khác nếu cần: notes, requiredBy, ...
      };

      await mfBloodRequestAPI.createBloodRequest(requestData);
      message.success({
        content: 'Gửi yêu cầu nhận máu thành công! Chúng tôi sẽ liên hệ hỗ trợ sớm nhất.',
        duration: 3,
        style: { marginTop: '60px', fontSize: 18 },
      });
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
      <div style={{ minHeight: 'calc(100vh - 64px - 64px)', display: 'flex', flexDirection: 'column' }}>
        <main className="container receive-blood-container" style={{ flex: 1 }}>
          <div className="receive-blood-form">
        <h2>Nhận máu</h2>
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
                {bloodGroups.map(bg => {
                  let rh = bg.rhFactor === 'positive' ? '+' : (bg.rhFactor === 'negative' ? '-' : '');
                  return (
                    <option key={bg.bloodGroupId} value={bg.bloodGroupId}>
                      {bg.aboType}{rh}
                    </option>
                  );
                })}
            </select>

            <label>Số lượng máu cần (ml)</label>
            <input 
              type="number" 
              name="quantity" 
              placeholder="Nhập số lượng (ml)" 
              value={formData.quantity} 
              onChange={handleChange} 
              required 
              />

              {/* Hộp chọn Yêu cầu tương hợp */}
              <label>Yêu cầu tương hợp</label>
            <select
                name="requireMatching"
                value={formData.requireMatching}
              onChange={handleChange}
              required
            >
                <option value="yes">Có</option>
                <option value="no">Không</option>
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
      </div>
      <Footer />
    </>
  );
}

export default ReceiveBloodPage;