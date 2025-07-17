import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Select, Button, Card, Typography, Row, Col, Input, message } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';
import Header from '../../../components/user/Header';
import Footer from '../../../components/user/Footer';
import StepProgress from '../../../components/user/StepProgress';
import './index.css';
import { donorAPI } from '../../../services/api';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';

const { Option } = Select;
const { Title } = Typography;

export default function BookingAntdForm() {
  const [form] = Form.useForm();
  const [profile, setProfile] = useState({});
  const [timeEvents, setTimeEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Hàm hiển thị giới tính tiếng Việt
  const renderGender = (gender) => {
    if (!gender) return '-';
    if (gender.toLowerCase() === 'male') return 'Nam';
    if (gender.toLowerCase() === 'female') return 'Nữ';
    return gender;
  };

  // Hàm hiển thị nhóm máu đúng chuẩn ABO+/-
  const renderBloodGroup = (aboType, rhFactor) => {
    if (!aboType || !rhFactor) return '-';
    const rh = rhFactor.toLowerCase() === 'positive' ? '+' : rhFactor.toLowerCase() === 'negative' ? '-' : '';
    return aboType + rh;
  };

  // Hàm kiểm tra 84 ngày
  const check84Days = (lastDonationDate) => {
    if (!lastDonationDate) return true; // Nếu chưa có lần hiến nào thì cho phép
    const lastDonation = moment(lastDonationDate);
    const today = moment();
    const daysDiff = today.diff(lastDonation, 'days');
    return daysDiff >= 84;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
         // Lấy thông tin profile donor
         const profileData = await donorAPI.getProfile();
         setProfile(profileData);
        
        // Lấy danh sách khung giờ hiến máu
        const timeEventsData = await donorAPI.getTimeEvents();
        setTimeEvents(timeEventsData);
       
         // Điền dữ liệu vào form
        form.setFieldsValue({
         fullName: profileData.fullName,
         gender: renderGender(profileData.gender),
         phone: profileData.phone,
         email: profileData.email,
         bloodGroup: renderBloodGroup(profileData.aboType, profileData.rhFactor),
         weight: profileData.weight,
         lastDonationDate: profileData.lastDonationDate ? moment(profileData.lastDonationDate) : null,
        });

        // Tự động điền appointment_date nếu có
        const appointDate = location.state?.appoint_date || localStorage.getItem('selectedBookingDate');
        if (appointDate) {
          form.setFieldsValue({ appointment_date: moment(appointDate, ["YYYY-MM-DD", "DD/MM/YYYY"]) });
        }
      } catch (error) {
        console.error('Error loading data:', error);
        message.error('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [form, location]);

  const handleSubmit = async (values) => {
    try {
      // Kiểm tra ngày hẹn hiến máu so với lần hiến máu gần nhất và ngày hiện tại
      const lastDonationDate = values.lastDonationDate || profile.lastDonationDate;
      const appointmentDate = values.appointment_date ? moment(values.appointment_date) : null;
      const today = moment();
      if (lastDonationDate && appointmentDate) {
        const lastDonation = moment(lastDonationDate, ["YYYY-MM-DD", "DD/MM/YYYY"]);
        const daysDiffSelected = appointmentDate.diff(lastDonation, 'days');
        const daysDiffNow = today.diff(lastDonation, 'days');
        if (daysDiffNow < 84) {
          message.error('Bạn đang trong thời gian phục hồi sau hiến máu (chưa đủ 84 ngày từ lần hiến gần nhất). Vui lòng quay lại sau.');
          return;
        }
        if (daysDiffSelected < 84) {
          message.error('Ngày bạn chọn chưa đủ 84 ngày kể từ lần hiến máu gần nhất. Vui lòng chọn ngày khác.');
          return;
        }
      }
      // Kiểm tra 84 ngày (logic cũ)
      if (!check84Days(lastDonationDate)) {
        message.error('Bạn đang trong thời gian phục hồi sức khỏe sau hiến máu (cần ít nhất 84 ngày). Vui lòng quay lại sau.');
        navigate('/registerdonateform');
        return;
      }
      // Kiểm tra trạng thái sẵn sàng hiến máu (logic chuẩn)
      if (profile.isEligible) {
        const now = moment();
        const availableFrom = profile.availableFrom ? moment(profile.availableFrom) : null;
        const availableUntil = profile.availableUntil ? moment(profile.availableUntil) : null;
        const lastDonation = profile.lastDonationDate ? moment(profile.lastDonationDate, ["YYYY-MM-DD", "DD/MM/YYYY"]) : null;
        // Trước available_from và chưa đủ 84 ngày từ lần hiến máu gần nhất
        if (availableFrom && now.isBefore(availableFrom, 'day') && lastDonation && now.diff(lastDonation, 'days') < 84) {
          message.error('Bạn đã đăng ký sẵn sàng hiến máu, không thể đăng ký hiến máu ngay bây giờ.');
          return;
        }
        // Trong khoảng available_from - available_until
        if (availableFrom && availableUntil && now.isBetween(availableFrom, availableUntil, 'day', '[]')) {
          message.error('Bạn đã đăng ký sẵn sàng hiến máu, không thể đăng ký hiến máu ngay bây giờ.');
          return;
        }
        // Sau available_until nhưng chưa đủ 84 ngày từ available_until
        if (availableUntil && now.isAfter(availableUntil, 'day') && now.diff(availableUntil, 'days') < 84) {
          message.error('Bạn đã đăng ký sẵn sàng hiến máu, không thể đăng ký hiến máu ngay bây giờ.');
          return;
        }
      }
      // Cập nhật weight vào donor
      await donorAPI.updateProfile({ weight: values.weight });
      // Lưu dữ liệu vào bộ đệm (localStorage) để chuyển sang trang khảo sát sức khỏe
      const formData = {
        ...values,
        timeId: values.timeSlot, // Lưu timeId thay vì timeSlot
        appointment_date: values.appointment_date ? values.appointment_date.format("YYYY-MM-DD") : null,
        lastDonationDate: values.lastDonationDate ? values.lastDonationDate.format("YYYY-MM-DD") : null,
        additional_notes: values.note,
        weight_kg: values.weight,
      };
      localStorage.setItem('donationFormData', JSON.stringify(formData));
      // Chuyển sang trang khảo sát sức khỏe
      navigate('/blood-donation-eligibility');
    } catch (error) {
      console.error('Error submitting form:', error);
      message.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div>Đang tải dữ liệu...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="form-header">
        <Title level={2} className="form-title">
          Đặt lịch hiến máu
        </Title>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
          <Button style={{ minWidth: 200, fontWeight: 600, fontSize: 16, background: '#fff', color: '#222', border: '1.5px solid #888', boxShadow: '0 2px 6px #0001' }}
            onClick={() => navigate('/registerdonateform')}>
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
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
              >
                <Input readOnly placeholder="Email" />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input readOnly placeholder="Số điện thoại" />
              </Form.Item>
              <Form.Item
                label={<span><EnvironmentOutlined style={{ color: '#43a047' }} /> Nhóm máu muốn hiến</span>}
                name="bloodGroup"
                rules={[{ required: true, message: 'Vui lòng chọn nhóm máu!' }]}
              >
                <Input readOnly placeholder="Nhóm máu" />
              </Form.Item>
              <Form.Item
                label="Lần hiến máu gần nhất"
                name="lastDonationDate"
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày hiến máu gần nhất"
                  allowClear
                  disabledDate={current => current && current > moment().endOf('day')}
                  disabled={profile.lastDonationDate ? true : false}
                />
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
                  {timeEvents.map(event => (
                    <Option key={event.timeEventId} value={event.timeEventId}>
                      {event.startTime?.slice(0,5)} - {event.endTime?.slice(0,5)}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Ngày hẹn hiến máu"
                name="appointment_date"
                rules={[
                  { required: true, message: 'Vui lòng chọn ngày hẹn!' }
                ]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày hẹn hiến máu"
                  allowClear={false}
                  disabledDate={current =>
                    current && (current < moment().startOf('day') || current > moment().add(1, 'year').endOf('day'))
                  }
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