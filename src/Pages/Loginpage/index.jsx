import React from "react";
import {
  Form,
  Input,
  Button,
  Typography,
} from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./index.css";

const { Title } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Login info:", values);
    localStorage.setItem('userEmailForProfile', values.emailOrPhone);
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/user-info-form');
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <div className="login-form-box">
          <Title level={3} className="login-title">Đăng Nhập</Title>
          <Form
            name="login-form"
            layout="vertical"
            onFinish={onFinish}
            className="login-form-content"
          >
            <Form.Item
              label="Nhập địa chỉ Email hoặc số điện thoại"
              name="emailOrPhone"
              rules={[{ required: true, message: "Vui lòng nhập Email hoặc số điện thoại!" }]}
            >
              <Input placeholder="Nhập Email / SDT" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                placeholder="Nhập mật khẩu"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <div className="forgot-password">
              <RouterLink to="/forgot-password">Bạn quên mật khẩu?</RouterLink>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-button">
                Đăng nhập
              </Button>
            </Form.Item>

            <div className="register-link">
              Chưa có tài khoản? <RouterLink to="/registerpage">Đăng ký</RouterLink>
            </div>
          </Form>
        </div>
      </div>
      <Footer />
    </>
  );
}
