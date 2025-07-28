import React, { useEffect, useState } from "react";
import './SummaryCard.css';
import { adminDonationProcessAPI } from '../../../services/admin/donationProcess';
import moment from 'moment';

const SummaryCard = () => {
  const [totalBlood, setTotalBlood] = useState(0);

  useEffect(() => {
    const fetchTotalBlood = async () => {
      try {
        const data = await adminDonationProcessAPI.getAllForProcessManagement();
        const now = moment();
        const currentMonth = now.month();
        const currentYear = now.year();
        const total = data.filter(d => {
          // Lọc trạng thái hoàn thành
          const status = d.donation_status || d.donationStatus;
          if (status !== 'completed') return false;
          // Lấy ngày hoàn thành hoặc ngày hiến
          let dateStr = d.completeDate || d.complete_date || d.donationDate || d.donateDate || d.appointment_date || d.appointmentDate;
          if (!dateStr) return false;
          let date = moment(dateStr, [moment.ISO_8601, 'YYYY-MM-DD', 'YYYY-MM-DD HH:mm', 'DD/MM/YYYY', 'DD/MM/YYYY HH:mm']);
          if (!date.isValid()) return false;
          return date.month() === currentMonth && date.year() === currentYear;
        }).reduce((sum, d) => {
          // Lấy số lượng ml
          let quantity = d.quantity_ml ?? d.quantityMl ?? d.amount ?? 0;
          quantity = typeof quantity === 'string' ? parseInt(quantity) : quantity;
          return sum + (isNaN(quantity) ? 0 : quantity);
        }, 0);
        setTotalBlood(total);
      } catch (e) {
        setTotalBlood(0);
      }
    };
    fetchTotalBlood();
  }, []);

  return (
    <div className="summary-card">
      <div className="summary-title">Lượng máu đã nhận trong tháng</div>
      <div className="summary-value">{totalBlood} ml</div>
    </div>
  );
};

export default SummaryCard; 