const API_BASE_URL = 'http://localhost:8080';

// Helper function để xử lý response
const handleResponse = async (response) => {
  if (!response.ok) {
    // Nếu có body JSON thì parse, không thì trả về text hoặc throw error
    const text = await response.text();
    try {
      const errorData = JSON.parse(text);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || errorData.error || text}`);
    } catch {
      throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
    }
  }
  // Nếu response ok
  const text = await response.text();
  if (!text) {
    return null; // Trả về null nếu response rỗng
  }
  try {
    return JSON.parse(text);
  } catch {
    // Nếu không phải JSON thì trả về text luôn (ví dụ: 'Xóa thành công')
    return text;
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
  },

  changePassword: async (data) => {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  deleteAccount: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/account`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// Donor API
export const donorAPI = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/donor/profile`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/donor/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData)
    });
    return handleResponse(response);
  },

  registerDonation: async (donationData) => {
    const response = await fetch(`${API_BASE_URL}/donor/register-donation`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(donationData)
    });
    return handleResponse(response);
  },

  getDonationHistory: async () => {
    const response = await fetch(`${API_BASE_URL}/donor/donation-history`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getDonationDetail: async (id) => {
    const response = await fetch(`${API_BASE_URL}/donor/donation-detail/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  deleteDonationRegister: async (registerId) => {
    const response = await fetch(`${API_BASE_URL}/donation-registers/${registerId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  createSurvey: async (surveyData) => {
    const headers = getHeaders();
    const response = await fetch(`${API_BASE_URL}/donor/survey/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(surveyData)
    });
    return handleResponse(response);
  },

  getLatestSurvey: async (donorId) => {
    const response = await fetch(`${API_BASE_URL}/donor/survey/latest/${donorId}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getAllDonors: async () => {
    const response = await fetch(`${API_BASE_URL}/donor`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  createDonor: async (donorData) => {
    const response = await fetch(`${API_BASE_URL}/donor`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(donorData)
    });
    return handleResponse(response);
  },

  updateDonor: async (id, donorData) => {
    const response = await fetch(`${API_BASE_URL}/donor/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(donorData)
    });
    return handleResponse(response);
  },

  deleteDonor: async (id) => {
    const response = await fetch(`${API_BASE_URL}/donor/${id}`, {
      method: 'DELETE',
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
    const response = await fetch(`${API_BASE_URL}/api/blood-stock`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  addStock: async (data) => {
    const response = await fetch(`${API_BASE_URL}/api/blood-stock`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
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
  },

  deleteStock: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/blood-stock/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
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
  },

  createFacility: async (facilityData) => {
    const response = await fetch(`${API_BASE_URL}/medical-facilities`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(facilityData)
    });
    return handleResponse(response);
  },

  updateFacility: async (id, facilityData) => {
    const response = await fetch(`${API_BASE_URL}/medical-facilities/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(facilityData)
    });
    return handleResponse(response);
  },

  deleteFacility: async (id) => {
    const response = await fetch(`${API_BASE_URL}/medical-facilities/${id}`, {
      method: 'DELETE',
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
  getDashboardAnalytics: async () => {
    const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

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

// Medical Facility API
export const medicalFacilityAPI = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/medical-facility/profile`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },
  // Có thể bổ sung các hàm khác nếu cần
  };

// Account API
export const accountAPI = {
  getAccounts: async () => {
    const response = await fetch(`${API_BASE_URL}/accounts`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getAccountById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/accounts/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  createAccount: async (accountData) => {
    const response = await fetch(`${API_BASE_URL}/accounts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(accountData)
    });
    return handleResponse(response);
  },

  updateAccount: async (id, accountData) => {
    const response = await fetch(`${API_BASE_URL}/accounts/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(accountData)
    });
    return handleResponse(response);
  },

  deleteAccount: async (id) => {
    const response = await fetch(`${API_BASE_URL}/accounts/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

export const donationRegisterAPI = {
  getAllDonationRegisters: async () => {
    const response = await fetch(`${API_BASE_URL}/donation-registers`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },
  createDonationRegister: async (data) => {
    const response = await fetch(`${API_BASE_URL}/donation-registers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  updateDonationRegister: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/donation-registers/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  deleteDonationRegister: async (id) => {
    const response = await fetch(`${API_BASE_URL}/donation-registers/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  },
  getDonationRegisterById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/donation-registers/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// Matching API
export const matchingAPI = {
  getAllMatchings: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/matching`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};
  
    