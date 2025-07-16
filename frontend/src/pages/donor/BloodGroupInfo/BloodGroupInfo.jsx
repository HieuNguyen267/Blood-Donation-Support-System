import React from "react";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import "./BloodGroupInfo.css";

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
  return (
    <>
      <Header />
      <div className="bloodgroup-info-wrapper">
        <h2 className="bloodgroup-title">CÁC NHÓM MÁU</h2>
        <div className="bloodgroup-grid">
          {bloodGroups.map((group) => (
            <div
              key={group.name}
              className="bloodgroup-card"
              style={{ borderTop: `8px solid ${group.color}` }}
            >
              <div className="bloodgroup-name" style={{ color: group.color }}>{group.name}</div>
              <div className="bloodgroup-label">Có thể nhận máu từ:</div>
              <div className="bloodgroup-value">{group.receive.join(", ")}</div>
              <div className="bloodgroup-label">Có thể cho máu:</div>
              <div className="bloodgroup-value">{group.donate.join(", ")}</div>
            </div>
          ))}
        </div>

        <h2 className="bloodcomponent-title">Thành phần máu</h2>
        <div className="bloodcomponent-list">
          <div className="bloodcomponent-card">
            <div className="bloodcomponent-icon">🟡</div>
            <div className="bloodcomponent-name">Huyết tương</div>
            <ul className="bloodcomponent-desc">
              <li>Là phần chất lỏng của máu, chứa các protein, hormone và chất dinh dưỡng</li>
              <li>55% thể tích máu</li>
              <li>Vàng nhạt</li>
              <li>Chứa các yếu tố đông máu</li>
            </ul>
          </div>
          <div className="bloodcomponent-card">
            <div className="bloodcomponent-icon">🔴</div>
            <div className="bloodcomponent-name">Hồng cầu</div>
            <ul className="bloodcomponent-desc">
              <li>Vận chuyển oxy từ phổi đến các mô và đưa CO2 từ các mô về phổi</li>
              <li>45% thể tích máu</li>
              <li>Đỏ</li>
              <li>Chứa hemoglobin</li>
            </ul>
          </div>
          <div className="bloodcomponent-card">
            <div className="bloodcomponent-icon">🟠</div>
            <div className="bloodcomponent-name">Tiểu cầu</div>
            <ul className="bloodcomponent-desc">
              <li>Giúp đông máu và ngăn chảy máu khi bị thương</li>
              <li>Kích thước bé nhất trong các thành phần máu</li>
              <li>Tuổi thọ 7-10 ngày</li>
            </ul>
          </div>
          <div className="bloodcomponent-card">
            <div className="bloodcomponent-icon">🔵</div>
            <div className="bloodcomponent-name">Bạch cầu</div>
            <ul className="bloodcomponent-desc">
              <li>Bảo vệ cơ thể khỏi các tác nhân gây bệnh</li>
              <li>Không màu</li>
              <li>Hệ thống miễn dịch</li>
            </ul>
          </div>
        </div>

        <div className="bloodprocess-section">
          <div className="bloodprocess-bar"></div>
          <div className="bloodprocess-steps">
            {[
              { num: 1, title: "Đăng ký", desc: "Điền thông tin cá nhân và kiểm tra điều kiện hiến máu" },
              { num: 2, title: "Khám sàng lọc", desc: "Kiểm tra sức khỏe, đo huyết áp và xét nghiệm máu" },
              { num: 3, title: "Hiến máu", desc: "Quá trình hiến máu diễn ra trong khoảng 10 - 15 phút" },
              { num: 4, title: "Nghỉ ngơi", desc: "Nghỉ ngơi và ăn nhẹ tại chỗ trong 15 - 20 phút" },
            ].map((step) => (
              <div key={step.num} className="bloodprocess-step">
                <div className="bloodprocess-step-circle">{step.num}</div>
                <div className="bloodprocess-step-title">{step.title}</div>
                <div className="bloodprocess-step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bloodinfo-list">
          <div className="bloodinfo-card">
            <div className="bloodinfo-icon">❗</div>
            <div className="bloodinfo-title">Tầm quan trọng</div>
            <ul className="bloodinfo-desc">
              <li>Máu chiếm 7-8% trọng lượng cơ thể</li>
              <li>Mỗi người có khoảng 5-6 lít máu</li>
              <li>Máu được tái tạo liên tục trong cơ thể</li>
            </ul>
          </div>
          <div className="bloodinfo-card">
            <div className="bloodinfo-icon">💧</div>
            <div className="bloodinfo-title">Thời gian tồn tại</div>
            <ul className="bloodinfo-desc">
              <li>Hồng cầu: 120 ngày</li>
              <li>Tiểu cầu: 7 - 10 ngày</li>
              <li>Bạch cầu: 1 - 3 ngày</li>
              <li>Huyết tương: 1 - 2 ngày</li>
            </ul>
          </div>
          <div className="bloodinfo-card">
            <div className="bloodinfo-icon">⚠️</div>
            <div className="bloodinfo-title">Dấu hiệu thiếu máu</div>
            <ul className="bloodinfo-desc">
              <li>Mệt mỏi, chóng mặt</li>
              <li>Da xanh xao</li>
              <li>Khó thở</li>
              <li>Tim đập nhanh</li>
            </ul>
          </div>
          <div className="bloodinfo-card">
            <div className="bloodinfo-icon">✔️</div>
            <div className="bloodinfo-title">Lợi ích hiến máu</div>
            <ul className="bloodinfo-desc">
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