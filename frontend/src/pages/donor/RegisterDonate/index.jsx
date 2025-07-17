import { Button, Form, Input, Select, DatePicker, Layout, Typography, message } from "antd";
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

// Hàm chuyển đổi nhóm máu
function formatBloodGroup(bloodGroup) {
  if (!bloodGroup) return '';
  return bloodGroup
    .replace('positive', '+')
    .replace('negative', '-');
}

export default function RegisterDonate() {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const defaultAddress = "466 Nguyễn Thị Minh Khai Phường 02, Quận 3, Tp Hồ Chí Minh";
  const [profile, setProfile] = useState({});
  const [lastDonationDisabled, setLastDonationDisabled] = useState(false);

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
      let lastDonation = undefined;
      let disableLastDonation = false;
      if (data.lastDonationDate) {
        lastDonation = moment(data.lastDonationDate);
        disableLastDonation = true;
      }
      const setValues = {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        donateLast: lastDonation,
        sampleGroup: formatBloodGroup(data.bloodGroup),
        ...initialValues
      };
      // KHÔNG set readyTimeRange ở đây để tránh mất giá trị người dùng chọn
      form.setFieldsValue(setValues);
      setLastDonationDisabled(disableLastDonation);
    });
  }, [location.state, form]);

  const handleFormChange = (changedValues, allValues) => {
    console.log('onValuesChange:', changedValues, allValues);
  };
// Hàm chuyển đổi moment hoặc string hoặc Date sang YYYY-MM-DD
const toDateString = (val) => {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (val._isAMomentObject) return val.format('YYYY-MM-DD');
  if (val instanceof Date) return moment(val).format('YYYY-MM-DD');
  if (val.$d) return moment(val.$d).format('YYYY-MM-DD'); // Trường hợp dayjs hoặc moment clone
  return '';
};

  const handleSubmit = async (values) => {
    try {
      // Lấy profile mới nhất
      const profile = await donorAPI.getProfile();
      // 1. Kiểm tra đơn hiến máu chưa hoàn thành
      const donationHistory = await donorAPI.getDonationHistory();
      const hasActiveDonation = donationHistory && donationHistory.some(d =>
        d.donationStatus !== 'deferred' &&
        d.donationStatus !== 'completed' &&
        d.status !== 'Not meeting health requirements'
      );
      if (hasActiveDonation) {
        message.error('Bạn đã đăng ký hiến máu rồi. Vui lòng hoàn thành hoặc hủy đơn trước khi đăng ký mới.');
        return;
      }
      // 2. Kiểm tra trạng thái sẵn sàng hiến máu
      if (profile.isEligible) {
        const now = moment();
        const availableFrom = profile.availableFrom ? moment(profile.availableFrom) : null;
        const availableUntil = profile.availableUntil ? moment(profile.availableUntil) : null;
        if (
          (availableFrom && now.isBefore(availableFrom, 'day')) ||
          (availableFrom && availableUntil && now.isBetween(availableFrom, availableUntil, 'day', '[]')) ||
          (availableUntil && now.diff(availableUntil, 'days') < 84)
        ) {
          message.error('Bạn đã đăng ký sẵn sàng hiến máu, không thể đăng ký hiến máu ngay bây giờ.');
          return;
        }
      }
      // 3. Nếu hợp lệ, cập nhật profile
      const [from, until] = values.readyTimeRange || [];
      console.log('readyTimeRange:', values.readyTimeRange, 'from:', from, 'until:', until, 'from type:', typeof from, 'until type:', typeof until);
      const availableFrom = toDateString(from);
      const availableUntil = toDateString(until);
      if (!availableFrom || !availableUntil) {
        message.error('Vui lòng chọn thời điểm sẵn sàng hiến máu!');
        return;
      }
      await donorAPI.updateProfile({
        availableFrom,
        availableUntil,
        isEligible: true,
        note: values.status || ''
      });
      message.success('Đăng ký sẵn sàng hiến máu thành công!');
      navigate('/registerdonate');
    } catch (error) {
      message.error('Có lỗi xảy ra khi đăng ký: ' + (error.message || ''));
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
              <Input readOnly value={formatBloodGroup(form.getFieldValue('sampleGroup'))} />
            </Form.Item>
            <Form.Item label="Lần hiến máu gần nhất" name="donateLast">
              <DatePicker
                style={{ width: "100%", color: lastDonationDisabled ? '#888' : '#222' }}
                suffixIcon={<CalendarOutlined />}
                disabled={lastDonationDisabled}
                inputReadOnly={lastDonationDisabled}
                allowClear={!lastDonationDisabled}
              />
            </Form.Item>
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
