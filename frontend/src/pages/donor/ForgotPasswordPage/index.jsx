import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import Header from '../../../components/user/Header';
import Footer from '../../../components/user/Footer';
import { authAPI } from '../../../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title } = Typography;

export default function ForgotPasswordPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const [loading, setLoading] = useState(false);

  // Bước 1: Nhập email/SĐT
  const handleEmailSubmit = async (values) => {
    setLoading(true);
    try {
      await authAPI.forgotPassword(values.email);
      
      message.success('Đã gửi mã OTP về email của bạn');
      // Gửi OTP và chuyển sang trang nhập OTP
      navigate('/verify-password', { 
        state: { 
          email: values.email,
          type: 'reset'
        } 
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      message.error(error.message || 'Gửi OTP thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: Đặt lại mật khẩu
  const handleResetPassword = async (values) => {
    const { newPassword, confirmPassword } = values;
    if (!newPassword || !confirmPassword) {
      message.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (newPassword.length < 6) {
      message.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword({
        email: email,
        newPassword: newPassword,
        confirmNewPassword: confirmPassword
      });
      
      message.success('Đặt lại mật khẩu thành công!');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      console.error('Reset password error:', error);
      message.error(error.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Nếu có state email thì chỉ hiển thị form đặt lại mật khẩu
  if (email) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', border: '2px solid #1890ff', borderRadius: 8, padding: 32, minWidth: 350, marginTop: 40 }}>
            <Title level={3} style={{ color: '#229E42', textAlign: 'center' }}>Đặt lại mật khẩu</Title>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleResetPassword}
              style={{ marginTop: 16 }}
            >
              <Form.Item
                label="Nhập mật khẩu mới"
                name="newPassword"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }, { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }]}
              >
                <Input.Password placeholder="Nhập mật khẩu mới" />
              </Form.Item>
              <Form.Item
                label="Xác nhận mật khẩu mới"
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Nhập lại mật khẩu mới" />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  style={{ background: '#42b72a', borderColor: '#42b72a' }}
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Xác nhận'}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Nếu không có state thì hiển thị form nhập email/SĐT
  return (
    <>
      <Header />
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: '#fff', border: '2px solid #1890ff', borderRadius: 8, padding: 32, minWidth: 350, marginTop: 40 }}>
          <Title level={3} style={{ color: '#229E42', textAlign: 'center' }}>Quên mật khẩu</Title>
          <Form form={form} layout="vertical" onFinish={handleEmailSubmit} style={{ marginTop: 16 }}>
            <Form.Item name="email" rules={[{ required: true, message: 'Vui lòng nhập Email' }]}> 
              <Input placeholder="Nhập Email" />
            </Form.Item>
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                style={{ background: '#42b72a', borderColor: '#42b72a' }}
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Đang gửi...' : 'Tiếp tục'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Footer />
    </>
  );
} 