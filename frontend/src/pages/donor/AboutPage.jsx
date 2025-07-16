import React from 'react';
import Header from '../../components/user/Header';
import Footer from '../../components/user/Footer';
import DonorNotificationBell from '../../components/user/DonorNotificationBell';

export default function AboutPage() {
  return (
    <>
      <Header />
      <DonorNotificationBell />
      <div style={{ minHeight: '70vh', background: '#f7f7f7', padding: '40px 0' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h2 style={{ color: '#229E42', marginBottom: 24 }}>Giới thiệu về hệ thống hiến máu</h2>
          <p>
            Hệ thống Quản lý Hiến máu tình nguyện giúp kết nối người hiến máu, các cơ sở y tế và cộng đồng, tạo nên mạng lưới hỗ trợ cứu người hiệu quả, minh bạch và hiện đại.<br/><br/>
            <b>Mục tiêu:</b> Đơn giản hóa quy trình đăng ký, tiếp nhận và quản lý hiến máu.<br/>
            <b>Sứ mệnh:</b> Đem lại sự thuận tiện, an toàn cho người hiến máu và hỗ trợ kịp thời cho người cần máu.<br/>
            <b>Ý nghĩa:</b> Mỗi giọt máu cho đi, một cuộc đời ở lại. Hãy cùng chung tay vì cộng đồng khỏe mạnh hơn!
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
} 