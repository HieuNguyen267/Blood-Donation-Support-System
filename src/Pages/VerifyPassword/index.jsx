import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Row, Col } from 'antd';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title } = Typography;

export default function VerifyPassword() {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpSent, setOtpSent] = useState(true);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const emailOrPhone = location.state?.emailOrPhone || '';
  const type = location.state?.type;

  // Gửi lại OTP
  const sendOtp = () => {
    setOtpSent(true);
    setOtpTimer(60);
    message.success('Đã gửi lại mã OTP (giả lập)');
    const timer = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Bước 1: Nhập OTP
  const handleOtpSubmit = () => {
    if (otp.length !== 6) {
      message.error('Mã OTP phải đủ 6 ký tự');
      return;
    }
    if (type === 'register') {
      message.success('Xác thực OTP thành công! (giả lập)');
      setTimeout(() => {
        navigate('/loginpage', { state: { registerSuccess: true } });
      }, 1000);
      return;
    }
    // Chuyển sang trang đặt lại mật khẩu
    navigate('/forgot-password', { state: { emailOrPhone } });
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

  // Hàm ẩn email
  function maskEmail(email) {
    if (!email) return '';
    const [name, domain] = email.split('@');
    if (!domain) return email;
    return name[0] + '***' + name[name.length - 1] + '@' + domain;
  }

  // Bước 2: Đặt lại mật khẩu
  if (location.pathname === '/forgot-password' && location.state?.emailOrPhone) {
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

  return (
    <>
      <Header />
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: '#fff', border: '2px solid #1890ff', borderRadius: 8, padding: 32, minWidth: 350, marginTop: 40 }}>
          {step === 1 && (
            <>
              <Title level={3} style={{ color: '#229E42', textAlign: 'center' }}>Xác thực OTP</Title>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <span style={{ fontWeight: 600 }}>Nhập mã xác thực đã gửi tới <b>{maskEmail(emailOrPhone)}</b></span>
                <Row justify="center" gutter={8} style={{ margin: '16px 0' }}>
                  {[...Array(6)].map((_, i) => (
                    <Col key={i}>
                      <Input
                        maxLength={1}
                        style={{ width: 40, height: 40, textAlign: 'center', fontSize: 20, marginRight: 4 }}
                        value={otp[i] || ''}
                        onChange={e => {
                          let val = e.target.value.replace(/[^0-9]/g, '');
                          let newOtp = otp.split('');
                          newOtp[i] = val;
                          setOtp(newOtp.join('').slice(0, 6));
                        }}
                      />
                    </Col>
                  ))}
                </Row>
                <Button type="primary" block style={{ background: '#42b72a', borderColor: '#42b72a', marginBottom: 8 }} onClick={handleOtpSubmit}>Tiếp tục</Button>
                <div style={{ color: '#888', marginTop: 8 }}>
                  Gửi lại mã OTP {otpTimer > 0 ? `(${otpTimer}s)` : <a onClick={sendOtp}>Gửi lại</a>}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
} 