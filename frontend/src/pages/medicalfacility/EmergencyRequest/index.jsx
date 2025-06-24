import React, { useState, useEffect } from "react";
import { Form, Input, Button, Typography, Select, InputNumber, Card } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown } from 'antd';
import { UserCircle } from 'lucide-react';
import Footer from "../../../components/user/Footer";
import "./index.css";

const { Title, Text } = Typography;

const bloodGroups = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
  { label: "Bombay (hh)", value: "Bombay" },
  { label: "Rhnull", value: "Rhnull" },
];

const components = [
  { label: "Toàn phần", value: "toanphan" },
  { label: "Hồng cầu", value: "hongcau" },
  { label: "Tiểu cầu", value: "tieucau" },
  { label: "Huyết tương", value: "huyettuong" },
];

export default function EmergencyRequest() {
  const [form] = Form.useForm();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    navigate('/'); 
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };

    window.addEventListener('storage', checkLoginStatus);
    checkLoginStatus();

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  // Lấy họ tên từ localStorage nếu đã đăng nhập
  let userName = 'Đăng nhập';
  let showDropdown = false;
  if (isLoggedIn) {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo && userInfo.fullName) {
        userName = userInfo.fullName;
        showDropdown = true;
      } else {
        userName = 'Người dùng';
        showDropdown = true;
      }
    } catch {
      userName = 'Người dùng';
      showDropdown = true;
    }
  }

  const menu = (
    <div style={{ 
      background: 'white', 
      border: '1px solid #d9d9d9', 
      borderRadius: '6px', 
      padding: '4px 0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}>
      <div 
        style={{ 
          padding: '8px 16px', 
          cursor: 'pointer',
          borderBottom: '1px solid #f0f0f0'
        }}
        onClick={() => navigate('/medical-facility/profile')}
      >
        Thông tin cơ sở
      </div>
      <div 
        style={{ 
          padding: '8px 16px', 
          cursor: 'pointer',
          color: '#ff4d4f'
        }}
        onClick={handleLogout}
      >
        Đăng xuất
      </div>
    </div>
  );

  const onFinish = (values) => {
    // Xử lý gửi yêu cầu ở đây
    // eslint-disable-next-line no-alert
    alert("Yêu cầu của bạn đã được gửi! Chúng tôi sẽ liên hệ hỗ trợ sớm nhất.");
    form.resetFields();
  };

  return (
    <>
      {/* Header Component */}
      <div className="header-wrapper">
        <div className="header-top">
          <div className="logo-title" style={{ cursor: 'pointer' }} onClick={() => navigate('/medical-facility') }>
            <span className="logo">🏥</span>
            <span className="system-title">Hệ thống Nhận Máu</span>
          </div>
          <div className="user-section">
          {showDropdown ? (
            <Dropdown overlay={menu} trigger={["click"]}>
              <div className="login-link" style={{ cursor: "pointer" }}>
                <UserCircle size={20} />
                <span>{userName} ▾</span>
              </div>
            </Dropdown>
          ) : (
            <Link to="/loginpage" className="login-link">
              <UserCircle size={20} />
              <span>Đăng nhập</span>
            </Link>
          )}
        </div>
        </div>
        <nav className="header-nav">
          <a href="/medical-facility">TRANG CHỦ</a>
          <a href="/receiveblood">YÊU CẦU MÁU</a>
          <a href="/medical-facility/history">LỊCH SỬ YÊU CẦU</a>
          <a href="#">TIN TỨC</a>
          <a href="/contact">LIÊN HỆ</a>
        </nav>
      </div>

      <div className="emergency-wrapper">
        <Card className="emergency-card" bordered={false}>
          <Title level={3} className="emergency-title">
            Yêu cầu nhận máu khẩn cấp
          </Title>
          <Text className="emergency-sub">
            Bạn đang cần máu gấp?<br />
            Hãy điền thông tin bên dưới để được hỗ trợ nhanh nhất
          </Text>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="emergency-form"
          >
            <div className="emergency-row">
              <Form.Item name="patient" label="Họ và tên bệnh nhân" rules={[{ required: true, message: "Vui lòng nhập họ tên bệnh nhân" }]}
                className="emergency-item">
                <Input placeholder="Nhập họ tên bệnh nhân" />
              </Form.Item>
              <Form.Item name="contact" label="Người liên lạc" rules={[{ required: true, message: "Vui lòng nhập tên người liên lạc" }]}
                className="emergency-item">
                <Input placeholder="Người liên lạc" />
              </Form.Item>
              <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                className="emergency-item">
                <Input placeholder="Số điện thoại" />
              </Form.Item>
              <Form.Item name="bloodGroup" label="Nhóm máu" rules={[{ required: true, message: "Chọn nhóm máu" }]}
                className="emergency-item">
                <Select placeholder="Chọn nhóm máu" options={bloodGroups} />
              </Form.Item>
            </div>
            <div className="emergency-row">
              <Form.Item name="hospital" label="Cơ sở y tế" rules={[{ required: true, message: "Nhập cơ sở y tế" }]}
                className="emergency-item">
                <Input placeholder="Tên bệnh viện/cơ sở y tế" />
              </Form.Item>
              <Form.Item name="amount" label="Số lượng (ml)" rules={[{ required: true, message: "Nhập số lượng" }]}
                className="emergency-item">
                <InputNumber min={100} max={10000} step={50} style={{ width: '100%' }} placeholder="Số lượng (ml)" />
              </Form.Item>
              <Form.Item name="component" label="Thành phần" rules={[{ required: true, message: "Chọn thành phần" }]}
                className="emergency-item">
                <Select placeholder="Chọn thành phần" options={components} />
              </Form.Item>
            </div>
            <Form.Item name="desc" label="Mô tả tình trạng khẩn cấp (tùy chọn)" className="emergency-item">
              <Input.TextArea rows={4} placeholder="Mô tả tình trạng khẩn cấp (nếu có)" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="emergency-btn">
                Gửi yêu cầu
              </Button>
            </Form.Item>
          </Form>
          <div className="emergency-hotline">
            Hotline hỗ trợ <b>1900 1234</b>
          </div>
        </Card>
      </div>
      <Footer />
    </>
  );
} 