import React from "react";
import './SummaryCard.css';

const SummaryCard = () => (
  <div className="summary-card">
    <div className="summary-title">Tổng cuộc hẹn</div>
    <div className="summary-value">1200</div>
    <div className="summary-statuses">
      <span className="done">700 Hoàn thành</span>
      <span className="pending">500 Sắp tới</span>
    </div>
  </div>
);

export default SummaryCard; 