import React, { useState, createContext, useEffect } from "react";
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

//Employee Management
import EmployeeDashboard from "./pages/employee/dashboard";
import EmployeeCreate from "./pages/employee/create";
import EmployeeDetails from "./pages/employee/employeedetails";
import Departments from "./pages/departments/management";

// Leave Category
import LeaveCategory from "./pages/attendance/leavecategory/management";
import LeaveCategoryCreate from "./pages/attendance/leavecategory/create";
import LeaveCategoryEdit from "./pages/attendance/leavecategory/edit";

// Invoice Management
import InvoiceDashboard from "@/pages/invoice/dashboard";
import InvoiceCreate from "@/pages/invoice/create";
import InvoiceManagement from "@/pages/invoice/management";
import InvoiceDetail from "@/pages/invoice/detail";

// Company Staff Management
import CompanyAddStaff from "@/pages/company/addstaff";
import CompanyStaffManagement from "@/pages/company/staffmanagement";
import MemberCompanyDetail from "@/pages/members/detail";

// Booking System
import Booking from "@/pages/booking";
import Floorplan from "@/pages/booking/floorplan";
import BookingRequests from "@/pages/booking/requests";
import ScheduleRequests from "@/pages/booking/calendar/requests";
import BookingPlans from "@/pages/booking/plans";
import BookingPlanCreate from "@/pages/booking/plancreate";
import SeatsAllocation from "@/pages/booking/seatsallocation";
import BookingCalendar from "@/pages/booking/calendar";
// import BookingInvoices from "@/pages/booking/invoices";

// Members
import MemberCreate from "@/pages/members/create";
import MemberCompanies from "@/pages/members/companies";
import MemberUsers from "@/pages/members/users";
import MemberContracts from "@/pages/members/contracts";

// Attendance
import AttendanceDashboard from "./pages/attendance/dashboard";
import LeaveApplication from "./pages/attendance/leaveapplication";
import NewApplication from "./pages/attendance/newapplication";
import LeaveManage from "./pages/attendance/leavemanage";
import LeaveReport from "./pages/attendance/leavereport";
import ManageAttendance from "./pages/attendance/manageattendance";
import AttendanceReport from "./pages/attendance/attendancereport";
import MonthlyReport from "./pages/attendance/monthlyreport";

// User Roles
import RoleManagement from "./pages/users/roles/management";
import RoleForm from "@/pages/users/roles/roleform";
import BranchUserManagement from "@/pages/users/management";
import BranchUserCreate from "@/pages/users/userform";

import CreateBranch from "./pages/dashboard/branch";

// Notification
import Notifications from "@/pages/notificaitons";

import NoPermission from "./pages/nopermission";
import SuperAdminLogin from "./pages/auth/login/superadminlogin";
import ProtectedSuperRoute from "./ProtectedSuperRoute";
import BranchManagement from "./pages/branch";

function App() {
	// const [isToggleSideBar, setIsToggleSidebar] = useState(false);
	const [showSplash, setShowSplash] = useState(true);

	if (showSplash) {
		return <SplashScreen onComplete={() => setShowSplash(false)} />;
	}

	return (
		<BrowserRouter>
			<Routes>
				{/* Public Routes */}
				<Route path="/" element={<SuperAdminLogin />} />
				<Route path="/:branch" element={<Welcome />} />
				<Route path=":branch/login" element={<LoginPage />} />

				{/* Super Admin Routes */}
				<Route
					path="/super-admin/dashboard"
					element={
						<ProtectedSuperRoute role="superadmin">
							<SuperAdminDashboard />
						</ProtectedSuperRoute>
					}
				/>

				<Route
					path="/super-admin/branch/create"
					element={
						<ProtectedSuperRoute role="superadmin">
							<CreateBranch />
						</ProtectedSuperRoute>
					}
				/>

				<Route
					path="/super-admin/branch/management"
					element={
						<ProtectedSuperRoute role="superadmin">
							<BranchManagement />
						</ProtectedSuperRoute>
					}
				/>

				{/* User Routes */}
				<Route
					path="/:branch/user/dashboard"
					element={
						<ProtectedRoute role="user">
							<UserDashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/user/booking-schedule"
					element={
						<ProtectedRoute role="user">
							<BookingCalendar />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/user/booking-schedule/requests"
					element={
						<ProtectedRoute role="user">
							<ScheduleRequests />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/user/invoices/management"
					element={
						<ProtectedRoute role="user">
							<InvoiceManagement />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/user/notifications"
					element={
						<ProtectedRoute role="user">
							<Notifications />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/user/contracts"
					element={
						<ProtectedRoute role="user">
							<MemberContracts />
						</ProtectedRoute>
					}
				/>

				{/* Company Routes */}
				<Route
					path="/:branch/company/dashboard"
					element={
						<ProtectedRoute role="company">
							<CompanyDashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/company/staff/add"
					element={
						<ProtectedRoute role="company">
							<CompanyAddStaff />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/company/staff/management"
					element={
						<ProtectedRoute role="company">
							<CompanyStaffManagement />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/company/invoices/management"
					element={
						<ProtectedRoute role="company">
							<InvoiceManagement />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/company/booking-schedule/requests"
					element={
						<ProtectedRoute role="company">
							<ScheduleRequests />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/company/notifications"
					element={
						<ProtectedRoute role="company">
							<Notifications />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/company/contracts"
					element={
						<ProtectedRoute role="company">
							<MemberContracts />
						</ProtectedRoute>
					}
				/>

				{/* Branch Routes */}
				<Route
					path="/:branch/branch/dashboard"
					element={
						<ProtectedRoute role="admin" permission="admin-dashboard">
							<AdminDashboard />
						</ProtectedRoute>
					}
				/>

				{/* Floor Plan */}
				<Route
					path="/:branch/branch/floorplan"
					element={
						<ProtectedRoute role="admin" permission="floor-plan">
							<Floorplan />
						</ProtectedRoute>
					}
				/>

				{/* Booking Requests */}
				<Route
					path="/:branch/branch/booking"
					element={
						<ProtectedRoute role="admin" permission="floor-plan">
							<Booking />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/branch/booking/requests"
					element={
						<ProtectedRoute role="admin" permission="booking-request">
							<BookingRequests />
						</ProtectedRoute>
					}
				/>
				{/* <Route
					path="/branch/booking/invoices"
					element={
						<ProtectedRoute role="admin" permission="seat-card">
							<BookingInvoices />
						</ProtectedRoute>
					}
				/> */}
				{/* Booking Price Plan */}
				<Route
					path="/:branch/branch/booking/plans"
					element={
						<ProtectedRoute role="admin" permission="price-plan">
							<BookingPlans />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/branch/booking/plans/create"
					element={
						<ProtectedRoute role="admin" permission="price-plan">
							<BookingPlanCreate />
						</ProtectedRoute>
					}
				/>
				{/* Booking Seats Allocation */}
				<Route
					path="/:branch/branch/booking/seats-allocation"
					element={
						<ProtectedRoute role="admin" permission="seat-card">
							<SeatsAllocation />
						</ProtectedRoute>
					}
				/>
				{/* Room Booking */}
				<Route
					path="/:branch/branch/booking-schedule"
					element={
						<ProtectedRoute role="admin" permission="room-booking">
							<BookingCalendar />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/branch/booking-schedule/requests"
					element={
						<ProtectedRoute role="admin" permission="booking-requests">
							<ScheduleRequests />
						</ProtectedRoute>
					}
				/>

				{/* Invoice Routes */}
				<Route
					path="/:branch/branch/invoice/dashboard"
					element={
						<ProtectedRoute role="admin" permission="invoice-dashboard">
							<InvoiceDashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/branch/invoice/create"
					element={
						<ProtectedRoute role="admin" permission="new-invoice">
							<InvoiceCreate />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/branch/invoice/management"
					element={
						<ProtectedRoute role="admin" permission="invoice-management">
							<InvoiceManagement />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/branch/invoice/customer-detail/:customerId"
					element={
						<ProtectedRoute role="admin" permission="invoice-management">
							<InvoiceDetail />
						</ProtectedRoute>
					}
				/>

				{/* Members */}
				{/* <Route
					path="/branch/member/create"
					element={
						<ProtectedRoute role="admin">
							<MemberCreate />
						</ProtectedRoute>
					}
				/> */}
				<Route
					path="/:branch/branch/member/companies"
					element={
						<ProtectedRoute role="admin" permission="Company">
							<MemberCompanies />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/branch/member/companies/:companyId"
					element={
						<ProtectedRoute role="admin" permission="Company">
							<MemberCompanyDetail />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/branch/member/users"
					element={
						<ProtectedRoute role="admin" permission="users">
							<MemberUsers />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/branch/member/contracts"
					element={
						<ProtectedRoute role="admin" permission="contracts">
							<MemberContracts />
						</ProtectedRoute>
					}
				/>

				{/* Notifications */}
				<Route
					path="/:branch/branch/notifications"
					element={
						<ProtectedRoute role="admin">
							<Notifications />
						</ProtectedRoute>
					}
				/>

				{/* Employee Management Routes */}

				<Route
					path="/:branch/branch/employee/dashboard"
					element={
						<ProtectedRoute role="admin" permission="employee-dashboard">
							<EmployeeDashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/branch/employee/create"
					element={
						<ProtectedRoute role="admin" permission="employee-dashboard">
							<EmployeeCreate />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/branch/employee/departments"
					element={
						<ProtectedRoute role="admin" permission="employee-dashboard">
							<Departments />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/:branch/branch/employee/details/:employeeId"
					element={
						<ProtectedRoute role="admin" permission="employee-dashboard">
							<EmployeeDetails />
						</ProtectedRoute>
					}
				/>
				{/* Attendance */}

				<Route
					path="/:branch/branch/employee/attendance"
					element={
						<ProtectedRoute role="admin" permission="attendance">
							<AttendanceDashboard />
						</ProtectedRoute>
					}
				/>
				{/* Leave Category */}
				<Route
					path="/:branch/branch/employee/leave/category"
					element={
						<ProtectedRoute role="admin" permission="leave-category">
							<LeaveCategory />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/:branch/branch/employee/leave/category/create"
					element={
						<ProtectedRoute role="admin" permission="leave-category">
							<LeaveCategoryCreate />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/branch/employee/leave/category/edit/:id"
					element={
						<ProtectedRoute role="admin" permission="leave-category">
							<LeaveCategoryEdit />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/:branch/branch/employee/leave/application"
					element={
						<ProtectedRoute role="admin" permission="leave-application">
							<LeaveApplication />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/:branch/branch/employee/leave/application/new"
					element={
						<ProtectedRoute role="admin" permission="leave-application">
							<NewApplication />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/branch/employee/leave/application/edit/:id"
					element={
						<ProtectedRoute role="admin" permission="leave-category">
							<NewApplication />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/:branch/branch/employee/leave/management"
					element={
						<ProtectedRoute role="admin" permission="leave-management">
							<LeaveManage />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/:branch/branch/employee/leave/report"
					element={
						<ProtectedRoute role="admin" permission="leave-report">
							<LeaveReport />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/:branch/branch/employee/manage/attendance"
					element={
						<ProtectedRoute role="admin" permission="manage-attendance">
							<ManageAttendance />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/:branch/branch/employee/attendance/report"
					element={
						<ProtectedRoute role="admin" permission="manage-attendance">
							<AttendanceReport />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/:branch/branch/employee/attendance/monthly/report"
					element={
						<ProtectedRoute role="admin" permission="monthly-report">
							<MonthlyReport />
						</ProtectedRoute>
					}
				/>

				{/* Manage User Roles */}

				<Route
					path="/:branch/branch/users/roles"
					element={
						<ProtectedRoute role="admin" permission="roles">
							<RoleManagement />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/branch/users/roles/new"
					element={
						<ProtectedRoute role="admin" permission="roles">
							<RoleForm />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/branch/users/roles/edit/:id"
					element={
						<ProtectedRoute role="admin" permission="roles">
							<RoleForm />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/branch/users/management"
					element={
						<ProtectedRoute role="admin" permission="employee-users">
							<BranchUserManagement />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/:branch/branch/users/new"
					element={
						<ProtectedRoute role="admin" permission="employee-users">
							<BranchUserCreate />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/:branch/branch/users/edit/:id"
					element={
						<ProtectedRoute role="admin" permission="employee-users">
							<BranchUserCreate />
						</ProtectedRoute>
					}
				/>

				{/*No Permission */}
				<Route
					path="/no-permission"
					element={
						<ProtectedRoute role="admin">
							<NoPermission />
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
