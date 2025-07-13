import { getHeaders } from '../api';

const API_BASE_URL = 'http://localhost:8080';

export const adminDonationRegisterAPI = {
  // ============= DONATION MANAGEMENT APIs =============
  // Lấy tất cả đơn hiến cho trang quản lý
  getAllForManagement: async () => {
    const response = await fetch(`${API_BASE_URL}/donation-registers/management`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch donation registers');
    return response.json();
  },

  // Lấy đơn hiến theo status
  getByStatusForManagement: async (status) => {
    const response = await fetch(`${API_BASE_URL}/donation-registers/management/status/${status}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch donation registers by status');
    return response.json();
  },

  // Lấy đơn hiến theo nhóm máu
  getByBloodGroupForManagement: async (bloodGroup) => {
    const response = await fetch(`${API_BASE_URL}/donation-registers/management/blood-group/${bloodGroup}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch donation registers by blood group');
    return response.json();
  },

  // Search đơn hiến theo tên
  searchByDonorNameForManagement: async (searchTerm) => {
    const response = await fetch(`${API_BASE_URL}/donation-registers/management/search?q=${encodeURIComponent(searchTerm)}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to search donation registers');
    return response.json();
  },

  // Cập nhật status của đơn hiến
  updateDonationStatus: async (registerId, newStatus) => {
    const response = await fetch(`${API_BASE_URL}/donation-registers/${registerId}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status: newStatus })
    });
    if (!response.ok) throw new Error('Failed to update donation status');
    return response.json();
  },

  // Cập nhật donation process status (processing, deferred, completed)
  updateDonationProcessStatus: async (registerId, donationStatus, incidentDescription, staffId) => {
    const response = await fetch(`${API_BASE_URL}/donation-registers/${registerId}/donation-status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ 
        donationStatus, 
        incidentDescription, 
        staffId 
      })
    });
    if (!response.ok) throw new Error('Failed to update donation process status');
    return response.json();
  },

  // Cập nhật kết quả kiểm tra sức khỏe
  updateHealthCheckResult: async (id, healthCheckResult) => {
    const response = await fetch(`${API_BASE_URL}/donation-registers/${id}/health-check`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ healthCheckResult })
    });
    if (!response.ok) throw new Error('Failed to update health check result');
    return response.json();
  },

  // Cập nhật số lượng máu
  updateBloodQuantity: async (id, quantity) => {
    const response = await fetch(`${API_BASE_URL}/donation-registers/${id}/quantity`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ quantity })
    });
    if (!response.ok) throw new Error('Failed to update blood quantity');
    return response.json();
  },

  // ============= EXISTING APIs =============
  // Lấy tất cả đơn hiến (legacy)
  getAllDonationRegisters: async () => {
    const response = await fetch(`${API_BASE_URL}/donation-registers`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch donation registers');
    return response.json();
  },

  // Tạo đơn hiến mới
  createDonationRegister: async (donationRegisterData) => {
    const response = await fetch(`${API_BASE_URL}/donation-registers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(donationRegisterData)
    });
    if (!response.ok) throw new Error('Failed to create donation register');
    return response.json();
  },

  // Cập nhật đơn hiến
  updateDonationRegister: async (id, donationRegisterData) => {
    const response = await fetch(`${API_BASE_URL}/donation-registers/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(donationRegisterData)
    });
    if (!response.ok) throw new Error('Failed to update donation register');
    return response.json();
  },

  // Xóa đơn hiến
  deleteDonationRegister: async (id) => {
    const response = await fetch(`${API_BASE_URL}/donation-registers/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete donation register');
  },

  // Lấy đơn hiến theo ID
  getDonationRegister: async (id) => {
    const response = await fetch(`${API_BASE_URL}/donation-registers/${id}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch donation register');
    return response.json();
  },

  // Lấy đơn hiến theo donor ID
  getDonationRegistersByDonor: async (donorId) => {
    const response = await fetch(`${API_BASE_URL}/donation-registers/donor/${donorId}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch donation registers by donor');
    return response.json();
  },

  // Lấy chi tiết đơn hiến theo ID
  getDonationRegisterDetailById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/donation-registers/${id}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch donation register detail');
    return response.json();
  }
}; 