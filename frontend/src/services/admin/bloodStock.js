import { apiUrl } from '../api';

export const bloodStockService = {
    // Get all blood stocks
    getAllBloodStocks: async () => {
        try {
            const response = await fetch(`${apiUrl}/admin/blood-stocks`, {
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
            console.error('Error fetching blood stocks:', error);
            throw error;
        }
    },

    // Get blood stock by ID
    getBloodStockById: async (id) => {
        try {
            const response = await fetch(`${apiUrl}/admin/blood-stocks/${id}`, {
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
            console.error('Error fetching blood stock:', error);
            throw error;
        }
    },

    // Create new blood stock
    createBloodStock: async (bloodStockData) => {
        try {
            const response = await fetch(`${apiUrl}/admin/blood-stocks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(bloodStockData)
            });
            
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error creating blood stock:', error);
            throw error;
        }
    },

    // Update blood stock
    updateBloodStock: async (id, bloodStockData) => {
        try {
            const response = await fetch(`${apiUrl}/admin/blood-stocks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(bloodStockData)
            });
            
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error updating blood stock:', error);
            throw error;
        }
    },

    // Delete blood stock
    deleteBloodStock: async (id) => {
        try {
            const response = await fetch(`${apiUrl}/admin/blood-stocks/${id}`, {
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
            console.error('Error deleting blood stock:', error);
            throw error;
        }
    },

    // Get available blood stocks
    getAvailableBloodStocks: async () => {
        try {
            const response = await fetch(`${apiUrl}/admin/blood-stocks/available`, {
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
            console.error('Error fetching available blood stocks:', error);
            throw error;
        }
    },

    // Get total available quantity by blood group
    getTotalAvailableQuantityByBloodGroup: async (bloodGroupId) => {
        try {
            const response = await fetch(`${apiUrl}/admin/blood-stocks/blood-group/${bloodGroupId}/quantity`, {
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
            console.error('Error fetching blood group quantity:', error);
            throw error;
        }
    }
}; 