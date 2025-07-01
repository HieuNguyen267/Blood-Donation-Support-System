import React, { useEffect, useState, useRef } from "react";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import html2canvas from "html2canvas";
import "./CertificatePage.css";
import { CertificateStepsCard, CertificateBenefitsCard } from "./CertificateBenefits";
import { certificatesAPI } from '../../../services/api';

export default function CertificatePage() {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const certRef = useRef(null);

  useEffect(() => {
    certificatesAPI.getCertificates()
      .then((certs) => {
        if (Array.isArray(certs) && certs.length > 0) {
          setFormData(certs[0]); // Lấy chứng nhận mới nhất
        } else {
          setFormData(null);
        }
      })
      .catch(() => setFormData(null))
      .finally(() => setLoading(false));
  }, []);

  const data = formData;

  const handleDownload = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, { useCORS: true, backgroundColor: '#fff' });
    const link = document.createElement('a');
    link.download = `giay-chung-nhan-hien-mau.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <>
      <Header />
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>Đang tải chứng nhận...</div>
      ) : data ? (
        <>
          <CertificateStepsCard />
          <div className="certificate-coursera-bg">
            <div className="certificate-coursera-card" ref={certRef}>
              <div className="certificate-coursera-center">
                <div className="certificate-coursera-title">GIẤY CHỨNG NHẬN HIẾN MÁU</div>
                <div className="certificate-coursera-label">Chứng nhận này được trao cho</div>
                <div className="certificate-coursera-name">{data.fullName}</div>
                <div className="certificate-coursera-desc">
                  Ghi nhận sự đóng góp quý báu và tự nguyện của bạn cho cộng đồng thông qua hoạt động hiến máu cứu người. Nghĩa cử cao đẹp của bạn đã góp phần mang lại sự sống cho những người cần giúp đỡ.
                </div>
                <div className="certificate-coursera-info">
                  <div><b>Số giấy:</b> {data.certificate_number}</div>
                  <div><b>Nhóm máu:</b> {data.bloodGroup}</div>
                  <div><b>Lượng máu (ml):</b> {data.blood_volume}</div>
                  <div><b>Ngày hiến máu:</b> {data.donation_date}</div>
                  <div><b>Địa điểm:</b> {data.donation_location}</div>
                  <div><b>Ngày cấp:</b> {data.issued_date}</div>
                  <div><b>Cấp bởi:</b> {data.issued_by}</div>
                  <div><b>Mã xác thực:</b> {data.verification_code}</div>
                  <div><b>Ngày tạo:</b> {data.created_at}</div>
                </div>
                <div className="certificate-coursera-notes"><b></b> {data.notes}</div>
                <div className="certificate-coursera-sign">
                  <div className="certificate-coursera-sign-label">Đại diện tổ chức</div>
                  <div className="certificate-coursera-sign-name">{data.issued_by}</div>
                </div>
                <Button type="primary" icon={<DownloadOutlined />} size="large" style={{ marginTop: 24, backgroundColor: '#4CAF50', borderColor: '#4CAF50' }} onClick={handleDownload}>
                  Tải giấy chứng nhận
                </Button>
              </div>
            </div>
          </div>
          <CertificateBenefitsCard />
        </>
      ) : (
        <div className="certificate-empty">
          Bạn chưa có chứng nhận hiến máu nào.
        </div>
      )}
      <Footer />
    </>
  );
}