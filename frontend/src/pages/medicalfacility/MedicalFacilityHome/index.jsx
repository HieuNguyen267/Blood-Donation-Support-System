import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Descriptions, Typography, Row, Col } from 'antd';
import moment from 'moment';
import Footer from "../../../components/user/Footer";
import MedicalFacilityHeader from "../../../components/user/MedicalFacilityHeader";
import "./index.css";

const { Title } = Typography;

export default function MedicalFacilityHome() {
  const [selectedDate, setSelectedDate] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const storedInfo = localStorage.getItem('userInfo');
    if (storedInfo) {
      try {
        const parsedInfo = JSON.parse(storedInfo);
        if (parsedInfo.dob) {
          parsedInfo.dob = moment(parsedInfo.dob);
        }
        setUserInfo(parsedInfo);
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
  }, []);

  const handleSearch = () => {
    if (selectedDate) {
      if (localStorage.getItem('isLoggedIn') !== 'true') {
        navigate('/login', { state: { requireLogin: true } });
        return;
      }
      navigate("/receiveblood");
    } else {
      alert("Vui lòng chọn ngày để tạo yêu cầu.");
    }
  };

  const renderItem = (value) => value || '-';

  return (
    <>
      <MedicalFacilityHeader />
      <div className="homepage-wrapper">
        {/* Banner */}
        <div className="banner-section">
          <img
            src="/images/banner.png"
            alt="Yêu cầu máu"
            className="banner-img"
          />
        </div>

       
        {/* Lưu ý quan trọng */}
        <div className="container">
        <h2 className="important-title">LƯU Ý QUAN TRỌNG</h2>
        <div className="important-list-row">
          <div className="important-card">
            <div className="important-header">Điều kiện để nhận máu?</div>
            <ol>
              <li>
                Cơ sở y tế phải có giấy phép hoạt động hợp lệ và được cấp phép thực hiện truyền máu
              </li>
              <li>
                Có bác sĩ chuyên khoa huyết học hoặc truyền máu phụ trách
              </li>
              <li>
                Có đầy đủ trang thiết bị y tế cần thiết cho việc truyền máu an toàn
              </li>
              <li>
                Tuân thủ các quy định về an toàn truyền máu của Bộ Y tế
              </li>
              <li>Có hệ thống quản lý chất lượng máu và sản phẩm máu</li>
            </ol>
          </div>
          <div className="important-card">
            <div className="important-header">Quy trình nhận máu an toàn</div>
            <ol>
              <li>
                Kiểm tra nhóm máu và xét nghiệm tương thích trước khi truyền
              </li>
              <li>
                Theo dõi chặt chẽ quá trình truyền máu và phản ứng của bệnh nhân
              </li>
            </ol>
          </div>
          <div className="important-card">
            <div className="important-header">Máu được kiểm tra những gì?</div>
            <ol>
              <li>
                Tất cả đơn vị máu đều được kiểm tra nhóm máu (hệ ABO, hệ Rh), HIV, virus viêm gan B, virus viêm gan C, giang mai, sốt rét
              </li>
              <li>
                Bạn sẽ được thông báo kết quả và được tư vấn khi cần thiết
              </li>
            </ol>
          </div>
        </div>
        </div>

        {/* Lời khuyên khi nhận máu */}
        <div className="container">
        <section className="tips-section">
          <h2 className="tips-title">Những lưu ý khi nhận máu</h2>
          <div className="tips-grid">
            <div className="tips-box should">
              <div className="tips-header">
                <span className="icon-check">✔</span> Nên
              </div>
              <ul>
                <li>Kiểm tra kỹ thông tin bệnh nhân và nhóm máu trước khi truyền</li>
                <li>
                  Theo dõi chặt chẽ các dấu hiệu sinh tồn trong quá trình truyền máu
                </li>
                <li>Chuẩn bị đầy đủ trang thiết bị cấp cứu khi cần thiết.</li>
                <li>
                  Ghi chép đầy đủ thông tin truyền máu vào hồ sơ bệnh án
                </li>
                <li>
                  Thông báo cho bệnh nhân về các dấu hiệu cần lưu ý sau truyền máu
                </li>
              </ul>
              <div className="tips-footer">
                Bác sĩ Ngô Văn Tân<br />
                Trưởng khoa Truyền máu<br />
                Bệnh viện Truyền máu Huyết học
              </div>
            </div>
            <div className="tips-box should-not">
              <div className="tips-header">
                <span className="icon-x">✖</span> Không nên
              </div>
              <ul>
                <li>Truyền máu khi chưa kiểm tra tương thích</li>
                <li>
                  Bỏ qua các dấu hiệu bất thường trong quá trình truyền máu
                </li>
              </ul>
              <div className="tips-footer">
                Bác sĩ Ngô Văn Tân<br />
                Trưởng khoa Truyền máu<br />
                Bệnh viện Truyền máu Huyết học
              </div>
            </div>
            <div className="tips-box warning">
              <div className="tips-header">
                <span className="icon-warning">!</span> Lưu ý
              </div>
              <ul>
                <li>Nếu có phản ứng truyền máu:</li>
                <li>Dừng ngay việc truyền máu</li>
                <li>Thực hiện các biện pháp cấp cứu cần thiết</li>
                <li>Báo cáo ngay cho bác sĩ phụ trách</li>
              </ul>
              <div className="tips-footer">
                Bác sĩ Ngô Văn Tân<br />
                Trưởng khoa Truyền máu<br />
                Bệnh viện Truyền máu Huyết học
              </div>
            </div>
          </div>
        </section>
        </div>

      </div>
      <Footer />
    </>
  );
} 