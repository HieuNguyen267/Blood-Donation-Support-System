import React, { useEffect, useState, useRef } from "react";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import { Button, Spin } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";
import { donorAPI } from '../../../services/api';

export default function CertificateDetail() {
  const { certificateId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const certRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    donorAPI.getCertificateDetail(certificateId)
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [certificateId]);

  const handleDownload = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, { useCORS: true, backgroundColor: '#fff' });
    const link = document.createElement('a');
    link.download = `chung-nhan-hien-mau-${data?.certificateNumber || ''}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <>
      <Header />
      <div style={{ minHeight: 'calc(100vh - 64px - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f7fafc' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}><Spin /> Đang tải chi tiết chứng nhận...</div>
        ) : data ? (
          <div
            ref={certRef}
            style={{
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 4px 24px rgba(76,175,80,0.08)",
              maxWidth: 650,
              width: "100%",
              margin: "32px 0 24px 0",
              padding: "36px 36px 28px 36px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <div style={{ color: "#e53935", fontWeight: 700, fontSize: 28, letterSpacing: 1, marginBottom: 6, textAlign: "center" }}>
              CHỨNG NHẬN HIẾN MÁU TÌNH NGUYỆN
            </div>
            <div style={{ color: "#4caf50", fontWeight: 500, fontSize: 16, marginBottom: 18, letterSpacing: 1 }}>
              Chứng nhận
            </div>
            <div style={{ fontWeight: 600, fontSize: 22, marginBottom: 8, color: "#222" }}>
              {data.donorName}
            </div>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ color: "#888", fontSize: 15, marginBottom: 2 }}><b>Sinh ngày:</b> {data.dateOfBirth}</div>
                <div style={{ color: "#888", fontSize: 15, marginBottom: 2 }}><b>Địa chỉ:</b> {data.address}</div>
              </div>
              <div style={{ flex: 1, minWidth: 180, textAlign: "right" }}>
                <div style={{ color: "#888", fontSize: 15, marginBottom: 2 }}><b>Lượng máu (ml):</b> {data.bloodVolume}</div>
                <div style={{ color: "#888", fontSize: 15, marginBottom: 2 }}><b>Cấp bởi:</b> {data.issuedByRole} {data.issuedByName}</div>
              </div>
            </div>
            <div style={{ fontWeight: 500, fontSize: 17, color: "#388e3c", margin: "10px 0 18px 0", letterSpacing: 0.5 }}>
              Đã hiến máu tình nguyện
            </div>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ color: "#444", fontSize: 15, marginBottom: 2 }}><b>Tại:</b> {data.facilityName}</div>
                <div style={{ color: "#444", fontSize: 15, marginBottom: 2 }}><b>Ngày cấp:</b> {data.issuedDate}</div>
                <div style={{ color: "#444", fontSize: 15, marginBottom: 2 }}><b>Mã số chứng nhận:</b> {data.certificateNumber}</div>
              </div>
              <div style={{ flex: 1, minWidth: 180, textAlign: "right" }}>
                <div style={{ color: "#444", fontSize: 15, marginBottom: 2 }}><b>Ghi chú thêm:</b> {data.notes || '-'}</div>
              </div>
            </div>
          </div>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            size="large"
            style={{
              marginTop: 24,
              backgroundColor: '#4CAF50',
              borderColor: '#4CAF50',
              borderRadius: 8,
              fontWeight: 500,
              fontSize: 16,
              padding: "0 32px"
            }}
            onClick={handleDownload}
          >
            Tải giấy chứng nhận
          </Button>
        ) : (
          <div className="certificate-empty">
            Không tìm thấy chứng nhận hoặc bạn không có quyền xem.
          </div>
        )}
      </div>
      <Footer />
    </>
  );
} 