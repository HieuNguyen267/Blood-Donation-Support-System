import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Radio, Card, Typography, Select, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/user/Header';
import Footer from '../../../components/user/Footer';
import './index.css';
import { donorAPI } from '../../../services/api';
import dayjs from 'dayjs';
import { bloodGroupAPI } from '../../../services/api';

const { Title } = Typography;
const { Option } = Select;

const UserInfoForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [bloodGroups, setBloodGroups] = useState([]);

  useEffect(() => {
    // Nếu chưa đăng nhập thì chuyển hướng về trang đăng nhập
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      navigate('/login');
      return;
    }
    // Lấy email đã lưu và điền vào form
    const userEmail = localStorage.getItem('email');
    if (userEmail) {
      form.setFieldsValue({ email: userEmail });
    }
    // Lấy danh sách nhóm máu từ DB
    async function fetchBloodGroups() {
      try {
        const res = await bloodGroupAPI.getBloodGroups();
        setBloodGroups(res);
      } catch {
        setBloodGroups([]);
      }
    }
    fetchBloodGroups();
  }, [form, navigate]);

  const onFinish = async (values) => {
    try {
      // Lấy account_id từ localStorage hoặc userInfo
      let userInfo = null;
      try {
        userInfo = JSON.parse(localStorage.getItem('userInfo'));
      } catch {}
      let accountId = userInfo?.accountId || localStorage.getItem('accountId');
      // Map giới tính
      let gender = values.gender === 'Nam' ? 'male' : (values.gender === 'Nữ' ? 'female' : 'other');
      if (!values.bloodType) {
        alert('Vui lòng chọn nhóm máu!');
        return;
      }
      await donorAPI.createDonor({
        account: { accountId: Number(accountId) }, // Truyền object đúng entity backend
        fullName: values.fullName,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : undefined,
        lastDonationDate: values.lastDonationDate ? values.lastDonationDate.format('YYYY-MM-DD') : undefined,
        gender: gender,
        bloodGroup: { bloodGroupId: Number(values.bloodType) },
        address: values.address,
        phone: values.phone,
        email: values.email,
        job: values.occupation,
      });
      navigate('/profile');
    } catch (error) {
      alert('Lưu thông tin thất bại! ' + (error?.message || ''));
    }
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
            <Title level={5} className="form-section-title">Thông tin định danh</Title>
            <Row gutter={24}>
              {/* Đã xóa trường Số CCCD */}
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="Họ và Tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
                  <Input placeholder="Nguyễn Văn A" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Ngày sinh"
                  name="dateOfBirth"
                  rules={[
                    { required: true, message: 'Vui lòng chọn ngày sinh!' },
                    { validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        const today = dayjs();
                        const age = today.diff(value, 'year');
                        if (age < 18) return Promise.reject('Bạn phải đủ 18 tuổi trở lên!');
                        if (age > 60) return Promise.reject('Tuổi tối đa được phép là 60!');
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Lần hiến máu gần nhất"
                  name="lastDonationDate"
                >
                  <DatePicker style={{ width: '100%' }} />
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
                      {bloodGroups.map(bg => {
                        let rh = bg.rhFactor === 'positive' ? '+' : (bg.rhFactor === 'negative' ? '-' : '');
                        return (
                          <Option key={bg.bloodGroupId} value={bg.bloodGroupId}>
                            {bg.aboType}{rh}
                          </Option>
                        );
                      })}
                    </Select>
                 </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Nghề nghiệp" name="occupation" rules={[{ required: true, message: 'Vui lòng nhập nghề nghiệp!' }]}>
                    <Input placeholder="Nhập nghề nghiệp hiện tại"/>
                </Form.Item>
              </Col>
            </Row>

            <Title level={5} className="form-section-title">Thông tin liên hệ</Title>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Email là bắt buộc!' }]}>
                  <Input  placeholder="địa chỉ email" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
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