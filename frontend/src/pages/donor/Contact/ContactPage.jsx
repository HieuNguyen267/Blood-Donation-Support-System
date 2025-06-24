import React, { useState } from 'react';
import Header from '../../../components/user/Header';
import Footer from '../../../components/user/Footer';
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { message } from 'antd';
import './ContactPage.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      // Logic gửi form (nếu có) sẽ ở đây
      console.log('Form data submitted:', formData);
      
      message.success('Gửi lời nhắn thành công!');
      setFormData({ name: '', email: '', message: '' }); // Reset form
    } else {
      message.error('Vui lòng điền đầy đủ thông tin.');
    }
  };

  return (
    <div className="contact-page">
      <Header />
      <div className="contact-main-content">
        <div className="contact-info-card">
          <h2>Liên hệ</h2>
          <div className="contact-section">
            <div className="contact-section-header">
              <MailOutlined />
              <h3>Email</h3>
            </div>
            <p>gmv@intelin.vn</p>
          </div>
          <div className="contact-section">
            <div className="contact-section-header">
              <PhoneOutlined />
              <h3>Hotline</h3>
            </div>
            <div className="hotline-item">
              <span>TT Hiến Máu Nhân Đạo:</span>
              <span className="hotline-number">0282938287<br/>0286276354</span>
            </div>
            <div className="hotline-item">
              <span>Bệnh viện BTH:</span>
              <span className="hotline-number">0282938287<br/>0286276354</span>
            </div>
            <div className="hotline-item">
              <span>TT Truyền máu Chợ Rẫy:</span>
              <span className="hotline-number">0282938287<br/>0286276354</span>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>Gửi lời nhắn cho chúng tôi</h2>
          <p>
            Nếu bạn có bất kì thắc mắc nào liên quan đến các hoạt động
            hiến máu tình nguyện xin liên hệ với chúng tôi qua địa chỉ
            email gmv@intelin.vn hoặc gửi thông tin cho chúng tôi theo
            mẫu bên dưới
          </p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Họ và tên:</label>
            <input type="text" id="name" value={formData.name} onChange={handleChange} required />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={formData.email} onChange={handleChange} required />

            <label htmlFor="message">Lời nhắn:</label>
            <textarea id="message" rows="4" value={formData.message} onChange={handleChange} required></textarea>

            <button type="submit" className="submit-message-btn">Gửi lời nhắn</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
} 