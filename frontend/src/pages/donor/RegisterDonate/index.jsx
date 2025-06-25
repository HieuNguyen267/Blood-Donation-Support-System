import { Button, Form, Input, Select, DatePicker, Layout, Typography } from "antd";
import { MailOutlined, PhoneOutlined, UserOutlined, CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import StepProgress from "../../../components/user/StepProgress";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";

import "./index.css";
const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

export default function RegisterDonate() {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const defaultAddress = "466 Nguyễn Thị Minh Khai Phường 02, Quận 3, Tp Hồ Chí Minh";
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [maxBloodVolume, setMaxBloodVolume] = useState(450);

  // Lấy userInfo từ localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const donorId = userInfo.donorId;

  // Hàm tính toán số lượng máu tối đa
  const calculateMaxBloodVolume = (weight, gender) => {
    if (!weight || !gender) return 450;
    const w = parseFloat(weight);
    if (isNaN(w)) return 450;
    if (gender === "Nam") {
      return Math.min(w * 8, w * 9, 450);
    } else if (gender === "Nữ") {
      return Math.min(w * 7, w * 9, 450);
    }
    return 450;
  };

  useEffect(() => {
    const preselectedDate = location.state?.date;
    const initialValues = {
      address: defaultAddress,
      fullName: userInfo.fullName || "",
      phone: userInfo.phone || "",
      email: userInfo.email || "",
      weight: userInfo.weight || "",
      sampleGroup: userInfo.bloodGroup || "",
      gender: userInfo.gender || "",
      // Có thể bổ sung thêm các trường khác nếu userInfo có
    };
    // Tính maxBloodVolume khi load lần đầu
    const max = calculateMaxBloodVolume(userInfo.weight, userInfo.gender);
    console.log("Tính maxBloodVolume lần đầu:", userInfo.weight, userInfo.gender, "=>", max);
    setMaxBloodVolume(max);
    if (preselectedDate) {
      initialValues.sendTime = moment(preselectedDate, "YYYY-MM-DD");
      setIsDateSelected(true); // Enable time slots if date is pre-selected
    }
    form.setFieldsValue(initialValues);
  }, [location.state, form, userInfo]);

  const handleFormChange = (changedValues, allValues) => {
    if ("sendTime" in changedValues) {
      setIsDateSelected(!!changedValues.sendTime);
    }
    // Khi thay đổi cân nặng hoặc gender, tính lại maxBloodVolume
    if ("weight" in changedValues || "gender" in changedValues) {
      const weight = allValues.weight;
      const gender = allValues.gender || userInfo.gender;
      const max = calculateMaxBloodVolume(weight, gender);
      console.log("Tính maxBloodVolume với:", weight, gender, "=>", max);
      setMaxBloodVolume(max);
      if (allValues.sampleQuantity && parseInt(allValues.sampleQuantity) > max) {
        form.setFieldsValue({ sampleQuantity: undefined });
      }
    }
  };

  const handleSubmit = (values) => {
    // Lấy lịch sử cũ từ localStorage
    const existingHistory = JSON.parse(localStorage.getItem("appointmentHistory")) || [];

    // Tạo lịch hẹn mới với đầy đủ thông tin
    const newAppointment = {
      id: Date.now(),
      status: 'active', // 'active' or 'cancelled'
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
    };

    // Thêm lịch hẹn mới vào đầu danh sách
    const updatedHistory = [newAppointment, ...existingHistory];

    // Lưu lại vào localStorage
    localStorage.setItem("appointmentHistory", JSON.stringify(updatedHistory));

    // Chuyển hướng đến trang lịch sử đặt hẹn
    navigate("/appointmenthistory");
  };

  return (
    <Layout className="main-layout">
      <Header />
      <div className="form-header">
        <Title level={2} className="form-title">
          Đăng ký hiến máu
        </Title>
        <div className="step-progress-wrapper">
          <StepProgress />
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
            <Form.Item label="Họ và tên *" name="fullName" rules={[{ required: true }]}>
              <Input prefix={<UserOutlined />} placeholder="Nhập họ tên" />
            </Form.Item>

            <Form.Item label="Số điện thoại *" name="phone" rules={[{ required: true }]}>
              <Input prefix={<PhoneOutlined />} placeholder="Nhập SĐT" />
            </Form.Item>

            <Form.Item label="Email *" name="email" rules={[{ required: true, type: "email" }]}>
              <Input prefix={<MailOutlined />} placeholder="abc@gmail.com" />
            </Form.Item>

            <Form.Item label="Địa chỉ hiến máu" name="address">
              <Input prefix={<EnvironmentOutlined />} disabled />
            </Form.Item>

            <Form.Item
              label="Cân nặng (kg) *"
              name="weight"
              rules={[
                { required: true, message: "Vui lòng nhập cân nặng" },
                {
                  pattern: /^[0-9]{1,3}$/,
                  message: "Cân nặng phải là số từ 1 đến 999",
                },
              ]}
            >
              <Input placeholder="Nhập cân nặng của bạn" />
            </Form.Item>

            <Form.Item
              label="Nhóm máu *"
              name="sampleGroup"
              rules={[{ required: true, message: "Vui lòng chọn nhóm máu" }]}
            >
              <Select placeholder="Chọn nhóm máu">
                <Select.Option value="A+">A+</Select.Option>
                <Select.Option value="A-">A-</Select.Option>
                <Select.Option value="B+">B+</Select.Option>
                <Select.Option value="B-">B-</Select.Option>
                <Select.Option value="O+">O+</Select.Option>
                <Select.Option value="O-">O-</Select.Option>
                <Select.Option value="AB+">AB+</Select.Option>
                <Select.Option value="AB-">AB-</Select.Option>
                <Select.Option value="Rh null">Rh null</Select.Option>
                <Select.Option value="Bombay(hh)">Bombay (hh)</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Số lượng máu muốn hiến (ml) *"
              name="sampleQuantity"
              rules={[
                { required: true, message: "Vui lòng nhập số lượng máu" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value) return Promise.resolve();
                    if (value < 250) return Promise.reject("Tối thiểu 250ml");
                    if (value > maxBloodVolume) return Promise.reject(`Tối đa ${maxBloodVolume}ml theo cân nặng và giới tính`);
                    return Promise.resolve();
                  }
                })
              ]}
            >
              <Input
                type="number"
                min={250}
                max={maxBloodVolume}
                placeholder={`Nhập số ml (tối đa ${maxBloodVolume}ml)`}
              />
            </Form.Item>

            <Form.Item label="Lần hiến máu gần nhất *" name="donateLast" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} suffixIcon={<CalendarOutlined />} />
            </Form.Item>

            <Form.Item label="Thời điểm sẵn sàng hiến máu *" name="sendTime" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} suffixIcon={<CalendarOutlined />} />
            </Form.Item>

            <Form.Item
              label="Khung giờ có thể hiến máu *"
              name="donationTimeSlot"
              rules={[{ required: true, message: "Vui lòng chọn khung giờ" }]}
            >
              <Select placeholder="Vui lòng chọn ngày trước" disabled={!isDateSelected}>
                <Option value="08:00-11:00">Sáng (08:00 - 11:00)</Option>
                <Option value="13:00-16:00">Chiều (13:00 - 16:00)</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Tình trạng sức khỏe *" name="status" rules={[{ required: true }]}>
              <Input.TextArea rows={4} />
            </Form.Item>

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
