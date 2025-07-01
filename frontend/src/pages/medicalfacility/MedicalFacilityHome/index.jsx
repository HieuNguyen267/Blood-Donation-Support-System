import React from 'react';
import { Link } from 'react-router-dom';
import { FiFileText } from 'react-icons/fi';
import { FaTint, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaClipboardList, FaVial, FaMicroscope } from 'react-icons/fa';
import { GiMicroscope } from 'react-icons/gi';
import MedicalFacilityHeader from '../../../components/user/MedicalFacilityHeader';
import Footer from '../../../components/user/Footer';
import './index.css';

const MedicalFacilityHome = () => {
  return (
    <div className="medical-facility-home">
      <MedicalFacilityHeader />
      
      {/* Banner Section */}
      <div className="mf-banner mf-banner-small">
        <img
          src="/images/z6758856467103_04585919c7ab449f5135c14c17f3bd5c.jpg"
          alt="Một giọt máu cho đi..."
          className="mf-banner-bg-img"
        />
        <div className="mf-banner-form-center mf-banner-form-small">
          <h1 className="mf-banner-title mf-banner-title-small">Nhận máu cho cơ sở</h1>
          <p className="mf-banner-desc mf-banner-desc-small">Kết nối cơ sở y tế với nguồn máu an toàn, kịp thời và hiệu quả</p>
          <div className="mf-banner-buttons mf-banner-buttons-small">
            <Link to="/medical-facility/receive-blood" className="mf-primary-btn mf-primary-btn-small">
              Tạo yêu cầu nhận máu
            </Link>
            <Link to="/medical-facility/contact" className="mf-secondary-btn mf-secondary-btn-small">
              Liên hệ
            </Link>
          </div>
        </div>
      </div>

      {/* Important Notes Section */}
      <div className="mf-important-section">
        <h2 className="mf-important-title">LƯU Ý QUAN TRỌNG</h2>
        <div className="mf-important-top-row">
          <div className="mf-important-box mf-important-greenborder">
            <div className="mf-important-header"><FaClipboardList className="mf-important-icon" /> Điều kiện để nhận máu?</div>
            <ol>
              <li>Cơ sở y tế phải có giấy phép hoạt động hợp lệ và được cấp phép thực hiện truyền máu</li>
              <li>Có bác sĩ chuyên khoa huyết học hoặc truyền máu phụ trách</li>
              <li>Có đầy đủ trang thiết bị y tế cần thiết cho việc truyền máu an toàn</li>
              <li>Tuân thủ các quy định về an toàn truyền máu của Bộ Y tế</li>
              <li>Có hệ thống quản lý chất lượng máu và sản phẩm máu</li>
            </ol>
          </div>
          <div className="mf-important-box mf-important-pinkborder">
            <div className="mf-important-header"><FaVial className="mf-important-icon" /> Quy trình nhận máu an toàn</div>
            <ol>
              <li>Kiểm tra nhóm máu và xét nghiệm tương thích trước khi truyền</li>
              <li>Theo dõi chặt chẽ quá trình truyền máu và phản ứng của bệnh nhân</li>
            </ol>
          </div>
          <div className="mf-important-box mf-important-blueborder">
            <div className="mf-important-header"><FaMicroscope className="mf-important-icon" /> Máu được kiểm tra những gì?</div>
            <ol>
              <li>Tất cả đơn vị máu đều được kiểm tra nhóm máu (hệ ABO, hệ Rh), HIV, virus viêm gan B, virus viêm gan C, giang mai, sốt rét</li>
              <li>Bệnh nhân sẽ được thông báo kết quả và được tư vấn khi cần thiết</li>
            </ol>
          </div>
        </div>
        <div className="mf-important-bottom-form">
          <div className="mf-important-bottom-title">Những lưu ý khi nhận máu</div>
          <div className="mf-important-bottom-row">
            <div className="mf-important-box mf-important-green">
              <div className="mf-important-header"><FaCheckCircle className="mf-important-icon" color="#43a047" /> Nên</div>
              <ul>
                <li>Kiểm tra kỹ thông tin bệnh nhân và nhóm máu trước khi truyền</li>
                <li>Theo dõi chặt chẽ các dấu hiệu sinh tồn trong quá trình truyền máu</li>
                <li>Chuẩn bị đủ trang thiết bị cấp cứu khi cần thiết</li>
                <li>Ghi chép đầy đủ thông tin truyền máu vào hồ sơ bệnh án</li>
                <li>Thông báo cho bệnh nhân về các dấu hiệu cần lưu ý sau truyền máu</li>
              </ul>
            </div>
            <div className="mf-important-box mf-important-red">
              <div className="mf-important-header"><FaTimesCircle className="mf-important-icon" color="#e53935" /> Không nên</div>
              <ul>
                <li>Truyền máu khi chưa kiểm tra tương thích</li>
                <li>Bỏ qua các dấu hiệu bất thường trong quá trình truyền máu</li>
              </ul>
            </div>
            <div className="mf-important-box mf-important-yellow">
              <div className="mf-important-header"><FaExclamationTriangle className="mf-important-icon" color="#fbc02d" /> Lưu ý</div>
              <ul>
                <li>Nếu có phản ứng truyền máu: Dừng ngay việc truyền máu</li>
                <li>Thực hiện các biện pháp cấp cứu cần thiết</li>
                <li>Báo cáo ngay cho bác sĩ phụ trách</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      

      {/* News Section */}
      <div className="mf-news-section">
        <div className="mf-container">
          <h2 className="mf-news-title-custom">Tin tức y tế</h2>
          <div className="mf-news-grid">
            {/* Card 1 */}
            <div className="mf-news-card mf-news-card-custom mf-news-card-small">
              <div className="mf-news-image mf-news-image-custom mf-news-image-small">
                <img src="/images/moi-ban-dong-hanh-cung-chien-dich-hien-mau-nhan-dao-560x315 (1).jpg" alt="Một giọt máu cho đi, một cuộc đời ở lại" />
              </div>
              <div className="mf-news-content mf-news-content-custom mf-news-content-small">
                <h4 className="mf-news-title-item">Nhu cầu máu tăng cao trong mùa dịch</h4>
                <p>Trong bối cảnh dịch bệnh, nhu cầu máu tại các bệnh viện đang tăng cao...</p>
                <span className="mf-news-date mf-news-date-small">15/01/2024 &nbsp; <span className="mf-news-detail-link">Xem chi tiết</span></span>
              </div>
            </div>
            {/* Card 2 */}
            <div className="mf-news-card mf-news-card-custom mf-news-card-small">
              <div className="mf-news-image mf-news-image-custom mf-news-image-small">
                <img src="/images/image_17.png" alt="Vận động hiến máu tình nguyện" />
              </div>
              <div className="mf-news-content mf-news-content-custom mf-news-content-small">
                <h4 className="mf-news-title-item">Hướng dẫn hiến máu an toàn</h4>
                <p>Các biện pháp đảm bảo an toàn khi hiến máu trong thời kỳ dịch bệnh...</p>
                <span className="mf-news-date mf-news-date-small">12/01/2024 &nbsp; <span className="mf-news-detail-link">Xem chi tiết</span></span>
              </div>
            </div>
            {/* Card 3 */}
            <div className="mf-news-card mf-news-card-custom mf-news-card-small">
              <div className="mf-news-image mf-news-image-custom mf-news-image-small">
                <img src="/images/images.jpg" alt="Mỗi giọt máu cho đi, một cuộc đời ở lại" />
              </div>
              <div className="mf-news-content mf-news-content-custom mf-news-content-small">
                <h4 className="mf-news-title-item">Điều kiện hiến máu mới</h4>
                <p>Cập nhật các điều kiện và tiêu chuẩn mới cho việc hiến máu...</p>
                <span className="mf-news-date mf-news-date-small">10/01/2024 &nbsp; <span className="mf-news-detail-link">Xem chi tiết</span></span>
              </div>
            </div>
            {/* Card 4 */}
            <div className="mf-news-card mf-news-card-custom mf-news-card-small">
              <div className="mf-news-image mf-news-image-custom mf-news-image-small">
                <img src="/images/new.jpg" alt="Hiến máu tình nguyện" />
              </div>
              <div className="mf-news-content mf-news-content-custom mf-news-content-small">
                <h4 className="mf-news-title-item">Hiến máu tình nguyện</h4>
                <p>Hành động nhỏ - Ý nghĩa lớn. Hãy cùng tham gia hiến máu tình nguyện để cứu giúp những người cần máu!</p>
                <span className="mf-news-date mf-news-date-small">01/07/2024 &nbsp; <span className="mf-news-detail-link">Xem chi tiết</span></span>
              </div>
            </div>
            {/* Card 5 */}
            <div className="mf-news-card mf-news-card-custom mf-news-card-small">
              <div className="mf-news-image mf-news-image-custom mf-news-image-small">
                <img src="/images/new1.jpg" alt="Một giọt máu cho đi, một cuộc đời ở lại" />
              </div>
              <div className="mf-news-content mf-news-content-custom mf-news-content-small">
                <h4 className="mf-news-title-item">Một giọt máu cho đi, một cuộc đời ở lại</h4>
                <p>Mỗi giọt máu bạn cho đi là một cơ hội sống cho người khác. Hãy lan tỏa thông điệp yêu thương này!</p>
                <span className="mf-news-date mf-news-date-small">01/07/2024 &nbsp; <span className="mf-news-detail-link">Xem chi tiết</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MedicalFacilityHome;