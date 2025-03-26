import React, { useContext } from "react";
import { Navigate, useParams } from "react-router-dom";
import { AuthContext } from "./contexts/SuperContext";
import SplashScreen from "./components/splashscreen";

const ProtectedSuperRoute = ({ children, role, permission }) => {
	const { user, userRole, permissions, loading } = useContext(AuthContext);
	const { branch } = useParams(); // Get branch from URL

	localStorage.setItem("branch", branch);
	if (loading) return <SplashScreen />;

	if (!user || (role && userRole !== role)) {
		return <Navigate to={`/`} replace />;
	}

	if (permission && !permissions.includes(permission)) {
		return <Navigate to="/no-permission" replace />;
	}

	return children;
};

export default ProtectedSuperRoute;
