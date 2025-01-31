import React, { useState, useContext } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import SplashScreen from "./components/splashscreen";
import SuperAdminDashboard from "./pages/dashboard/superadmin";
import AdminDashboard from "./pages/dashboard/admin";
import UserDashboard from "./pages/dashboard/user";
import Welcome from "./pages/welcome/welcome";
import LoginPage from "./pages/auth/login/login";
import Booking from "./pages/booking";
import Floorplan from "./pages/booking/floorplan";
import BookingRequests from "./pages/booking/requests";
import BookingPlans from "./pages/booking/plans";
import BookingPlanCreate from "./pages/booking/plancreate";
import SeatsAllocation from "./pages/booking/seatsallocation";
import BookingCalender from "./pages/booking/calendar";
import BookingInvoices from "./pages/booking/invoices";
import ProtectedRoute from "./ProtectedRoute";
// import TopNavbar from './topNavbar/page';
function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <BrowserRouter>
          <Routes>
            {/* Define your routes */}
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/super-admin/dashboard"
              element={
                <ProtectedRoute role="super_admin">
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
            {/* User Routes */}
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute role="user">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/booking-schedule"
              element={
                <ProtectedRoute role="user">
                  <BookingCalender />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/booking/invoices"
              element={
                <ProtectedRoute role="user">
                  <BookingInvoices />
                </ProtectedRoute>
              }
            />

            {/* Branch Routes */}
            <Route
              path="/branch/dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
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
                  <Floorplan />
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
              path="/branch/booking/invoices"
              element={
                <ProtectedRoute role="admin">
                  <BookingInvoices />
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
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
