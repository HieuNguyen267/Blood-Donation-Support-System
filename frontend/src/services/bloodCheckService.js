const API_BASE_URL = 'http://localhost:8080';

// Helper function để xử lý response
const handleResponse = async (response) => {
    if (!response.ok) {
        const text = await response.text();
        try {
            const errorData = JSON.parse(text);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || errorData.error || text}`);
        } catch {
            throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
        }
    }
    const text = await response.text();
    if (!text) {
        return null;
    }
    try {
        return JSON.parse(text);
    } catch {
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

const bloodCheckService = {
    // Lấy tất cả blood checks
    getAllBloodChecks: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/blood-checks`, {
                headers: getHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error fetching blood checks:', error);
            throw error;
        }
    },

    // Lấy blood checks theo status
    getBloodChecksByStatus: async (status) => {
        try {
            const response = await fetch(`${API_BASE_URL}/blood-checks/status/${status}`, {
                headers: getHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error fetching blood checks by status:', error);
            throw error;
        }
    },

    // Lấy chi tiết blood check theo ID
    getBloodCheckById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/blood-checks/${id}`, {
                headers: getHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error fetching blood check detail:', error);
            throw error;
        }
    },

    // Cập nhật blood check
    updateBloodCheck: async (id, updateData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/blood-checks/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(updateData)
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error updating blood check:', error);
            throw error;
        }
    },

    // Cập nhật status của blood check
    updateBloodCheckStatus: async (id, status) => {
        try {
            const response = await fetch(`${API_BASE_URL}/blood-checks/${id}/status`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({ status })
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error updating blood check status:', error);
            throw error;
        }
    }
};

export default bloodCheckService; 