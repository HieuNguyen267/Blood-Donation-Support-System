import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../../../components/user/Header";
import MedicalFacilityHeader from "../../../components/user/MedicalFacilityHeader";
import Footer from "../../../components/user/Footer";

const bloodGroups = [
  {
    name: "A+",
    color: "#ff5252",
    receive: ["A+", "A-", "O+", "O-"],
    donate: ["A+", "AB+"],
  },
  {
    name: "A-",
    color: "#ff1744",
    receive: ["A-", "O-"],
    donate: ["A+", "A-", "AB+", "AB-"],
  },
  {
    name: "B+",
    color: "#00e676",
    receive: ["B+", "B-", "O+", "O-"],
    donate: ["B+", "AB+"],
  },
  {
    name: "B-",
    color: "#00c853",
    receive: ["B-", "O-"],
    donate: ["B+", "B-", "AB+", "AB-"],
  },
  {
    name: "AB+",
    color: "#7c4dff",
    receive: ["Tất cả các nhóm máu (trừ Rh Null và Bombay)"],
    donate: ["AB+"],
  },
  {
    name: "AB-",
    color: "#651fff",
    receive: ["AB-", "A-", "B-", "O-"],
    donate: ["AB+", "AB-"],
  },
  {
    name: "O+",
    color: "#ff9100",
    receive: ["O+", "O-"],
    donate: ["O+", "A+", "B+", "AB+"],
  },
  {
    name: "O-",
    color: "#ffab00",
    receive: ["O-"],
    donate: ["Tất cả các nhóm máu (trừ Rh Null và Bombay)"],
  },
  {
    name: "Rh Null",
    color: "#ffd600",
    receive: ["Rh Null"],
    donate: ["Rh Null"],
  },
  {
    name: "Bombay(hh)",
    color: "#304ffe",
    receive: ["Bombay (hh)"],
    donate: ["Bombay (hh)"],
  },
];

const bloodComponents = [
  {
    name: "Huyết tương",
    color: "#ffe082",
    desc: "Là phần chất lỏng của máu, chứa nước, muối, enzyme, kháng thể, protein.",
  },
  {
    name: "Hồng cầu",
    color: "#ff8a80",
    desc: "Vận chuyển oxy và CO2, mang sắc tố hemoglobin.",
  },
  {
    name: "Tiểu cầu",
    color: "#ffd180",
    desc: "Giúp đông máu, ngăn chảy máu.",
  },
  {
    name: "Bạch cầu",
    color: "#b3e5fc",
    desc: "Bảo vệ cơ thể khỏi vi khuẩn, virus, ký sinh trùng.",
  },
];

const processSteps = [
  { title: "Đăng ký", desc: "Điền thông tin và nhận số thứ tự" },
  { title: "Khám sàng lọc", desc: "Khám sức khỏe, xét nghiệm máu" },
  { title: "Hiến máu", desc: "Thực hiện hiến máu tại khu vực quy định" },
  { title: "Nghỉ ngơi", desc: "Nghỉ ngơi, nhận quà và giấy chứng nhận" },
];

const infoBoxes = [
  {
    title: "Tầm quan trọng",
    desc: [
      "Máu không thể sản xuất nhân tạo",
      "Mỗi giọt máu cho đi - Một cuộc đời ở lại",
    ],
  },
  {
    title: "Thời gian tồn tại",
    desc: [
      "Hồng cầu: 42 ngày",
      "Tiểu cầu: 5 ngày",
      "Huyết tương: 1 năm",
    ],
  },
  {
    title: "Dấu hiệu thiếu máu",
    desc: [
      "Da xanh xao, mệt mỏi",
      "Chóng mặt, hoa mắt",
      "Khó thở, tim đập nhanh",
    ],
  },
  {
    title: "Lợi ích hiến máu",
    desc: [
      "Kiểm tra sức khỏe miễn phí",
      "Giảm nguy cơ bệnh tim mạch",
      "Tạo máu mới",
      "Giúp đỡ người khác",
    ],
  },
];

export default function BloodGroupInfo() {
  const location = useLocation();
  const isMedicalFacility = location.pathname.startsWith('/medical-facility');
  return (
    <>
      {isMedicalFacility ? <MedicalFacilityHeader /> : <Header />}
      <div style={{ maxWidth: 1100, margin: "32px auto", padding: "0 16px" }}>
        <h2 style={{ color: "#43a047", textAlign: "center", marginBottom: 32, fontWeight: 700, fontSize: 28 }}>
          CÁC NHÓM MÁU
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
          {bloodGroups.map((group) => (
            <div key={group.name} style={{
              background: "#ffe9dc",
              borderRadius: 12,
              boxShadow: "0 2px 8px #0001",
              padding: 20,
              borderTop: `8px solid ${group.color}`,
              minHeight: 180,
            }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: group.color, marginBottom: 8 }}>{group.name}</div>
              <div style={{ fontWeight: 500, marginBottom: 6 }}>Có thể nhận máu từ:</div>
              <div style={{ marginBottom: 8 }}>{group.receive.join(", ")}</div>
              <div style={{ fontWeight: 500, marginBottom: 6 }}>Có thể cho máu:</div>
              <div>{group.donate.join(", ")}</div>
            </div>
          ))}
        </div>

        <h2 style={{ color: "#e53935", textAlign: "center", margin: "48px 0 24px 0", fontWeight: 700, fontSize: 22 }}>
          Thành phần máu
        </h2>
        <div style={{ display: "flex", gap: 24, flexWrap: "nowrap", justifyContent: "center", marginBottom: 32, overflowX: "auto" }}>
          <div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px #0001", padding: 18, minWidth: 220, maxWidth: 260, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🟡</div>
            <div style={{ fontWeight: 700, color: "#ffb300", fontSize: 18, marginBottom: 8 }}>Huyết tương</div>
            <ul style={{ textAlign: "left", fontSize: 15, margin: 0, paddingLeft: 18 }}>
              <li>Là phần chất lỏng của máu, chứa các protein, hormone và chất dinh dưỡng</li>
              <li>55% thể tích máu</li>
              <li>Vàng nhạt</li>
              <li>Chứa các yếu tố đông máu</li>
            </ul>
          </div>
          <div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px #0001", padding: 18, minWidth: 220, maxWidth: 260, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔴</div>
            <div style={{ fontWeight: 700, color: "#e53935", fontSize: 18, marginBottom: 8 }}>Hồng cầu</div>
            <ul style={{ textAlign: "left", fontSize: 15, margin: 0, paddingLeft: 18 }}>
              <li>Vận chuyển oxy từ phổi đến các mô và đưa CO2 từ các mô về phổi</li>
              <li>45% thể tích máu</li>
              <li>Đỏ</li>
              <li>Chứa hemoglobin</li>
            </ul>
          </div>
          <div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px #0001", padding: 18, minWidth: 220, maxWidth: 260, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🟠</div>
            <div style={{ fontWeight: 700, color: "#ff9800", fontSize: 18, marginBottom: 8 }}>Tiểu cầu</div>
            <ul style={{ textAlign: "left", fontSize: 15, margin: 0, paddingLeft: 18 }}>
              <li>Giúp đông máu và ngăn chảy máu khi bị thương</li>
              <li>Kích thước bé nhất trong các thành phần máu</li>
              <li>Tuổi thọ 7-10 ngày</li>
            </ul>
          </div>
          <div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px #0001", padding: 18, minWidth: 220, maxWidth: 260, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔵</div>
            <div style={{ fontWeight: 700, color: "#1976d2", fontSize: 18, marginBottom: 8 }}>Bạch cầu</div>
            <ul style={{ textAlign: "left", fontSize: 15, margin: 0, paddingLeft: 18 }}>
              <li>Bảo vệ cơ thể khỏi các tác nhân gây bệnh</li>
              <li>Không màu</li>
              <li>Hệ thống miễn dịch</li>
            </ul>
          </div>
        </div>

        <div style={{ position: "relative", margin: "40px 0 32px 0", width: "100%", maxWidth: 1100, minHeight: 120, display: "flex", justifyContent: "center" }}>
          <div style={{ position: "absolute", top: 32, left: 0, right: 0, height: 4, background: "#e53935", zIndex: 0, maxWidth: 900, margin: "0 auto" }}></div>
          <div style={{ display: "flex", gap: 0, flexWrap: "nowrap", width: "100%", maxWidth: 900, justifyContent: "space-between", zIndex: 1 }}>
            {[
              { num: 1, title: "Đăng ký", desc: "Điền thông tin cá nhân và kiểm tra điều kiện hiến máu" },
              { num: 2, title: "Khám sàng lọc", desc: "Kiểm tra sức khỏe, đo huyết áp và xét nghiệm máu" },
              { num: 3, title: "Hiến máu", desc: "Quá trình hiến máu diễn ra trong khoảng 10 - 15 phút" },
              { num: 4, title: "Nghỉ ngơi", desc: "Nghỉ ngơi và ăn nhẹ tại chỗ trong 15 - 20 phút" },
            ].map((step) => (
              <div key={step.num} style={{ flex: 1, textAlign: "center", position: "relative" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: "#e53935", color: "#fff", fontWeight: 700,
                  fontSize: 28, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 8, position: "relative", zIndex: 2
                }}>{step.num}</div>
                <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{step.title}</div>
                <div style={{ fontSize: 15 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 24, flexWrap: "nowrap", justifyContent: "center", marginBottom: 40, overflowX: "auto" }}>
          <div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px #0001", padding: 18, minWidth: 220, maxWidth: 260, textAlign: "center" }}>
            <div style={{ fontSize: 28, color: "#e53935", marginBottom: 8 }}>❗</div>
            <div style={{ fontWeight: 700, color: "#e53935", fontSize: 18, marginBottom: 8 }}>Tầm quan trọng</div>
            <ul style={{ textAlign: "left", fontSize: 15, margin: 0, paddingLeft: 18 }}>
              <li>Máu chiếm 7-8% trọng lượng cơ thể</li>
              <li>Mỗi người có khoảng 5-6 lít máu</li>
              <li>Máu được tái tạo liên tục trong cơ thể</li>
            </ul>
          </div>
          <div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px #0001", padding: 18, minWidth: 220, maxWidth: 260, textAlign: "center" }}>
            <div style={{ fontSize: 28, color: "#039be5", marginBottom: 8 }}>💧</div>
            <div style={{ fontWeight: 700, color: "#039be5", fontSize: 18, marginBottom: 8 }}>Thời gian tồn tại</div>
            <ul style={{ textAlign: "left", fontSize: 15, margin: 0, paddingLeft: 18 }}>
              <li>Hồng cầu: 120 ngày</li>
              <li>Tiểu cầu: 7 - 10 ngày</li>
              <li>Bạch cầu: 1 - 3 ngày</li>
              <li>Huyết tương: 1 - 2 ngày</li>
            </ul>
          </div>
          <div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px #0001", padding: 18, minWidth: 220, maxWidth: 260, textAlign: "center" }}>
            <div style={{ fontSize: 28, color: "#fbc02d", marginBottom: 8 }}>⚠️</div>
            <div style={{ fontWeight: 700, color: "#fbc02d", fontSize: 18, marginBottom: 8 }}>Dấu hiệu thiếu máu</div>
            <ul style={{ textAlign: "left", fontSize: 15, margin: 0, paddingLeft: 18 }}>
              <li>Mệt mỏi, chóng mặt</li>
              <li>Da xanh xao</li>
              <li>Khó thở</li>
              <li>Tim đập nhanh</li>
            </ul>
          </div>
          <div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px #0001", padding: 18, minWidth: 220, maxWidth: 260, textAlign: "center" }}>
            <div style={{ fontSize: 28, color: "#43a047", marginBottom: 8 }}>✔️</div>
            <div style={{ fontWeight: 700, color: "#43a047", fontSize: 18, marginBottom: 8 }}>Lợi ích hiến máu</div>
            <ul style={{ textAlign: "left", fontSize: 15, margin: 0, paddingLeft: 18 }}>
              <li>Kiểm tra sức khỏe miễn phí</li>
              <li>Giảm nguy cơ bệnh tim</li>
              <li>Kích thích tạo máu mới</li>
              <li>Cứu sống người khác</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}