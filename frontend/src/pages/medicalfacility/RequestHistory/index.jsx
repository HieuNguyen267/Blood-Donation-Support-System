import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../../components/user/Footer';
import MedicalFacilityHeader from '../../../components/user/MedicalFacilityHeader';

const RequestHistory = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const fetchRequests = () => {
    const storedRequests = JSON.parse(localStorage.getItem('medicalRequests')) || [];
    const sortedRequests = storedRequests.sort((a, b) => b.id - a.id);
    setRequests(sortedRequests);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCancelRequest = (requestId, event) => {
    event.preventDefault(); // Ngăn không cho Link điều hướng khi bấm nút
    event.stopPropagation(); // Ngăn sự kiện nổi bọt lên thẻ li

    const updatedRequests = requests.map(req => {
      if (req.id === requestId) {
        return { ...req, status: 'Đã hủy' };
      }
      return req;
    });

    localStorage.setItem('medicalRequests', JSON.stringify(updatedRequests));
    setRequests(updatedRequests); // Cập nhật UI ngay lập tức
  };
  
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Đang chờ xác nhận':
        return { color: '#f0ad4e', fontWeight: 'bold' };
      case 'Đã hủy':
        return { color: '#777', fontWeight: 'bold' };
      case 'Đã xác nhận':
        return { color: '#5cb85c', fontWeight: 'bold' };
      default:
        return { fontWeight: 'bold' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <MedicalFacilityHeader />
      <main className="container">
        <div style={{ flexGrow: 1, maxWidth: '900px', margin: '2rem auto', padding: '2rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#c80000', fontSize: '2rem' }}>Lịch sử yêu cầu máu</h2>
          {requests.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {requests.map(request => (
                <li key={request.id} style={{ 
                    marginBottom: '1.5rem', 
                    border: '1px solid #e8e8e8', 
                    borderRadius: '8px', 
                    padding: '1.5rem', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)' 
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', alignItems: 'start' }}>
                    <div>
                      <p><strong>Cơ sở:</strong> {request.facilityName}</p>
                      <p><strong>Người liên hệ:</strong> {request.contactPerson}</p>
                      <p><strong>Số điện thoại:</strong> {request.contactPhone}</p>
                    </div>
                    <div>
                      <p><strong>Nhóm máu:</strong> <span style={{ color: '#c80000', fontWeight: 'bold' }}>{request.bloodType}</span></p>
                      <p><strong>Số lượng:</strong> {request.quantity} ml</p>
                      <p><strong>Ngày cần:</strong> {request.dateNeeded}</p>
                    </div>
                    <div>
                      <p><strong>Mục đích:</strong> {request.purpose}</p>
                      <p><strong>Ghi chú:</strong> {request.notes || 'Không có'}</p>
                      <p><strong>Trạng thái:</strong> <span style={getStatusStyle(request.status)}>{request.status}</span></p>
                    </div>
                    {request.status === 'Đang chờ xác nhận' && (
                      <div style={{ textAlign: 'right', alignSelf: 'center' }}>
                          <button 
                              onClick={(e) => handleCancelRequest(request.id, e)}
                              style={{ padding: '8px 16px', cursor: 'pointer', background: '#d9534f', color: 'white', border: 'none', borderRadius: '5px' }}
                          >
                              Hủy yêu cầu
                          </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#f9f9f9', borderRadius: '8px' }}>
              <p>Chưa có yêu cầu nào được thực hiện.</p>
              <button onClick={() => navigate('/receiveblood')} style={{ padding: '10px 20px', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
                Tạo yêu cầu mới
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RequestHistory; 