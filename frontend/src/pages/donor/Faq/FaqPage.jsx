import React, { useState } from "react";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import "./FaqPage.css";
import { FaQuestionCircle } from 'react-icons/fa';

const faqs = [
  {
    question: "Ai có thể tham gia hiến máu?",
    answer: [
      "Tất cả mọi người từ 18 - 60 tuổi, thực sự tình nguyện hiến máu cứu người để cứu chữa người bệnh.",
      "Cân nặng: ít nhất 45kg đối với cả nam và nữ. Lượng máu mỗi lần hiến không quá 9ml/kg cân nặng, không quá 500ml/lần.",
      "Không mắc hoặc không có hành vi nguy cơ lây nhiễm HIV và các bệnh lây truyền qua đường máu khác.",
      "Thời gian giữa 2 lần hiến máu là 12 tuần đối với cả nam và nữ.",
      "Có giấy tờ tùy thân."
    ]
  },
  {
    question: "Ai là người không nên hiến máu",
    answer: [
      "Người đã nhiễm hoặc có hành vi nguy cơ nhiễm HIV, viêm gan B, viêm gan C, và các bệnh lây qua đường truyền máu.",
      "Người mắc các bệnh mãn tính: tim mạch, huyết áp, hô hấp, dạ dày..."
    ]
  },
  {
    question: "Máu của tôi sẽ được làm những xét nghiệm gì?",
    answer: [
      "Tất cả máu hiến ra đều được kiểm tra các nhóm máu (như ABO, Rh), HIV, viêm gan B, viêm gan C, giang mai...",
      "Sau khi hiến máu, kết quả sẽ được gửi về sau (nếu đăng ký nhận).",
      "Máu đạt chuẩn sẽ được bảo quản, xử lý, và sử dụng phục vụ cho điều trị."
    ]
  },
  {
    question: "Máu gồm những thành phần và chức năng gì?",
    answer: [
      "Máu có 4 thành phần chính: huyết tương, hồng cầu, bạch cầu và tiểu cầu.",
      "Chức năng: vận chuyển khí, bảo vệ cơ thể, duy trì nhiệt độ, đông máu,..."
    ]
  },
  {
    question: "Tại sao khi tham gia hiến máu lại cần phải có giấy CMND?",
    answer: [
      "Mỗi đơn vị máu là tài sản quý báu, do đó cần truy xuất nguồn hiến rõ ràng, đầy đủ.",
      "Giấy tờ tùy thân còn giúp việc cấp Giấy chứng nhận và bảo hiểm quyền lợi về sau dễ dàng hơn."
    ]
  },
  {
    question: "Nhu cầu máu điều trị ở nước ta hiện nay?",
    answer: [
      "Mỗi năm nước ta cần khoảng 1.800.000 đơn vị máu.",
      "Hiến máu nhân đạo là nghĩa cử cao đẹp, góp phần cứu sống nhiều người bệnh."
    ]
  },
  {
    question: "Có dấu hiệu sưng, phù nơi vết chích?",
    answer: [
      "Hiện tượng sưng nhẹ, hơi đau, hoặc bầm tím là bình thường.",
      "Nếu kéo dài hoặc sưng to, hãy dùng khăn lạnh chườm nhẹ và liên hệ cơ sở y tế nếu cần."
    ]
  }
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <>
      <Header />
      <div className="faq-page">
        <h2 className="faq-title">Lưu ý quan trọng</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-box ${openIndex === index ? "open" : ""}`}
              style={{
                borderLeft: openIndex === index ? '6px solid #43a047' : '6px solid #ffe0b2',
                boxShadow: openIndex === index ? '0 4px 16px #43a04722' : '0 2px 6px rgba(0,0,0,0.1)',
                background: openIndex === index ? '#e8f5e9' : '#fff3e0',
                transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
              }}
            >
              <div className="faq-question" onClick={() => toggle(index)} style={{fontSize: openIndex === index ? '1.18rem' : '1.08rem'}}>
                <span style={{display:'flex',alignItems:'center',gap:12}}>
                  <span className="faq-number-circle">{index + 1}</span>
                  <FaQuestionCircle style={{color:'#f57c00',marginRight:6,fontSize:20}}/>
                  {faq.question}
                </span>
                <span className="faq-icon" style={{fontSize:openIndex===index?22:18}}>{openIndex === index ? "▲" : "▼"}</span>
              </div>
              <div className="faq-answer">
                <ul>
                  {faq.answer.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
