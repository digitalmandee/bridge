import { Routes, Route } from "react-router-dom";
import ProtectedSuperRoute from "./ProtectedSuperRoute";
// Dashboards
import SuperAdminDashboard from "@/pages/dashboard/superadmin";

import CreateBranch from "./pages/dashboard/branch";

import BranchManagement from "./pages/branch";
import SuperAdminLogin from "./pages/auth/login/superadminlogin";

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
		</Routes>
	);
}

export default SuperAdminRoutes;
