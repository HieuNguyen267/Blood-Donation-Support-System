import React, { useEffect, useState } from "react";
import { bloodRequestAPI } from '../../../services/api';
import './Table.css';


const columns = [
  { title: 'Cơ sở y tế', dataIndex: 'facilityName', key: 'facilityName' },
  { title: 'Nhóm máu', dataIndex: 'bloodGroup', key: 'bloodGroup' },
  { title: 'Số lượng (ml)', dataIndex: 'quantityRequested', key: 'quantityRequested' },
  { title: 'Ngày cần', dataIndex: 'requiredBy', key: 'requiredBy' },
  { title: 'Người liên hệ', dataIndex: 'contactPerson', key: 'contactPerson' },
  { title: 'SĐT liên hệ', dataIndex: 'contactPhone', key: 'contactPhone' },
  { title: 'Ghi chú', dataIndex: 'specialRequirements', key: 'specialRequirements' },
  { title: 'Trạng thái', dataIndex: 'requestStatus', key: 'requestStatus' },
];

const EmergencyBloodRequestTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await bloodRequestAPI.getAllAdminBloodRequests();
        const filtered = res.filter(r => {
          const isEmergency = r.isEmergency === true || r.isEmergency === 'true' || r.is_emergency === true || r.is_emergency === 'true';
          const status = (r.requestStatus || r.request_status || '').toLowerCase();
          return isEmergency && (status === 'pending' || status === 'chờ xác nhận');
        });
        setData(filtered);
      } catch (e) {
        setData([]);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="emergency-blood-request-table" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 24, marginTop: 32 }}>
      <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 16 }}>Đơn yêu cầu máu khẩn cấp</div>
      <div style={{ overflowX: 'auto' }}>
        <table className="table table-bordered table-hover" style={{ minWidth: 900 }}>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key}>{col.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={columns.length} style={{ textAlign: 'center', color: '#888' }}>Không có đơn khẩn cấp nào đang chờ xác nhận</td></tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx}>
                  {columns.map(col => (
                    <td key={col.key}>{
                      col.dataIndex === 'requestStatus'
                        ? (() => {
                            const status = (row.requestStatus || row.request_status || '-').toLowerCase();
                            if (status === 'chờ xác nhận' || status === 'pending') {
                              return <span className="status-orange">{row.requestStatus || row.request_status || '-'}</span>;
                            }
                            return row.requestStatus || row.request_status || '-';
                          })()
                        : (row[col.dataIndex] || '-')
                    }</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmergencyBloodRequestTable; 