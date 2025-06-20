import React from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Layout,
} from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./index.css";

const { Content } = Layout;
const { Title, Text, Link } = Typography;

export default function LoginPage() {
  const onFinish = (values) => {
    console.log("Login info:", values);
  };

  return (
    <Layout className="login-layout">
      <Header />
      <Content className="login-content">
        <div className="login-form-wrapper">
         <Title level={4} className="login-title">Đăng Nhập</Title>
          <Form
            name="login-form"
            layout="vertical"
            onFinish={onFinish}
            className="login-form"
          >
            <Form.Item
              label="Nhập địa chỉ Email hoặc số điện thoại"
              name="emailOrPhone"
              rules={[{ required: true, message: "Vui lòng nhập Email hoặc số điện thoại!" }]}
            >
              <Input placeholder="Nhập Email / SDT" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                placeholder="Nhập mật khẩu"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <div className="forgot-password">
              <Link href="#">Bạn quên mật khẩu?</Link>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-button">
                Đăng nhập
              </Button>
            </Form.Item>

            <div className="register-link">
              Chưa có tài khoản? <Link href="/registerpage">Đăng ký</Link>
            </div>
          </Form>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
}
