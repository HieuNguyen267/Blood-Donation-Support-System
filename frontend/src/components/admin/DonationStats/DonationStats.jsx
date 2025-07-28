import React, { useEffect, useState } from "react";
import './DonationStats.css';
import { bloodRequestAPI } from '../../../services/api';
import moment from 'moment';

const DonationStats = () => {
  const [totalSent, setTotalSent] = useState(0);

  useEffect(() => {
    const fetchTotalSent = async () => {
      try {
        const data = await bloodRequestAPI.getAllAdminBloodRequests();
        const now = moment();
        const currentMonth = now.month();
        const currentYear = now.year();
        const total = data.filter(r => {
          // Trạng thái thành công: ưu tiên emergency_status, processing_status, request_status
          const status = (r.emergencyStatus || r.emergency_status || r.processingStatus || r.processing_status || r.requestStatus || r.request_status || '').toLowerCase();
          if (status !== 'completed' && status !== 'hoàn thành') return false;
          let dateStr = r.requiredBy || r.required_by;
          if (!dateStr) return false;
          let date = moment(dateStr, [moment.ISO_8601, 'YYYY-MM-DD', 'YYYY-MM-DD HH:mm', 'DD/MM/YYYY', 'DD/MM/YYYY HH:mm']);
          if (!date.isValid()) return false;
          return date.month() === currentMonth && date.year() === currentYear;
        }).reduce((sum, r) => {
          let quantity = r.quantityRequested ?? r.quantity_requested ?? 0;
          quantity = typeof quantity === 'string' ? parseInt(quantity) : quantity;
          return sum + (isNaN(quantity) ? 0 : quantity);
        }, 0);
        setTotalSent(total);
      } catch (e) {
        setTotalSent(0);
      }
    };
    fetchTotalSent();
  }, []);

  return (
    <div className="summary-card">
      <div className="summary-title">Tổng lượng máu đã gửi trong tháng</div>
      <div className="summary-value">{totalSent} ml</div>
    </div>
  );
};

export default DonationStats; 