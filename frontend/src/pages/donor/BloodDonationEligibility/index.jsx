import React, { useState } from "react";
import { Form, Button, Typography, Card, Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import "./index.css";

const { Title } = Typography;

const questions = [
  {
    label: "Bạn có đang bị cảm, sốt hoặc ho không?",
    name: "camSotHo",
    options: [
      { label: "Không có triệu chứng", value: "none", safe: true },
      { label: "Sốt nhẹ", value: "sotnhe", safe: false },
      { label: "Ho khan", value: "hokhan", safe: false },
      { label: "Sốt cao, ho nhiều", value: "sotcao", safe: false },
    ],
  },
  {
    label: "Bạn có đang bị đau họng hoặc viêm họng không?",
    name: "dauHong",
    options: [
      { label: "Không có", value: "none", safe: true },
      { label: "Đau nhẹ", value: "daunhe", safe: false },
      { label: "Viêm họng nặng", value: "viemhong", safe: false },
    ],
  },
  {
    label: "Bạn có đang bị tiêu chảy hoặc rối loạn tiêu hóa không?",
    name: "tieuChay",
    options: [
      { label: "Không có", value: "none", safe: true },
      { label: "Tiêu chảy nhẹ", value: "tieuchay", safe: false },
      { label: "Rối loạn tiêu hóa kéo dài", value: "roiloan", safe: false },
    ],
  },
  {
    label: "Bạn có đang bị đau đầu, chóng mặt hoặc mệt mỏi bất thường không?",
    name: "dauDau",
    options: [
      { label: "Không có", value: "none", safe: true },
      { label: "Đau đầu nhẹ", value: "daudau", safe: false },
      { label: "Chóng mặt, mệt mỏi nhiều", value: "chongmat", safe: false },
    ],
  },
  {
    label: "Bạn có đang bị dị ứng nghiêm trọng hoặc phát ban không?",
    name: "diUng",
    options: [
      { label: "Không có", value: "none", safe: true },
      { label: "Dị ứng nhẹ", value: "nhe", safe: true },
      { label: "Dị ứng nặng/phát ban", value: "nang", safe: false },
    ],
  },
  {
    label: "Bạn có đang bị nhiễm trùng hoặc vết thương hở không?",
    name: "nhiemTrung",
    options: [
      { label: "Không có", value: "none", safe: true },
      { label: "Vết thương nhỏ đã lành", value: "lanh", safe: true },
      { label: "Nhiễm trùng/vết thương hở", value: "nhiemtrung", safe: false },
    ],
  },
  {
    label: "Bạn có đang sử dụng thuốc kháng sinh hoặc thuốc điều trị bệnh không?",
    name: "thuoc",
    options: [
      { label: "Không sử dụng thuốc", value: "none", safe: true },
      { label: "Thuốc cảm cúm thông thường", value: "camcum", safe: true },
      { label: "Kháng sinh/điều trị bệnh mãn tính", value: "khangsinh", safe: false },
    ],
  },
  {
    label: "Bạn có tiền sử mắc các bệnh truyền nhiễm như viêm gan B, C, HIV không?",
    name: "truyenNhiem",
    options: [
      { label: "Không có", value: "none", safe: true },
      { label: "Đã điều trị ổn định", value: "onDinh", safe: false },
      { label: "Đang điều trị", value: "dangDieuTri", safe: false },
    ],
  },
  {
    label: "Bạn có đang bị cao huyết áp hoặc bệnh tim mạch không?",
    name: "huyetAp",
    options: [
      { label: "Không có", value: "none", safe: true },
      { label: "Huyết áp cao đã kiểm soát", value: "kiemsoat", safe: true },
      { label: "Huyết áp cao chưa kiểm soát/bệnh tim", value: "caochua", safe: false },
    ],
  },
  {
    label: "Bạn có đang bị bệnh tiểu đường hoặc các bệnh mãn tính khác không?",
    name: "tieuDuong",
    options: [
      { label: "Không có", value: "none", safe: true },
      { label: "Tiểu đường kiểm soát tốt", value: "kiemsoat", safe: true },
      { label: "Tiểu đường không kiểm soát/bệnh mãn tính khác", value: "khongkiemsoat", safe: false },
    ],
  },
];

export default function BloodDonationEligibility() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    // 1. Lưu các câu trả lời vào localStorage
    localStorage.setItem('healthCheckAnswers', JSON.stringify(values));

    // 2. Chuyển hướng về trang thông tin đăng ký
    navigate('/registerdonate');
  };

  return (
    <div className="page-container">
      <Header />
      <div className="eligibility-form-wrapper">
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          Kiểm tra điều kiện hiến máu (Sức khỏe)
        </Title>
        <Card className="eligibility-card" bordered={false}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            {questions.map((q, idx) => (
              <div className="question-box" key={q.name}>
                <div className="question-header">{idx + 1}. {q.label}</div>
                <div className="question-content">
                  <Form.Item
                    name={q.name}
                    rules={[{ required: true, message: "Vui lòng chọn đáp án!" }]}
                    style={{ marginBottom: 0 }}
                  >
                    <Checkbox.Group options={q.options.map(opt => ({ label: opt.label, value: opt.value }))} />
                  </Form.Item>
                </div>
              </div>
            ))}
            <Form.Item>
              <div className="btn-group-right">
                <Button
                  className="btn-outline-green"
                  style={{ order: 1, flex: 1 }}
                  onClick={() => navigate(-1)}
                >
                  Quay về
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="check-btn btn-green"
                  size="large"
                  style={{ order: 2, flex: 1 }}
                >
                  Lưu
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <Footer />
    </div>
  );
} 