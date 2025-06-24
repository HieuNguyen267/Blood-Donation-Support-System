import React, { useState } from "react";
import { Form, Input, Button, DatePicker, Select, Typography, message, Modal, Row, Col } from "antd";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import { authAPI } from "../../../services/api";
import "./index.css";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

export default function RegisterPage() {
  const [form] = Form.useForm();
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpTarget, setOtpTarget] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [registerData, setRegisterData] = useState(null);
  const navigate = useNavigate();

  // Regex kiểm tra email hoặc số điện thoại
  const emailOrPhoneRegex = /^((\+?\d{9,13})|([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+))$/;

  const onFinish = async (values) => {
    if (!emailOrPhoneRegex.test(values.email)) {
      message.error("Vui lòng nhập đúng định dạng email hoặc số điện thoại.");
      return;
    }
    if (values.password.length < 6) {
      message.error("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);
    try {
      // Gọi API đăng ký nhưng chưa tạo tài khoản ngay
      await authAPI.register(values); 
      setLoading(false);
      message.success('Mã OTP đã được gửi tới email của bạn. Vui lòng kiểm tra và xác thực.');
      // Chuyển hướng đến trang xác thực OTP với thông tin cần thiết
      navigate('/verify-password', {
        state: { 
          email: values.email, 
          password: values.password, 
          type: 'signup'
        } 
      });
    } catch (error) {
      console.error('Register error:', error);
      message.error(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
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
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="lastName" label="Họ" rules={[{ required: true, message: "Vui lòng nhập Họ" }]}>
                  <Input placeholder="Họ" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="firstName" label="Tên" rules={[{ required: true, message: "Vui lòng nhập Tên" }]}>
                  <Input placeholder="Tên" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="email"
              label="Địa chỉ Email"
              rules={[
                { required: true, message: "Vui lòng nhập email " },
                {
                  pattern: emailOrPhoneRegex,
                  message: "Vui lòng nhập đúng định dạng email ",
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                className="register-button"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
              </Button>
            </Form.Item>

            <div className="login-link">
              <a href="/loginpage">Bạn đã có tài khoản ư?</a>
            </div>
          </Form>
        </div>
      </div>
      <Footer />
    </>
  );
}