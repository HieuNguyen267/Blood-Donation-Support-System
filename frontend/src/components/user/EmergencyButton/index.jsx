import React from 'react';
import { PhoneOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './index.css';

export default function EmergencyButton() {
  return (
    <div className="emergency-call-container">
      <Link to="/emergency" className="emergency-call-button">
        NHẬN MÁU KHẨN CẤP
        <span className="emergency-icon-wrapper">
          <PhoneOutlined />
        </span>
      </Link>
    </div>
  );
} 