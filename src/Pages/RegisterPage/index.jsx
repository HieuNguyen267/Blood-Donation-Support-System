import React, { useState } from "react";
import { Form, Input, Button, DatePicker, Select, Typography, message, Modal } from "antd";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./index.css";

const { Title } = Typography;
const { Option } = Select;

export default function RegisterPage() {
  const [form] = Form.useForm();
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpTarget, setOtpTarget] = useState("");
  const [otp, setOtp] = useState("");

  // Regex kiểm tra email hoặc số điện thoại
  const emailOrPhoneRegex = /^((\+?\d{9,13})|([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+))$/;

  const onFinish = (values) => {
    if (!emailOrPhoneRegex.test(values.email)) {
      message.error("Vui lòng nhập đúng định dạng email hoặc số điện thoại.");
      return;
    }
    if (values.password.length < 6) {
      message.error("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    setOtpTarget(values.email);
    setOtpModalVisible(true);
    message.success("Đã gửi mã OTP về " + values.email + " (giả lập)");
    // Thực tế: Gọi API gửi OTP ở đây
  };

  const handleOtpOk = () => {
    if (!otp) {
      message.error("Vui lòng nhập mã OTP.");
      return;
    }
    setOtpModalVisible(false);
    message.success("Xác thực OTP thành công! (giả lập)");
    // Xử lý tiếp tục đăng ký ở đây nếu cần
  };

  return (
    <>
      <Header />
      <div className="register-container">
        <div className="register-form">
          <Title level={3} className="register-title">
            Tạo tài khoản mới
          </Title>
     
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <div className="name-row">
              <Form.Item name="lastName" className="half-input" rules={[{ required: true, message: "Vui lòng nhập Họ" }]}>
                <Input placeholder="Họ" />
              </Form.Item>
              <Form.Item name="firstName" className="half-input" rules={[{ required: true, message: "Vui lòng nhập Tên" }]}>
                <Input placeholder="Tên" />
              </Form.Item>
            </div>

            <Form.Item name="dob" label="Ngày sinh" rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}>
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>

            <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}>
              <Select placeholder="Chọn giới tính">
                <Option value="female">Nữ</Option>
                <Option value="male">Nam</Option>
                <Option value="custom">Tùy chỉnh</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email hoặc số điện thoại" },
                {
                  pattern: emailOrPhoneRegex,
                  message: "Vui lòng nhập đúng định dạng email hoặc số điện thoại",
                },
              ]}
            >
              <Input placeholder="Số di động hoặc email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
              ]}
            >
              <Input.Password placeholder="Mật khẩu mới" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block className="register-button">
                Đăng ký
              </Button>
            </Form.Item>

            <div className="login-link">
              <a href="/loginpage">Bạn đã có tài khoản ư?</a>
            </div>
          </Form>
        </div>
      </div>
      <Modal
        title="Xác thực OTP"
        open={otpModalVisible}
        onOk={handleOtpOk}
        onCancel={() => setOtpModalVisible(false)}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Đã gửi mã OTP về <b>{otpTarget}</b>. Vui lòng kiểm tra và nhập mã OTP để xác thực.</p>
        <Input
          placeholder="Nhập mã OTP"
          style={{ marginTop: 12 }}
          value={otp}
          onChange={e => setOtp(e.target.value)}
        />
      </Modal>
      <Footer />
    </>
  );
}