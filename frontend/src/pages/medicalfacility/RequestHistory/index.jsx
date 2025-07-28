import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../../components/user/Footer';
import MedicalFacilityHeader from '../../../components/user/MedicalFacilityHeader';
import { Spin, Typography, Button, Modal, message } from 'antd';
import { mfBloodRequestAPI, bloodRequestAPI } from '../../../services/api';

const { Title } = Typography;

function getStatusText(request) {
  // Highest priority: emergency_status
  if (request.emergencyStatus) {
    if (request.emergencyStatus === 'pending') return { text: 'Chờ liên hệ', color: '#faad14' };
    if (request.emergencyStatus === 'contacting') return { text: 'Đang liên hệ', color: '#1890ff' };
    if (request.emergencyStatus === 'completed') return { text: 'Hoàn thành', color: '#52c41a' };
  }
  // Next: request_status + processing_status
  if (request.requestStatus === 'confirmed' && request.processingStatus) {
    if (request.processingStatus === 'pending') return { text: 'Đang xử lí', color: '#faad14' };
    if (request.processingStatus === 'in transit') return { text: 'Đang vận chuyển', color: '#1890ff' };
    if (request.processingStatus === 'completed') return { text: 'Hoàn thành', color: '#52c41a' };
  }
  // Lowest: request_status
  if (request.requestStatus === 'pending') return { text: 'Chờ xác nhận', color: '#faad14' };
  if (request.requestStatus === 'confirmed') return { text: 'Xác nhận', color: '#1890ff' };
  if (request.requestStatus === 'rejected') return { text: 'Từ chối', color: '#ff4d4f' };
  if (request.requestStatus === 'cancelled') return { text: 'Đã hủy', color: '#ff7875' };
  return { text: request.requestStatus || '-', color: '#888' };
}

const RequestHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(3); // Hiển thị 3 yêu cầu mỗi trang

  useEffect(() => {
    mfBloodRequestAPI.getBloodRequestHistory()
      .then((data) => setRequests(Array.isArray(data) ? data : []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  const handleCancelRequest = async (requestId) => {
    try {
      setCancellingId(requestId);
      
      // Tìm request để kiểm tra emergency_status
      const request = requests.find(req => req.id === requestId);
      
      // Hủy yêu cầu máu
      await mfBloodRequestAPI.cancelBloodRequest(requestId);
      
      // Nếu có emergency_status và đang ở trạng thái pending hoặc contacting, cập nhật thành cancelled
      if (request && request.emergencyStatus && 
          (request.emergencyStatus === 'pending' || request.emergencyStatus === 'contacting')) {
        try {
          await bloodRequestAPI.updateEmergencyStatus(requestId, 'cancelled');
          console.log('Emergency status updated to cancelled for request:', requestId);
        } catch (emergencyError) {
          console.error('Error updating emergency status:', emergencyError);
          // Không hiển thị lỗi cho user vì yêu cầu đã được hủy thành công
        }
      }
      
      message.success('Đã hủy yêu cầu máu thành công!');
      // Reload danh sách
      const updatedRequests = await mfBloodRequestAPI.getBloodRequestHistory();
      setRequests(Array.isArray(updatedRequests) ? updatedRequests : []);
    } catch (error) {
      console.error('Error cancelling request:', error);
      message.error('Không thể hủy yêu cầu. Vui lòng thử lại.');
    } finally {
      setCancellingId(null);
    }
  };

  const showCancelConfirm = (requestId, requestTitle) => {
    // Kiểm tra xem yêu cầu có đang trong quá trình vận chuyển không
    const request = requests.find(req => req.id === requestId);
    if (request && request.processingStatus === 'in transit') {
      Modal.warning({
        title: 'Không thể hủy yêu cầu',
        content: 'Máu đang trong quá trình vận chuyển, không thể hủy yêu cầu này.',
        okText: 'Đã hiểu',
        okType: 'default',
      });
      return;
    }

    Modal.confirm({
      title: 'Xác nhận hủy yêu cầu',
      content: `Bạn có chắc chắn muốn hủy yêu cầu máu này không?`,
      okText: 'Hủy yêu cầu',
      okType: 'danger',
      cancelText: 'Không',
      onOk() {
        handleCancelRequest(requestId);
      },
    });
  };

  return (
    <div className="history-page-container" style={{ minHeight: '100vh', background: '#f7f7f7' }}>
      <MedicalFacilityHeader />
      <div style={{ minHeight: 'calc(100vh - 64px - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 16 }}>
        <Title level={2} style={{ textAlign: 'center', margin: '12px 0 18px 0' }}>Lịch sử yêu cầu máu</Title>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}><Spin /> Đang tải lịch sử yêu cầu...</div>
        ) : requests.length > 0 ? (
          <>
          <div className="certificate-list-modern">
              {requests
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map(req => {
              const status = getStatusText(req);
              return (
                <div className="certificate-card-modern" key={req.id}>
                  <div className="certificate-card-left">
                    <div className="blood-drop-icon">🩸</div>
                    <div className="certificate-type">Yêu cầu máu</div>
                  </div>
                  <div className="certificate-card-main">
                    <div className="certificate-title" style={{ fontWeight: 'bold', fontSize: 18 }}>
                      Yêu cầu máu
                    </div>
                    <div className="certificate-info-row">
                      <span className="certificate-info-label">Ngày yêu cầu:</span> <span>{req.requiredBy ? new Date(req.requiredBy).toLocaleDateString() : '-'}</span>
                    </div>
                    <div className="certificate-info-row">
                      <span className="certificate-info-label">Số lượng máu:</span> <span>{req.quantityRequested ? req.quantityRequested + ' ml' : '-'}</span>
                    </div>
                    <div className="certificate-info-row">
                      <span className="certificate-info-label">Ghi chú:</span> <span>{req.specialRequirements || '-'}</span>
                    </div>
                    <div className="certificate-info-row">
                      <span className="certificate-info-label">Mức độ:</span> <span style={{ color: req.isEmergency ? '#ff4d4f' : '#52c41a', fontWeight: 500 }}>{req.isEmergency ? 'Khẩn cấp' : 'Bình thường'}</span>
                    </div>
                    <div className="certificate-info-row">
                      <span className="certificate-info-label">Trạng thái:</span> <span style={{ color: status.color, fontWeight: 500 }}>{status.text}</span>
                    </div>
                  </div>
                  <div className="certificate-card-right">
                    <Link to={`/medical-facility/request-history/${req.id}`} className="details-link">
                      Xem chi tiết
                    </Link>
                      {/* Chỉ hiển thị nút hủy yêu cầu khi trạng thái không phải là hoàn thành */}
                      {status.text !== 'Hoàn thành' && (
                        <Button 
                          type="primary" 
                          danger 
                          size="small" 
                          style={{ marginTop: 8 }}
                          loading={cancellingId === req.id}
                          onClick={() => showCancelConfirm(req.id, req.title)}
                          disabled={req.requestStatus === 'completed' || req.requestStatus === 'rejected' || req.requestStatus === 'cancelled' || req.processingStatus === 'in transit'}
                        >
                          Hủy yêu cầu
                        </Button>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
            {/* Phân trang */}
            {requests.length > pageSize && (
              <div className="pagination-container">
                <Button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  style={{ marginRight: 8 }}
                >
                  Trước
                </Button>
                <span className="pagination-info">
                  Trang {currentPage} / {Math.ceil(requests.length / pageSize)}
                </span>
                <Button 
                  disabled={currentPage === Math.ceil(requests.length / pageSize)}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  style={{ marginLeft: 8 }}
                >
                  Sau
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="certificate-empty">
            Không có yêu cầu máu nào.
          </div>
        )}
      </div>
      <Footer />
      <style>{`
        .certificate-list-modern {
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 700px;
          margin: 0;
          align-items: center;
        }
        .certificate-card-modern {
          display: flex;
          align-items: center;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          padding: 20px 28px;
          gap: 18px;
          transition: box-shadow 0.2s;
          min-height: 140px;
          width: 100%;
          max-width: 600px;
          box-sizing: border-box;
        }
        .certificate-card-modern:hover {
          box-shadow: 0 4px 16px rgba(76,175,80,0.15);
        }
        .certificate-card-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-right: 12px;
        }
        .blood-drop-icon {
          font-size: 32px;
          margin-bottom: 4px;
        }
        .certificate-type {
          font-size: 13px;
          color: #1890ff;
        }
        .certificate-card-main {
          flex: 1;
        }
        .certificate-title {
          margin-bottom: 6px;
        }
        .certificate-info-row {
          font-size: 15px;
          margin-bottom: 2px;
        }
        .certificate-info-label {
          color: #888;
          margin-right: 4px;
        }
        .certificate-card-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          min-width: 110px;
        }
        .details-link {
          color: #1890ff;
          font-weight: 500;
          text-decoration: none;
          font-size: 15px;
        }
        .details-link:hover {
          text-decoration: underline;
        }
        .certificate-empty {
          color: #888;
          font-size: 16px;
          margin-top: 32px;
        }
        .pagination-container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 24px;
          padding: 16px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .pagination-info {
          font-size: 14px;
          color: #666;
          margin: 0 16px;
        }
      `}</style>
    </div>
  );
};

export default RequestHistory; 