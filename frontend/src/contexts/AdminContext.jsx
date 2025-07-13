import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminStaffAPI } from '../services/admin/adminStaff';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        console.log('AdminContext: Fetching admin info...');
        const accountId = localStorage.getItem('accountId');
        console.log('AdminContext: AccountId from localStorage:', accountId);
        
        if (accountId) {
          console.log('AdminContext: Calling adminStaffAPI.getByAccountId with accountId:', accountId);
          const data = await adminStaffAPI.getByAccountId(accountId);
          console.log('AdminContext: API response data:', data);
          setAdminInfo(data);
        } else {
          console.log('AdminContext: No accountId found in localStorage');
        }
      } catch (error) {
        console.error('AdminContext: Error fetching admin info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminInfo();
  }, []);

  const value = {
    adminInfo,
    setAdminInfo,
    loading
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}; 