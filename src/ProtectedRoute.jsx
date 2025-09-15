import React, { useContext, useEffect, useState } from "react";
import { Navigate, useParams, useLocation } from "react-router-dom";
import axiosInstance from "./utils/axiosInstance";
import { AuthContext } from "./contexts/AuthContext";
import SplashScreen from "./components/splashscreen";

const ProtectedRoute = ({ children, role, permission }) => {
	const { user, userRole, permissions, loading } = useContext(AuthContext);
	const { branch } = useParams();
	const location = useLocation();

	const [branchExists, setBranchExists] = useState(null);

	// Store branch in localStorage
	localStorage.setItem("branch", branch);

	// Check if branch exists
	useEffect(() => {
		const checkBranch = async () => {
			try {
				const res = await axiosInstance.get(`branch/check?branch=${branch}`);
				setBranchExists(res.data.exist);
			} catch (error) {
				console.error("Error checking branch:", error);
				setBranchExists(false);
			}
		};

		checkBranch();
	}, [branch]);

	// Loading states
	if (branchExists === null || loading) {
		return <SplashScreen />;
	}

	// Invalid branch
	if (!branchExists) {
		return <p>Branch does not exist</p>;
	}

	// User not logged in
	if (!user || (role && userRole !== role)) {
		return <Navigate to={`/${branch}/login`} replace />;
	}

	// Permission check
	if (permission && !permissions.includes(permission)) {
		return <Navigate to={`/${branch}/no-permission`} replace />;
	}

	// --- Investor dashboard check ---
	if (location.pathname.includes("/investor/dashboard")) {
		if (!user.is_investor) {
			return <Navigate to={`/${branch}/no-permission`} replace />;
		}
	}

	// --- Normal feature pages check (profile must be completed) ---
	if (!location.pathname.includes("/investor/dashboard") && !user.is_profile_completed && location.pathname !== `/${branch}/no-permission` && userRole !== "admin") {
		return <Navigate to={`/${branch}/no-permission`} replace />;
	}

	// ✅ All good → render children
	return children;
};

export default ProtectedRoute;
