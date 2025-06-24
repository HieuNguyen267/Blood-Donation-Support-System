import React, { useState } from "react";
import { Form, Input, Button, Typography, Select, InputNumber, Card, message } from "antd";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import { bloodRequestAPI } from "../../../services/api";
import "./index.css";

const { Title, Text } = Typography;

const bloodGroups = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
  { label: "Bombay (hh)", value: "Bombay" },
  { label: "Rhnull", value: "Rhnull" },
];

const components = [
  { label: "Toàn phần", value: "toanphan" },
  { label: "Hồng cầu", value: "hongcau" },
  { label: "Tiểu cầu", value: "tieucau" },
  { label: "Huyết tương", value: "huyettuong" },
];

export default function EmergencyRequest() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Chuẩn bị dữ liệu cho API
      const requestData = {
        patientName: values.patient,
        contactPerson: values.contact,
        phoneNumber: values.phone,
        bloodGroup: values.bloodGroup,
        hospital: values.hospital,
        amount: values.amount,
        component: values.component,
        description: values.desc,
        isEmergency: true,
        status: 'PENDING'
      };

      await bloodRequestAPI.createRequest(requestData);
      
      message.success("Yêu cầu của bạn đã được gửi! Chúng tôi sẽ liên hệ hỗ trợ sớm nhất.");
    form.resetFields();
    } catch (error) {
      console.error('Emergency request error:', error);
      message.error(error.message || 'Gửi yêu cầu thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="emergency-wrapper">
        <Card className="emergency-card" bordered={false}>
          <Title level={3} className="emergency-title">
            Yêu cầu nhận máu khẩn cấp
          </Title>
          <Text className="emergency-sub">
            Bạn đang cần máu gấp?<br />
            Hãy điền thông tin bên dưới để được hỗ trợ nhanh nhất
          </Text>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="emergency-form"
          >
            <div className="emergency-row">
              <Form.Item name="patient" label="Họ và tên bệnh nhân" rules={[{ required: true, message: "Vui lòng nhập họ tên bệnh nhân" }]}
                className="emergency-item">
                <Input placeholder="Nhập họ tên bệnh nhân" />
              </Form.Item>
              <Form.Item name="contact" label="Người liên lạc" rules={[{ required: true, message: "Vui lòng nhập tên người liên lạc" }]}
                className="emergency-item">
                <Input placeholder="Người liên lạc" />
              </Form.Item>
              <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                className="emergency-item">
                <Input placeholder="Số điện thoại" />
              </Form.Item>
              <Form.Item name="bloodGroup" label="Nhóm máu" rules={[{ required: true, message: "Chọn nhóm máu" }]}
                className="emergency-item">
                <Select placeholder="Chọn nhóm máu" options={bloodGroups} />
              </Form.Item>
            </div>
            <div className="emergency-row">
              <Form.Item name="hospital" label="Cơ sở y tế" rules={[{ required: true, message: "Nhập cơ sở y tế" }]}
                className="emergency-item">
                <Input placeholder="Tên bệnh viện/cơ sở y tế" />
              </Form.Item>
              <Form.Item name="amount" label="Số lượng (ml)" rules={[{ required: true, message: "Nhập số lượng" }]}
                className="emergency-item">
                <InputNumber min={100} max={10000} step={50} style={{ width: '100%' }} placeholder="Số lượng (ml)" />
              </Form.Item>
              <Form.Item name="component" label="Thành phần" rules={[{ required: true, message: "Chọn thành phần" }]}
                className="emergency-item">
                <Select placeholder="Chọn thành phần" options={components} />
              </Form.Item>
            </div>
            <Form.Item name="desc" label="Mô tả tình trạng khẩn cấp (tùy chọn)" className="emergency-item">
              <Input.TextArea rows={4} placeholder="Mô tả tình trạng khẩn cấp (nếu có)" />
            </Form.Item>
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                className="emergency-btn"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
              </Button>
            </Form.Item>
          </Form>
          <div className="emergency-hotline">
            Hotline hỗ trợ <b>1900 1234</b>
          </div>
        </Card>
      </div>
      <Footer />
    </>
  );
} 