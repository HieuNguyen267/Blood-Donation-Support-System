import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Typography, message, Row, Col } from 'antd';
import Header from '../../../components/user/Header';
import Footer from '../../../components/user/Footer';
import { authAPI, setAuthToken } from '../../../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { donorAPI } from '../../../services/api';

const { Title } = Typography;

export default function VerifyPassword() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [otpTimer, setOtpTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);

  // Lấy thông tin từ state của navigate
  const email = location.state?.email || '';
  const type = location.state?.type; // 'register' hoặc 'forgot-password'
  const password = location.state?.password; // Nhận mật khẩu

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Timer effect
  useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpTimer]);

  // useEffect để tự động submit khi đủ 6 số
  useEffect(() => {
    const finalOtp = otp.join("");
    if (finalOtp.length === 6 && !loading) {
      handleOtpSubmit();
    }
  }, [otp, loading]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    
    // Chỉ cho phép nhập số
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    if (value.length > 1) { 
      // Xử lý trường hợp paste hoặc nhập nhiều số
      const pastedDigits = value.split('').slice(0, 6 - index);
      pastedDigits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });

      // Tìm ô trống đầu tiên để focus
      const nextEmptyIndex = newOtp.findIndex(val => val === "");
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }
    } else {
      // Xử lý nhập một số
      newOtp[index] = value;
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
    setOtp(newOtp);
  };
  
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Khi ô hiện tại đã trống và nhấn Backspace, di chuyển và xóa ô trước đó
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    if (!/^\d{1,6}$/.test(paste)) return;
    
    const newOtp = new Array(6).fill("");
    paste.split('').forEach((digit, i) => {
      if (i < 6) {
        newOtp[i] = digit;
      }
    });
    setOtp(newOtp);

    const nextFocusIndex = paste.length >= 6 ? 5 : paste.length;
    inputRefs.current[nextFocusIndex]?.focus();
  };

  // Gửi lại OTP
  const resendOtp = async () => {
    setLoading(true);
    try {
      // Sửa lại để gọi đúng API gửi lại mã cho việc đăng ký
      await authAPI.sendCode({ email: email, type: 'signup' });
      setOtpTimer(60);
      message.success('Đã gửi lại mã OTP');
    } catch (error) {
      message.error(error.message || 'Gửi lại OTP thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) return;
    if (loading) return; // Ngăn chặn gửi nhiều lần

    setLoading(true);
    
    try {
      await authAPI.verifyCode({ email, code: finalOtp, type });

      if (type === 'signup') {
        message.success('Xác thực thành công! Tự động đăng nhập...');
        
        // Tự động đăng nhập
        const loginResponse = await authAPI.login({ email, password });
        setAuthToken(loginResponse.token, loginResponse.email, loginResponse.role);
        
        // Chuyển đến trang cập nhật thông tin sau khi đăng nhập thành công
        navigate('/user-info-form'); 

      } else { // 'reset'
        message.success('Xác thực thành công! Giờ bạn có thể đặt lại mật khẩu.');
        navigate('/forgot-password', { state: { email: email } });
      }
    } catch (error) {
      console.error('OTP/Login error:', error);
      message.error(error.message || 'Xác thực hoặc đăng nhập thất bại');
      setOtp(new Array(6).fill("")); // Xóa OTP để người dùng nhập lại
      inputRefs.current[0]?.focus();
      setLoading(false);
    }
  };

  function maskEmail(email) {
    if (!email) return '';
    const [name, domain] = email.split('@');
    if (!domain) return email;
    return name[0] + '***' + name.slice(-1) + '@' + domain;
  }

  const handleSave = async (formData) => {
    try {
      await donorAPI.updateProfile(formData);
      message.success('Thông tin cá nhân đã được cập nhật thành công');
    } catch (error) {
      message.error('Cập nhật thông tin cá nhân thất bại');
    }
  };

  return (
    <>
      <Header />
      <div style={{ minHeight: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: '#fff', border: '2px solid #1890ff', borderRadius: 8, padding: 32, minWidth: 400, marginTop: 40 }}>
          <Title level={3} style={{ color: '#229E42', textAlign: 'center' }}>Xác thực OTP</Title>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <p>Nhập mã xác thực gồm 6 chữ số đã được gửi tới <b>{maskEmail(email)}</b></p>
            <div onPaste={handlePaste} style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '20px 0' }}>
              {otp.map((data, index) => (
                <Input
                  key={index}
                  ref={el => (inputRefs.current[index] = el)}
                  maxLength={1}
                  style={{ width: 40, height: 40, textAlign: 'center', fontSize: '18px' }}
                  value={data}
                  onChange={e => handleChange(e, index)}
                  onFocus={e => e.target.select()}
                  onKeyDown={e => handleKeyDown(e, index)}
                />
              ))}
            </div>
            <Button 
              type="primary" 
              block 
              style={{ background: '#42b72a', borderColor: '#42b72a', marginBottom: 8 }} 
              onClick={handleOtpSubmit}
              loading={loading}
            >
              Xác nhận
            </Button>
            <div style={{ color: '#888', marginTop: 8 }}>
              {otpTimer > 0 ? `Bạn có thể gửi lại mã sau ${otpTimer}s` : <Button type="link" onClick={resendOtp} disabled={loading}>Gửi lại mã</Button>}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 