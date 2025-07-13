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
    const response = await fetch(`${API_BASE_URL}/donor/register-donation/${registerId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  createSurvey: async (surveyData) => {
    console.log('Current role:', localStorage.getItem('role'));
    console.log('Is logged in:', localStorage.getItem('isLoggedIn'));
    console.log('Token:', localStorage.getItem('token'));
    const headers = getHeaders();
    console.log('Request headers:', headers);
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

  getDonationRegistrationInfo: async () => {
    const response = await fetch(`${API_BASE_URL}/donor/donation-registration-info`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getTimeEvents: async () => {
    const response = await fetch(`${API_BASE_URL}/time-events`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getAllDonors: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/donors`, {
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
  },
  getEligibleDonors: async () => {
    const response = await fetch(`${API_BASE_URL}/donor/eligible`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },
  updateMatchingBloodStatus: async (requestId, status) => {
    const response = await fetch(`${API_BASE_URL}/donor/emergency-request/${requestId}/response`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },

  getMatchingHistory: async () => {
    const response = await fetch(`${API_BASE_URL}/donor/matching-history`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getMatchingDetail: async (matchingId) => {
    const response = await fetch(`${API_BASE_URL}/donor/matching-detail/${matchingId}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Lấy danh sách chứng nhận hiến máu tình nguyện
  getCertificates: async () => {
    const response = await fetch(`${API_BASE_URL}/donor/certificates`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Lấy chi tiết chứng nhận hiến máu tình nguyện
  getCertificateDetail: async (certificateId) => {
    const response = await fetch(`${API_BASE_URL}/donor/certificate-detail/${certificateId}`, {
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
    const response = await fetch(`${API_BASE_URL}/api/admin/blood-requests/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  updateRequest: async (id, requestData) => {
    // Nếu là gửi máu (có sentBlood), gọi endpoint mới
    if (requestData.sentBlood) {
      const response = await fetch(`${API_BASE_URL}/api/admin/blood-requests/${id}/send-blood`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(requestData)
      });
      return handleResponse(response);
    }
    // Nếu chỉ update trạng thái, giữ nguyên endpoint cũ
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
  },

  getAllAdminBloodRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/blood-requests`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },
  updateStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/blood-requests/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },
  updateProcessingStatus: async (id, processingStatus) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/blood-requests/${id}/processing-status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ processingStatus })
    });
    return handleResponse(response);
  },

  contactDonorForEmergency: async (requestId, { donorId, distanceKm }) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/blood-requests/${requestId}/contact-donor`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ donorId, distanceKm })
    });
    return handleResponse(response);
  },

  testEmail: async (email) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/blood-requests/test-email`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email })
    });
    return handleResponse(response);
  },

  testSimpleEmail: async (email) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/blood-requests/test-simple-email`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email })
    });
    return handleResponse(response);
  },

  testEmailNoAuth: async (email) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/blood-requests/test-email-no-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    return handleResponse(response);
  },

  testLogOnly: async (email) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/blood-requests/test-log-only`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    return handleResponse(response);
  },

  updateEmergencyStatus: async (id, emergencyStatus) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/blood-requests/${id}/emergency-status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ emergencyStatus })
    });
    return handleResponse(response);
  },
  getMatchingBlood: async (requestId) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/blood-requests/${requestId}/matching-blood`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },
  completeEmergencyRequest: async (requestId) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/blood-requests/${requestId}/complete-emergency`, {
      method: 'PUT',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  // Matching Blood API
  getMatchingBloodForAdmin: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/matching-blood`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// Blood Stock API
export const bloodStockAPI = {
  getStock: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/blood-stocks`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  addStock: async (data) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/blood-stocks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  updateStock: async (id, stockData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/blood-stocks/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(stockData)
    });
    return handleResponse(response);
  },

  deleteStock: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/blood-stocks/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getAvailableStock: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/blood-stocks/available`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getQuantityByBloodGroup: async (bloodGroupId) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/blood-stocks/blood-group/${bloodGroupId}/quantity`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// Medical Facilities API
export const medicalFacilitiesAPI = {
  getFacilities: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/medical-facilities`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getFacilityById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/medical-facilities/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  createFacility: async (facilityData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/medical-facilities`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(facilityData)
    });
    return handleResponse(response);
  },

  updateFacility: async (id, facilityData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/medical-facilities/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(facilityData)
    });
    return handleResponse(response);
  },

  deleteFacility: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/medical-facilities/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  },
  getFacilityByAccountId: async (accountId) => {
    const response = await fetch(`${API_BASE_URL}/medical-facility/by-account/${accountId}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// Medical Facility Blood Request API
// (giữ lại khai báo mới ở phía trên, xóa đoạn dưới)

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
  
export const adminDonationRegisterAPI = {
  getDonationRegisterDetailById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/donation-registers/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },
  updateDonationStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/donation-registers/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  },
  updateHealthCheckResult: async (id, healthCheckResult) => {
    const response = await fetch(`${API_BASE_URL}/donation-registers/${id}/health-check`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ healthCheckResult })
    });
    return handleResponse(response);
  },
  updateBloodQuantity: async (id, quantity) => {
    const response = await fetch(`${API_BASE_URL}/donation-registers/${id}/quantity`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ quantity })
    });
    return handleResponse(response);
  },
  updateDonationProcessStatus: async (id, donationStatus, incidentDescription = null) => {
    const response = await fetch(`${API_BASE_URL}/donation-registers/${id}/donation-status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ donationStatus, incidentDescription })
    });
    return handleResponse(response);
  }
};

// Blood Check API
export const bloodCheckAPI = {
  getAllBloodChecks: async () => {
    const response = await fetch(`${API_BASE_URL}/blood-checks`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getBloodChecksByStatus: async (status) => {
    const response = await fetch(`${API_BASE_URL}/blood-checks/status/${status}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  updateBloodCheckStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/blood-checks/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  }
};
  
export { getHeaders };

// Certificate API
export const certificateAPI = {
  createCertificateFromMatching: async (matchingId, staffId, notes) => {
    const response = await fetch(`${API_BASE_URL}/admin/certificates/matching/${matchingId}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ staffId, notes })
    });
    return handleResponse(response);
  },

  getAllCertificates: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/certificates`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getCertificateById: async (certificateId) => {
    const response = await fetch(`${API_BASE_URL}/admin/certificates/${certificateId}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getCertificateByNumber: async (certificateNumber) => {
    const response = await fetch(`${API_BASE_URL}/admin/certificates/number/${certificateNumber}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getCertificatesByDonorId: async (donorId) => {
    const response = await fetch(`${API_BASE_URL}/admin/certificates/donor/${donorId}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getCertificatesByMatchingId: async (matchingId) => {
    const response = await fetch(`${API_BASE_URL}/admin/certificates/matching/${matchingId}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  searchCertificates: async (searchTerm) => {
    const response = await fetch(`${API_BASE_URL}/admin/certificates/search?q=${encodeURIComponent(searchTerm)}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },
  createCertificateFromRegister: async (registerId, staffId, notes) => {
    const response = await fetch(`${API_BASE_URL}/admin/certificates/register/${registerId}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ staffId, notes })
    });
    return handleResponse(response);
  },

  getCertificatesByRegisterId: async (registerId) => {
    const response = await fetch(`${API_BASE_URL}/admin/certificates/register/${registerId}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// Medical Facility Blood Request API
export const mfBloodRequestAPI = {
  createBloodRequest: async (requestData) => {
    const response = await fetch(`${API_BASE_URL}/api/medical-facility/blood-requests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(requestData)
    });
    return handleResponse(response);
  },

  getAllBloodRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/api/medical-facility/blood-requests`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getBloodRequestById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/medical-facility/blood-requests/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  deleteBloodRequest: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/medical-facility/blood-requests/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// Cuối file, export default object tổng hợp
const api = {
  authAPI,
  donorAPI,
  bloodRequestAPI,
  bloodStockAPI,
  medicalFacilitiesAPI,
  bloodGroupAPI,
  certificatesAPI,
  analyticsAPI,
  medicalFacilityAPI,
  accountAPI,
  setAuthToken,
  getAuthToken,
  isAuthenticated,
  donationRegisterAPI,
  adminDonationRegisterAPI,
  bloodCheckAPI,
  certificateAPI,
  mfBloodRequestAPI
};

export default api;
  
    