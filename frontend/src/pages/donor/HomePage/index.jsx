import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import "./index.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { message, Spin } from "antd";
import { bloodStockAPI, analyticsAPI } from "../../../services/api";

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [bloodStock, setBloodStock] = useState({});
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    setLoading(true);
    try {
      // Tạm thời tắt các API call này để tránh lỗi 500 do backend chưa sẵn sàng
      // // Load thông tin kho máu
      // const stock = await bloodStockAPI.getStock();
      // setBloodStock(stock);

      // // Load thống kê tổng quan
      // const dashboardStats = await analyticsAPI.getDashboardStats();
      // setStats(dashboardStats);
    } catch (error) {
      console.error('Load home data error:', error);
      // Không hiển thị lỗi vì đây là trang chủ
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (selectedDate) {
      if (localStorage.getItem('isLoggedIn') !== 'true') {
        navigate('/loginpage', { state: { requireLogin: true } });
        return;
      }
      navigate("/registerdonateform", { state: { date: selectedDate } });
    } else {
      message.warning("Vui lòng chọn ngày để đặt lịch.");
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="homepage-wrapper">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '20px' }}>Đang tải thông tin...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="homepage-wrapper">
        {/* Banner */}
        <div className="banner-section">
          <img
            src="/images/banner.png"
            alt="Trao giọt hồng"
            className="banner-img"
          />
        </div>

        {/* Thông tin chi tiết về các nhóm máu */}
        <Link
          to="/bloodgroup-info"
          style={{
            color: '#219653',
            textAlign: 'left',
<<<<<<< HEAD
            margin: '18px 0 30px 500px',
=======
            margin: '18px 0 30px 300px',
>>>>>>> 073bd8776b9e662f3d0df0a5cb949ba04fad2983
            fontWeight: 700,
            fontSize: 16,
            textDecoration: 'underline',
            display: 'block',
            width: 'fit-content'
          }}
        >
          Thông tin chi tiết về các nhóm máu
        </Link>

        {/* Điều kiện hiến máu */}
        <div className="blood-condition">
          <div className="condition-col">
            <img
              src="/images/loi_ich_hien_mau.jpg"
              alt="Lợi ích hiến máu"
              className="condition-img"
            />
          </div>
          <div className="condition-col">
            <img
              src="/images/dieu-kien-hien-mau.png"
              alt="Điều kiện hiến máu"
              className="condition-img"
            />
            <div className="condition-search">
              <label htmlFor="date">Bạn cần đặt lịch vào thời gian nào?</label>
              <input
                type="date"
                id="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <button className="search-btn" onClick={handleSearch}>
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>

        {/* Lưu ý quan trọng */}
        <div className="container">
        <h2 className="important-title">LƯU Ý QUAN TRỌNG</h2>
        <div className="important-list-row">
          <div className="important-card">
            <div className="important-header">Ai có thể tham gia hiến máu?</div>
            <ol>
              <li>
                Tất cả mọi người từ 18 - 60 tuổi, thực sự tình nguyện hiến máu của mình để cứu chữa người bệnh
              </li>
              <li>
                Cân nặng ít nhất 45kg đối với nữ, nam; Lượng máu hiến mỗi lần không quá 9ml/kg cân nặng và không quá 500ml mỗi lần
              </li>
              <li>
                Không bị nhiễm hoặc không có các hành vi lây nhiễm HIV và các bệnh lây nhiễm qua đường truyền máu khác
              </li>
              <li>
                Thời gian giữa 2 lần hiến máu toàn phần tối thiểu là 12 tuần đối với cả Nam và Nữ
              </li>
              <li>Có giấy tờ tùy thân</li>
            </ol>
          </div>
          <div className="important-card">
            <div className="important-header">Ai là người không nên hiến máu?</div>
            <ol>
              <li>
                Người đã nhiễm hoặc đã thực hiện hành vi có nguy cơ nhiễm HIV, viêm gan B, viêm gan C, và virus lây qua đường truyền máu
              </li>
              <li>
                Người có các bệnh mãn tính: tim mạch, huyết áp, hô hấp, dạ dày...
              </li>
            </ol>
          </div>
          <div className="important-card">
            <div className="important-header">Máu của tôi sẽ được làm những xét nghiệm gì?</div>
            <ol>
              <li>
                Tất cả đơn vị máu đều được kiểm tra nhóm máu (hệ ABO, hệ Rh), HIV, virus viêm gan B, virus viêm gan C, giang mai, sốt rét
              </li>
              <li>
                Bạn sẽ được thông báo kết quả, được gửi lại và được tư vấn (miễn phí) khi phát hiện ra các bệnh nhiễm trùng nói trên
              </li>
            </ol>
          </div>
        </div>
        </div>

        {/* Lời khuyên trước/sau khi hiến máu */}
        <div className="container">
        <section className="tips-section">
          <h2 className="tips-title">Những lời khuyên trước và sau khi hiến máu</h2>
          <div className="tips-grid">
            <div className="tips-box should">
              <div className="tips-header">
                <span className="icon-check">✔</span> Nên
              </div>
              <ul>
                <li>Ăn nhẹ và uống nhiều nước (300-500ml) trước khi hiến máu</li>
                <li>
                  Đè chặt miếng bông gòn cầm máu nơi kim chích 10 phút, giữ băng keo cá nhân trong 4-6 giờ
                </li>
                <li>Nằm và nghỉ ngơi tại chỗ 10 phút sau khi hiến máu.</li>
                <li>
                  Nằm nghỉ đầu thấp, kê chân cao nếu thấy chóng mặt, mệt, buồn nôn
                </li>
                <li>
                  Chườm lạnh (túi chườm chuyên dụng hoặc cho đá vào khăn) chườm vết chích nếu bị sưng, bầm tím
                </li>
              </ul>
              <div className="tips-footer">
                Bác sĩ Ngô Văn Tân<br />
                Trưởng khoa Tiếp nhận hiến máu<br />
                Bệnh viện Truyền máu Huyết học
              </div>
            </div>
            <div className="tips-box should-not">
              <div className="tips-header">
                <span className="icon-x">✖</span> Không nên
              </div>
              <ul>
                <li>Uống sữa, rượu bia trước khi hiến máu</li>
                <li>
                  Lái xe đi xa, khuân vác, làm việc nặng hoặc luyện tập thể thao gắng sức trong ngày lấy máu
                </li>
              </ul>
              <div className="tips-footer">
                Bác sĩ Ngô Văn Tân<br />
                Trưởng khoa Tiếp nhận hiến máu<br />
                Bệnh viện Truyền máu Huyết học
              </div>
            </div>
            <div className="tips-box warning">
              <div className="tips-header">
                <span className="icon-warning">!</span> Lưu ý
              </div>
              <ul>
                <li>Nếu phát hiện chảy máu tại chỗ chích:</li>
                <li>Giơ tay cao</li>
                <li>Lấy tay kia ấn nhẹ vào miếng bông hoặc băng dính</li>
                <li>Liên hệ nhân viên y tế để được hỗ trợ khi cần thiết</li>
              </ul>
              <div className="tips-footer">
                Bác sĩ Ngô Văn Tân<br />
                Trưởng khoa Tiếp nhận hiến máu<br />
                Bệnh viện Truyền máu Huyết học
              </div>
            </div>
          </div>
        </section>
        </div>

        {/* Các hoạt động hiến máu nhân đạo */}
        <div className="container">
          <h2 className="activity-title">Các hoạt động hiến máu nhân đạo</h2>
          <div className="activity-single-item">
            <img src="/images/hoatdong.jpg" alt="Hoạt động hiến máu" />
            <div className="activity-overlay">
              <h3>Tình người hiến máu giữa đại dịch</h3>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
}