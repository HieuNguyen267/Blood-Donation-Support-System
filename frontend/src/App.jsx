import React from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { AdminProvider } from './contexts/AdminContext';
import HomePage from './pages/donor/HomePage';

import RegisterDonate from './pages/donor/RegisterDonate/RegisterDonatePage';
import RegisterDonateform from './pages/donor/RegisterDonate/index';

import AppointmentHistory from './pages/donor/AppointmentHistory/index'; // dòng này sẽ tự lấy index.jsx nếu có
import AppointmentDetail from './pages/donor/AppointmentHistory/AppointmentDetail';

import Faq from './pages/donor/Faq/FaqPage'; // Thêm trang FAQ nếu cần

import CertificatePage from "./pages/donor/AddCertificate/CertificatePage";
import CertificateDetail from "./pages/donor/AddCertificate/CertificateDetail";
// import CertificatePageform from "./pages/donor/AddCertificate/index";

import ReceiveBloodPage from './pages/donor/ReceiveBlood/ReceiveBloodPage';

import BloodGroupInfo from './pages/donor/BloodGroupInfo/BloodGroupInfo';

import ContactPage from './pages/donor/Contact/ContactPage';
import EmergencyButton from './components/user/EmergencyButton';

// Thêm lại các import cho các trang mới
import Signup from './pages/donor/Signup';
import LoginPage from './pages/donor/Login';
import EmergencyRequest from './pages/medicalfacility/EmergencyRequest/index';

import UserInfoForm from './pages/donor/UserInfoForm';
import ProfilePage from './pages/donor/Profile';
import BloodDonationEligibility from './pages/donor/BloodDonationEligibility';
import ForgotPasswordPage from './pages/donor/ForgotPasswordPage';
import Settings from './pages/donor/Settings';
import VerifyPassword from './pages/donor/VerifyPassword';

import News from './pages/donor/News/News';

// Emergency Request Detail for Donors
import EmergencyRequestDetail from './pages/donor/EmergencyRequestDetail';

// Medical Facility Pages
import MedicalFacilityHome from './pages/medicalfacility/MedicalFacilityHome/index';
import MedicalFacilityProfile from './pages/medicalfacility/Profile/index';
import MedicalFacilityReceiveBlood from './pages/medicalfacility/ReceiveBlood/ReceiveBloodPage';
import MedicalFacilityRequestHistory from './pages/medicalfacility/RequestHistory/index';
import MedicalFacilityRequestDetail from './pages/medicalfacility/RequestHistory/RequestDetail';
import MedicalFacilityEmergencyRequest from './pages/medicalfacility/EmergencyRequest/index';
import MedicalFacilityContact from './pages/medicalfacility/Contact/ContactPage';

import Statistics from './pages/Admin/Statistics';
import DonorManagement from './pages/Admin/DonorManagement';
import BloodStorageManagement from './pages/Admin/BloodStorageManagement';
import DonationManagement from './pages/Admin/DonationManagement';
import DonationDetail from './pages/Admin/DonationDetail';
import NewsManagement from './pages/Admin/NewsManagement';
import BloodRequestManagement from './pages/Admin/BloodRequestManagement';
import EmergencyDonorMatching from './pages/Admin/EmergencyDonorMatching';
import EmergencyProcess from './pages/Admin/EmergencyProcess';
import MedicalFacilityManagement from './pages/Admin/MedicalFacilityManagement';
import AccountManagement from './pages/Admin/AccountManagement';
import AccountProfile from './pages/Admin/AccountProfile';
import MatchingManagement from './pages/Admin/MatchingManagement';
import MatchingDetail from './pages/Admin/MatchingDetail';
import BloodRequestDetail from './pages/Admin/BloodRequestDetail';
import DonationProcessManagement from './pages/Admin/DonationProcessManagement';
import DonationProcessDetail from './pages/Admin/DonationProcessDetail';
import BloodTestManagement from './pages/Admin/BloodTestManagement';
import BloodCheckDetail from './pages/Admin/BloodCheckDetail';
import DashBoard from './pages/Admin/dashBoard';

import BookingAntdForm from './pages/donor/BookingAntdForm/index';

import AboutPage from './pages/donor/AboutPage';

import ActivityPage from './pages/donor/ActivityPage';

import MedicalFacilityLayout from './pages/medicalfacility/MedicalFacilityLayout';

function AppContent() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/registerdonate" element={<RegisterDonate />} />
        <Route path="/appointmenthistory" element={<AppointmentHistory />} />
        <Route path="/appointment/:id" element={<AppointmentDetail />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/registerdonateform" element={<RegisterDonateform />} />
        <Route path="/addcertificate" element={<CertificatePage />} />
        <Route path="/certificate" element={<CertificatePage />} />
        <Route path="/certificate/:certificateId" element={<CertificateDetail />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/receiveblood" element={<ReceiveBloodPage />} />
        <Route path="/bloodgroup-info" element={<BloodGroupInfo />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/emergency" element={<EmergencyRequest />} />
        <Route path="/user-info-form" element={<UserInfoForm />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/blood-donation-eligibility" element={<BloodDonationEligibility />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-password" element={<VerifyPassword />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/booking-antd" element={<BookingAntdForm />} />
        <Route path="/donor/emergency-request-detail/:requestId" element={<EmergencyRequestDetail />} />
        <Route path="/medical-facility" element={<MedicalFacilityLayout />}>
          <Route index element={<MedicalFacilityHome />} />
          <Route path="profile" element={<MedicalFacilityProfile />} />
          <Route path="receive-blood" element={<MedicalFacilityReceiveBlood />} />
          <Route path="request-history" element={<MedicalFacilityRequestHistory />} />
          <Route path="request-history/:id" element={<MedicalFacilityRequestDetail />} />
          <Route path="emergency-request" element={<MedicalFacilityEmergencyRequest />} />
          <Route path="contact" element={<MedicalFacilityContact />} />
        </Route>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        
        {/* Admin routes wrapped in AdminProvider */}
        <Route path="/admin/*" element={
          <AdminProvider>
            <Routes>
              <Route path="/" element={<DashBoard />} />
              <Route path="/donors" element={<DonorManagement />} />
              <Route path="/blood-storage" element={<BloodStorageManagement />} />
              <Route path="/donations" element={<DonationManagement />} />
              <Route path="/donations/:id" element={<DonationDetail />} />
              <Route path="/news" element={<NewsManagement />} />
              <Route path="/blood-requests" element={<BloodRequestManagement />} />
              <Route path="/blood-requests/:id" element={<BloodRequestDetail />} />
              <Route path="/emergency-donor-matching/:requestId" element={<EmergencyDonorMatching />} />
              <Route path="/emergency-process/:requestId" element={<EmergencyProcess />} />
              <Route path="/medical-facilities" element={<MedicalFacilityManagement />} />
              <Route path="/donation-process" element={<DonationProcessManagement />} />
              <Route path="/donation-process/:id" element={<DonationProcessDetail />} />
              <Route path="/blood-test" element={<BloodTestManagement />} />
              <Route path="/blood-checks/:id" element={<BloodCheckDetail />} />
              <Route path="/dashboard" element={<DashBoard />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/accounts" element={<AccountManagement />} />
              <Route path="/profile" element={<AccountProfile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/matching" element={<MatchingManagement />} />
              <Route path="/matching-detail/:id" element={<MatchingDetail />} />
            </Routes>
          </AdminProvider>
        } />
        
        <Route path="/about" element={<AboutPage />} />
        <Route path="/activities" element={<ActivityPage />} />
        <Route path="/news" element={<News />} />
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
