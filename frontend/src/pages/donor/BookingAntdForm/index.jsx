import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Select, Button, Card, Typography, Row, Col, Input } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Header from '../../../components/user/Header';
import Footer from '../../../components/user/Footer';
import StepProgress from '../../../components/user/StepProgress';
import './index.css';
import { donorAPI } from '../../../services/api';
import moment from 'moment';

const { Option } = Select;
const { Title } = Typography;

const timeSlots = [
  { label: '07:00 - 11:00', value: '07:00-11:00' },
  { label: '13:00 - 16:00', value: '13:00-16:00' },
];

export default function BookingAntdForm() {
  const [form] = Form.useForm();
  const [profile, setProfile] = useState({});

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

  const handleSubmit = async (values) => {
    // Địa chỉ mặc định
    const DEFAULT_ADDRESS = '466 Nguyễn Thị Minh Khai Phường 02, Quận 3, Tp Hồ Chí Minh';
    values.address = DEFAULT_ADDRESS;
    // Lấy lịch sử cũ từ localStorage
    const email = profile.email || localStorage.getItem('email');
    const existingHistory = JSON.parse(localStorage.getItem(`appointmentHistory_${email}`)) || [];

    try {
      const donorId = profile.id || profile.donorId || profile.donor_id;
      const payload = {
        donorId,
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        address: values.address,
        quantityMl: values.quantity,
        bloodGroup: values.sampleGroup,
        lastDonationDate: values.donateLast ? moment(values.donateLast).format("YYYY-MM-DD") : null,
        readyTimeRange: values.readyTimeRange ? values.readyTimeRange.map(d => moment(d).format("YYYY-MM-DD")) : null,
        healthStatus: values.status,
      };
      // Gửi dữ liệu lên backend và lấy registerId trả về
      const newRegister = await donorAPI.registerDonation(payload);
      console.log('Kết quả trả về từ backend:', newRegister);
      // Gán registerId vào dữ liệu lưu localStorage
      const registerId = newRegister && (newRegister.registerId || newRegister.id);
      if (!registerId) {
        window.alert('Không nhận được mã đơn đăng ký từ hệ thống! Vui lòng thử lại.');
        return;
      }
      // Tạo lịch hẹn mới với đầy đủ thông tin và registerId
      const newAppointment = {
        id: Date.now(),
        registerId: registerId,
        status: 'active',
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        address: values.address,
        quantity: values.quantity,
        sampleGroup: values.sampleGroup,
        sampleQuantity: values.sampleQuantity,
        donateLast: values.donateLast ? moment(values.donateLast).format("DD/MM/YYYY") : null,
        sendDate: values.date ? moment(values.date).format("DD/MM/YYYY") : null,
        donationTimeSlot: values.donationTimeSlot,
        healthStatus: values.status,
        readyTimeRange: values.readyTimeRange || null,
      };
      // Lưu vào localStorage sau khi đăng ký thành công
      localStorage.setItem('donationFormData', JSON.stringify({ ...values, registerId }));
      const updatedHistory = [newAppointment, ...existingHistory];
      localStorage.setItem(`appointmentHistory_${email}`, JSON.stringify(updatedHistory));
      console.log('registerId dùng để xóa:', registerId);
      // Thành công
      window.location.href = '/registerdonate';
    } catch (error) {
      window.alert('Đăng ký lên hệ thống thất bại: ' + (error.message || error));
    }
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
              onFinish={handleSubmit}
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
                label="Số lượng máu muốn hiến (ml)"
                name="quantity"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng máu muốn hiến!' },
                  { validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      if (value > 500) return Promise.reject('Không được vượt quá 500ml máu cho 1 lần hiến!');
                      if (value < 50) return Promise.reject('Số lượng máu phải từ 50ml trở lên!');
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input placeholder="Nhập số lượng (ml)" type="number" min={50} max={500} step={50} />
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
                <Select placeholder="Chọn khung giờ hiến máu">
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
                label="Thời điểm sẵn sàng hiến máu"
                name="readyTimeRange"
                rules={[
                  { required: true, message: 'Vui lòng chọn thời điểm sẵn sàng!' },
                  { validator: (_, value) => {
                      if (!value || value.length === 0) return Promise.resolve();
                      const now = moment().startOf('day');
                      const invalid = value.some(date => moment(date).isBefore(now, 'day'));
                      if (invalid) return Promise.reject('Chỉ được chọn từ ngày hiện tại trở đi!');
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <DatePicker.RangePicker
                  format="DD/MM/YYYY"
                  style={{ width: '100%' }}
                  disabledDate={current => current && current < moment().startOf('day')}
                />
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