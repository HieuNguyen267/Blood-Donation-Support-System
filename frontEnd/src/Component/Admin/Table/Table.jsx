import React from "react";

const Table = () => (
  <table className="dashboard-table">
    <thead>
      <tr>
        <th>Họ và tên</th><th>Giới tính</th><th>SĐT</th><th>Staff phụ trách</th><th>Loại máu</th><th>Báo cáo</th><th>Ngày cuối hiến</th><th>Số lượng</th><th>Vai trò</th><th>Trạng thái</th><th>Hành động</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Đậu Nguyễn Bảo Tuấn</td><td>Nam</td><td>03627929786</td><td>Nguyễn Văn A</td><td>A+</td><td>📄</td><td>2024-07-07</td><td>120ml</td><td>Donor</td><td className="status-ok">Đạt chuẩn</td><td>✏️ 🗑️</td>
      </tr>
      <tr>
        <td>Nguyễn Anh Khoa</td><td>Nam</td><td>05343249786</td><td>Nguyễn Anh B</td><td>O+</td><td>📄</td><td>2024-01-16</td><td>150ml</td><td>Donor</td><td className="status-pending">Đang xét nghiệm</td><td>✏️ 🗑️</td>
      </tr>
      <tr>
        <td>Lữ Phước Nhật Tú</td><td>Nam</td><td>08627929786</td><td>Lê Tuấn C</td><td>AB+</td><td>📄</td><td>2024-01-06</td><td>150ml</td><td>Donor</td><td className="status-ok">Đạt chuẩn</td><td>✏️ 🗑️</td>
      </tr>
      <tr>
        <td>Nguyễn Duy Hiếu</td><td>Nam</td><td>07627929786</td><td>Nguyễn Anh B</td><td>B+</td><td>📄</td><td>2024-01-05</td><td>132ml</td><td>Donor</td><td className="status-fail">Không đạt chuẩn</td><td>✏️ 🗑️</td>
      </tr>
      <tr>
        <td>Nguyễn Duy Hiếu</td><td>Nam</td><td>04627929786</td><td>Huỳnh Nhật D</td><td>A+</td><td>📄</td><td>2024-11-09</td><td>130ml</td><td>Donor</td><td className="status-ok">Đạt chuẩn</td><td>✏️ 🗑️</td>
      </tr>
      <tr>
        <td>Nguyễn Duy Hiếu</td><td>Nam</td><td>03927929786</td><td>Lê Tuấn C</td><td>AB+</td><td>📄</td><td>2024-01-10</td><td>140ml</td><td>Donor</td><td className="status-ok">Đạt chuẩn</td><td>✏️ 🗑️</td>
      </tr>
      <tr>
        <td>Đậu Nguyễn Bảo Tuấn</td><td>Nam</td><td>03727929786</td><td>Nguyễn Văn A</td><td>O+</td><td>📄</td><td>2024-08-05</td><td>1350ml</td><td>Donor</td><td className="status-fail">Không đạt chuẩn</td><td>✏️ 🗑️</td>
      </tr>
    </tbody>
  </table>
);

export default Table; 