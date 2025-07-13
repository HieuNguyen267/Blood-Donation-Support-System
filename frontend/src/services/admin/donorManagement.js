import { apiUrl } from '../api';

export const donorManagementService = {
    // Get all donors
    getAllDonors: async () => {
        try {
            const response = await fetch(`${apiUrl}/admin/donors`, {
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
            console.error('Error fetching donors:', error);
            throw error;
        }
    },

    // Get donor by ID
    getDonorById: async (id) => {
        try {
            const response = await fetch(`${apiUrl}/admin/donors/${id}`, {
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
            console.error('Error fetching donor:', error);
            throw error;
        }
    },

    // Update donor eligibility
    updateDonorEligibility: async (id, isEligible) => {
        try {
            const response = await fetch(`${apiUrl}/admin/donors/${id}/eligibility?isEligible=${isEligible}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error updating donor eligibility:', error);
            throw error;
        }
    },

    // Update donor emergency availability
    updateDonorEmergencyAvailability: async (id, isAvailableForEmergency) => {
        try {
            const response = await fetch(`${apiUrl}/admin/donors/${id}/emergency-availability?isAvailableForEmergency=${isAvailableForEmergency}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error updating donor emergency availability:', error);
            throw error;
        }
    },

    // Get donors by eligibility
    getDonorsByEligibility: async (isEligible) => {
        try {
            const response = await fetch(`${apiUrl}/admin/donors/eligibility/${isEligible}`, {
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
            console.error('Error fetching donors by eligibility:', error);
            throw error;
        }
    },

    // Get donors by blood group
    getDonorsByBloodGroup: async (bloodGroupId) => {
        try {
            const response = await fetch(`${apiUrl}/admin/donors/blood-group/${bloodGroupId}`, {
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
            console.error('Error fetching donors by blood group:', error);
            throw error;
        }
    },

    // Delete donor
    deleteDonor: async (id) => {
        try {
            const response = await fetch(`${apiUrl}/admin/donors/${id}`, {
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
            console.error('Error deleting donor:', error);
            throw error;
        }
    }
}; 