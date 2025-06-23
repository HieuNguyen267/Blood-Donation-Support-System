import React from 'react';
import { Layout, Button, DatePicker, Typography, Row, Col, Card } from 'antd';
import { SearchOutlined, PhoneOutlined } from '@ant-design/icons';
import './index.css';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { donorAPI, medicalFacilityAPI } from "../../../services/api";
import moment from 'moment';

const { Content } = Layout;
const { Title, Text } = Typography;

const data = [
  {
    id: 1,
    title: 'Cơ sở chính',
    address: '46 Nguyễn Minh Khai, Phường 02, Quận 3, TP Hồ Chí Minh',
    time: '17/05/2025 - 11:00 đến 15:30',
    registered: 202,
    capacity: 204,
  },
  {
    id: 2,
    title: 'Cơ sở chính',
    address: '46 Nguyễn Minh Khai, Phường 02, Quận 3, TP Hồ Chí Minh',
    time: '17/05/2025 - 11:00 đến 15:30',
    registered: 209,
    capacity: 210,
  },
  {
    id: 3,
    title: 'Cơ sở chính',
    address: '46 Nguyễn Minh Khai, Phường 02, Quận 3, TP Hồ Chí Minh',
    time: '17/05/2025 - 11:00 đến 15:30',
    registered: 180,
    capacity: 200,
  },
];

const AppointmentSchedule = () => {
  return (
    <Layout>
      <Header />
      <Content>
        <div className="main-container">
          <div className="filter-row">
            <span className="filter-title">Bạn cần đặt lịch vào thời gian nào?</span>
            <div className="filter-form">
              <DatePicker placeholder="Từ ngày" />
              <DatePicker placeholder="Đến ngày" />
              <Button icon={<SearchOutlined />} className="green-btn">Tìm kiếm</Button>
              
            </div>
          </div>

          <div className="button-group">
            <Button>Đăng ký thời điểm sẵn sàng hiến máu</Button>
            <Button className="green-btn">Đặt lịch hiến máu theo thời gian</Button>
          </div>
 <span className="result-count-row">Có {data.length} lịch hẹn phù hợp</span>
          <Row gutter={[16, 16]}>
            {data.map(item => (
              <Col span={24} key={item.id}>
                <Card className="schedule-card">
                  <div className="schedule-card-content">
                    <img
                      src="/images/datlich.jpg"
                      alt="logo"
                      className="card-image"
                    />
                    <div className="card-info">
                      <Title level={5}>{item.title}</Title>
                      <Text>{item.address}</Text><br />
                      <Text>{item.time}</Text>
                    </div>
                    <div className="card-action">
                      <span className="registered-label">Số người đăng ký</span>
                      <span className="registered-count">{item.registered}/{item.capacity} Người</span>
                      <Button size="small" className="green-dark-btn" style={{ marginTop: 8 }}>Đặt lịch</Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="emergency-button">
            <Button type="primary" shape="circle" size="large" icon={<PhoneOutlined />} />
            <Text className="emergency-text">Nhận máu khẩn cấp</Text>
          </div>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default AppointmentSchedule;