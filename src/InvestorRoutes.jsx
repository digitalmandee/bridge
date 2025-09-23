import { Routes, Route } from "react-router-dom";
import ProtectedSuperRoute from "./ProtectedSuperRoute";
// Dashboards
import InvestorDashboard from "@/pages/investor/dashboard";
import InvestorManagement from "./pages/investor/management";

function InvestorRoutes() {
	return (
		<Routes>
			<Route
				path="dashboard"
				element={
					<ProtectedSuperRoute role="investor">
						<InvestorDashboard />
					</ProtectedSuperRoute>
				}
			/>

			<Route
				path="management"
				element={
					<ProtectedSuperRoute role="investor">
						<InvestorManagement />
					</ProtectedSuperRoute>
				}
			/>
		</Routes>
	);
}

export default InvestorRoutes;
