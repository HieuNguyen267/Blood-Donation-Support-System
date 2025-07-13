// API cho quản lý quá trình hiến máu (admin)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const adminDonationProcessAPI = {
  // Lấy tất cả quá trình hiến máu
  getAllForProcessManagement: async () => {
    const response = await fetch(`${API_BASE_URL}/donation-process/management`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Không thể tải dữ liệu quá trình hiến máu');
    return await response.json();
  },
  // Lọc theo trạng thái
  getByStatusForProcessManagement: async (status) => {
    const response = await fetch(`${API_BASE_URL}/donation-process/management/status/${status}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Không thể lọc dữ liệu quá trình hiến máu');
    return await response.json();
  },
  // Lọc theo nhóm máu
  getByBloodGroupForProcessManagement: async (bloodGroup) => {
    const response = await fetch(`${API_BASE_URL}/donation-process/management/blood-group/${bloodGroup}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Không thể lọc dữ liệu theo nhóm máu');
    return await response.json();
  },
  // Tìm kiếm theo tên
  searchByDonorNameForProcessManagement: async (searchTerm) => {
    const response = await fetch(`${API_BASE_URL}/donation-process/management/search?q=${encodeURIComponent(searchTerm)}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Không thể tìm kiếm dữ liệu quá trình hiến máu');
    return await response.json();
  },
}; 