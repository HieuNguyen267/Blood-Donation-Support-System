import { Button, Form, Input, Select, DatePicker, Layout, Typography } from "antd";
import { MailOutlined, PhoneOutlined, UserOutlined, CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";
import { donorAPI } from '../../../services/api';

import "./index.css";
const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

export default function RegisterDonate() {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const defaultAddress = "466 Nguyễn Thị Minh Khai Phường 02, Quận 3, Tp Hồ Chí Minh";
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const preselectedDate = location.state?.date;
    const initialValues = {
      address: defaultAddress,
    };
    if (preselectedDate) {
      initialValues.sendTime = moment(preselectedDate, "YYYY-MM-DD");
    }
    // Lấy profile
    donorAPI.getProfile().then((data) => {
      setProfile(data);
      const setValues = {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        donateLast: undefined,
        sampleGroup: data.bloodGroup,
        ...initialValues
      };
      // KHÔNG set readyTimeRange ở đây để tránh mất giá trị người dùng chọn
      form.setFieldsValue(setValues);
    });
  }, [location.state, form]);

  const handleFormChange = (changedValues, allValues) => {
    console.log('onValuesChange:', changedValues, allValues);
  };

  const handleSubmit = async (values) => {
    // Chỉ lưu vào localStorage khi đăng ký thành công
    // Lấy lịch sử cũ từ localStorage
    const email = profile.email || localStorage.getItem('email');
    const existingHistory = JSON.parse(localStorage.getItem(`appointmentHistory_${email}`)) || [];

    // Tạo lịch hẹn mới với đầy đủ thông tin (chưa có registerId)
    const newAppointment = {
      id: Date.now(),
      status: 'active',
      fullName: values.fullName,
      phone: values.phone,
      email: values.email,
      address: values.address,
      weight: values.weight,
      sampleGroup: values.sampleGroup,
      sampleQuantity: values.sampleQuantity,
      donateLast: values.donateLast ? moment(values.donateLast).format("DD/MM/YYYY") : null,
      sendDate: values.sendTime ? moment(values.sendTime).format("DD/MM/YYYY") : null,
      donationTimeSlot: values.donationTimeSlot,
      healthStatus: values.status,
      readyTimeRange: values.readyTimeRange || null
    };

    // Gửi dữ liệu lên backend
    try {
      const donorId = profile.id || profile.donorId || profile.donor_id;
      const payload = {
        donorId,
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        address: values.address,
        weight: values.weight,
        bloodGroup: values.sampleGroup,
        quantity: values.sampleQuantity,
        lastDonationDate: values.donateLast ? moment(values.donateLast).format("YYYY-MM-DD") : null,
        readyTimeRange: values.readyTimeRange ? values.readyTimeRange.map(d => moment(d).format("YYYY-MM-DD")) : null,
        healthStatus: values.status,
        appointmentDate: values.appointmentDate ? moment(values.appointmentDate).format("YYYY-MM-DD") : null,
        preDonationSurvey: values.preDonationSurvey || "Không có triệu chứng bất thường",
        timeSlot: values.donationTimeSlot || values.timeSlot || null
      };
      const newRegister = await donorAPI.registerDonation(payload);
      // Lưu vào localStorage sau khi đăng ký thành công
      localStorage.setItem('donationFormData', JSON.stringify(values));
      const updatedHistory = [{ ...newAppointment, registerId: newRegister.registerId }, ...existingHistory];
      localStorage.setItem(`appointmentHistory_${email}`, JSON.stringify(updatedHistory));
      // Thành công
      navigate("/registerdonate");
    } catch (error) {
      window.alert('Đăng ký lên hệ thống thất bại: ' + (error.message || error));
    }
  };

  return (
    <Layout className="main-layout">
      <Header />
      <div className="form-header">
        <Title level={2} className="form-title">
          Đăng ký sẵn sàng hiến máu
        </Title>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
          <Button type="primary" style={{ minWidth: 200, fontWeight: 600, fontSize: 16, boxShadow: '0 2px 6px #0001', background: '#52c41a', borderColor: '#52c41a', color: '#fff' }}>
            Đăng ký thời điểm sẵn sàng hiến máu
          </Button>
          <Button style={{ minWidth: 200, fontWeight: 600, fontSize: 16, background: '#fff', color: '#222', border: '1.5px solid #888', boxShadow: '0 2px 6px #0001' }}
            onClick={() => navigate('/booking-antd')}>
            Đăng kí hiến máu theo thời gian
          </Button>
        </div>
      </div>

      <Content className="content">
        <div className="form-container">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            onValuesChange={handleFormChange}
          >
            <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true }]}>
              <Input prefix={<UserOutlined />} placeholder="Nhập họ tên" readOnly />
            </Form.Item>
            <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true }]}>
              <Input prefix={<PhoneOutlined />} placeholder="Nhập SĐT" readOnly />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
              <Input prefix={<MailOutlined />} placeholder="abc@gmail.com" readOnly />
            </Form.Item>
            <Form.Item label="Địa chỉ hiến máu" name="address">
              <Input prefix={<EnvironmentOutlined />} readOnly />
            </Form.Item>
            <Form.Item
              label="Nhóm máu"
              name="sampleGroup"
              rules={[{ required: true, message: "Vui lòng chọn nhóm máu" }]}
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item label="Lần hiến máu gần nhất" name="donateLast"> <DatePicker style={{ width: "100%" }} suffixIcon={<CalendarOutlined />} disabled /> </Form.Item>
            <Form.Item
              label="Thời điểm sẵn sàng hiến máu"
              name="readyTimeRange"
              rules={[
                { required: true, message: 'Vui lòng chọn khoảng thời gian sẵn sàng hiến máu!' },
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
                style={{ width: "100%" }}
                suffixIcon={<CalendarOutlined />}
                disabledDate={current => current && current < moment().startOf('day')}
              />
            </Form.Item>
            <Form.Item label="Tình trạng sức khỏe" name="status"> <Input.TextArea rows={4} /> </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block className="green-button">
                Đăng ký
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>

      <Footer />
    </Layout>
  );
}
