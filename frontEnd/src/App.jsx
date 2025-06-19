import React from 'react'
import AdminDashBoard from './Pages/Admin/dashBoard'
import DonorManagement from './Pages/Admin/DonorManagement'
import BloodStorageManagement from './Pages/Admin/BloodStorageManagement'
import { BrowserRouter } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'

import './App.css'

function App() {
  return (
    <BrowserRouter>
    <Routes>
       <Route path="/admin" element={<AdminDashBoard />} />
       <Route path="/admin/donors" element={<DonorManagement />} />
       <Route path="/admin/blood-storage" element={<BloodStorageManagement />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App
