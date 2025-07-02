import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Select, Button, Card, Typography, Row, Col, Input } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Header from '../../../components/user/Header';
import Footer from '../../../components/user/Footer';
import StepProgress from '../../../components/user/StepProgress';
import './index.css';
import { donorAPI } from '../../../services/api';
import moment from 'moment';
import { useLocation } from 'react-router-dom';

const { Option } = Select;
const { Title } = Typography;

const timeSlots = [
  { label: '07:00 - 11:00', value: '07:00-11:00' },
  { label: '13:00 - 16:00', value: '13:00-16:00' },
];

export default function BookingAntdForm() {
  const [form] = Form.useForm();
  const [profile, setProfile] = useState({});
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;
    donorAPI.getProfile().then((data) => {
      setProfile(data);
      const currentValues = form.getFieldsValue(['appointment_date', 'lastDonationDate', 'fullName', 'gender', 'phone', 'email', 'bloodGroup']);
      let appointment = currentValues.appointment_date;
      let lastDonation = currentValues.lastDonationDate;
      if (!appointment) {
        const appointDateState = location.state?.appoint_date;
        const appointDateStorage = localStorage.getItem('selectedBookingDate');
        console.log('appointDateState:', appointDateState);
        console.log('appointDateStorage:', appointDateStorage);
        if (appointDateState) {
          appointment = moment(appointDateState, ["YYYY-MM-DD", "DD/MM/YYYY"]);
        } else if (appointDateStorage) {
          appointment = moment(appointDateStorage, ["YYYY-MM-DD", "DD/MM/YYYY"]);
        }
      }
      if (data.lastDonationDate) {
        lastDonation = moment(data.lastDonationDate, ["YYYY-MM-DD", "DD/MM/YYYY"]);
      }
      form.setFieldsValue({
        appointment_date: appointment,
        lastDonationDate: lastDonation,
        fullName: currentValues.fullName || data.fullName,
        gender: currentValues.gender || data.gender,
        phone: currentValues.phone || data.phone,
        email: currentValues.email || data.email,
        bloodGroup: currentValues.bloodGroup || data.bloodGroup,
      });
      setIsInitialized(true);
    });
    // Chỉ chạy 1 lần khi mount
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (values) => {
    // Ép về moment object trước khi so sánh
    const appoint = values.appointment_date ? moment(values.appointment_date, ["YYYY-MM-DD", "DD/MM/YYYY"]) : null;
    const last = values.lastDonationDate ? moment(values.lastDonationDate, ["YYYY-MM-DD", "DD/MM/YYYY"]) : null;
    if (
      appoint && last &&
      appoint.isSame(last, 'day')
    ) {
      window.alert('Ngày hẹn hiến máu không được trùng với lần hiến máu gần nhất!');
      return;
    }
    console.log('Giá trị thực tế khi submit:', values.appointment_date?.format('YYYY-MM-DD'), values.lastDonationDate?.format('YYYY-MM-DD'));
    try {
      const donorId = profile.id || profile.donorId || profile.donor_id;
      // Cập nhật lastDonationDate và weight vào donor nếu có
      if (values.lastDonationDate) {
        await donorAPI.updateProfile({ lastDonationDate: values.lastDonationDate.format('YYYY-MM-DD') });
      }
      if (values.weight) {
        await donorAPI.updateProfile({ weight: values.weight });
      }
      // Địa chỉ mặc định
      const DEFAULT_ADDRESS = '466 Nguyễn Thị Minh Khai Phường 02, Quận 3, Tp Hồ Chí Minh';
      values.address = DEFAULT_ADDRESS;
      const email = profile.email || localStorage.getItem('email');
      const existingHistory = JSON.parse(localStorage.getItem(`appointmentHistory_${email}`)) || [];
      // Payload đăng ký hiến máu (KHÔNG gửi lastDonationDate)
      const payload = {
        donorId,
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        address: values.address,
        bloodGroup: values.bloodGroup,
        appointment_date: values.appointment_date ? values.appointment_date.format('YYYY-MM-DD') : null,
        timeSlot: values.timeSlot,
        // các trường khác nếu cần
      };
      console.log('Payload gửi lên:', payload);
      // Gửi dữ liệu lên backend và lấy registerId trả về
      const newRegister = await donorAPI.registerDonation(payload);
      console.log('Kết quả trả về từ backend:', newRegister);
      const registerId = newRegister && (newRegister.registerId || newRegister.id);
      if (!registerId) {
        window.alert('Không nhận được mã đơn đăng ký từ hệ thống! Vui lòng thử lại.');
        return;
      }
      // Tạo lịch hẹn mới với đầy đủ thông tin và registerId (không có weight)
      const newAppointment = {
        id: Date.now(),
        registerId: registerId,
        status: 'active',
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        address: values.address,
        sampleGroup: values.bloodGroup,
        sampleQuantity: values.sampleQuantity,
        donateLast: values.lastDonationDate ? values.lastDonationDate.format('DD/MM/YYYY') : null,
        sendDate: values.appointment_date ? values.appointment_date.format('DD/MM/YYYY') : null,
        donationTimeSlot: values.timeSlot,
        healthStatus: values.status,
        readyTimeRange: values.readyTimeRange || null,
        appointment_date: values.appointment_date ? values.appointment_date.format('DD/MM/YYYY') : null,
        timeSlot: values.timeSlot,
      };
      // Lưu vào localStorage sau khi đăng ký thành công
      localStorage.setItem('donationFormData', JSON.stringify({ ...values, registerId }));
      const updatedHistory = [newAppointment, ...existingHistory];
      localStorage.setItem(`appointmentHistory_${email}`, JSON.stringify(updatedHistory));
      console.log('registerId dùng để xóa:', registerId);
      // Thành công
      window.location.href = '/blood-donation-eligibility';
    } catch (error) {
      window.alert('Đăng ký lên hệ thống thất bại: ' + (error.message || error));
    }
  };

  console.log('Form values:', form.getFieldsValue());

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
                label={<span><EnvironmentOutlined style={{ color: '#43a047' }} /> Nhóm máu muốn hiến</span>}
                name="bloodGroup"
                rules={[{ required: true, message: 'Vui lòng chọn nhóm máu!' }]}
              >
                <Input readOnly placeholder="Nhóm máu" />
              </Form.Item>
              <Form.Item
                label="Cân nặng (kg)"
                name="weight"
                rules={[{ required: true, message: 'Vui lòng nhập cân nặng!' },
                  { validator: (_, value) => {
                      const gender = form.getFieldValue('gender');
                      if (!value) return Promise.resolve();
                      if (gender === 'Nam' && value < 45) return Promise.reject('Nam phải từ 45kg trở lên!');
                      if (gender === 'Nữ' && value < 42) return Promise.reject('Nữ phải từ 42kg trở lên!');
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input placeholder="Nhập cân nặng (kg)" type="number" min={30} max={200} step={1} />
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
                label="Ngày hẹn hiến máu"
                name="appointment_date"
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày hẹn hiến máu"
                  allowClear={false}
                  disabledDate={current => current && current < moment().startOf('day')}
                  onChange={() => {}}
                />
              </Form.Item>
              <Form.Item
                label="Lần hiến máu gần nhất"
                name="lastDonationDate"
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày hiến máu gần nhất (không bắt buộc)"
                  allowClear
                  disabledDate={current => current && current > moment().endOf('day')}
                  onChange={() => {}}
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