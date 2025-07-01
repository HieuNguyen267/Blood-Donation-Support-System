import React from 'react';
import { Outlet } from 'react-router-dom';
import EmergencyButton from '../../components/user/EmergencyButton';

const MedicalFacilityLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <EmergencyButton />
    </div>
  );
};

export default MedicalFacilityLayout; 