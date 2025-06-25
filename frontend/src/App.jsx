import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter, useLocation, Navigate } from 'react-router-dom';
import HomePage from './pages/donor/HomePage';

import RegisterDonate from './pages/donor/RegisterDonate/RegisterDonatePage';
import RegisterDonateform from './pages/donor/RegisterDonate/index';

import AppointmentHistory from './pages/donor/AppointmentHistory/index'; // dòng này sẽ tự lấy index.jsx nếu có
import AppointmentDetail from './pages/donor/AppointmentHistory/AppointmentDetail';

import Faq from './pages/donor/Faq/FaqPage'; // Thêm trang FAQ nếu cần

import CertificatePage from "./pages/donor/AddCertificate/CertificatePage";
import CertificatePageform from "./pages/donor/AddCertificate/index";

import ReceiveBloodPage from './pages/donor/ReceiveBlood/ReceiveBloodPage';

import BloodGroupInfo from './pages/donor/BloodGroupInfo/BloodGroupInfo';

import ContactPage from './pages/donor/Contact/ContactPage';
import EmergencyButton from './components/user/EmergencyButton';

// Thêm lại các import cho các trang mới
import RegisterPage from './pages/donor/RegisterPage';
import LoginPage from './pages/donor/Loginpage';
import EmergencyRequest from './pages/donor/EmergencyRequest';

import UserInfoForm from './pages/donor/UserInfoForm';
import ProfilePage from './pages/donor/Profile';
import BloodDonationEligibility from './pages/donor/BloodDonationEligibility';
import ForgotPasswordPage from './pages/donor/ForgotPasswordPage';
import Settings from './pages/donor/Settings';
import VerifyPassword from './pages/donor/VerifyPassword';

// Medical Facility Pages
import MedicalFacilityHome from './pages/medicalfacility/MedicalFacilityHome/index';
import MedicalFacilityProfile from './pages/medicalfacility/Profile/index';
import MedicalFacilityReceiveBlood from './pages/medicalfacility/ReceiveBlood/ReceiveBloodPage';
import MedicalFacilityRequestHistory from './pages/medicalfacility/RequestHistory/index';
import MedicalFacilityRequestDetail from './pages/medicalfacility/RequestHistory/RequestDetail';
import MedicalFacilityEmergencyRequest from './pages/medicalfacility/EmergencyRequest/index';
import MedicalFacilityContact from './pages/medicalfacility/Contact/ContactPage';

// Admin Pages
import AdminDashBoard from './pages/Admin/dashBoard';
import Statistics from './pages/Admin/Statistics';
import DonorManagement from './pages/Admin/DonorManagement';
import BloodStorageManagement from './pages/Admin/BloodStorageManagement';
import DonationManagement from './pages/Admin/DonationManagement';
import DonationProcessManagement from './pages/Admin/DonationProcessManagement';
import DonationProcessDetail from './pages/Admin/DonationProcessDetail';
import DonationDetail from './pages/Admin/DonationDetail';
import BloodTestManagement from './pages/Admin/BloodTestManagement';
import NewsManagement from './pages/Admin/NewsManagement';
import BloodRequestManagement from './pages/Admin/BloodRequestManagement';
import EmergencyDonorMatching from './pages/Admin/EmergencyDonorMatching';
import EmergencyProcess from './pages/Admin/EmergencyProcess';
import MedicalFacilityManagement from './pages/Admin/MedicalFacilityManagement';
import AccountManagement from './pages/Admin/AccountManagement';
import AccountProfile from './pages/Admin/AccountProfile';
import MatchingManagement from './pages/Admin/MatchingManagement';
import BookingAntdForm from './pages/donor/BookingAntdForm';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const location = useLocation();
  const hideEmergencyButton = [
    '/registerpage',
    '/loginpage',
    '/forgot-password',
    '/user-info-form',
    '/verify-password'
  ].includes(location.pathname);

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
    <>
      {/* {isLoggedIn && !hideEmergencyButton && <EmergencyButton />} */}
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
        <Route path="/bloodgroup-info" element={<BloodGroupInfo />} />
        <Route path="/registerpage" element={<RegisterPage />} />
        <Route path="/loginpage" element={<LoginPage />} />
        <Route path="/emergency" element={<EmergencyRequest />} />
        <Route path="/user-info-form" element={<UserInfoForm />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/blood-donation-eligibility" element={<BloodDonationEligibility />} />
        <Route path="/eligibility" element={<BloodDonationEligibility />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-password" element={<VerifyPassword />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/medical-facility" element={<MedicalFacilityHome />} />
        <Route path="/medical-facility/profile" element={<MedicalFacilityProfile />} />
        <Route path="/medical-facility/receive-blood" element={<MedicalFacilityReceiveBlood />} />
        <Route path="/medical-facility/request-history" element={<MedicalFacilityRequestHistory />} />
        <Route path="/medical-facility/request-history/:id" element={<MedicalFacilityRequestDetail />} />
        <Route path="/medical-facility/emergency-request" element={<MedicalFacilityEmergencyRequest />} />
        <Route path="/medical-facility/contact" element={<MedicalFacilityContact />} />
        <Route path="/admin" element={<AdminDashBoard />} />
        <Route path="/admin/statistics" element={<Statistics />} />
        <Route path="/admin/donors" element={<DonorManagement />} />
        <Route path="/admin/blood-storage" element={<BloodStorageManagement />} />
        <Route path="/admin/donations" element={<DonationManagement />} />
        <Route path="/admin/donation-process" element={<DonationProcessManagement />} />
        <Route path="/admin/donation-process/:id" element={<DonationProcessDetail />} />
        <Route path="/admin/blood-test" element={<BloodTestManagement />} />
        <Route path="/admin/donations/:id" element={<DonationDetail />} />
        <Route path="/admin/news" element={<NewsManagement />} />
        <Route path="/admin/blood-requests" element={<BloodRequestManagement />} />
        <Route path="/admin/emergency-donor-matching/:requestId" element={<EmergencyDonorMatching />} />
        <Route path="/admin/emergency-process/:requestId" element={<EmergencyProcess />} />
        <Route path="/admin/medical-facilities" element={<MedicalFacilityManagement />} />
        <Route path="/admin/accounts" element={<AccountManagement />} />
        <Route path="/admin/profile" element={<AccountProfile />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/matching" element={<MatchingManagement />} />
        <Route path="/booking-antd" element={<BookingAntdForm />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
