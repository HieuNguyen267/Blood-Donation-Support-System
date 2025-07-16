import React, { useState, useEffect } from 'react';
import { donorAPI } from '../../services/api';
import { BellOutlined } from '@ant-design/icons';
import { Badge, Drawer, List, Button } from 'antd';

function getUpcomingDonations(donations) {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 5);
  return (donations || []).filter(d => {
    if (!d.appointmentDate) return false;
    const date = new Date(d.appointmentDate);
    return (
      d.status === 'confirmed' &&
      d.donationStatus === 'processing' &&
      date >= today && date <= maxDate
    );
  });
}

export default function DonorNotificationBell() {
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true);
      try {
        const history = await donorAPI.getDonationHistory();
        setNotifications(getUpcomingDonations(history));
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          right: 32,
          bottom: 32,
          zIndex: 9999,
          background: '#fff',
          borderRadius: '50%',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          width: 56,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onClick={() => setVisible(true)}
        title="Thông báo nhắc lịch hiến máu"
      >
        <Badge count={notifications.length} size="small">
          <BellOutlined style={{ fontSize: 28, color: '#faad14' }} />
        </Badge>
      </div>
      <Drawer
        title="Thông báo nhắc lịch hiến máu"
        placement="right"
        onClose={() => setVisible(false)}
        open={visible}
        width={360}
      >
        <List
          loading={loading}
          dataSource={notifications}
          locale={{ emptyText: 'Không có thông báo nhắc lịch hiến máu nào.' }}
          renderItem={item => {
            const date = new Date(item.appointmentDate);
            let timeStr = '';
            if (item.timeSlot) {
              // Nếu có timeSlot dạng 'dd/MM/yyyy, HH:mm - HH:mm' thì lấy phần giờ
              const match = item.timeSlot.match(/\d{2}:\d{2} - \d{2}:\d{2}/);
              timeStr = match ? match[0] : '';
            }
            return (
              <a
                href={`/donor/AppointmentHistory/${item.registerId || item.id}`}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                  background: '#f6f8fa',
                  borderRadius: 10,
                  padding: 16,
                  marginBottom: 16,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  border: '1px solid #e5e7eb',
                  transition: 'box-shadow 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)'}
                onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}
              >
                <div style={{fontWeight: 500, fontSize: 15}}>
                  Bạn có lịch hiến máu vào ngày {date.toLocaleDateString('vi-VN')}{timeStr ? ` lúc ${timeStr}` : ''}
                </div>
              </a>
            );
          }}
        />
      </Drawer>
    </>
  );
} 