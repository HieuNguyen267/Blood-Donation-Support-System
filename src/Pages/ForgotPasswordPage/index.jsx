import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title } = Typography;

function maskEmail(email) {
  if (!email) return '';
  const [name, domain] = email.split('@');
  if (!domain) return email;
  return name[0] + '******' + name[name.length - 1] + '@' + domain;
}

export default function ForgotPasswordPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const emailOrPhone = location.state?.emailOrPhone || '';

  // Bước 1: Nhập email/SĐT
  const handleEmailSubmit = (values) => {
    // Gửi OTP và chuyển sang trang nhập OTP
    navigate('/verify-password', { state: { emailOrPhone: values.emailOrPhone } });
  };

  // Bước 2: Đặt lại mật khẩu
  const handleResetPassword = (values) => {
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
    message.success('Đặt lại mật khẩu thành công! (giả lập)');
    setTimeout(() => {
      navigate('/loginpage');
    }, 1000);
  };

  // Nếu có state emailOrPhone thì chỉ hiển thị form đặt lại mật khẩu
  if (emailOrPhone) {
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
                <Button type="primary" htmlType="submit" block style={{ background: '#42b72a', borderColor: '#42b72a' }}>Xác nhận</Button>
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
            <Form.Item name="emailOrPhone" rules={[{ required: true, message: 'Vui lòng nhập Email / SĐT' }]}> 
              <Input placeholder="Nhập Email / SĐT" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block style={{ background: '#42b72a', borderColor: '#42b72a' }}>Tiếp tục</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Footer />
    </>
  );
} 