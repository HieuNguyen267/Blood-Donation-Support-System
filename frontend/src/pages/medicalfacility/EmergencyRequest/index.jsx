import React from "react";
import { Form, Input, Button, Typography, Select, InputNumber, Card } from "antd";
import { Dropdown } from 'antd';
import { UserCircle } from 'lucide-react';
import MedicalFacilityHeader from '../../../components/user/MedicalFacilityHeader';
import Footer from "../../../components/user/Footer";
import "./index.css";
import { FaTint, FaPhoneAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { mfBloodRequestAPI } from '../../../services/api';
import { message } from 'antd';

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
      // Lấy facilityId từ userInfo hoặc localStorage
      let userInfo = null;
      try {
        userInfo = JSON.parse(localStorage.getItem('userInfo'));
      } catch {}
      let facilityId = userInfo?.facilityId || localStorage.getItem('facilityId');
      if (!facilityId) {
        message.error('Không tìm thấy thông tin cơ sở y tế. Vui lòng đăng nhập lại.');
        return;
      }

      const requestData = {
        facilityId: Number(facilityId),
        bloodGroupId: bloodGroupMap[values.bloodGroup],
        quantityRequested: Number(values.amount),
        requestStatus: 'PENDING',
        isEmergency: true, // Đánh dấu là yêu cầu khẩn cấp
        patientInfo: values.desc || null, // Mô tả tình trạng khẩn cấp
        isCompatible: true, // Mặc định là tương hợp
        requiredBy: new Date().toISOString(), // Ngày hiện tại
        contactPerson: values.contact,
        contactPhone: values.phone,
        notes: values.additionalNotes || null, // Ghi chú thêm
        specialRequirements: values.additionalNotes || null, // Yêu cầu đặc biệt
      };

      await mfBloodRequestAPI.createBloodRequest(requestData);
      message.success({
        content: 'Gửi yêu cầu máu khẩn cấp thành công! Chúng tôi sẽ liên hệ hỗ trợ ngay lập tức.',
        duration: 3,
        style: { marginTop: '60px', fontSize: 18 },
      });
      form.resetFields();
      navigate('/medical-facility/request-history');
    } catch (err) {
      console.error('Lỗi khi gửi yêu cầu khẩn cấp:', err);
      message.error('Gửi yêu cầu thất bại: ' + (err.message || 'Lỗi không xác định'));
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
              <Form.Item name="amount" label={<b>Số lượng (ml)</b>} rules={[{ required: true, message: "Nhập số lượng" }]}
                className="emergency-item">
                <InputNumber min={100} max={10000} step={50} style={{ width: '100%' }} placeholder="Số lượng (ml)" />
              </Form.Item>
            </div>
            <Form.Item name="desc" label={<b>Mô tả tình trạng khẩn cấp (tùy chọn)</b>} className="emergency-item">
              <Input.TextArea rows={4} placeholder="Mô tả tình trạng khẩn cấp (nếu có)" />
            </Form.Item>
            <Form.Item name="additionalNotes" label={<b>Ghi chú thêm (tùy chọn)</b>} className="emergency-item">
              <Input.TextArea rows={3} placeholder="Ghi chú thêm thông tin khác (nếu có)" />
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