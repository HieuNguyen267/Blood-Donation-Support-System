const API_BASE_URL = 'http://localhost:8080';

export const adminMedicalFacilityAPI = {
    // Get all medical facilities
    getAll: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/medical-facilities`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching medical facilities:', error);
            throw error;
        }
    },

    // Get facility by ID
    getById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/medical-facilities/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching facility:', error);
            throw error;
        }
    },

    // Create new facility
    create: async (facilityData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/medical-facilities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(facilityData)
            });
            
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error creating facility:', error);
            throw error;
        }
    },

    // Update facility
    update: async (id, facilityData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/medical-facilities/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(facilityData)
            });
            
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error updating facility:', error);
            throw error;
        }
    },

    // Delete facility
    delete: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/medical-facilities/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData);
            }
            
            return true;
        } catch (error) {
            console.error('Error deleting facility:', error);
            throw error;
        }
    }
}; 