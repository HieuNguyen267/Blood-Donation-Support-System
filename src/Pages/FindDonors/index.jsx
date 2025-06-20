import React from 'react';
import { Select, Slider, Button, Card } from 'antd';
import { MapPin, Droplet } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './index.css';

const { Option } = Select;

const donors = [
  {
    name: 'Nguyễn Duy Hiếu',
    bloodType: 'A+',
    distance: 3.14,
    time: 10,
  },
  {
    name: 'Nguyễn Anh Khoa',
    bloodType: 'A-',
    distance: 3.14,
    time: 10,
  },
];

const FindDonors = () => {
  return (
    <div className="find-donors-page">
      <Header />
      <div className="find-donors-container">
        <div className="page-title">
          <h1>Tìm kiếm người hiến máu</h1>
          <p>Kết nối người cần máu với người hiến máu trong khu vực</p>
        </div>
        <div className="main-content">
          <div className="left-panel">
            <Card title="Tìm kiếm" className="search-card">
              <div className="search-form">
                <Select defaultValue="Chọn nhóm máu" className="search-select">
                  <Option value="A+">A+</Option>
                  <Option value="A-">A-</Option>
                  <Option value="B+">B+</Option>
                  <Option value="B-">B-</Option>
                  <Option value="AB+">AB+</Option>
                  <Option value="AB-">AB-</Option>
                  <Option value="O+">O+</Option>
                  <Option value="O-">O-</Option>
                </Select>
                <Select defaultValue="Mức độ khẩn cấp" className="search-select">
                  <Option value="low">Thấp</Option>
                  <Option value="medium">Trung bình</Option>
                  <Option value="high">Cao</Option>
                </Select>
                <Button type="primary" className="search-button">Tìm kiếm</Button>
                <Select defaultValue="Chọn thành phần" className="search-select-full">
                  <Option value="whole">Máu toàn phần</Option>
                  <Option value="platelets">Tiểu cầu</Option>
                  <Option value="plasma">Huyết tương</Option>
                </Select>
                <div className="slider-container">
                   <div className='slider-labels'>
                        <span>Khoảng cách (km)</span>
                        <span>10km</span>
                   </div>
                   <Slider defaultValue={10} max={50} />
                </div>
              </div>
            </Card>
            <Card title="Kết quả" className="results-card">
              {donors.map((donor, index) => (
                <div key={index} className="donor-item">
                  <div className="donor-info">
                    <p className="donor-name">{donor.name}</p>
                    <p className="donor-blood"><Droplet size={16} /> {donor.bloodType}</p>
                    <p className="donor-distance"><MapPin size={16} /> {donor.distance}km ({donor.time} phút)</p>
                  </div>
                  <div className="donor-actions">
                    <Button className="contact-button">Liên hệ</Button>
                    <Button className="details-button">Chi tiết</Button>
                  </div>
                </div>
              ))}
            </Card>
          </div>
          <div className="right-panel">
             <div className="map-placeholder">
                <img src="https://i.imgur.com/7T8sC1C.png" alt="Map of the area" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px'}}/>
             </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FindDonors; 