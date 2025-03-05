import React, { useContext } from "react";
import { Navigate, useParams } from "react-router-dom";
import { AuthContext } from "./contexts/SuperContext";

const ProtectedSuperRoute = ({ children, role, permission }) => {
	const { user, userRole, permissions, loading } = useContext(AuthContext);
	const { branch } = useParams(); // Get branch from URL

	localStorage.setItem("branch", branch);
	if (loading) return <p>Loading...</p>;

	if (!user || (role && userRole !== role)) {
		return <Navigate to={`/${branch}/login`} replace />;
	}

	if (permission && !permissions.includes(permission)) {
		return <Navigate to="/no-permission" replace />;
	}

	return children;
};

export default ProtectedSuperRoute;
