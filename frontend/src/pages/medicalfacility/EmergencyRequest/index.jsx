import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Select, InputNumber, Card, message } from "antd";
import { Dropdown } from 'antd';
import { UserCircle } from 'lucide-react';
import { FaTint, FaPhoneAlt } from 'react-icons/fa';
import MedicalFacilityHeader from '../../../components/user/MedicalFacilityHeader';
import Footer from "../../../components/user/Footer";
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
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      // Lấy thông tin cơ sở y tế từ localStorage
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const facilityId = userInfo.facilityId;

      if (!facilityId) {
        alert('Không tìm thấy thông tin cơ sở y tế. Vui lòng đăng nhập lại.');
        return;
      }

      const payload = {
        facilityId: facilityId,
        bloodGroupId: bloodGroupMap[values.bloodGroup],
        quantityRequested: values.amount,
        urgencyLevel: "urgent",
        contactPerson: values.contact,
        contactPhone: values.phone,
        notes: values.desc,
        patientInfo: values.patient,
        facilityName: values.hospital,
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
        const data = await response.json();
        alert("Gửi yêu cầu khẩn cấp thành công!");
        form.resetFields();
        // Chuyển hướng đến trang theo dõi quá trình
        navigate(`/medical-facility/emergency-process/${data.requestId}`, { 
          state: { request: data } 
        });
      } else {
        alert("Gửi yêu cầu thất bại! Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error('Lỗi:', error);
      alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.");
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
              🚨 Yêu cầu máu khẩn cấp
            </Title>
          </div>
          <Text className="emergency-sub">
            Vui lòng điền đầy đủ thông tin để gửi yêu cầu máu khẩn cấp
          </Text>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="emergency-form"
          >
            <div className="emergency-row">
              <Form.Item name="patient" label={<b>Tên bệnh nhân</b>} rules={[{ required: true, message: "Vui lòng nhập tên bệnh nhân" }]}
                className="emergency-item">
                <Input placeholder="Nhập tên bệnh nhân" />
              </Form.Item>
              <Form.Item name="contact" label={<b>Người liên hệ</b>} rules={[{ required: true, message: "Vui lòng nhập tên người liên hệ" }]}
                className="emergency-item">
                <Input placeholder="Nhập tên người liên hệ" />
              </Form.Item>
              <Form.Item name="phone" label={<b>Số điện thoại</b>} rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                className="emergency-item">
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
              <Form.Item name="bloodGroup" label={<b>Nhóm máu cần</b>} rules={[{ required: true, message: "Chọn nhóm máu" }]}
                className="emergency-item">
                <Select placeholder="Chọn nhóm máu" options={bloodGroups} />
              </Form.Item>
            </div>
            <div className="emergency-row">
              <Form.Item name="hospital" label={<b>Tên cơ sở y tế</b>} rules={[{ required: true, message: "Vui lòng nhập tên cơ sở y tế" }]}
                className="emergency-item">
                <Input placeholder="Nhập tên cơ sở y tế" />
              </Form.Item>
              <Form.Item name="amount" label={<b>Số lượng cần (ml)</b>} rules={[{ required: true, message: "Vui lòng nhập số lượng máu cần" }]}
                className="emergency-item">
                <InputNumber min={1} max={5000} step={1} style={{ width: '100%' }} placeholder="Nhập số lượng (ml)" />
              </Form.Item>
              <Form.Item name="dateNeeded" label={<b>Ngày cần</b>} rules={[{ required: true, message: "Vui lòng chọn ngày cần máu" }]}
                className="emergency-item">
                <Input type="date" />
              </Form.Item>
            </div>
            <Form.Item name="desc" label={<b>Ghi chú</b>} className="emergency-item">
              <Input.TextArea rows={4} placeholder="Nhập thông tin bổ sung nếu cần..." />
            </Form.Item>
            <Form.Item>
              <Button type="primary" danger htmlType="submit" className="emergency-btn">
                <FaTint style={{marginRight:8,marginBottom:2}}/> Gửi yêu cầu khẩn cấp
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