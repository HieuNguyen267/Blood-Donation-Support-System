import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Footer from '../../../components/user/Footer';
import MedicalFacilityHeader from '../../../components/user/MedicalFacilityHeader';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);

  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem('medicalRequests')) || [];
    const foundRequest = storedRequests.find(req => req.id === Number(id));
    
    if (foundRequest) {
      setRequest(foundRequest);
    } else {
      navigate('/medical-facility/request-history');
    }
  }, [id, navigate]);

  const handleCancelRequest = () => {
    const storedRequests = JSON.parse(localStorage.getItem('medicalRequests')) || [];
    const updatedRequests = storedRequests.map(req => {
      if (req.id === Number(id)) {
        return { ...req, status: 'Đã hủy' };
      }
      return req;
    });

    localStorage.setItem('medicalRequests', JSON.stringify(updatedRequests));
    // Cập nhật lại state của trang này để hiển thị trạng thái mới
    setRequest(prevRequest => ({ ...prevRequest, status: 'Đã hủy' }));
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

  if (!request) {
    return <p>Đang tải...</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <MedicalFacilityHeader />
      <main className="container">
        <div style={{ flexGrow: 1, maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
          <h2 style={{ textAlign: 'center', color: '#c80000' }}>Chi tiết yêu cầu máu</h2>
          <div>
            <p><strong>ID Yêu cầu:</strong> {request.id}</p>
            <p><strong>Tên cơ sở:</strong> {request.facilityName}</p>
            <p><strong>Người liên hệ:</strong> {request.contactPerson}</p>
            <p><strong>Số điện thoại:</strong> {request.contactPhone}</p>
            <p><strong>Nhóm máu cần:</strong> {request.bloodType}</p>
            <p><strong>Số lượng (ml):</strong> {request.quantity}</p>
            <p><strong>Ngày cần máu:</strong> {request.dateNeeded}</p>
            <p><strong>Mục đích:</strong> {request.purpose}</p>
            <p><strong>Ghi chú:</strong> {request.notes}</p>
            <p><strong>Trạng thái:</strong> <span style={getStatusStyle(request.status)}>{request.status}</span></p>
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button onClick={() => navigate('/medical-facility/request-history')} style={{ padding: '10px 20px', cursor: 'pointer', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}>
                  Quay lại Lịch sử
              </button>
              {request.status === 'Đang chờ xác nhận' && (
                  <button 
                      onClick={handleCancelRequest}
                      style={{ padding: '10px 20px', cursor: 'pointer', background: '#d9534f', color: 'white', border: 'none', borderRadius: '5px' }}
                  >
                      Hủy yêu cầu
                  </button>
              )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RequestDetail; 