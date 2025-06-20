import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  message,
} from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./index.css";

const { Title } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const onFinish = (values) => {
    console.log("Login info:", values);
    localStorage.setItem('userEmailForProfile', values.emailOrPhone);
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/user-info-form');
  };

  useEffect(() => {
    if (location.state?.registerSuccess) {
      message.success('Đăng ký tài khoản thành công!');
      navigate(location.pathname, { replace: true, state: {} });
    } else if (location.state?.requireLogin) {
      message.warning('Bạn phải đăng nhập mới được đặt lịch');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

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
              label="Nhập địa chỉ Email "
              name="emailOrPhone"
              rules={[
                { required: true, message: "Vui lòng nhập Email" },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input placeholder="Nhập Email" />
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
