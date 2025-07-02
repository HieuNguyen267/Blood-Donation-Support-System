import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MedicalFacilityHome from './MedicalFacilityHome';
import EmergencyRequest from './EmergencyRequest';
import EmergencyProcess from './EmergencyRequest/EmergencyProcess';
import ReceiveBlood from './ReceiveBlood/ReceiveBloodPage';
import RequestHistory from './RequestHistory';
import Contact from './Contact/ContactPage';
import Profile from './Profile';
import EmergencyButton from '../../components/user/EmergencyButton';
import BloodGroupInfo from './BloodGroupInfo/BloodGroupInfo';

export default function MedicalFacilityLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<MedicalFacilityHome />} />
          <Route path="/emergency" element={<EmergencyRequest />} />
          <Route path="/emergency-process/:requestId" element={<EmergencyProcess />} />
          <Route path="/receive-blood" element={<ReceiveBlood />} />
          <Route path="/request-history" element={<RequestHistory />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/bloodgroup-info" element={<BloodGroupInfo />} />
        </Routes>
      </div>
      <EmergencyButton />
    </div>
  );
} 