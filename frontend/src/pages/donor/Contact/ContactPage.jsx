import React, { useState } from 'react';
import Header from '../../../components/user/Header';
import Footer from '../../../components/user/Footer';
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { message } from 'antd';
import './ContactPage.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({ message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem('email');
    if (formData.message && email) {
      try {
        const res = await fetch('http://localhost:8080/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, message: formData.message })
        });
        const data = await res.json();
        if (res.ok) {
          message.success('Gửi lời nhắn thành công!');
          setFormData({ message: '' });
        } else {
          message.error(data.error || 'Gửi lời nhắn thất bại!');
        }
      } catch {
        message.error('Không thể gửi lời nhắn. Vui lòng thử lại sau.');
      }
    } else {
      message.error('Vui lòng nhập lời nhắn.');
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
            <p>swp391.donateblood@gmail.com</p>
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
            email swp391.donateblood@gmail.com hoặc gửi thông tin cho chúng tôi theo
            mẫu bên dưới
          </p>
          <form onSubmit={handleSubmit}>
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