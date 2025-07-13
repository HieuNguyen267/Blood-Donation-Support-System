import React from "react";
import { CheckCircleFilled } from '@ant-design/icons';
import './CertificateBenefits.css';

const benefits = [
  "Ghi nhận cá nhân: Ghi nhận chính thức cho đóng góp nhân đạo của bạn.",
  "Hồ sơ y tế: Theo dõi lịch sử hiến máu cho sức khỏe.",
  "Lợi ích công việc: Một số nơi ưu tiên cho người hiến máu.",
  "Ghi nhận xã hội: Chia sẻ thành tích với gia đình, bạn bè.",
  "Động lực: Khuyến khích tham gia hiến máu nhiều hơn.",
  "Chứng nhận pháp lý: Bằng chứng cho hoạt động cộng đồng tự nguyện."
];

const steps = [
  {
    title: "Hiến máu",
    desc: "Đến các điểm hiến máu được cấp phép."
  },
  {
    title: "Hoàn tất thủ tục",
    desc: "Hoàn thành quy trình và nghỉ ngơi sau hiến máu."
  },
  {
    title: "Yêu cầu giấy chứng nhận",
    desc: "Liên hệ để nhận giấy chứng nhận hiến máu."
  },
  {
    title: "Nhận giấy chứng nhận",
    desc: "Nhận giấy chứng nhận cá nhân của bạn."
  }
];

export function CertificateStepsCard() {
  return (
    <div className="certificate-benefits-wrapper">
      <div className="certificate-benefits-card">
        <h3 style={{ marginTop: 0 }}>Các bước nhận giấy chứng nhận</h3>
        <p>Thực hiện các bước sau để nhận giấy chứng nhận hiến máu của bạn:</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ flex: '1 1 180px', textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#52c41a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 20, margin: '0 auto 8px auto' }}>{i + 1}</div>
              <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 14 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CertificateBenefitsCard() {
  return (
    <div className="certificate-benefits-wrapper">
      <div className="certificate-benefits-card">
        <h3 style={{ marginTop: 0 }}>Lợi ích của Giấy chứng nhận hiến máu</h3>
        <p>Giấy chứng nhận hiến máu mang lại nhiều lợi ích thiết thực:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {benefits.map((b, i) => (
            <div key={i} style={{ flex: '1 1 250px', display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <CheckCircleFilled style={{ color: '#52c41a', marginRight: 8, fontSize: 18 }} />
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 