import { Routes, Route } from "react-router-dom";
import ProtectedSuperRoute from "./ProtectedSuperRoute";
// Dashboards
import SuperAdminDashboard from "@/pages/dashboard/superadmin";

import CreateBranch from "./pages/dashboard/branch";

import BranchManagement from "./pages/branch";
import SuperAdminLogin from "./pages/auth/login/superadminlogin";

import InvestorDashboard from "@/pages/investor/dashboard";
import NewInvestment from "@/pages/investor/NewEntry";
import InvestmentTypes from "@/pages/investor/InvestmentTypes";
import InvestorManagement from "@/pages/investor/management";

function SuperAdminRoutes() {
	return (
		<Routes>
			<Route
				path="dashboard"
				element={
					<ProtectedSuperRoute role="superadmin">
						<SuperAdminDashboard />
					</ProtectedSuperRoute>
				}
			/>

			<Route
				path="branch/create"
				element={
					<ProtectedSuperRoute role="superadmin">
						<CreateBranch />
					</ProtectedSuperRoute>
				}
			/>

			<Route
				path="branch/management"
				element={
					<ProtectedSuperRoute role="superadmin">
						<BranchManagement />
					</ProtectedSuperRoute>
				}
			/>

			{/* Investor Dashboard */}

			<Route
				path="investor/dashboard"
				element={
					<ProtectedSuperRoute role="superadmin">
						<InvestorDashboard />
					</ProtectedSuperRoute>
				}
			/>
			<Route
				path="investor/new-entry"
				element={
					<ProtectedSuperRoute role="superadmin">
						<NewInvestment />
					</ProtectedSuperRoute>
				}
			/>
			<Route
				path="investor/investment-types"
				element={
					<ProtectedSuperRoute role="superadmin">
						<InvestmentTypes />
					</ProtectedSuperRoute>
				}
			/>
			<Route
				path="investor/management"
				element={
					<ProtectedSuperRoute role="superadmin">
						<InvestorManagement />
					</ProtectedSuperRoute>
				}
			/>
		</Routes>
	);
}

export default SuperAdminRoutes;
