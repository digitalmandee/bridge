import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
// Dashboards
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

// Notification
import Notifications from "@/pages/notificaitons";
import Welcome from "./pages/welcome/welcome";
import LoginPage from "./pages/auth/login/login";
import NoPermission from "./pages/nopermission";

// Finance
import FinanceDashboard from "./pages/finance/dashboard";
import CreateReport from "./pages/finance/create";
import FinanceCategory from "./pages/finance/category";

// Payroll
import PayrollDashboard from "./pages/payroll/dashboard";
import RunPayroll from "./pages/payroll/runpayroll";
import SalaryRevesion from "./pages/payroll/salaryrev";
import HoledEmployee from "./pages/payroll/holed";
import Deduction from "./pages/payroll/deduction";
import Reimbursement from "./pages/payroll/reimburse";
import EmployeeLeave from "./pages/payroll/leaves";
import ManageCheque from "./pages/payroll/cheque";
import CreateCheque from "./pages/payroll/create";
import PayrollMonthly from "./pages/payroll/monthly";
import PayrollSummary from "./pages/payroll/summary";
import EmployeSalary from "./pages/payroll/empsalary";
import SalaryComponent from "./pages/payroll/salarycomp";
import PaySlip from "./pages/payroll/payslip";

function AuthRoutes() {
	return (
		<Routes>
			<Route path="" element={<Welcome />} />
			<Route path="login" element={<LoginPage />} />
			{/* User Routes */}
			<Route
				path="user/dashboard"
				element={
					<ProtectedRoute role="user">
						<UserDashboard />
					</ProtectedRoute>
				}
			/>
			<Route
				path="user/booking-schedule"
				element={
					<ProtectedRoute role="user">
						<BookingCalendar />
					</ProtectedRoute>
				}
			/>
			<Route
				path="user/booking-schedule/requests"
				element={
					<ProtectedRoute role="user">
						<ScheduleRequests />
					</ProtectedRoute>
				}
			/>
			<Route
				path="user/invoices/management"
				element={
					<ProtectedRoute role="user">
						<InvoiceManagement />
					</ProtectedRoute>
				}
			/>
			<Route
				path="user/notifications"
				element={
					<ProtectedRoute role="user">
						<Notifications />
					</ProtectedRoute>
				}
			/>
			<Route
				path="user/contracts"
				element={
					<ProtectedRoute role="user">
						<MemberContracts />
					</ProtectedRoute>
				}
			/>

			{/* Company Routes */}
			<Route
				path="company/dashboard"
				element={
					<ProtectedRoute role="company">
						<CompanyDashboard />
					</ProtectedRoute>
				}
			/>
			<Route
				path="company/staff/add"
				element={
					<ProtectedRoute role="company">
						<CompanyAddStaff />
					</ProtectedRoute>
				}
			/>
			<Route
				path="company/staff/management"
				element={
					<ProtectedRoute role="company">
						<CompanyStaffManagement />
					</ProtectedRoute>
				}
			/>
			<Route
				path="company/invoices/management"
				element={
					<ProtectedRoute role="company">
						<InvoiceManagement />
					</ProtectedRoute>
				}
			/>
			<Route
				path="company/booking-schedule/requests"
				element={
					<ProtectedRoute role="company">
						<ScheduleRequests />
					</ProtectedRoute>
				}
			/>
			<Route
				path="company/notifications"
				element={
					<ProtectedRoute role="company">
						<Notifications />
					</ProtectedRoute>
				}
			/>
			<Route
				path="company/contracts"
				element={
					<ProtectedRoute role="company">
						<MemberContracts />
					</ProtectedRoute>
				}
			/>

			{/* Branch Routes */}
			<Route
				path="branch/dashboard"
				element={
					<ProtectedRoute role="admin" permission="admin-dashboard">
						<AdminDashboard />
					</ProtectedRoute>
				}
			/>

			{/* Floor Plan */}
			<Route
				path="branch/floorplan"
				element={
					<ProtectedRoute role="admin" permission="floor-plan">
						<Floorplan />
					</ProtectedRoute>
				}
			/>

			{/* Booking Requests */}
			<Route
				path="branch/booking"
				element={
					<ProtectedRoute role="admin" permission="floor-plan">
						<Booking />
					</ProtectedRoute>
				}
			/>
			<Route
				path="branch/booking/requests"
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
				path="branch/booking/plans"
				element={
					<ProtectedRoute role="admin" permission="price-plan">
						<BookingPlans />
					</ProtectedRoute>
				}
			/>
			<Route
				path="branch/booking/plans/create"
				element={
					<ProtectedRoute role="admin" permission="price-plan">
						<BookingPlanCreate />
					</ProtectedRoute>
				}
			/>
			{/* Booking Seats Allocation */}
			<Route
				path="branch/booking/seats-allocation"
				element={
					<ProtectedRoute role="admin" permission="seat-card">
						<SeatsAllocation />
					</ProtectedRoute>
				}
			/>
			{/* Room Booking */}
			<Route
				path="branch/booking-schedule"
				element={
					<ProtectedRoute role="admin" permission="room-booking">
						<BookingCalendar />
					</ProtectedRoute>
				}
			/>
			<Route
				path="branch/booking-schedule/requests"
				element={
					<ProtectedRoute role="admin" permission="booking-requests">
						<ScheduleRequests />
					</ProtectedRoute>
				}
			/>

			{/* Invoice Routes */}
			<Route
				path="branch/invoice/dashboard"
				element={
					<ProtectedRoute role="admin" permission="invoice-dashboard">
						<InvoiceDashboard />
					</ProtectedRoute>
				}
			/>
			<Route
				path="branch/invoice/create"
				element={
					<ProtectedRoute role="admin" permission="new-invoice">
						<InvoiceCreate />
					</ProtectedRoute>
				}
			/>
			<Route
				path="branch/invoice/management"
				element={
					<ProtectedRoute role="admin" permission="invoice-management">
						<InvoiceManagement />
					</ProtectedRoute>
				}
			/>
			<Route
				path="branch/invoice/customer-detail/:customerId"
				element={
					<ProtectedRoute role="admin" permission="invoice-management">
						<InvoiceDetail />
					</ProtectedRoute>
				}
			/>

			{/* Members */}
			<Route
				path="branch/member/companies"
				element={
					<ProtectedRoute role="admin" permission="Company">
						<MemberCompanies />
					</ProtectedRoute>
				}
			/>
			<Route
				path="branch/member/companies/:companyId"
				element={
					<ProtectedRoute role="admin" permission="Company">
						<MemberCompanyDetail />
					</ProtectedRoute>
				}
			/>
			<Route
				path="branch/member/users"
				element={
					<ProtectedRoute role="admin" permission="users">
						<MemberUsers />
					</ProtectedRoute>
				}
			/>
			<Route
				path="branch/member/contracts"
				element={
					<ProtectedRoute role="admin" permission="contracts">
						<MemberContracts />
					</ProtectedRoute>
				}
			/>

			{/* Notifications */}
			<Route
				path="branch/notifications"
				element={
					<ProtectedRoute role="admin">
						<Notifications />
					</ProtectedRoute>
				}
			/>

			{/* Employee Management Routes */}

			<Route
				path="branch/employee/dashboard"
				element={
					<ProtectedRoute role="admin" permission="employee-dashboard">
						<EmployeeDashboard />
					</ProtectedRoute>
				}
			/>
			<Route
				path="branch/employee/create"
				element={
					<ProtectedRoute role="admin" permission="employee-dashboard">
						<EmployeeCreate />
					</ProtectedRoute>
				}
			/>
			<Route
				path="branch/employee/departments"
				element={
					<ProtectedRoute role="admin" permission="employee-dashboard">
						<Departments />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/employee/details/:employeeId"
				element={
					<ProtectedRoute role="admin" permission="employee-dashboard">
						<EmployeeDetails />
					</ProtectedRoute>
				}
			/>
			{/* Attendance */}

			<Route
				path="branch/employee/attendance"
				element={
					<ProtectedRoute role="admin" permission="attendance">
						<AttendanceDashboard />
					</ProtectedRoute>
				}
			/>
			{/* Leave Category */}
			<Route
				path="branch/employee/leave/category"
				element={
					<ProtectedRoute role="admin" permission="leave-category">
						<LeaveCategory />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/employee/leave/category/create"
				element={
					<ProtectedRoute role="admin" permission="leave-category">
						<LeaveCategoryCreate />
					</ProtectedRoute>
				}
			/>
			<Route
				path="branch/employee/leave/category/edit/:id"
				element={
					<ProtectedRoute role="admin" permission="leave-category">
						<LeaveCategoryEdit />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/employee/leave/application"
				element={
					<ProtectedRoute role="admin" permission="leave-application">
						<LeaveApplication />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/employee/leave/application/new"
				element={
					<ProtectedRoute role="admin" permission="leave-application">
						<NewApplication />
					</ProtectedRoute>
				}
			/>
			<Route
				path="branch/employee/leave/application/edit/:id"
				element={
					<ProtectedRoute role="admin" permission="leave-category">
						<NewApplication />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/employee/leave/management"
				element={
					<ProtectedRoute role="admin" permission="leave-management">
						<LeaveManage />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/employee/leave/report"
				element={
					<ProtectedRoute role="admin" permission="leave-report">
						<LeaveReport />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/employee/manage/attendance"
				element={
					<ProtectedRoute role="admin" permission="manage-attendance">
						<ManageAttendance />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/employee/attendance/report"
				element={
					<ProtectedRoute role="admin" permission="manage-attendance">
						<AttendanceReport />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/employee/attendance/monthly/report"
				element={
					<ProtectedRoute role="admin" permission="monthly-report">
						<MonthlyReport />
					</ProtectedRoute>
				}
			/>

			{/* Manage User Roles */}

			<Route
				path="branch/users/roles"
				element={
					<ProtectedRoute role="admin" permission="roles">
						<RoleManagement />
					</ProtectedRoute>
				}
			/>
			<Route
				path="branch/users/roles/new"
				element={
					<ProtectedRoute role="admin" permission="roles">
						<RoleForm />
					</ProtectedRoute>
				}
			/>
			<Route
				path="branch/users/roles/edit/:id"
				element={
					<ProtectedRoute role="admin" permission="roles">
						<RoleForm />
					</ProtectedRoute>
				}
			/>
			<Route
				path="branch/users/management"
				element={
					<ProtectedRoute role="admin" permission="employee-users">
						<BranchUserManagement />
					</ProtectedRoute>
				}
			/>
			<Route
				path="branch/users/new"
				element={
					<ProtectedRoute role="admin" permission="employee-users">
						<BranchUserCreate />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/users/edit/:id"
				element={
					<ProtectedRoute role="admin" permission="employee-users">
						<BranchUserCreate />
					</ProtectedRoute>
				}
			/>

			{/* Finance Management Routes */}
			<Route
				path="branch/finance/dashboard"
				element={
					<ProtectedRoute role="admin" permission="employee-dashboard">
						<FinanceDashboard />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/finance/create"
				element={
					<ProtectedRoute role="admin" permission="employee-dashboard">
						<CreateReport />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/finance/category"
				element={
					<ProtectedRoute role="admin" permission="employee-dashboard">
						<FinanceCategory />
					</ProtectedRoute>
				}
			/>

			{/* Payroll Routes */}
			<Route
				path="branch/payroll/dashboard"
				element={
					<ProtectedRoute role="admin" permission="employee-dashboard">
						<PayrollDashboard />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/run-payroll"
				element={
					<ProtectedRoute role="admin" permission="employee-dashboard">
						<RunPayroll />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/payroll/salary-revision"
				element={
					<ProtectedRoute role="admin" permission="employee-dashboard">
						<SalaryRevesion />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/payroll/holed-employee"
				element={
					<ProtectedRoute role="admin" permission="employee-dashboard">
						<HoledEmployee />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/payroll/deduction"
				element={
					<ProtectedRoute role="admin" permission="employee-dashboard">
						<Deduction />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/payroll/employee-leave"
				element={
					<ProtectedRoute role="admin" permission="employee-dashboard">
						<EmployeeLeave />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/payroll/cheque"
				element={
					<ProtectedRoute role="admin" permission="employee-dashboard">
						<ManageCheque />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/payroll/cheque/create"
				element={
					<ProtectedRoute role="admin" permission="employee-dashboard">
						<CreateCheque />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/payroll/reimbursement"
				element={
					<ProtectedRoute role="admin" permission="employee-dashboard">
						<Reimbursement />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/payroll/monthly"
				element={
					<ProtectedRoute role="admin" permission="employee-dashboard">
						<PayrollMonthly />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/payroll/summary"
				element={
					<ProtectedRoute role="admin" permission="employee-dashboard">
						<PayrollSummary />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/payroll/employee/salary"
				element={
					<ProtectedRoute role="admin" permission="employee-dashboard">
						<EmployeSalary />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/salary/component"
				element={
					<ProtectedRoute role="admin" permission="employee-dashboard">
						<SalaryComponent />
					</ProtectedRoute>
				}
			/>

			<Route
				path="branch/payroll/payslip"
				element={
					<ProtectedRoute role="admin" permission="employee-dashboard">
						<PaySlip />
					</ProtectedRoute>
				}
			/>

			{/*No Permission */}
			<Route
				path="no-permission"
				element={
					<ProtectedRoute role="admin">
						<NoPermission />
					</ProtectedRoute>
				}
			/>
		</Routes>
	);
}

export default AuthRoutes;
