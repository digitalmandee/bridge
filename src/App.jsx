import React, { useState, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Welcome from "./auth/welcome/welcome";
import SplashScreen from "./auth/splash";
import LoginPage from "./auth/login/login";
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
import { FloorPlanProvider } from "./contexts/floorplan.context";
import AuthProvider from "./contexts/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
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
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/super-admin/dashboard"
              element={
                <ProtectedRoute role="super_admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/branch/dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute role="user">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/branch/booking"
              element={
                <ProtectedRoute role="admin">
                  <Booking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/branch/floorplan"
              element={
                <ProtectedRoute role="admin">
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/branch/booking/requests"
              element={
                <ProtectedRoute role="admin">
                  <BookingRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/branch/booking/plans"
              element={
                <ProtectedRoute role="admin">
                  <BookingPlans />
                </ProtectedRoute>
              }
            />
            <Route
              path="/branch/booking/plans/create"
              element={
                <ProtectedRoute role="admin">
                  <BookingPlanCreate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/branch/booking/seats-allocation"
              element={
                <ProtectedRoute role="admin">
                  <SeatsAllocation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/branch/booking-schedule"
              element={
                <ProtectedRoute role="admin">
                  <BookingCalender />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<p>404 Not Found</p>} />
          </Routes>
        )}
      </div>
    </>
  );
}

function AppWrapper() {
  return (
    <AuthProvider>
      <FloorPlanProvider>
        <App />
      </FloorPlanProvider>
    </AuthProvider>
  );
}

export default AppWrapper;
