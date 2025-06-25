const API_BASE_URL = 'http://localhost:8080';

// Helper function để xử lý response
const handleResponse = async (response) => {
  if (!response.ok) {
    // Nếu có body JSON thì parse, không thì trả về text hoặc throw error
    const text = await response.text();
    try {
      const errorData = JSON.parse(text);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || errorData.error || text}`);
    } catch (parseError) {
      throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
    }
  }
  
  // Kiểm tra response có body không
  const text = await response.text();
  if (!text) {
    return null; // Trả về null nếu response rỗng
  }
  
  try {
    return JSON.parse(text);
  } catch (parseError) {
    throw new Error(`Invalid JSON response: ${text}`);
  }
};

// Helper function để tạo headers
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials)
    });
    const data = await handleResponse(response);
    console.log('Login response data:', data); // Debug log
    console.log('Email from response:', data.email); // Debug log
    console.log('Role from response:', data.role); // Debug log
    setAuthToken(data.token, data.email, data.role);
    return data;
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email })
    });
    return handleResponse(response);
  },

  resetPassword: async (resetData) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(resetData)
    });
    return handleResponse(response);
  },

  verifyCode: async (verifyData) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-code`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(verifyData)
    });
    return handleResponse(response);
  }
};

// Donor API
export const donorAPI = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/donors/profile`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/donors/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData)
    });
    return handleResponse(response);
  },

  registerDonation: async (donationData) => {
    const response = await fetch(`${API_BASE_URL}/donation-register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(donationData)
    });
    return handleResponse(response);
  },

  getDonationHistory: async () => {
    const response = await fetch(`${API_BASE_URL}/donation-register/history`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getDonationDetail: async (id) => {
    const response = await fetch(`${API_BASE_URL}/donation-register/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// Blood Request API
export const bloodRequestAPI = {
  createRequest: async (requestData) => {
    const response = await fetch(`${API_BASE_URL}/blood-requests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(requestData)
    });
    return handleResponse(response);
  },

  getRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/blood-requests`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getRequestById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/blood-requests/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  updateRequest: async (id, requestData) => {
    const response = await fetch(`${API_BASE_URL}/blood-requests/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(requestData)
    });
    return handleResponse(response);
  },

  deleteRequest: async (id) => {
    const response = await fetch(`${API_BASE_URL}/blood-requests/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// Blood Stock API
export const bloodStockAPI = {
  getStock: async () => {
    const response = await fetch(`${API_BASE_URL}/blood-stock`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  updateStock: async (stockData) => {
    const response = await fetch(`${API_BASE_URL}/blood-stock`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(stockData)
    });
    return handleResponse(response);
  }
};

// Medical Facilities API
export const medicalFacilitiesAPI = {
  getFacilities: async () => {
    const response = await fetch(`${API_BASE_URL}/medical-facilities`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getFacilityById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/medical-facilities/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// Blood Group API
export const bloodGroupAPI = {
  getBloodGroups: async () => {
    const response = await fetch(`${API_BASE_URL}/blood-groups`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// Certificates API
export const certificatesAPI = {
  uploadCertificate: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/certificates/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    return handleResponse(response);
  },

  getCertificates: async () => {
    const response = await fetch(`${API_BASE_URL}/certificates`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// Analytics API
export const analyticsAPI = {
  getDashboardStats: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getDonationStats: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/donations`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// Utility functions
export const setAuthToken = (token, email, role) => {
  if (token) {
    localStorage.setItem('token', token);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('email', email);
    localStorage.setItem('role', role);
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

const email = localStorage.getItem('email') || '';
const role = localStorage.getItem('role');

const handleSave = async (values) => {
  await donorAPI.updateProfile(values);
  // ... xử lý tiếp
};

const handleSaveForm = async (e) => {
  e.preventDefault(); // Ngăn submit mặc định
  await donorAPI.updateProfile(formData); // Gọi API PUT
  // ... xử lý tiếp (hiển thị thông báo, chuyển trang nếu thành công)
}; 