import React from "react";
import './dashBoard.css';
import Header from "../../Component/Header";
import Header from "../../Component/Footer";
import Footer from "../../Component/Footer";
export default function DashBoard() {
  return (
    <>
      <Header />
      <Footer />
      <div className="dashboard-container">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-content">
          <p>Welcome to the Admin Dashboard!</p>
          <p>Here you can manage users, view reports, and configure settings.</p>
        </div>
      </div>
    </>
  );
}