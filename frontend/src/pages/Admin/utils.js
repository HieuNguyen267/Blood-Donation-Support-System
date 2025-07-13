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

// Validate cho BloodRequest
export function validateRequest(data) {
  const errors = {};
  if (!data.facility_name?.trim()) errors.facility_name = "Cơ sở y tế là bắt buộc";
  if (!data.blood_group?.trim()) errors.blood_group = "Nhóm máu là bắt buộc";
  if (!data.quantity_requested?.toString().trim()) errors.quantity_requested = "Số lượng là bắt buộc";
  if (!data.urgency_level?.trim()) errors.urgency_level = "Mức độ khẩn cấp là bắt buộc";
  if (!data.required_by?.trim()) errors.required_by = "Ngày cần là bắt buộc";
  if (!data.contact_person?.trim()) errors.contact_person = "Người liên hệ là bắt buộc";
  if (!data.contact_phone?.trim()) errors.contact_phone = "SĐT liên hệ là bắt buộc";
  if (!data.manager?.trim()) errors.manager = "Người phụ trách là bắt buộc";
  return errors;
}

// Hàm trả về style màu cho mức độ khẩn cấp
export function getUrgencyColor(urgency) {
  switch (urgency) {
    case "routine": return { color: '#22c55e' }; // Xanh lá - Thường xuyên
    case "urgent": return { color: '#fb923c' }; // Cam - Khẩn cấp
    case "emergency": return { color: '#ef4444' }; // Đỏ - Khẩn cấp cao
    case "critical": return { color: '#dc2626', fontWeight: 'bold' }; // Đỏ đậm - Nguy kịch
    default: return { color: '#888' };
  }
}

// Hàm trả về className bootstrap cho mức độ khẩn cấp (dùng cho badge)
export function getUrgencyBadge(urgency) {
  switch (urgency) {
    case "routine": return "badge bg-success"; // Xanh lá
    case "urgent": return "badge bg-warning text-dark"; // Cam
    case "emergency": return "badge bg-danger"; // Đỏ
    case "critical": return "badge bg-danger text-white fw-bold"; // Đỏ đậm, in đậm
    default: return "badge bg-secondary";
  }
}

/**
 * Returns a style object for status text based on the status string.
 * This is the single source of truth for status styling across the application.
 * @param {string} status The status string.
 * @returns {object} A style object with a color property.
 */
export const getStatusStyle = (status) => {
  if (status === 'Kích hoạt') {
    return { color: '#22c55e', fontWeight: '600' }; // Xanh lá
  }
  if (status === 'Khóa') {
    return { color: '#ef4444', fontWeight: '600' }; // Đỏ
  }
  const styles = {
    'pending': { color: '#f59e0b', fontWeight: '600' },
    'confirmed': { color: '#059669', fontWeight: '600' },
    'Not meeting health requirements': { color: '#dc2626', fontWeight: '600' },
    'Chờ xác nhận': { color: '#f59e0b', fontWeight: '600' },
    'Xác nhận': { color: '#059669', fontWeight: '600' },
    'Không đủ điều kiện sức khỏe': { color: '#dc2626', fontWeight: '600' },
    // Blood test statuses
    'Chờ xét nghiệm': { color: '#f59e0b', fontWeight: '600' }, // Orange
    'Đạt chuẩn': { color: '#10b981', fontWeight: '600' }, // Green
    'Không đạt chuẩn': { color: '#ef4444', fontWeight: '600' }, // Red
    // Matching statuses
    'Đang liên hệ': { color: '#3b82f6', fontWeight: '600' }, // Xanh dương
    'Liên hệ thành công': { color: '#10b981', fontWeight: '600' }, // Xanh lá
    'Hoàn thành': { color: '#10b981', fontWeight: '600' }, // Xanh lá
    'Đã từ chối': { color: '#ef4444', fontWeight: '600' }, // Đỏ
    'Đã đồng ý': { color: '#10b981', fontWeight: '600' } // Xanh lá
  };
  return styles[status] || { color: '#6b7280', fontWeight: '600' };
};

/**
 * Returns a Bootstrap badge class for status based on the status string.
 * This is used for displaying status badges in tables and other components.
 * @param {string} status The status string.
 * @returns {string} A Bootstrap badge class.
 */
export const getStatusBadge = (status) => {
  switch (status) {
    // Blood Storage statuses
    case 'Mới':
      return 'badge bg-success';
    case 'Đang sử dụng':
      return 'badge bg-primary';
    case 'Hết hạn':
      return 'badge bg-danger';

    // Blood Request statuses (đơn yêu cầu máu)
    case 'Chờ duyệt':
      return 'badge bg-warning text-dark';
    case 'Đang xử lý':
      return 'badge bg-primary';
    case 'Đang yêu cầu máu khẩn cấp':
      return 'badge bg-danger';
    case 'Hoàn thành':
      return 'badge bg-success';

    // Green statuses (other modules)
    case 'Đã đồng ý':
    case 'Đạt chuẩn':
    case 'Xác nhận':
    case 'Kích hoạt':
    case 'Liên hệ thành công':
    case 'Hoàn thành':
      return 'badge bg-success';

    // Blood test statuses
    case 'Chờ xét nghiệm':
      return 'badge bg-warning text-dark';
    case 'Đạt chuẩn':
      return 'badge bg-success';
    case 'Không đạt chuẩn':
      return 'badge bg-danger';

    // Orange/Yellow statuses
    case 'Chờ xác nhận':
    case 'Đang xét nghiệm':
      return 'badge bg-warning text-dark';

    // Red statuses
    case 'Đã từ chối':
    case 'Không đạt chuẩn':
    case 'Đang yêu cầu máu khẩn cấp':
    case 'Khóa':
    case 'Từ chối':
    case 'Không đủ điều kiện sức khỏe':
      return 'badge bg-danger';

    // Blue statuses
    case 'Đang xử lý':
    case 'Đã hủy':
    case 'Đang liên hệ':
      return 'badge bg-primary';

    // Default Gray
    default:
      return 'badge bg-secondary';
  }
}; 