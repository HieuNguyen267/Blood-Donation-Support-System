// Các hàm validateForm dùng chung cho các component quản lý

// Validate cho Donor
export function validateDonor(data) {
  const errors = {};
  if (!data.name?.trim()) errors.name = "Họ và tên là bắt buộc";
  if (!data.phone?.trim()) errors.phone = "Số điện thoại là bắt buộc";
  if (!data.age?.toString().trim()) errors.age = "Tuổi là bắt buộc";
  if (!data.address?.trim()) errors.address = "Địa chỉ là bắt buộc";
  if (!data.amount?.toString().trim()) errors.amount = "Số lượng là bắt buộc";
  if (!data.staff?.trim()) errors.staff = "Nhân viên phụ trách là bắt buộc";
  if (!data.email?.trim()) errors.email = "Email là bắt buộc";
  if (!data.last?.trim()) errors.last = "Lần hiến gần nhất là bắt buộc";
  return errors;
}

// Validate cho BloodStorage
export function validateBloodStorage(data) {
  const errors = {};
  if (!data.code?.trim()) errors.code = "Mã đơn nhận là bắt buộc";
  if (!data.collect?.trim()) errors.collect = "Ngày và giờ thu thập là bắt buộc";
  if (!data.expire?.trim()) errors.expire = "Ngày và giờ hết hạn là bắt buộc";
  if (!data.amount?.toString().trim()) errors.amount = "Số lượng trong kho là bắt buộc";
  if (!data.temp?.trim()) errors.temp = "Phạm vi nhiệt độ là bắt buộc";
  return errors;
}

// Validate cho Donation
export function validateDonation(data) {
  const errors = {};
  if (!data.code?.trim()) errors.code = "Mã đơn nhận là bắt buộc";
  if (!data.name?.trim()) errors.name = "Họ và tên là bắt buộc";
  if (!data.donateDate?.trim()) errors.donateDate = "Ngày và giờ hiến là bắt buộc";
  if (!data.completeDate?.trim()) errors.completeDate = "Ngày và giờ hoàn thành là bắt buộc";
  if (!data.amount?.toString().trim()) errors.amount = "Số lượng là bắt buộc";
  return errors;
}

// Hàm trả về style màu cho trạng thái
export function getStatusColor(status) {
  if (["Đạt chuẩn", "Xác nhận", "Mới"].includes(status)) return { color: '#22c55e' };
  if (["Đang xét nghiệm", "Chờ xác nhận", "Đang sử dụng"].includes(status)) return { color: '#fb923c' };
  if (["Hết hạn", "Từ chối", "Không đạt chuẩn"].includes(status)) return { color: '#ef4444' };
  return { color: '#888' };
}

// Hàm trả về className bootstrap cho trạng thái (dùng cho badge)
export function getStatusBadge(status) {
  if (["Đạt chuẩn", "Xác nhận", "Mới"].includes(status)) return "badge bg-success";
  if (["Đang xét nghiệm", "Chờ xác nhận", "Đang sử dụng"].includes(status)) return "badge bg-warning text-dark";
  if (["Hết hạn", "Từ chối", "Không đạt chuẩn"].includes(status)) return "badge bg-danger";
  return "badge bg-secondary";
} 