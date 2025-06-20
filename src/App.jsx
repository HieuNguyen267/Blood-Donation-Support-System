import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './Pages/HomePage';

import RegisterDonate from './Pages/RegisterDonate/RegisterDonatePage';
import RegisterDonateform from './Pages/RegisterDonate/index';

import AppointmentHistory from './Pages/AppointmentHistory/index'; // dòng này sẽ tự lấy index.jsx nếu có
import AppointmentDetail from './Pages/AppointmentHistory/AppointmentDetail';

import Faq from './Pages/Faq/FaqPage'; // Thêm trang FAQ nếu cần

import CertificatePage from "./Pages/AddCertificate/CertificatePage";
import CertificatePageform from "./Pages/AddCertificate/index";

import ReceiveBloodPage from './Pages/ReceiveBlood/ReceiveBloodPage';
import ReceiveBloodSuccess from './Pages/ReceiveBlood/ReceiveBloodSuccess';

import BloodGroupInfo from './Pages/BloodGroupInfo/BloodGroupInfo';

import ContactPage from './Pages/Contact/ContactPage';
import EmergencyButton from './components/EmergencyButton';

// Thêm lại các import cho các trang mới
import RegisterPage from './Pages/RegisterPage';
import LoginPage from './Pages/Loginpage';
import EmergencyRequest from './Pages/EmergencyRequest';

import UserInfoForm from './Pages/UserInfoForm';
import ProfilePage from './Pages/Profile';
import BloodDonationEligibility from './pages/BloodDonationEligibility';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);

    // Initial check
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <BrowserRouter>
      {isLoggedIn && <EmergencyButton />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/registerdonate" element={<RegisterDonate />} />
        <Route path="/appointmenthistory" element={<AppointmentHistory />} />
        <Route path="/appointment/:id" element={<AppointmentDetail />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/registerdonateform" element={<RegisterDonateform />} />
        <Route path="/addcertificate" element={<CertificatePage />} />
        <Route path="/certificateform" element={<CertificatePageform />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/receiveblood" element={<ReceiveBloodPage />} />
        <Route path="/receiveblood-success" element={<ReceiveBloodSuccess />} />
        <Route path="/bloodgroup-info" element={<BloodGroupInfo />} />
        
        {/* Khôi phục lại các route mới */}
        <Route path="/registerpage" element={<RegisterPage />} />
        <Route path="/loginpage" element={<LoginPage />} />
        <Route path="/emergency" element={<EmergencyRequest />} />

        <Route path="/user-info-form" element={<UserInfoForm />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/blood-donation-eligibility" element={<BloodDonationEligibility />} />
        <Route path="/eligibility" element={<BloodDonationEligibility />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
