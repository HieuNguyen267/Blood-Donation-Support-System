import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/user/Header';
import Footer from '../../components/user/Footer';
import { bloodRequestAPI } from '../../services/api';
import { message, Modal } from 'antd';
import './EmergencyRequestDetail.css';
import { donorAPI } from '../../services/api';

const { confirm } = Modal;

export default function EmergencyRequestDetail() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);

  useEffect(() => {
    const fetchRequestDetail = async () => {
      try {
        setLoading(true);
        const data = await bloodRequestAPI.getRequestById(requestId);
        setRequest(data);
      } catch (error) {
        console.error('Error fetching request detail:', error);
        message.error('Không thể tải thông tin yêu cầu máu');
      } finally {
        setLoading(false);
      }
    };
    fetchRequestDetail();
  }, [requestId]);

  const handleResponse = (accepted) => {
    const action = accepted ? 'xác nhận' : 'từ chối';
    const status = accepted ? 'contact_successful' : 'rejected';
    confirm({
      title: `Xác nhận ${action}`,
      content: `Bạn có chắc chắn muốn ${action} yêu cầu hiến máu khẩn cấp này không?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        setResponding(true);
        try {
          await donorAPI.updateMatchingBloodStatus(requestId, status);
          message.success(`Đã ${action} yêu cầu hiến máu khẩn cấp`);
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } catch (error) {
          console.error('Error responding to emergency request:', error);
          if (error.message && error.message.includes('Không thể cập nhật trạng thái cho matching này')) {
            message.error('Yêu cầu đã cũ hoặc không còn hiệu lực. Vui lòng kiểm tra lại.');
          } else if (error.message && error.message.includes('Không tìm thấy matching cho donor này')) {
            message.error('Bạn không có yêu cầu phù hợp để phản hồi.');
          } else if (error.message && error.message.includes('403')) {
            message.error('Bạn vui lòng đăng nhập tài khoản trước khi xác nhận.');
          } else {
            message.error(`Lỗi khi ${action}: ${error.message || 'Lỗi không xác định'}`);
          }
        } finally {
          setResponding(false);
        }
      }
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container py-5 text-center">
          <div className="spinner-border text-danger mb-3" role="status"></div>
          <div>Đang tải thông tin yêu cầu máu...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!request) {
    return (
      <>
        <Header />
        <div className="container py-5 text-center">
          <h2>Không tìm thấy yêu cầu máu</h2>
          <p>Yêu cầu máu này có thể đã bị xóa hoặc không tồn tại.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Về trang chủ</button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="card shadow-lg emergency-card">
              <div className="card-header bg-danger text-white d-flex align-items-center">
                <span className="me-2" style={{fontSize:'1.5rem'}}>🚨</span>
                <span className="fw-bold">Yêu cầu hiến máu khẩn cấp</span>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <h5 className="card-title text-danger mb-2">Thông tin chi tiết</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div><b>Mã yêu cầu:</b> #{request.requestId}</div>
                      <div><b>Cơ sở y tế:</b> {request.facilityName}</div>
                      <div><b>Nhóm máu cần:</b> {request.bloodGroup}</div>
                      <div><b>Số lượng cần:</b> {request.quantityRequested} ml</div>
                      <div><b>Ngày cần:</b> {request.requiredBy}</div>
                    </div>
                    <div className="col-md-6">
                      <div><b>Người liên hệ:</b> {request.contactPerson}</div>
                      <div><b>Số điện thoại:</b> {request.contactPhone}</div>
                      <div><b>Ghi chú:</b> {request.notes || <span className="text-muted">Không có</span>}</div>
                    </div>
                  </div>
                </div>
                <hr/>
                <div className="mb-3">
                  <h5 className="card-title text-success mb-2">Bạn có thể hỗ trợ?</h5>
                  <div className="mb-2">Vui lòng xem xét kỹ thông tin và đưa ra quyết định phù hợp.</div>
                  <div className="response-radio-group">
                    {/* Nút Xác nhận */}
                    <div
                      className={`response-radio${selectedResponse === true ? ' selected-accept' : ''}${selectedResponse === false ? ' dim' : ''}`}
                      onClick={() => setSelectedResponse(true)}
                    >
                      <div className="radio-icon">
                        {selectedResponse === true && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <polyline points="20,6 9,17 4,12"></polyline>
                          </svg>
                        )}
                      </div>
                      <span>Xác nhận hỗ trợ</span>
                    </div>
                    {/* Nút Từ chối */}
                    <div
                      className={`response-radio${selectedResponse === false ? ' selected-decline' : ''}${selectedResponse === true ? ' dim' : ''}`}
                      onClick={() => setSelectedResponse(false)}
                    >
                      <div className="radio-icon">
                        {selectedResponse === false && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <path d="M18 6L6 18M6 6l12 12"></path>
                          </svg>
                        )}
                      </div>
                      <span>Từ chối</span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center">
                    <button
                      className="btn btn-primary btn-lg px-5 response-submit-btn"
                      disabled={selectedResponse === null || responding}
                      onClick={() => handleResponse(selectedResponse)}
                    >
                      Gửi phản hồi
                    </button>
                  </div>
                </div>
                <div className="alert alert-warning mt-4 mb-0">
                  <b>Lưu ý:</b> Đây là yêu cầu hiến máu khẩn cấp, mọi sự hỗ trợ của bạn đều rất quý giá.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 