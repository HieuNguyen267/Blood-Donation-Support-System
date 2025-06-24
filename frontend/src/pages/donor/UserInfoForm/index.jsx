import React, { useEffect } from 'react';
import { Form, Input, Button, DatePicker, Radio, Card, Typography, Select, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/user/Header';
import Footer from '../../../components/user/Footer';
import './index.css';
import { donorAPI } from '../../../services/api';

const { Title } = Typography;
const { Option } = Select;

const UserInfoForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    // Nếu chưa đăng nhập thì chuyển hướng về trang đăng nhập
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      navigate('/loginpage');
      return;
    }
    // Lấy email đã lưu và điền vào form
    const userEmail = localStorage.getItem('userEmailForProfile');
    if (userEmail) {
      form.setFieldsValue({ email: userEmail });
    }
  }, [form, navigate]);

  const onFinish = (values) => {
    console.log('User Info:', values);
    // Lưu thông tin vào localStorage để giả lập
    localStorage.setItem('userInfo', JSON.stringify(values));
    // Xóa email tạm
    localStorage.removeItem('userEmailForProfile');
    // Chuyển hướng đến trang cá nhân
    navigate('/profile');
  };

  return (
    <>
      <Header />
      <div className="user-info-container">
        <Card className="user-info-card-large">
          <Title level={3} style={{ textAlign: 'center', marginBottom: '8px' }}>
            Cập nhật thông tin cá nhân
          </Title>
          <p style={{ textAlign: 'center', marginBottom: '32px', color: '#888' }}>
            Đây là lần đầu bạn đăng nhập. Vui lòng hoàn tất thông tin để sử dụng đầy đủ tính năng.
          </p>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Title level={5} className="form-section-title">Thông tin cá nhân & sức khỏe</Title>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="Họ và Tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
                  <Input placeholder="Nguyễn Văn A" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Ngày sinh" name="dob" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
                  <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày"/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Giới tính" name="gender" rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
                  <Radio.Group>
                    <Radio value="Nam">Nam</Radio>
                    <Radio value="Nữ">Nữ</Radio>
                    <Radio value="Khác">Khác</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                 <Form.Item label="Nhóm máu" name="bloodType" rules={[{ required: true, message: 'Vui lòng chọn nhóm máu!' }]}>
                    <Select placeholder="Chọn nhóm máu">
                        <Option value="A+">A+</Option>
                        <Option value="A-">A-</Option>
                        <Option value="B+">B+</Option>
                        <Option value="B-">B-</Option>
                        <Option value="AB+">AB+</Option>
                        <Option value="AB-">AB-</Option>
                        <Option value="O+">O+</Option>
                        <Option value="O-">O-</Option>
                    </Select>
                 </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Nghề nghiệp" name="occupation">
                    <Input placeholder="Nhập nghề nghiệp hiện tại"/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Lần hiến máu gần nhất" name="lastDonationDate">
                  <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" />
                </Form.Item>
              </Col>
            </Row>

            <Title level={5} className="form-section-title">Thông tin liên hệ</Title>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Email là bắt buộc!' }]}>
                  <Input readOnly placeholder="địa chỉ email" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Điện thoại di động" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>
              <Col span={24}>
                 <Form.Item label="Địa chỉ liên hệ" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                  <Input.TextArea rows={3} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item style={{ marginTop: '24px' }}>
              <Button type="primary" htmlType="submit" block size="large">
                Lưu thông tin
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default UserInfoForm; 