import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Footer from '../../../components/user/Footer';
import MedicalFacilityHeader from '../../../components/user/MedicalFacilityHeader';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const token = localStorage.getItem('token');
        // Thử lấy chi tiết yêu cầu nhận máu trước
        let response = await fetch(`http://localhost:8080/blood-requests/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        });
        if (response.ok) {
          const data = await response.json();
          setRequest({ ...data, _type: 'receive' });
          return;
        }
        // Nếu không có, thử lấy chi tiết hiến máu
        response = await fetch(`http://localhost:8080/donation-registers/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        });
        if (response.ok) {
          const data = await response.json();
          setRequest({ ...data, _type: 'donate' });
          return;
        }
      } catch {}
      // fallback localStorage nếu cần
      setRequest(null);
      navigate('/medical-facility/request-history');
    }
    fetchDetail();
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

  if (!request) {
    return <p>Đang tải...</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <MedicalFacilityHeader />
      <main className="container">
        <div style={{ flexGrow: 1, maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
          <h2 style={{ textAlign: 'center', color: '#c80000' }}>
            {request._type === 'receive' ? 'Chi tiết yêu cầu nhận máu' : 'Chi tiết hiến máu'}
          </h2>
          <div>
            {request._type === 'receive' ? (
              <>
                <p><strong>ID Yêu cầu:</strong> {request.requestId}</p>
                <p><strong>Tên cơ sở:</strong> {request.facilityName}</p>
                <p><strong>Người liên hệ:</strong> {request.contactPerson}</p>
                <p><strong>Số điện thoại:</strong> {request.contactPhone}</p>
                <p><strong>Nhóm máu:</strong> {request.bloodGroupName || '-'}</p>
                <p><strong>Số lượng nhận (ml):</strong> {request.quantityRequested || '-'}</p>
                <p><strong>Ngày cần máu:</strong> {request.requiredBy ? request.requiredBy.split('T')[0] : '-'}</p>
                <p><strong>Mức độ khẩn cấp:</strong> {request.urgencyLevel === 'urgent' ? 'Khẩn cấp' : 'Bình thường'}</p>
                <p><strong>Ghi chú:</strong> {request.notes || '-'}</p>
              </>
            ) : (
              <>
                <p><strong>ID Đăng ký:</strong> {request.registerId || request.id}</p>
                <p><strong>Tên cơ sở:</strong> {request.facilityName}</p>
                <p><strong>Người liên hệ:</strong> {request.contactPerson}</p>
                <p><strong>Số điện thoại:</strong> {request.contactPhone}</p>
                <p><strong>Nhóm máu:</strong> {request.bloodGroup || request.bloodType || '-'}</p>
                <p><strong>Số lượng hiến (ml):</strong> {request.quantity || '-'}</p>
                <p><strong>Ngày đăng ký:</strong> {request.appointmentDate || '-'}</p>
                <p><strong>Ghi chú của nhân viên:</strong> {request.staffNotes || '-'}</p>
              </>
            )}
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