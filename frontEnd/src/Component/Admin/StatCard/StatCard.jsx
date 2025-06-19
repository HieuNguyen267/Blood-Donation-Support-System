import React from "react";
import './StatCard.css';

const Icon = ({ color, children }) => (
  <div style={{
    background: color,
    borderRadius: '8px',
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 22
  }}>{children}</div>
);

const StatCard = ({ icon, color, title, value }) => (
  <div className="stat-card">
    <Icon color={color}>{icon}</Icon>
    <div>
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  </div>
);

export default StatCard; 