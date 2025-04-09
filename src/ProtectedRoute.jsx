import React, { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import axiosInstance from "./utils/axiosInstance"; // Import your Axios instance
import { AuthContext } from "./contexts/AuthContext";
import SplashScreen from "./components/splashscreen";

const ProtectedRoute = ({ children, role, permission }) => {
	const { user, userRole, permissions, loading } = useContext(AuthContext);
	const { branch } = useParams(); // Get branch from URL

	const [branchExists, setBranchExists] = useState(null); // null = loading state

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
				setBranchExists(false); // Assume branch does not exist on error
			}
		};

		checkBranch();
	}, [branch]);

	// If still checking branch existence, show a loading state
	if (branchExists === null || loading) {
		return <SplashScreen />;
	}

	// If branch does not exist, redirect to a "Not Found" page
	if (!branchExists) {
		return <p>Branch does not exist</p>; // Show error if branch is invalid
	}

	// If user is not authenticated or lacks the required role, redirect to login
	if (!user || (role && userRole !== role)) {
		return <Navigate to={`/${branch}/login`} replace />;
	}

	// If user lacks permission, redirect to a no-permission page
	if (permission && !permissions.includes(permission)) {
		return <Navigate to="/no-permission" replace />;
	}

	// If everything is okay, render the protected content
	return children;
};

export default ProtectedRoute;
