import React, { useState } from 'react';
import { Card, Typography, Switch, Button, Divider, Form, Input, Modal, message } from 'antd';
import Header from '../../../components/user/Header';
import Footer from '../../../components/user/Footer';

const { Title } = Typography;

export default function Settings() {
  const [smsNotify, setSmsNotify] = useState(true);
  const [emailNotify, setEmailNotify] = useState(true);
  const [changePwdModal, setChangePwdModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [form] = Form.useForm();

  const handleSave = () => {
    message.success('Lưu thay đổi thành công!');
  };

  const handleChangePwd = (values) => {
    // Thực tế: gọi API đổi mật khẩu
    message.success('Đổi mật khẩu thành công! (giả lập)');
    setChangePwdModal(false);
    form.resetFields();
  };

  const handleDeleteAccount = () => {
    // Thực tế: gọi API xóa tài khoản
    message.success('Tài khoản đã bị xóa! (giả lập)');
    setDeleteModal(false);
  };

  return (
    <>
      <Header />
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f7f7f7', padding: '32px 0' }}>
        <Card style={{ maxWidth: 500, width: '100%', margin: '32px 0', borderRadius: 12 }}>
          <Title level={4} style={{ marginBottom: 24, color: '#229E42', textAlign: 'center' }}>Cài đặt tài khoản</Title>
          <div style={{ marginBottom: 24 }}>
            <b>Quản lý thông báo</b>
            <div style={{ marginTop: 12 }}>
              <Switch checked={smsNotify} onChange={setSmsNotify} style={{ marginRight: 8 }} /> Tin nhắn (SMS)
            </div>
            <div style={{ marginTop: 8 }}>
              <Switch checked={emailNotify} onChange={setEmailNotify} style={{ marginRight: 8 }} /> Email
            </div>
          </div>
          <Divider />
          <div style={{ marginBottom: 24 }}>
            <b>Bảo mật</b>
            <div style={{ marginTop: 12 }}>
              <Button type="link" onClick={() => setChangePwdModal(true)} style={{ padding: 0 }}>Đổi mật khẩu</Button>
            </div>
          </div>
          <Divider />
          <div style={{ marginBottom: 24 }}>
            <b>Tài khoản</b>
            <div style={{ marginTop: 12 }}>
              <Button danger type="link" onClick={() => setDeleteModal(true)} style={{ padding: 0 }}>Xóa tài khoản</Button>
            </div>
          </div>
          <Button type="primary" block style={{ background: '#42b72a', borderColor: '#42b72a' }} onClick={handleSave}>Lưu thay đổi</Button>
        </Card>
      </div>
      <Modal
        title="Đổi mật khẩu"
        open={changePwdModal}
        onCancel={() => setChangePwdModal(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleChangePwd}>
          <Form.Item label="Mật khẩu hiện tại" name="oldPassword" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="Mật khẩu mới" name="newPassword" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }, { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="Xác nhận mật khẩu mới" name="confirmPassword" dependencies={['newPassword']} rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
              },
            }),
          ]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Đổi mật khẩu</Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Xóa tài khoản"
        open={deleteModal}
        onOk={handleDeleteAccount}
        onCancel={() => setDeleteModal(false)}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.</p>
      </Modal>
      <Footer />
    </>
  );
} 