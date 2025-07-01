import React from 'react';
import Header from '../../components/user/Header';
import Footer from '../../components/user/Footer';

const newsList = [
  {
    title: 'Ngày hội Hiến máu 2024 diễn ra trên toàn quốc',
    date: '10/06/2024',
    content: 'Chương trình hiến máu lớn nhất năm sẽ được tổ chức tại nhiều tỉnh thành, thu hút hàng nghìn người tham gia.'
  },
  {
    title: 'Câu chuyện người hiến máu cứu sống bệnh nhân hiểm nghèo',
    date: '05/06/2024',
    content: 'Một người hiến máu đã giúp cứu sống bệnh nhân bị tai nạn giao thông nguy kịch tại TP.HCM.'
  },
  {
    title: 'Khuyến khích hiến máu định kỳ – Vì sức khỏe cộng đồng',
    date: '01/06/2024',
    content: 'Các chuyên gia y tế khuyến cáo mọi người nên hiến máu định kỳ để đảm bảo nguồn máu dự trữ.'
  }
];

export default function NewsPage() {
  return (
    <>
      <Header />
      <div style={{ minHeight: '70vh', background: '#f7f7f7', padding: '40px 0' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', borderRadius: 12, padding: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h2 style={{ color: '#229E42', marginBottom: 24 }}>Tin tức hiến máu</h2>
          {newsList.map((news, idx) => (
            <div key={idx} style={{ marginBottom: 32 }}>
              <h3 style={{ color: '#1976d2' }}>{news.title}</h3>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>{news.date}</div>
              <div>{news.content}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
} 