import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Welcome from './auth/welcome/welcome';
import SplashScreen from './auth/splash';
import LoginPage from './auth/login/login';
import Home from './home';
import Booking from './booking';
import UserDashboard from './Dashboard/userdashboard';
import BranchAdmin from './Dashboard/branchadmin';
import AdminDashboard from './Dashboard/AdminDashboard';
import CompanyDashboard from './Dashboard/companydashboard';
import Staff from './Dashboard/staff';
import NewInvoice from './invoice/newinvoice';
import StaffArchive from './Dashboard/staffarchive';
import BookingCalender from './calender';
import InvoiceSlip from './invoice/invoiceslip';
import InvoiceDetail from './invoice/invoicedetail';
import ShowInvoice from './invoice/showinvoice';
import InvoiceDashboard from './invoice/dashboard';
import SeatsAllocation from './booking/seatsallocation';
import BookingRequest from './booking/bookingrequest';
import './App.css';
// import TopNavbar from './topNavbar/page';
function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
        <title>
          BRIDGE
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      
    <div>
      
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <Routes>
          {/* Define your routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/invoice-slip" element={<InvoiceSlip />} />
          <Route path="/invoice-detail" element={<InvoiceDetail />} />
          <Route path="/show-invoice" element={<ShowInvoice />} />
          <Route path="/new-invoice" element={<NewInvoice />} />
          <Route path="/invoice-dashboard" element={<InvoiceDashboard />} />
          <Route path="/add-staff" element={<Staff />} />
          <Route path="/staff-archive" element={<StaffArchive />} />
          <Route path="/branch-admin-dashboard" element={<BranchAdmin />} />
          <Route path="/company-dashboard" element={<CompanyDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/floorplan" element={<Home />} />
          <Route path="/booking-calender" element={<BookingCalender />} />
          <Route path="/seatsAllocation" element={<SeatsAllocation />} />
          <Route path="/booking-request" element={<BookingRequest />} />
        </Routes>
      )}
    </div>
    </>
  );
};

export default App;
