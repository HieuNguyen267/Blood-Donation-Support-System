import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Typography, Button, Row, Col, Form, Input, DatePicker, Select, Radio, Space, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Edit } from 'lucide-react';
import Header from '../../../components/user/Header';
import Footer from '../../../components/user/Footer';
import { donorAPI } from '../../../services/api';
import moment from 'moment';
import './index.css';

const { Title } = Typography;
const { Option } = Select;

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
      const profile = await donorAPI.getProfile();
      if (profile.dob) {
        profile.dob = moment(profile.dob);
      }
      setUserInfo(profile);
      form.setFieldsValue(profile);
    } catch (error) {
      console.error('Load profile error:', error);
      message.error('Không thể tải thông tin hồ sơ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    form.setFieldsValue(userInfo);
    setIsEditMode(true);
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
    const updatedInfo = { ...values };
    if (updatedInfo.dob) {
        updatedInfo.dob = moment(updatedInfo.dob).format('YYYY-MM-DD');
    }
      
      await donorAPI.updateProfile(updatedInfo);
      
      // Cập nhật state với dữ liệu mới
      const newProfile = { ...updatedInfo };
      if (newProfile.dob) {
        newProfile.dob = moment(newProfile.dob);
      }
      setUserInfo(newProfile);
    setIsEditMode(false);
      
      message.success('Cập nhật thông tin thành công!');
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

  const renderViewMode = () => (
    <Row gutter={24} className="profile-grid">
      <Col span={12}>
        <Card className="profile-info-card" title="Thông tin cá nhân">
          <Descriptions layout="horizontal" column={1} bordered>
            <Descriptions.Item label="Số CCCD:">{renderItem(userInfo.cccd)}</Descriptions.Item>
            <Descriptions.Item label="Họ và tên:">{renderItem(userInfo.fullName)}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh:">{userInfo.dob ? userInfo.dob.format('DD/MM/YYYY') : '-'}</Descriptions.Item>
            <Descriptions.Item label="Giới tính:">{renderItem(userInfo.gender)}</Descriptions.Item>
            <Descriptions.Item label="Nhóm máu:">{renderItem(userInfo.bloodType)}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
      <Col span={12}>
        <Card 
          className="profile-info-card" 
          title="Thông tin liên hệ"
          extra={
            <Button type="link" icon={<Edit size={16} />} onClick={handleEdit}>
              Chỉnh sửa
            </Button>
          }
        >
          <Descriptions layout="horizontal" column={1} bordered>
             <Descriptions.Item label="Địa chỉ liên hệ:">{renderItem(userInfo.address)}</Descriptions.Item>
             <Descriptions.Item label="Điện thoại di động:">{renderItem(userInfo.phone)}</Descriptions.Item>
             <Descriptions.Item label="Điện thoại bàn:">-</Descriptions.Item>
             <Descriptions.Item label="Email:">{renderItem(userInfo.email)}</Descriptions.Item>
             <Descriptions.Item label="Nghề nghiệp:">{renderItem(userInfo.occupation)}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
    </Row>
  );

  const renderEditMode = () => (
    <Card className="profile-edit-card">
      <Title level={4} style={{ textAlign: 'center', marginBottom: '32px' }}>Chỉnh sửa thông tin cá nhân</Title>
      <Form form={form} layout="vertical" onFinish={handleSave} className="profile-antd-form">
        <Row gutter={32}>
          {/* Cột trái */}
          <Col span={12}>
            <Form.Item label="Họ và Tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Ngày sinh" name="dob" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Số CCCD" name="cccd" rules={[{ required: true, message: 'Vui lòng nhập CCCD!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Giới tính" name="gender" rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
              <Radio.Group>
                <Radio value="Nam">Nam</Radio>
                <Radio value="Nữ">Nữ</Radio>
                <Radio value="Khác">Khác</Radio>
              </Radio.Group>
            </Form.Item>
             <Form.Item label="Nhóm máu" name="bloodType" rules={[{ required: true, message: 'Vui lòng chọn nhóm máu!' }]}>
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
             <Form.Item label="Email" name="email">
              <Input readOnly />
            </Form.Item>
            <Form.Item label="Điện thoại di động" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Nghề nghiệp" name="occupation">
                <Input />
            </Form.Item>
            <Form.Item label="Địa chỉ liên hệ" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
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