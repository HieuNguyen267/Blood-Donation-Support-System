import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Card, Descriptions, Typography, Button, Row, Col, Form, Input, DatePicker, Select, Radio, Space, message, Spin, Avatar, Tag, Divider, List, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Edit, User, Trash2 } from 'lucide-react';
=======
import { Card, Descriptions, Typography, Button, Row, Col, Form, Input, DatePicker, Select, Radio, Space, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Edit } from 'lucide-react';
>>>>>>> 073bd8776b9e662f3d0df0a5cb949ba04fad2983
import Header from '../../../components/user/Header';
import Footer from '../../../components/user/Footer';
import { donorAPI } from '../../../services/api';
import moment from 'moment';
import './index.css';

<<<<<<< HEAD
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

const mockStats = [
  { label: 'Lần hiến máu', value: 5 },
  { label: 'Số lượt đăng ký', value: 8 },
  { label: 'Điểm tích lũy', value: 120 },
];

=======
const { Title } = Typography;
const { Option } = Select;

>>>>>>> 073bd8776b9e662f3d0df0a5cb949ba04fad2983
const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
<<<<<<< HEAD
  const [occupationEdit, setOccupationEdit] = useState('');
  const [occupationSaving, setOccupationSaving] = useState(false);
=======
>>>>>>> 073bd8776b9e662f3d0df0a5cb949ba04fad2983

  useEffect(() => {
    loadProfile();
  }, []);

<<<<<<< HEAD
  useEffect(() => {
    setOccupationEdit(userInfo.occupation || '');
  }, [userInfo.occupation]);

=======
>>>>>>> 073bd8776b9e662f3d0df0a5cb949ba04fad2983
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
<<<<<<< HEAD
      const updatedInfo = { ...values };
      if (updatedInfo.dob) {
        updatedInfo.dob = moment(updatedInfo.dob).format('YYYY-MM-DD');
      }
      await donorAPI.updateProfile(updatedInfo);
=======
    const updatedInfo = { ...values };
    if (updatedInfo.dob) {
        updatedInfo.dob = moment(updatedInfo.dob).format('YYYY-MM-DD');
    }
      
      await donorAPI.updateProfile(updatedInfo);
      
      // Cập nhật state với dữ liệu mới
>>>>>>> 073bd8776b9e662f3d0df0a5cb949ba04fad2983
      const newProfile = { ...updatedInfo };
      if (newProfile.dob) {
        newProfile.dob = moment(newProfile.dob);
      }
      setUserInfo(newProfile);
<<<<<<< HEAD
      setIsEditMode(false);
=======
    setIsEditMode(false);
      
>>>>>>> 073bd8776b9e662f3d0df0a5cb949ba04fad2983
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

<<<<<<< HEAD
  // Handler for direct occupation edit
  const handleOccupationChange = (e) => {
    setOccupationEdit(e.target.value);
  };
  const handleOccupationBlur = async () => {
    if (occupationEdit !== userInfo.occupation) {
      setOccupationSaving(true);
      try {
        await donorAPI.updateProfile({ ...userInfo, occupation: occupationEdit });
        setUserInfo((prev) => ({ ...prev, occupation: occupationEdit }));
        message.success('Cập nhật nghề nghiệp thành công!');
      } catch (error) {
        message.error('Cập nhật nghề nghiệp thất bại.');
        setOccupationEdit(userInfo.occupation || '');
      } finally {
        setOccupationSaving(false);
      }
    }
  };

  // Handler for delete registration
  const handleDeleteRegistration = () => {
    Modal.confirm({
      title: 'Xác nhận xóa đơn đăng ký hiến máu',
      content: 'Bạn có chắc chắn muốn xóa đơn đăng ký hiến máu này không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await donorAPI.deleteRegistration(); // Giả sử API này tồn tại
          message.success('Đã xóa đơn đăng ký hiến máu!');
          // Cập nhật lại state để ẩn nút xóa, hiện nút đăng ký
          setUserInfo((prev) => ({ ...prev, hasActiveRegistration: false, lastDonationId: null }));
        } catch (error) {
          message.error('Xóa đơn đăng ký thất bại!');
        }
      },
    });
  };

  // Handler for register button
  const handleRegister = () => {
    navigate('/donor/register-donate');
  };

=======
>>>>>>> 073bd8776b9e662f3d0df0a5cb949ba04fad2983
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

<<<<<<< HEAD
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
              <Text type="secondary">@{userInfo.cccd || 'user'}</Text>
              <div style={{ marginTop: 8 }}>
                <Button icon={<Edit size={16} />} onClick={handleEdit} type="primary" size="small" style={{ background: '#52c41a', borderColor: '#52c41a' }}>Chỉnh sửa hồ sơ</Button>
              </div>
            </div>
          </div>
          <Divider />
          <Title level={5}>Giới thiệu</Title>
          <Text>
            {userInfo.occupation ? `Nghề nghiệp: ${userInfo.occupation}. ` : ''}
            {userInfo.address ? `Địa chỉ: ${userInfo.address}. ` : ''}
            {userInfo.email ? `Email: ${userInfo.email}.` : 'Chưa cập nhật email.'}
          </Text>
          <Divider />
        
          
          <Title level={5}>Kinh nghiệm</Title>
          <List
            itemLayout="vertical"
            dataSource={userInfo.experience || mockExperience}
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
            <Descriptions.Item label="Ngày sinh">{userInfo.dob ? userInfo.dob.format('DD/MM/YYYY') : '-'}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">{renderItem(userInfo.gender)}</Descriptions.Item>
            <Descriptions.Item label="Nhóm máu">{renderItem(userInfo.bloodType)}</Descriptions.Item>
            <Descriptions.Item label="Điện thoại di động">{renderItem(userInfo.phone)}</Descriptions.Item>
            <Descriptions.Item label="Email">{renderItem(userInfo.email)}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ liên hệ">{renderItem(userInfo.address)}</Descriptions.Item>
            <Descriptions.Item label="Nghề nghiệp">{renderItem(userInfo.occupation)}</Descriptions.Item>
            <Descriptions.Item label="Ngày hiến máu gần nhất">{userInfo.lastDonationDate ? moment(userInfo.lastDonationDate).format('DD/MM/YYYY') : '-'}</Descriptions.Item>
          </Descriptions>
        </Card>
        {/* Button for blood donation registration or delete registration */}
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          {userInfo.hasActiveRegistration || userInfo.lastDonationId ? (
            <Button
              type="primary"
              danger
              icon={<Trash2 size={16} />}
              style={{ background: '#52c41a', borderColor: '#52c41a' }}
              onClick={handleDeleteRegistration}
            >
              Xóa đơn đăng ký hiến máu
            </Button>
          ) : (
            <Button type="primary" onClick={handleRegister}>
              Đăng ký hiến máu
            </Button>
          )}
        </div>
=======
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
>>>>>>> 073bd8776b9e662f3d0df0a5cb949ba04fad2983
      </Col>
    </Row>
  );

<<<<<<< HEAD
  // --- EDIT MODE ---
=======
>>>>>>> 073bd8776b9e662f3d0df0a5cb949ba04fad2983
  const renderEditMode = () => (
    <Card className="profile-edit-card">
      <Title level={4} style={{ textAlign: 'center', marginBottom: '32px' }}>Chỉnh sửa thông tin cá nhân</Title>
      <Form form={form} layout="vertical" onFinish={handleSave} className="profile-antd-form">
        <Row gutter={32}>
          {/* Cột trái */}
          <Col span={12}>
<<<<<<< HEAD
            <Form.Item label="Họ và Tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}> <Input /> </Form.Item>
            <Form.Item label="Ngày sinh" name="dob" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
            <Form.Item label="Giới tính" name="gender" rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}> <Radio.Group> <Radio value="Nam">Nam</Radio> <Radio value="Nữ">Nữ</Radio> <Radio value="Khác">Khác</Radio> </Radio.Group> </Form.Item>
            <Form.Item label="Nhóm máu" name="bloodType" rules={[{ required: true, message: 'Vui lòng chọn nhóm máu!' }]}> <Select> <Option value="A+">A+</Option> <Option value="A-">A-</Option> <Option value="B+">B+</Option> <Option value="B-">B-</Option> <Option value="AB+">AB+</Option> <Option value="AB-">AB-</Option> <Option value="O+">O+</Option> <Option value="O-">O-</Option> </Select> </Form.Item>
          </Col>
          {/* Cột phải */}
          <Col span={12}>
            <Form.Item label="Email" name="email"> <Input readOnly /> </Form.Item>
            <Form.Item label="Điện thoại di động" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}> <Input /> </Form.Item>
            <Form.Item label="Địa chỉ liên hệ" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}> <Input.TextArea rows={5} /> </Form.Item>
          </Col>
        </Row>
        <Row justify="end" style={{ marginTop: '24px' }}>
          <Space>
            <Button onClick={handleCancel} disabled={saving}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={saving} disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </Space>
=======
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
>>>>>>> 073bd8776b9e662f3d0df0a5cb949ba04fad2983
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