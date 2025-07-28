import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Typography, Spin, Row, Col } from 'antd';
import MedicalFacilityHeader from '../../../components/user/MedicalFacilityHeader';
import Footer from '../../../components/user/Footer';
import { medicalFacilityAPI } from '../../../services/api';

const { Title } = Typography;

const MedicalFacilityProfile = () => {
  const [facilityInfo, setFacilityInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFacilityInfo() {
      let userInfo = null;
      try {
        userInfo = JSON.parse(localStorage.getItem('userInfo'));
      } catch {}
      let facilityId = userInfo?.facilityId || localStorage.getItem('facilityId');
      if (!facilityId) {
        setLoading(false);
        return;
      }
      try {
        const res = await medicalFacilityAPI.getFacilityById(facilityId);
        setFacilityInfo(res);
      } catch (err) {
        setFacilityInfo({});
      }
      setLoading(false);
    }
    fetchFacilityInfo();
  }, []);

  if (loading) {
    return (
      <div className="profile-page">
        <MedicalFacilityHeader />
        <div className="profile-container">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '20px' }}>Đang tải thông tin cơ sở y tế...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <MedicalFacilityHeader />
      <div className="profile-container">
        <Row justify="center">
          <Col xs={24} md={16} lg={12}>
            <Card className="profile-card" title={<Title level={3} style={{ margin: 0 }}>{facilityInfo.facilityName || ''}</Title>}>
              <Descriptions layout="vertical" column={1} size="middle" bordered>
                <Descriptions.Item label="Địa chỉ">{facilityInfo.address}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{facilityInfo.phone}</Descriptions.Item>
                <Descriptions.Item label="Email">{facilityInfo.email}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </div>
      <Footer />
    </div>
  );
};

export default MedicalFacilityProfile; 