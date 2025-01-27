import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Welcome from './auth/welcome/welcome';
import SplashScreen from './auth/splash';
import LoginPage from './auth/login/login';
import Home from './home';
import Booking from './booking';
import UserDashboard from './Dashboard/userdashboard';
import AdminDashboard from './Dashboard/AdminDashboard';
import BookingCalender from './calender';
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
