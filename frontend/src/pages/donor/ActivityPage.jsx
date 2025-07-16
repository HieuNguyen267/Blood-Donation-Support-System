import React from 'react';
import Header from '../../components/user/Header';
import Footer from '../../components/user/Footer';
import DonorNotificationBell from '../../components/user/DonorNotificationBell';

const activities = [
  'Tổ chức Ngày hội Hiến máu tại các trường đại học, khu công nghiệp',
  'Phối hợp cùng bệnh viện tổ chức tiếp nhận máu lưu động',
  'Tư vấn, hỗ trợ người hiến máu qua tổng đài và email',
  'Tuyên truyền, nâng cao nhận thức về hiến máu tình nguyện',
  'Vinh danh người hiến máu tiêu biểu hằng năm'
];

export default function ActivityPage() {
  return (
    <>
      <Header />
      <DonorNotificationBell />
      <div style={{ minHeight: '70vh', background: '#f7f7f7', padding: '40px 0' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h2 style={{ color: '#229E42', marginBottom: 24 }}>Các hoạt động nổi bật</h2>
          <ul style={{ fontSize: 16, lineHeight: 2 }}>
            {activities.map((act, idx) => (
              <li key={idx}>{act}</li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
} 