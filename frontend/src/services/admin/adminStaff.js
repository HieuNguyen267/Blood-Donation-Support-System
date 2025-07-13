import { getHeaders } from '../api';

const API_BASE_URL = 'http://localhost:8080';

export const adminStaffAPI = {
  getByAccountId: async (accountId) => {
    const response = await fetch(`${API_BASE_URL}/admin-staff/account/${accountId}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Không lấy được thông tin admin staff');
    const data = await response.json();
    console.log('Raw API response:', data);
    
    // Return the first staff object if array exists
    if (Array.isArray(data) && data.length > 0) {
      const staff = data[0];
      console.log('Found staff with staffId:', staff.staffId);
      return staff;
    } else {
      // No staff found - throw error instead of fallback
      console.error('No staff found for accountId:', accountId);
      throw new Error(`Không tìm thấy thông tin staff cho account ID: ${accountId}. Vui lòng liên hệ quản trị viên.`);
    }
  },
  
  createDefaultStaff: async (accountId) => {
    const response = await fetch(`${API_BASE_URL}/admin-staff/create-default/${accountId}`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Không thể tạo default staff');
    const data = await response.json();
    console.log('Created default staff:', data);
    return data;
  }
}; 