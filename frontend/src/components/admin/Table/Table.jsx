import React from "react";
import { getStatusBadge } from '../../../Pages/Admin/utils';

const sampleData = [
  {
    name: "Đậu Nguyễn Bảo Tuấn", gender: "Nam", phone: "03627929786", staff: "Nguyễn Văn A", address: "abcdef", blood: "A+", age: 20, email: "abcde@gmail.com", last: "2024-07-07", amount: "120ml", role: "Donor", status: "Đạt chuẩn"
  },
  {
    name: "Nguyễn Anh Khoa", gender: "Nam", phone: "03634529786", staff: "Nguyễn Anh B", address: "abcdef", blood: "O+", age: 20, email: "abcde@gmail.com", last: "2024-01-04", amount: "125ml", role: "Donor", status: "Đang xét nghiệm"
  },
  {
    name: "Lữ Phước Nhật Tú", gender: "Nam", phone: "08627929786", staff: "Lê Tuấn C", address: "abcdef", blood: "AB+", age: 20, email: "abcde@gmail.com", last: "2024-01-06", amount: "150ml", role: "Donor", status: "Đạt chuẩn"
  },
  {
    name: "Nguyễn Duy Hiếu", gender: "Nam", phone: "07627929786", staff: "Nguyễn Anh B", address: "abcdef", blood: "B+", age: 20, email: "abcde@gmail.com", last: "2024-01-05", amount: "122ml", role: "Donor", status: "Không đạt chuẩn"
  },
  {
    name: "Nguyễn Duy Hiếu", gender: "Nam", phone: "04627929786", staff: "Huỳnh Nhật D", address: "abcdef", blood: "A+", age: 20, email: "abcde@gmail.com", last: "2024-11-09", amount: "130ml", role: "Donor", status: "Đạt chuẩn"
  },
];

const Table = () => (
  <div className="donor-table-card">
    <table className="table table-hover table-bordered align-middle mb-0">
      <thead className="table-light">
        <tr>
          <th className="text-center" style={{minWidth: 160}}>Họ và tên</th>
          <th className="text-center" style={{minWidth: 90}}>Giới tính</th>
          <th className="text-center" style={{minWidth: 120}}>Số điện thoại</th>
          <th className="text-center" style={{minWidth: 140}}>Staff phụ trách</th>
          <th className="text-center" style={{minWidth: 110}}>Địa chỉ</th>
          <th className="text-center" style={{minWidth: 80}}>Loại máu</th>
          <th className="text-center" style={{minWidth: 60}}>Tuổi</th>
          <th className="text-center" style={{minWidth: 180}}>Email</th>
          <th className="text-center" style={{minWidth: 110}}>Ngày cuối hiến</th>
          <th className="text-center" style={{minWidth: 90}}>Số lượng</th>
          <th className="text-center" style={{minWidth: 80}}>Vai trò</th>
          <th className="text-center" style={{minWidth: 110}}>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        {sampleData.map((d, i) => (
          <tr key={i}>
            <td className="text-truncate" style={{maxWidth: 180}}>{d.name}</td>
            <td className="text-center">{d.gender}</td>
            <td className="text-center">{d.phone}</td>
            <td className="text-truncate" style={{maxWidth: 120}}>{d.staff}</td>
            <td className="text-truncate" style={{maxWidth: 100}}>{d.address}</td>
            <td className="text-center">{d.blood}</td>
            <td className="text-center">{d.age}</td>
            <td className="text-truncate" style={{maxWidth: 180}}>{d.email}</td>
            <td className="text-center">{d.last}</td>
            <td className="text-center">{d.amount}</td>
            <td className="text-center">{d.role}</td>
            <td className="text-center">
              <span className={getStatusBadge(d.status)}>{d.status}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Table; 