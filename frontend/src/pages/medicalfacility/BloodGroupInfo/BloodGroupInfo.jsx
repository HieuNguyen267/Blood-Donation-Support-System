import React from "react";
import MedicalFacilityHeader from "../../../components/user/MedicalFacilityHeader";
import Footer from "../../../components/user/Footer";
import "./BloodGroupInfo.css";

const bloodGroups = [
  { name: "A+", color: "#ff5252", receive: ["A+", "A-", "O+", "O-"], donate: ["A+", "AB+"] },
  { name: "A-", color: "#ff1744", receive: ["A-", "O-"], donate: ["A+", "A-", "AB+", "AB-"] },
  { name: "B+", color: "#00e676", receive: ["B+", "B-", "O+", "O-"], donate: ["B+", "AB+"] },
  { name: "B-", color: "#00c853", receive: ["B-", "O-"], donate: ["B+", "B-", "AB+", "AB-"] },
  { name: "AB+", color: "#7c4dff", receive: ["Tất cả các nhóm máu (trừ Rh Null và Bombay)"], donate: ["AB+"] },
  { name: "AB-", color: "#651fff", receive: ["AB-", "A-", "B-", "O-"], donate: ["AB+", "AB-"] },
  { name: "O+", color: "#ff9100", receive: ["O+", "O-"], donate: ["O+", "A+", "B+", "AB+"] },
  { name: "O-", color: "#ffab00", receive: ["O-"], donate: ["Tất cả các nhóm máu (trừ Rh Null và Bombay)"] },
  { name: "Rh Null", color: "#ffd600", receive: ["Rh Null"], donate: ["Rh Null"] },
  { name: "Bombay(hh)", color: "#304ffe", receive: ["Bombay (hh)"], donate: ["Bombay (hh)"] },
];

export default function BloodGroupInfo() {
  return (
    <>
      <MedicalFacilityHeader />
      <div className="mf-bloodgroup-root">
        <h2 className="mf-bloodgroup-title" style={{ letterSpacing: 2, fontSize: 32, marginBottom: 36, textShadow: '0 2px 8px #0001' }}>
          <span role="img" aria-label="blood" style={{ marginRight: 10 }}>🩸</span>CÁC NHÓM MÁU
        </h2>
        <div className="mf-bloodgroup-grid">
          {bloodGroups.map((group) => (
            <div
              key={group.name}
              className="mf-bloodgroup-card"
              style={{ borderTop: `8px solid ${group.color}`, transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 2px 12px #0002' }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 24px #0002'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px #0002'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 22, color: group.color, marginRight: 8 }}>{group.name}</span>
                <span style={{ background: group.color, color: '#fff', borderRadius: 8, fontSize: 13, padding: '2px 10px', fontWeight: 600, marginLeft: 2 }}>
                  {group.name.includes('+') ? 'Rh+' : group.name.includes('-') ? 'Rh-' : ''}
                </span>
              </div>
              <div className="mf-bloodgroup-label">Có thể nhận máu từ:</div>
              <div className="mf-bloodgroup-value">{group.receive.join(", ")}</div>
              <div className="mf-bloodgroup-label">Có thể cho máu:</div>
              <div className="mf-bloodgroup-value">{group.donate.join(", ")}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Thành phần máu */}
      <h2 style={{ color: "#e53935", textAlign: "center", margin: "48px 0 24px 0", fontWeight: 700, fontSize: 26, letterSpacing: 1, textShadow: '0 2px 8px #0001' }}>
        <span role="img" aria-label="drop">💧</span>Thành phần máu
      </h2>
      <div style={{ display: "flex", gap: 24, flexWrap: "nowrap", justifyContent: "center", marginBottom: 32, overflowX: "auto" }}>
        <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px #0002", padding: 22, minWidth: 220, maxWidth: 260, textAlign: "center", borderTop: '6px solid #ffb300' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🟡</div>
          <div style={{ fontWeight: 700, color: "#ffb300", fontSize: 19, marginBottom: 8 }}>Huyết tương</div>
          <div style={{ fontSize: 15, marginBottom: 8, color: '#888' }}>55% thể tích máu</div>
          <ul style={{ textAlign: "left", fontSize: 15, margin: 0, paddingLeft: 18 }}>
            <li>Là phần chất lỏng của máu, chứa các protein, hormone và chất dinh dưỡng</li>
            <li>Vàng nhạt, chứa các yếu tố đông máu</li>
          </ul>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px #0002", padding: 22, minWidth: 220, maxWidth: 260, textAlign: "center", borderTop: '6px solid #e53935' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🔴</div>
          <div style={{ fontWeight: 700, color: "#e53935", fontSize: 19, marginBottom: 8 }}>Hồng cầu</div>
          <div style={{ fontSize: 15, marginBottom: 8, color: '#888' }}>45% thể tích máu</div>
          <ul style={{ textAlign: "left", fontSize: 15, margin: 0, paddingLeft: 18 }}>
            <li>Vận chuyển oxy từ phổi đến các mô và đưa CO2 từ các mô về phổi</li>
            <li>Đỏ, chứa hemoglobin</li>
          </ul>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px #0002", padding: 22, minWidth: 220, maxWidth: 260, textAlign: "center", borderTop: '6px solid #ff9800' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🟠</div>
          <div style={{ fontWeight: 700, color: "#ff9800", fontSize: 19, marginBottom: 8 }}>Tiểu cầu</div>
          <div style={{ fontSize: 15, marginBottom: 8, color: '#888' }}>Nhỏ nhất, sống 7-10 ngày</div>
          <ul style={{ textAlign: "left", fontSize: 15, margin: 0, paddingLeft: 18 }}>
            <li>Giúp đông máu và ngăn chảy máu khi bị thương</li>
          </ul>
        </div>
        <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px #0002", padding: 22, minWidth: 220, maxWidth: 260, textAlign: "center", borderTop: '6px solid #1976d2' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🔵</div>
          <div style={{ fontWeight: 700, color: "#1976d2", fontSize: 19, marginBottom: 8 }}>Bạch cầu</div>
          <div style={{ fontSize: 15, marginBottom: 8, color: '#888' }}>Không màu, hệ miễn dịch</div>
          <ul style={{ textAlign: "left", fontSize: 15, margin: 0, paddingLeft: 18 }}>
            <li>Bảo vệ cơ thể khỏi các tác nhân gây bệnh</li>
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
} 