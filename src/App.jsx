import React, { useState, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Welcome from "./auth/welcome";
import SplashScreen from "./auth/splash";
import LoginPage from "./auth/login";
import Home from "./home";
import BookingPlans from "./booking/plans";
import BookingRequests from "./booking/requests";
import BookingPlanCreate from "./booking/plancreate";
import Booking from "./booking";
import UserDashboard from "./dashboard/userdashboard";
import AdminDashboard from "./dashboard/admindashboard";
import BookingCalender from "./calender";
import SeatsAllocation from "./booking/seatsallocation";
import "./App.css";
import { FloorPlanProvider} from "./contexts/floorplan.context";
// import TopNavbar from './topNavbar/page';
function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <title>BRIDGE</title>
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
            <Route path="/booking/requests" element={<BookingRequests />} />
            <Route path="/booking/plans" element={<BookingPlans />} />
            <Route path="/booking/plans/create" element={<BookingPlanCreate />} />
            <Route path="/booking-calender" element={<BookingCalender />} />
            <Route path="/seatsAllocation" element={<SeatsAllocation />} />
          </Routes>
        )}
      </div>
    </>
  );
}

function AppWrapper() {
  return (
    <FloorPlanProvider>
      <App />
    </FloorPlanProvider>
  );
}

export default AppWrapper;
