import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Typography, Button, Row, Col, Form, Input, DatePicker, Select, Radio, Space, message, Spin, Avatar, Tag, Divider, List, Modal, Dropdown, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Edit, User, Trash2 } from 'lucide-react';
import Header from '../../../components/user/Header';
import Footer from '../../../components/user/Footer';
import { donorAPI } from '../../../services/api';
import dayjs from 'dayjs';
import './index.css';

const { Title, Text } = Typography;
const { Option } = Select;

const mockExperience = [
  {
    title: 'Tham gia hiến máu nhân đạo',
    org: 'Hội Chữ thập đỏ',
    time: '2021 - 2023',
    desc: 'Tham gia nhiều đợt hiến máu và hỗ trợ tổ chức sự kiện.'
  },
  {
    title: 'Tình nguyện viên',
    org: 'CLB Thanh niên',
    time: '2020 - 2021',
    desc: 'Tham gia các hoạt động tuyên truyền và hỗ trợ cộng đồng.'
  }
];

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      let profile = await donorAPI.getProfile();
      if (!profile || Object.keys(profile).length === 0) {
        const localProfile = localStorage.getItem('userInfo');
        if (localProfile) {
          profile = JSON.parse(localProfile);
        }
      }
      const fixedProfile = {
        ...profile,
        dateOfBirth: profile.dateOfBirth ? dayjs(profile.dateOfBirth) : null,
      };
      setUserInfo(fixedProfile);
    } catch (error) {
      // Nếu lỗi, thử lấy từ localStorage
      const localProfile = localStorage.getItem('userInfo');
      if (localProfile) {
        const profile = JSON.parse(localProfile);
        const fixedProfile = {
          ...profile,
          dateOfBirth: profile.dateOfBirth ? dayjs(profile.dateOfBirth) : null,
        };
        setUserInfo(fixedProfile);
      } else {
        message.error('Không thể tải thông tin hồ sơ. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
    setTimeout(() => {
      form.setFieldsValue(userInfo);
    }, 0);
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      await donorAPI.updateProfile({
        fullName: values.fullName,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : undefined,
        identityNumber: values.identityNumber,
        gender: values.gender,
        address: values.address,
        bloodGroup: values.bloodGroup,
        job: values.job,
        phone: values.phone,
        email: values.email,
      });
      const newProfile = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth : undefined,
        identityNumber: values.identityNumber,
        bloodGroup: values.bloodGroup,
        job: values.job,
      };
      setUserInfo(newProfile);
      setIsEditMode(false);
      message.success('Cập nhật thông tin thành công!');
      localStorage.setItem('userInfo', JSON.stringify(newProfile));
    } catch (error) {
      console.error('Update profile error:', error);
      message.error(error.message || 'Cập nhật thông tin thất bại. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    form.setFieldsValue(userInfo);
    setIsEditMode(false);
  };

  const renderItem = (value) => value || '-';

  if (loading) {
    return (
      <div className="profile-page">
        <Header />
        <div className="profile-container">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '20px' }}>Đang tải thông tin hồ sơ...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // --- VIEW MODE ---
  const renderViewMode = () => (
    <Row gutter={32} className="profile-modern-grid">
      {/* Left column */}
      <Col xs={24} md={14}>
        <Card className="profile-card profile-main-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <Avatar size={96} icon={<User size={48} />} style={{ background: '#222' }} />
            <div>
              <Title level={3} style={{ marginBottom: 0 }}>{renderItem(userInfo.fullName)}</Title>
              <Text type="secondary">@{userInfo.identityNumber || 'user'}</Text>
              <div style={{ marginTop: 8 }}>
                <Button icon={<Edit size={16} />} onClick={handleEdit} type="primary" size="small" style={{ background: '#52c41a', borderColor: '#52c41a' }}>Chỉnh sửa hồ sơ</Button>
              </div>
            </div>
          </div>
          <Divider />
          <Title level={5}>Giới thiệu</Title>
          <Text>
            {userInfo.job ? `Nghề nghiệp: ${userInfo.job}. ` : ''}
            {userInfo.address ? `Địa chỉ: ${userInfo.address}. ` : ''}
            {userInfo.email ? `Email: ${userInfo.email}.` : 'Chưa cập nhật email.'}
          </Text>
          <Divider />
          <Title level={5}>Kinh nghiệm</Title>
          <List
            itemLayout="vertical"
            dataSource={mockExperience}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={<b>{item.title}</b>}
                  description={<span>{item.org} <span style={{ float: 'right' }}>{item.time}</span></span>}
                />
                <div>{item.desc}</div>
              </List.Item>
            )}
          />
        </Card>
      </Col>
      {/* Right column */}
      <Col xs={24} md={10}>
        <Card className="profile-card" title="Thông tin liên hệ" style={{ marginBottom: 24 }}>
          <Descriptions layout="vertical" column={1} bordered size="small">
            <Descriptions.Item label="Ngày sinh">{userInfo.dateOfBirth ? userInfo.dateOfBirth.format('DD/MM/YYYY') : '-'}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">{renderItem(userInfo.gender)}</Descriptions.Item>
            <Descriptions.Item label="Nhóm máu">{renderItem(userInfo.bloodGroup)}</Descriptions.Item>
            <Descriptions.Item label="Điện thoại di động">{renderItem(userInfo.phone)}</Descriptions.Item>
            <Descriptions.Item label="Email">{renderItem(userInfo.email)}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ liên hệ">{renderItem(userInfo.address)}</Descriptions.Item>
            <Descriptions.Item label="Nghề nghiệp">{renderItem(userInfo.job)}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
    </Row>
  );

  // --- EDIT MODE ---
  const renderEditMode = () => (
    <Card className="profile-edit-card">
      <Title level={4} style={{ textAlign: 'center', marginBottom: '32px' }}>Chỉnh sửa thông tin cá nhân</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        className="profile-antd-form"
      >
        <Row gutter={32}>
          {/* Cột trái */}
          <Col span={12}>
            <Form.Item
              label="Họ và Tên"
              name="fullName"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Ngày sinh"
              name="dateOfBirth"
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label="Số CCCD"
              name="identityNumber"
              rules={[{ required: true, message: 'Vui lòng nhập CCCD!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Giới tính"
              name="gender"
              rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
            >
              <Radio.Group>
                <Radio value="Nam">Nam</Radio>
                <Radio value="Nữ">Nữ</Radio>
                <Radio value="Khác">Khác</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Nhóm máu"
              name="bloodGroup"
              rules={[{ required: true, message: 'Vui lòng chọn nhóm máu!' }]}
            >
              <Select>
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
          {/* Cột phải */}
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              label="Điện thoại di động"
              name="phone"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Nghề nghiệp"
              name="job"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Địa chỉ liên hệ"
              name="address"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
            >
              <Input.TextArea rows={5} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="end" style={{ marginTop: '24px' }}>
          <Space>
            <Button onClick={handleCancel} disabled={saving}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={saving} disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </Space>
        </Row>
      </Form>
    </Card>
  );

  return (
    <div className="profile-page">
      <Header />
      <div className="profile-container">
        {isEditMode ? renderEditMode() : renderViewMode()}
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage; 