import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Typography, Button, Row, Col, Form, Input, DatePicker, Select, Radio, Space, message, Spin, Avatar, Tag, Divider, List, Modal, Dropdown, Menu } from 'antd';
import { Edit, User, Trash2 } from 'lucide-react';
import Header from '../../../components/user/Header';
import Footer from '../../../components/user/Footer';
import { donorAPI } from '../../../services/api';
import { bloodGroupAPI } from '../../../services/api';
import dayjs from 'dayjs';
import './index.css';
import DonorNotificationBell from '../../../components/user/DonorNotificationBell';

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
  },
  {
    title: 'Tham gia tổ chức sự kiện hiến máu',
    org: 'Đoàn trường Đại học',
    time: '2022',
    desc: 'Phối hợp tổ chức, truyền thông và hỗ trợ các hoạt động hiến máu tại trường.'
  }
];

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [bloodGroups, setBloodGroups] = useState([]);

  // useEffect đầu tiên chỉ fetch bloodGroups
  useEffect(() => {
    fetchBloodGroups();
  }, []);

  // Khi bloodGroups đã có dữ liệu, mới load profile
  useEffect(() => {
    if (bloodGroups.length > 0) {
      loadProfile();
    }
    // eslint-disable-next-line
  }, [bloodGroups]);

  // Debug effect để kiểm tra userInfo khi thay đổi
  useEffect(() => {
    console.log('UserInfo changed:', userInfo);
  }, [userInfo]);

  const fetchBloodGroups = async () => {
    try {
      const res = await bloodGroupAPI.getBloodGroups();
      setBloodGroups(res);
    } catch {
      setBloodGroups([]);
    }
  };

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
      // Map lại cho form, đặc biệt nhóm máu: tìm id từ bloodGroups dựa trên aboType và rhFactor
      let bloodGroupId = undefined;
      if (profile.aboType && profile.rhFactor && bloodGroups.length > 0) {
        const found = bloodGroups.find(bg => bg.aboType === profile.aboType && bg.rhFactor === profile.rhFactor);
        bloodGroupId = found ? found.bloodGroupId : undefined;
      }
      // Debug log để kiểm tra dữ liệu từ backend
      console.log('Profile from backend:', profile);
      console.log('Gender from backend:', profile.gender);
      
      // Map gender từ database sang hiển thị
      let genderDisplay = 'Khác';
      if (profile.gender === 'male') {
        genderDisplay = 'Nam';
      } else if (profile.gender === 'female') {
        genderDisplay = 'Nữ';
      }
      
      const fixedProfile = {
        fullName: profile.fullName || '',
        email: profile.email || '',
        dateOfBirth: profile.dateOfBirth ? dayjs(profile.dateOfBirth) : null,
        gender: genderDisplay,
        phone: profile.phone || '',
        job: profile.job || '',
        bloodGroup: bloodGroupId,
        address: profile.address || '',
        // Lưu thêm thông tin nhóm máu để hiển thị
        aboType: profile.aboType,
        rhFactor: profile.rhFactor,
        bloodGroupDisplay: profile.bloodGroup,
        // Lưu gender gốc từ database để debug
        originalGender: profile.gender,
      };
      
      console.log('Mapped gender:', fixedProfile.gender);
      setUserInfo(fixedProfile);
      form.setFieldsValue(fixedProfile);
      // Debug log sau khi set form
      console.log('Form gender after loadProfile:', form.getFieldValue('gender'));
    } catch {
      // fallback như cũ
      const localProfile = localStorage.getItem('userInfo');
      if (localProfile) {
        const profile = JSON.parse(localProfile);
        let bloodGroupId = undefined;
        if (profile.aboType && profile.rhFactor && bloodGroups.length > 0) {
          const found = bloodGroups.find(bg => bg.aboType === profile.aboType && bg.rhFactor === profile.rhFactor);
          bloodGroupId = found ? found.bloodGroupId : undefined;
        }
        // Map gender từ database sang hiển thị (fallback)
        let genderDisplay = 'Khác';
        if (profile.gender === 'male') {
          genderDisplay = 'Nam';
        } else if (profile.gender === 'female') {
          genderDisplay = 'Nữ';
        }
        
        const fixedProfile = {
          fullName: profile.fullName || '',
          email: profile.email || '',
          dateOfBirth: profile.dateOfBirth ? dayjs(profile.dateOfBirth) : null,
          gender: genderDisplay,
          phone: profile.phone || '',
          job: profile.job || '',
          bloodGroup: bloodGroupId,
          address: profile.address || '',
          // Lưu thêm thông tin nhóm máu để hiển thị
          aboType: profile.aboType,
          rhFactor: profile.rhFactor,
          bloodGroupDisplay: profile.bloodGroup,
          // Lưu gender gốc từ database để debug
          originalGender: profile.gender,
        };
        setUserInfo(fixedProfile);
        form.setFieldsValue(fixedProfile);
        // Debug log sau khi set form (fallback)
        console.log('Form gender after loadProfile (fallback):', form.getFieldValue('gender'));
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
      // Debug log để kiểm tra dữ liệu được set vào form
      console.log('Setting form values:', userInfo);
      console.log('Gender for form:', userInfo.gender);
      form.setFieldsValue(userInfo);
      // Debug log sau khi set
      console.log('Form gender after set:', form.getFieldValue('gender'));
    }, 0);
  };

  const handleSave = async (values) => {
    setSaving(true);
    try {
      // Debug log để kiểm tra dữ liệu form
      console.log('Form values:', values);
      console.log('Gender from form:', values.gender);
      
      // Map gender từ form sang database
      let mappedGender = 'other';
      if (values.gender === 'Nam') {
        mappedGender = 'male';
      } else if (values.gender === 'Nữ') {
        mappedGender = 'female';
      }
      console.log('Mapped gender for backend:', mappedGender);
      
      await donorAPI.updateProfile({
        fullName: values.fullName,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : undefined,
        gender: mappedGender,
        address: values.address,
        blood_group_id: values.bloodGroup,
        job: values.job,
        phone: values.phone,
        email: values.email,
      });
      
      message.success('Cập nhật thông tin thành công!');
      setIsEditMode(false);
      
      // Refresh lại trang bằng cách reload dữ liệu
      setLoading(true);
      await loadProfile();
      setLoading(false);
    } catch (error) {
      console.error('Update profile error:', error);
      message.error(error.message || 'Cập nhật thông tin thất bại. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Debug log để kiểm tra dữ liệu được reset
    console.log('Resetting form to:', userInfo);
    form.setFieldsValue(userInfo);
    // Debug log sau khi reset
    console.log('Form gender after reset:', form.getFieldValue('gender'));
    setIsEditMode(false);
  };

  const renderItem = (value) => value || '-';

  if (loading) {
    return (
      <div className="profile-page">
        <Header />
        <DonorNotificationBell />
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
  const renderViewMode = () => {
    // Render nhóm máu từ aboType + rhFactor trả về từ backend
    let bloodGroupLabel = '-';
    if (userInfo.aboType && userInfo.rhFactor) {
      const rh = userInfo.rhFactor === 'positive' ? '+' : (userInfo.rhFactor === 'negative' ? '-' : '');
      bloodGroupLabel = `${userInfo.aboType}${rh}`;
    }
    // Sử dụng gender đã được map từ loadProfile
    const genderLabel = userInfo.gender || '-';
    // Debug log để kiểm tra
    console.log('UserInfo gender:', userInfo.gender);
    console.log('Original gender from DB:', userInfo.originalGender);
    console.log('Gender display label:', genderLabel);
    return (
      <Row gutter={32} className="profile-modern-grid">
        {/* Left column */}
        <Col xs={24} md={14}>
          <Card className="profile-card profile-main-card">
            <DonorNotificationBell />
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <Avatar size={96} icon={<User size={48} />} style={{ background: '#222' }} />
              <div>
                <Title level={3} style={{ marginBottom: 0 }}>{renderItem(userInfo.fullName)}</Title>
                <Text type="secondary">@{userInfo.email || 'user'}</Text>
                <div style={{ marginTop: 8 }}>
                  <Button icon={<Edit size={16} />} onClick={handleEdit} type="primary" size="small" style={{ background: '#52c41a', borderColor: '#52c41a' }}>Chỉnh sửa hồ sơ</Button>
                </div>
              </div>
            </div>
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
            <Descriptions layout="vertical" column={1} variant="outlined" size="small">
              <Descriptions.Item label="Ngày sinh">{userInfo.dateOfBirth ? userInfo.dateOfBirth.format('DD/MM/YYYY') : '-'}</Descriptions.Item>
              <Descriptions.Item label="Giới tính">{genderLabel}</Descriptions.Item>
              <Descriptions.Item label="Nhóm máu">{bloodGroupLabel}</Descriptions.Item>
              <Descriptions.Item label="Điện thoại">{renderItem(userInfo.phone)}</Descriptions.Item>
              <Descriptions.Item label="Email">{renderItem(userInfo.email)}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ liên hệ">{renderItem(userInfo.address)}</Descriptions.Item>
              <Descriptions.Item label="Nghề nghiệp">{renderItem(userInfo.job)}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    );
  };

  // --- EDIT MODE ---
  const renderEditMode = () => {
    // Debug log để kiểm tra dữ liệu form
    console.log('Rendering edit mode with userInfo:', userInfo);
    console.log('Form gender value:', form.getFieldValue('gender'));
    return (
    <Card className="profile-edit-card">
      <Title level={4} style={{ textAlign: 'center', marginBottom: '32px' }}>Chỉnh sửa thông tin cá nhân</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        className="profile-antd-form"
        initialValues={userInfo}
        key={JSON.stringify(userInfo)} // Force re-render when userInfo changes
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
            {/* Debug info - có thể xóa sau */}
            <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
              Debug: Form gender value = {form.getFieldValue('gender')}, UserInfo gender = {userInfo.gender}
            </div>
            <Form.Item
              label="Nhóm máu"
              name="bloodGroup"
              rules={[{ required: true, message: 'Vui lòng chọn nhóm máu!' }]}
            >
              <Select>
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
          {/* Cột phải */}
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              label="Điện thoại"
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
  };

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