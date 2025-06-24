import React from 'react';
import MedicalFacilityHeader from '../../../components/user/MedicalFacilityHeader';
import Footer from '../../../components/user/Footer';
import './ContactPage.css'; 

const MedicalFacilityContactPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Cảm ơn bạn đã gửi lời nhắn. Chúng tôi sẽ sớm liên hệ lại với bạn!');
    // Ở đây có thể thêm logic gửi email hoặc lưu vào backend
  };

  return (
    <div className="mf-contact-page">
      <MedicalFacilityHeader />
      <div className="mf-contact-container">
        <div className="mf-contact-info">
          <h2>Thông tin liên hệ</h2>
          <div className="mf-info-item">
            <span role="img" aria-label="email">📧</span>
            <div>
              <h3>Email</h3>
              <p>support.medical@bloodbank.vn</p>
            </div>
          </div>
          <div className="mf-info-item">
            <span role="img" aria-label="phone">📞</span>
            <div>
              <h3>Hotline Hỗ Trợ Cơ Sở Y Tế</h3>
              <p>1900-xxxx (Nhánh 2)</p>
            </div>
          </div>
           <div className="mf-info-item">
            <span role="img" aria-label="address">📍</span>
            <div>
              <h3>Địa chỉ văn phòng</h3>
              <p>123 Đường Sức Khỏe, Quận Y Tế, TP.HCM</p>
            </div>
          </div>
        </div>

        <div className="mf-contact-form">
          <h2>Gửi lời nhắn cho chúng tôi</h2>
          <p>Nếu bạn có bất kì thắc mắc nào, xin hãy điền vào form bên dưới. Đội ngũ hỗ trợ sẽ trả lời bạn trong thời gian sớm nhất.</p>
          <form onSubmit={handleSubmit}>
            <div className="mf-form-group">
              <label htmlFor="facilityName">Tên cơ sở y tế</label>
              <input type="text" id="facilityName" name="facilityName" required />
            </div>
            <div className="mf-form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="mf-form-group">
              <label htmlFor="message">Lời nhắn</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            <button type="submit" className="mf-submit-btn">Gửi lời nhắn</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MedicalFacilityContactPage; 