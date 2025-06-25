import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Select, Button, Card, Typography, Row, Col, message, Input } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Header from '../../../components/user/Header';
import Footer from '../../../components/user/Footer';
import StepProgress from '../../../components/user/StepProgress';
import './index.css';
import { donorAPI } from '../../../services/api';

const { Option } = Select;
const { Title } = Typography;

const locations = [
  '466 Nguyễn Thị Minh Khai Phường 02, Quận 3, Tp Hồ Chí Minh',
  '105 Trần Hưng Đạo, Phường 6, Quận 5, Tp Hồ Chí Minh',
  '595 Sư Vạn Hạnh, Phường 13, Quận 10, Tp Hồ Chí Minh',
];
const bloodGroups = [
  { label: 'A+', value: 'A+' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B-', value: 'B-' },
  { label: 'O+', value: 'O+' },
  { label: 'O-', value: 'O-' },
  { label: 'AB+', value: 'AB+' },
  { label: 'AB-', value: 'AB-' },
  { label: 'Rh null', value: 'Rh null' },
  { label: 'Bombay (hh)', value: 'Bombay(hh)' },
];
const timeSlots = [
  { label: '07:00 - 11:00', value: '07:00-11:00' },
  { label: '13:00 - 16:00', value: '13:00-16:00' },
];

export default function BookingAntdForm() {
  const [form] = Form.useForm();
  const [profile, setProfile] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    donorAPI.getProfile().then((data) => {
      setProfile(data);
      form.setFieldsValue({
        fullName: data.fullName,
        gender: data.gender,
        phone: data.phone,
        email: data.email,
        bloodGroup: data.bloodGroup,
        lastDonationDate: data.lastDonationDate,
      });
    });
  }, [form]);

  const onFinish = (values) => {
    // Lưu dữ liệu booking vào localStorage
    localStorage.setItem('bookingFormData', JSON.stringify(values));
    // Thêm vào appointmentHistory để lịch sử và chi tiết hiển thị đúng
    const existingHistory = JSON.parse(localStorage.getItem('appointmentHistory')) || [];
    const newAppointment = {
      id: Date.now(),
      status: 'active',
      fullName: values.fullName,
      gender: values.gender,
      phone: values.phone,
      email: values.email,
      weight: values.weight,
      date: values.date ? values.date.format('DD/MM/YYYY') : null,
      location: values.location,
      bloodGroup: values.bloodGroup,
      timeSlot: values.timeSlot,
      lastDonationDate: values.lastDonationDate,
      note: values.note || '',
    };
    const updatedHistory = [newAppointment, ...existingHistory];
    localStorage.setItem('appointmentHistory', JSON.stringify(updatedHistory));
    // Chuyển hướng sang trang khảo sát sức khỏe
    window.location.href = '/blood-donation-eligibility';
  };

  return (
    <>
      <Header />
      <div className="form-header">
        <Title level={2} className="form-title">
          Đặt lịch hiến máu
        </Title>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
          <Button style={{ minWidth: 200, fontWeight: 600, fontSize: 16, background: '#fff', color: '#222', border: '1.5px solid #888', boxShadow: '0 2px 6px #0001' }}
            onClick={() => window.location.href = '/registerdonateform'}>
            Đăng ký thời điểm sẵn sàng hiến máu
          </Button>
          <Button type="primary" style={{ minWidth: 200, fontWeight: 600, fontSize: 16, boxShadow: '0 2px 6px #0001', background: '#52c41a', borderColor: '#52c41a', color: '#fff' }}>
            Đăng kí hiến máu theo thời gian
          </Button>
        </div>
        <div className="step-progress-wrapper">
          <StepProgress />
        </div>
      </div>
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Card className="booking-antd-card">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
              className="booking-antd-form"
            >
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input readOnly placeholder="Họ và tên" />
              </Form.Item>
              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[{ required: true, message: 'Vui lòng nhập giới tính!' }]}
              >
                <Input readOnly placeholder="Giới tính" />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input readOnly placeholder="Số điện thoại" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
              >
                <Input readOnly placeholder="Email" />
              </Form.Item>
              <Form.Item
                label="Cân nặng (kg)"
                name="weight"
                rules={[{ required: true, message: 'Vui lòng nhập cân nặng!' }]}
              >
                <Input placeholder="Nhập cân nặng của bạn" type="number" min={1} max={300} />
              </Form.Item>
              <Form.Item
                label={<span><CalendarOutlined style={{ color: '#43a047' }} /> Ngày hiến máu</span>}
                name="date"
                rules={[{ required: true, message: 'Vui lòng chọn ngày hiến máu!' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  placeholder="Chọn ngày" 
                  onChange={date => setSelectedDate(date)}
                />
              </Form.Item>
              <Form.Item
                label={<span><EnvironmentOutlined style={{ color: '#43a047' }} /> Địa điểm</span>}
                name="location"
                rules={[{ required: true, message: 'Vui lòng chọn địa điểm!' }]}
                initialValue={locations[0]}
              >
                <Input value={locations[0]} disabled style={{ background: '#f5f5f5', color: '#222', fontWeight: 500 }} />
              </Form.Item>
              <Form.Item
                label={<span><EnvironmentOutlined style={{ color: '#43a047' }} /> Nhóm máu muốn hiến</span>}
                name="bloodGroup"
                rules={[{ required: true, message: 'Vui lòng chọn nhóm máu!' }]}
              >
                <Input readOnly placeholder="Nhóm máu" />
              </Form.Item>
              <Form.Item
                label={<span><ClockCircleOutlined style={{ color: '#43a047' }} /> Khung giờ hiến máu</span>}
                name="timeSlot"
                rules={[{ required: true, message: 'Vui lòng chọn khung giờ!' }]}
              >
                <Select placeholder="Chọn khung giờ hiến máu" disabled={!selectedDate}>
                  {timeSlots.map(slot => (
                    <Option key={slot.value} value={slot.value}>{slot.label}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Lần hiến máu gần nhất"
                name="lastDonationDate"
              >
                <Input readOnly placeholder="Lần hiến máu gần nhất" />
              </Form.Item>
              <Form.Item
                label="Ghi chú thêm"
                name="note"
              >
                <Input.TextArea rows={3} placeholder="Nhập ghi chú nếu có..." />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block style={{ fontWeight: 600, fontSize: 18, height: 48, marginTop: 8 }}>
                  Tiếp tục
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
      <Footer />
    </>
  );
} 