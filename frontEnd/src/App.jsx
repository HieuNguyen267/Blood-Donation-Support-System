import React from 'react'
import AdminDashBoard from './Pages/Admin/dashBoard'
import DonorManagement from './Pages/Admin/DonorManagement'
import BloodStorageManagement from './Pages/Admin/BloodStorageManagement'
import DonationManagement from './Pages/Admin/DonationManagement'
import DonationDetail from './Pages/Admin/DonationDetail'
import NewsManagement from './Pages/Admin/NewsManagement'
import BloodRequestManagement from './Pages/Admin/BloodRequestManagement'
import EmergencyDonorMatching from './Pages/Admin/EmergencyDonorMatching'
import EmergencyProcess from './Pages/Admin/EmergencyProcess'
import MedicalFacilityManagement from './Pages/Admin/MedicalFacilityManagement'
import Statistics from './Pages/Admin/Statistics'
import AccountManagement from './Pages/Admin/AccountManagement'
import AccountProfile from './Pages/Admin/AccountProfile'
import Settings from './Pages/Admin/Settings'
import MatchingManagement from './Pages/Admin/MatchingManagement'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

import './App.css'
//test comment
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<AdminDashBoard />} />
        <Route path="/admin/donors" element={<DonorManagement />} />
        <Route path="/admin/blood-storage" element={<BloodStorageManagement />} />
        <Route path="/admin/donations" element={<DonationManagement />} />
        <Route path="/admin/donations/:id" element={<DonationDetail />} />
        <Route path="/admin/news" element={<NewsManagement />} />
        <Route path="/admin/blood-requests" element={<BloodRequestManagement />} />
        <Route path="/admin/emergency-donor-matching/:requestId" element={<EmergencyDonorMatching />} />
        <Route path="/admin/emergency-process/:requestId" element={<EmergencyProcess />} />
        <Route path="/admin/medical-facilities" element={<MedicalFacilityManagement />} />
        <Route path="/admin/statistics" element={<Statistics />} />
        <Route path="/admin/accounts" element={<AccountManagement />} />
        <Route path="/admin/profile" element={<AccountProfile />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/matching" element={<MatchingManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
