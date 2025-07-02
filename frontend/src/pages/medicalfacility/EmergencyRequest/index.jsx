import React from "react";
import { Form, Input, Button, Typography, Select, InputNumber, Card } from "antd";
import { Dropdown } from 'antd';
import { UserCircle } from 'lucide-react';
import MedicalFacilityHeader from '../../../components/user/MedicalFacilityHeader';
import Footer from "../../../components/user/Footer";
import "./index.css";
import { FaTint, FaPhoneAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

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

const bloodGroupMap = {
  "A+": 1,
  "A-": 2,
  "B+": 3,
  "B-": 4,
  "AB+": 5,
  "AB-": 6,
  "O+": 7,
  "O-": 8
};

export default function EmergencyRequest() {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const payload = {
        facilityId: 1, // hoặc lấy từ context/user nếu có
        requesterName: values.patient,
        contactPerson: values.contact,
        contactPhone: values.phone,
        bloodGroupId: bloodGroupMap[values.bloodGroup],
        facilityName: values.hospital,
        quantityRequested: values.amount,
        component: values.component,
        notes: values.desc,
        requiredBy: values.dateNeeded ? values.dateNeeded + 'T00:00:00' : null,
      };
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:8080/emergency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        alert("Gửi yêu cầu thành công!");
        form.resetFields();
      } else {
        alert("Gửi yêu cầu thất bại!");
      }
    } catch {
      alert("Gửi yêu cầu thất bại!");
    }
  };

  return (
    <>
      {/* Header Component */}
      <MedicalFacilityHeader />

      <div className="emergency-wrapper">
        <Card className="emergency-card" variant="outlined">
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:12,marginBottom:8}}>
            <FaTint style={{color:'#e53935',fontSize:36,filter:'drop-shadow(0 2px 8px #ffebee)'}}/>
            <Title level={3} className="emergency-title" style={{margin:0}}>
              Yêu cầu nhận máu khẩn cấp
            </Title>
          </div>
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
              <Form.Item name="patient" label={<b>Họ và tên bệnh nhân</b>} rules={[{ required: true, message: "Vui lòng nhập họ tên bệnh nhân" }]}
                className="emergency-item">
                <Input placeholder="Nhập họ tên bệnh nhân" />
              </Form.Item>
              <Form.Item name="contact" label={<b>Người liên lạc</b>} rules={[{ required: true, message: "Vui lòng nhập tên người liên lạc" }]}
                className="emergency-item">
                <Input placeholder="Người liên lạc" />
              </Form.Item>
              <Form.Item name="phone" label={<b>Số điện thoại</b>} rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                className="emergency-item">
                <Input placeholder="Số điện thoại" />
              </Form.Item>
              <Form.Item name="bloodGroup" label={<b>Nhóm máu</b>} rules={[{ required: true, message: "Chọn nhóm máu" }]}
                className="emergency-item">
                <Select placeholder="Chọn nhóm máu" options={bloodGroups} />
              </Form.Item>
            </div>
            <div className="emergency-row">
              <Form.Item name="hospital" label={<b>Cơ sở y tế</b>} rules={[{ required: true, message: "Nhập cơ sở y tế" }]}
                className="emergency-item">
                <Input placeholder="Tên bệnh viện/cơ sở y tế" />
              </Form.Item>
              <Form.Item name="amount" label={<b>Số lượng (ml)</b>} rules={[{ required: true, message: "Nhập số lượng" }]}
                className="emergency-item">
                <InputNumber min={100} max={10000} step={50} style={{ width: '100%' }} placeholder="Số lượng (ml)" />
              </Form.Item>
              <Form.Item name="component" label={<b>Thành phần</b>} rules={[{ required: true, message: "Chọn thành phần" }]}
                className="emergency-item">
                <Select placeholder="Chọn thành phần" options={components} />
              </Form.Item>
            </div>
            <Form.Item name="desc" label={<b>Mô tả tình trạng khẩn cấp (tùy chọn)</b>} className="emergency-item">
              <Input.TextArea rows={4} placeholder="Mô tả tình trạng khẩn cấp (nếu có)" />
            </Form.Item>
            <Form.Item name="dateNeeded" label={<b>Ngày cần máu</b>} rules={[{ required: true, message: "Vui lòng chọn ngày cần máu" }]}
              className="emergency-item">
              <Input type="date" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="emergency-btn">
                <FaTint style={{marginRight:8,marginBottom:2}}/> Gửi yêu cầu
              </Button>
            </Form.Item>
          </Form>
          <div className="emergency-hotline">
            <FaPhoneAlt style={{color:'#e53935',marginRight:6,marginBottom:-2}}/>
            <span>Hotline hỗ trợ <b>1900 1234</b></span>
          </div>
        </Card>
      </div>
      <Footer />
    </>
  );
}