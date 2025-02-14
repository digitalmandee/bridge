import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import SplashScreen from "@/components/splashscreen";
import ProtectedRoute from "@/ProtectedRoute";

// Authentication
import LoginPage from "@/pages/auth/login/login";
import Welcome from "@/pages/welcome/welcome";

// Dashboards
import SuperAdminDashboard from "@/pages/dashboard/superadmin";
import AdminDashboard from "@/pages/dashboard/admin";
import UserDashboard from "@/pages/dashboard/user";
import CompanyDashboard from "@/pages/dashboard/company";

// Invoice Management
import InvoiceDashboard from "@/pages/invoice/dashboard";
import InvoiceCreate from "@/pages/invoice/create";
import InvoiceManagement from "@/pages/invoice/management";
import InvoiceDetail from "@/pages/invoice/detail";

// Company Staff Management
import CompanyAddStaff from "@/pages/company/addstaff";
import CompanyStaffManagement from "@/pages/company/staffmanagement";

// Booking System
import Booking from "@/pages/booking";
import Floorplan from "@/pages/booking/floorplan";
import BookingRequests from "@/pages/booking/requests";
import ScheduleRequests from "@/pages/booking/calendar/requests";
import BookingPlans from "@/pages/booking/plans";
import BookingPlanCreate from "@/pages/booking/plancreate";
import SeatsAllocation from "@/pages/booking/seatsallocation";
import BookingCalendar from "@/pages/booking/calendar";
import BookingInvoices from "@/pages/booking/invoices";

// Members
import MemberCreate from "@/pages/members/create";
import MemberCompanies from "@/pages/members/companies";
import MemberUsers from "@/pages/members/users";
import MemberContracts from "@/pages/members/contracts";

// Notification
import Notifications from "@/pages/notificaitons";
import MemberCompanyDetail from "./pages/members/detail";
function App() {
	const [showSplash, setShowSplash] = useState(true);

	if (showSplash) {
		return <SplashScreen onComplete={() => setShowSplash(false)} />;
	}

	return (
		<BrowserRouter>
			<Routes>
				{/* Public Routes */}
				<Route path="/" element={<Welcome />} />
				<Route path="/login" element={<LoginPage />} />

				{/* Super Admin Routes */}
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
							<BookingCalendar />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/user/booking-schedule/requests"
					element={
						<ProtectedRoute role="user">
							<ScheduleRequests />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/user/invoices/management"
					element={
						<ProtectedRoute role="user">
							<InvoiceManagement />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/user/notifications"
					element={
						<ProtectedRoute role="user">
							<Notifications />
						</ProtectedRoute>
					}
				/>

				{/* Company Routes */}
				<Route
					path="/company/dashboard"
					element={
						<ProtectedRoute role="company">
							<CompanyDashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/company/staff/add"
					element={
						<ProtectedRoute role="company">
							<CompanyAddStaff />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/company/staff/management"
					element={
						<ProtectedRoute role="company">
							<CompanyStaffManagement />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/company/invoices/management"
					element={
						<ProtectedRoute role="company">
							<InvoiceManagement />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/company/booking-schedule/requests"
					element={
						<ProtectedRoute role="company">
							<ScheduleRequests />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/company/notifications"
					element={
						<ProtectedRoute role="company">
							<Notifications />
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

				{/* Floor Plan */}
				<Route
					path="/branch/floorplan"
					element={
						<ProtectedRoute role="admin">
							<Floorplan />
						</ProtectedRoute>
					}
				/>

				{/* Booking Requests */}
				<Route
					path="/branch/booking"
					element={
						<ProtectedRoute role="admin">
							<Booking />
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
				{/* Booking Price Plan */}
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
				{/* Booking Seats Allocation */}
				<Route
					path="/branch/booking/seats-allocation"
					element={
						<ProtectedRoute role="admin">
							<SeatsAllocation />
						</ProtectedRoute>
					}
				/>
				{/* Room Booking */}
				<Route
					path="/branch/booking-schedule"
					element={
						<ProtectedRoute role="admin">
							<BookingCalendar />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/branch/booking-schedule/requests"
					element={
						<ProtectedRoute role="admin">
							<ScheduleRequests />
						</ProtectedRoute>
					}
				/>

				{/* Invoice Routes */}
				<Route
					path="/branch/invoice/dashboard"
					element={
						<ProtectedRoute role="admin">
							<InvoiceDashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/branch/invoice/create"
					element={
						<ProtectedRoute role="admin">
							<InvoiceCreate />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/branch/invoice/management"
					element={
						<ProtectedRoute role="admin">
							<InvoiceManagement />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/branch/invoice/customer-detail/:customerId"
					element={
						<ProtectedRoute role="admin">
							<InvoiceDetail />
						</ProtectedRoute>
					}
				/>

				{/* Members */}
				<Route
					path="/branch/member/create"
					element={
						<ProtectedRoute role="admin">
							<MemberCreate />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/branch/member/companies"
					element={
						<ProtectedRoute role="admin">
							<MemberCompanies />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/branch/member/companies/:companyId"
					element={
						<ProtectedRoute role="admin">
							<MemberCompanyDetail />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/branch/member/users"
					element={
						<ProtectedRoute role="admin">
							<MemberUsers />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/branch/member/contracts"
					element={
						<ProtectedRoute role="admin">
							<MemberContracts />
						</ProtectedRoute>
					}
				/>

				{/* Notifications */}
				<Route
					path="/branch/notifications"
					element={
						<ProtectedRoute role="admin">
							<Notifications />
						</ProtectedRoute>
					}
				/>

				{/* 404 Page */}
				<Route path="*" element={<p>404 Not Found</p>} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
