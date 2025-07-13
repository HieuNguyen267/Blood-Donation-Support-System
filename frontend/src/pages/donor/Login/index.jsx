import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  message,
  Spin,
} from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import { authAPI, setAuthToken, donorAPI } from "../../../services/api";
import "./index.css";

const { Title } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await authAPI.login({
        email: values.email,
        password: values.password
      });
      
      console.log('Login response:', response); // Debug log

      if (!response.token) {
        throw new Error('Token không hợp lệ');
      }

      // Lưu token và thông tin user
      setAuthToken(response.token, response.email, response.role);
      // Lưu accountId cho mọi role
      if (response.id) {
        localStorage.setItem('accountId', response.id);
      }
      // Kiểm tra token đã được lưu
      const savedToken = localStorage.getItem('token');
      console.log('Saved token:', savedToken); // Debug log
      
      if (!savedToken) {
        throw new Error('Token không được lưu');
      }

      // Khai báo role một lần
      const role = response.role?.toUpperCase();
      // Lấy profile hoặc lưu thông tin cơ bản tuỳ theo role
      if (role === 'DONOR') {
      try {
        const profile = await donorAPI.getProfile();
        console.log('Profile response:', profile); // Debug log
        if (profile) {
          localStorage.setItem('userInfo', JSON.stringify(profile));
        } else {
          localStorage.setItem('userInfo', JSON.stringify({
            email: response.email,
            role: response.role,
            fullName: 'Người dùng'
          }));
        }
        window.dispatchEvent(new Event('storage'));
      } catch (profileError) {
        console.error('Get profile error:', profileError);
        localStorage.setItem('userInfo', JSON.stringify({
          email: response.email,
          role: response.role,
          fullName: 'Người dùng'
          }));
          window.dispatchEvent(new Event('storage'));
        }
      } else if (role === 'ADMIN' || role === 'STAFF') {
        // Lưu thông tin cơ bản cho admin/staff
        localStorage.setItem('userInfo', JSON.stringify({
          email: response.email,
          role: response.role,
          accountId: response.id
        }));
        window.dispatchEvent(new Event('storage'));
      }

      message.success('Đăng nhập thành công!');
      
      // Chuyển hướng dựa trên role
      if (role === 'DONOR') {
        navigate('/', { replace: true });
      } else if (role === 'MEDICAL_FACILITY') {
        navigate('/medical-facility', { replace: true });
      } else if (role === 'ADMIN' || role === 'STAFF') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      // Xóa token nếu có lỗi
      setAuthToken(null);
    } finally {
      setLoading(false);
    }
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
              label="Nhập địa chỉ Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập Email" },
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
              <Button 
                type="primary" 
                htmlType="submit" 
                className="login-button"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </Form.Item>

            <div className="register-link">
              Chưa có tài khoản? <RouterLink to="/signup">Đăng ký</RouterLink>
            </div>
          </Form>
        </div>
      </div>
      <Footer />
    </>
  );
}
