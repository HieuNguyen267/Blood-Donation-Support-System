import React, { useEffect, useState } from "react";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import { Button, Spin } from "antd";
import { Link } from "react-router-dom";
import "./CertificatePage.css";
import { donorAPI } from '../../../services/api';

export default function CertificatePage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    donorAPI.getCertificates()
      .then((certs) => {
        setCertificates(Array.isArray(certs) ? certs : []);
      })
      .catch(() => setCertificates([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 64px - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 16 }}>
        <h2 style={{ textAlign: 'center', margin: '12px 0 18px 0' }}>Chứng nhận Hiến Máu Tình Nguyện</h2>
      {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}><Spin /> Đang tải chứng nhận...</div>
        ) : certificates.length > 0 ? (
          <div className="certificate-list-modern">
            {certificates.map(cert => (
              <div className="certificate-card-modern" key={cert.certificateId}>
                <div className="certificate-card-left">
                  <div className="blood-drop-icon">🩸</div>
                  <div className="certificate-type">Chứng nhận</div>
                </div>
                <div className="certificate-card-main">
                  <div className="certificate-title" style={{fontWeight: 'bold', fontSize: 18}}>
                    Chứng nhận Hiến Máu Tình Nguyện
                  </div>
                  <div className="certificate-info-row">
                    <span className="certificate-info-label">Ngày cấp:</span> <span>{cert.issuedDate}</span>
                  </div>
                  <div className="certificate-info-row">
                    <span className="certificate-info-label">Số lượng máu:</span> <span>{cert.bloodVolume ? cert.bloodVolume + ' ml' : '-'}</span>
                  </div>
                  <div className="certificate-info-row">
                    <span className="certificate-info-label">Ghi chú:</span> <span>{cert.notes || '-'}</span>
                  </div>
                </div>
                <div className="certificate-card-right">
                  <Link to={`/certificate/${cert.certificateId}`} className="details-link">
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
      ) : (
        <div className="certificate-empty">
          Bạn chưa có chứng nhận hiến máu nào.
        </div>
      )}
      </div>
      <Footer />
      <style>{`
        .certificate-list-modern {
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 700px;
          margin: 0;
          align-items: center;
        }
        .certificate-card-modern {
          display: flex;
          align-items: center;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          padding: 20px 28px;
          gap: 18px;
          transition: box-shadow 0.2s;
        }
        .certificate-card-modern:hover {
          box-shadow: 0 4px 16px rgba(76,175,80,0.15);
        }
        .certificate-card-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-right: 12px;
        }
        .blood-drop-icon {
          font-size: 32px;
          margin-bottom: 4px;
        }
        .certificate-type {
          font-size: 13px;
          color: #1890ff;
        }
        .certificate-card-main {
          flex: 1;
        }
        .certificate-title {
          margin-bottom: 6px;
        }
        .certificate-info-row {
          font-size: 15px;
          margin-bottom: 2px;
        }
        .certificate-info-label {
          color: #888;
          margin-right: 4px;
        }
        .certificate-card-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          min-width: 110px;
        }
        .details-link {
          color: #1890ff;
          font-weight: 500;
          text-decoration: none;
          font-size: 15px;
        }
        .details-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}