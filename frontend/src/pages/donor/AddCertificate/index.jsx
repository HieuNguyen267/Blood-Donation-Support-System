import React from "react";
import {
  Form,
  Input,
  Upload,
  Button,
  DatePicker,
  InputNumber,
  Typography,
  Layout,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import "./index.css";
import { useNavigate } from 'react-router-dom';
import { certificatesAPI } from "../../../services/api";

const { Title } = Typography;
const { Content } = Layout;

export default function AddCertificate() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = (values) => {
    // Xử lý ảnh
    let imageUrl = '';
    if (values.image && values.image[0] && values.image[0].originFileObj) {
      imageUrl = URL.createObjectURL(values.image[0].originFileObj);
    }
    // Lưu dữ liệu vào localStorage
    const dataToSave = {
      ...values,
      imageUrl,
      birthDate: values.birthDate ? values.birthDate.format('DD/MM/YYYY') : '',
    };
    localStorage.setItem('certificateFormData', JSON.stringify(dataToSave));
    navigate('/addcertificate');
  };

  return (
    <Layout>
      <Header />
      <Title level={2} className="form-title">
        Thêm chứng nhận
      </Title>
      <Content className="add-cert-container">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="add-cert-form"
        >
          <Form.Item
            name="image"
            label="Ảnh giấy chứng nhận"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            rules={[{ required: true, message: "Vui lòng tải ảnh giấy chứng nhận." }]}
          >
            <Upload name="image" listType="picture" beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="idNumber"
            label="Giấy tờ tùy thân"
            rules={[{ required: true, message: "Vui lòng nhập số giấy tờ tùy thân." }]}
          >
            <Input placeholder="VD: 1234567" />
          </Form.Item>

          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên." }]}
          >
            <Input placeholder="VD: Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            name="birthDate"
            label="Ngày sinh"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh." }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ." }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="facility"
            label="Cơ sở tiếp nhận máu"
            rules={[{ required: true, message: "Vui lòng nhập cơ sở tiếp nhận." }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Lượng máu (ml)"
            rules={[{ required: true, message: "Vui lòng nhập lượng máu." }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="serial"
            label="Số seri"
            rules={[{ required: true, message: "Vui lòng nhập số seri." }]}
          >
            <Input placeholder="VD: 1234567" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
            <Button htmlType="button" onClick={() => navigate('/addcertificate')} style={{ marginLeft: 8 }}>
              Quay về
            </Button>
          </Form.Item>
        </Form>
      </Content>
      <Footer />
    </Layout>
  );
}