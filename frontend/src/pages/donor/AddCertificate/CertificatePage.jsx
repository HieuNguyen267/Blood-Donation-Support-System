import React, { useEffect, useState } from "react";
import "./CertificatePage.css";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import { Link } from "react-router-dom";
import { certificatesAPI } from "../../../services/api";

export default function CertificatePage() {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("certificateFormData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setFormData(parsedData);

      // ✅ Xoá sau khi load để không hiển thị lại sau khi reload/truy cập lại
      localStorage.removeItem("certificateFormData");
    }
  }, []);

  return (
    <>
      <Header />
      <div className="certificate-container">
        <div className="certificate-box">
          {/* Ẩn đoạn giới thiệu nếu đã có dữ liệu */}
          {!formData && (
            <p>
              Thêm giấy chứng nhận hiến máu của bạn tại đây. Nếu bạn chưa từng đặt
              lịch hiến trên hệ thống, hãy nhớ cập nhật thông tin cá nhân của bạn
              trước khi thực hiện thao tác này để quản trị có thể đối chiếu thông tin.
            </p>
          )}

          {/* Nút Thêm/Chỉnh sửa */}
          <div className="donate-btn-wrap">
            <Link to="/certificateform">
              <button className="add-btn">
                {formData ? "Chỉnh sửa chứng nhận" : "Thêm chứng nhận"}
              </button>
            </Link>
          </div>

          {/* Hiển thị dữ liệu nếu có */}
          {formData && (
            <div className="certificate-info">
              <h3>🩸 Thông tin chứng nhận:</h3>

              {formData.imageUrl && (
                <div className="certificate-image">
                  <img
                    src={formData.imageUrl}
                    alt="Chứng nhận hiến máu"
                    style={{
                      maxWidth: "300px",
                      marginBottom: "12px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      padding: "4px",
                      backgroundColor: "#fff",
                    }}
                  />
                </div>
              )}

              <p><strong>Họ và tên:</strong> {formData.fullName}</p>
              <p><strong>Giấy tờ tùy thân:</strong> {formData.idNumber}</p>
              <p><strong>Ngày sinh:</strong> {formData.birthDate}</p>
              <p><strong>Địa chỉ:</strong> {formData.address}</p>
              <p><strong>Cơ sở tiếp nhận máu:</strong> {formData.facility}</p>
              <p><strong>Lượng máu (ml):</strong> {formData.amount}</p>
              <p><strong>Số seri:</strong> {formData.serial}</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
