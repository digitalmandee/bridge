import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";

const ProtectedRoute = ({ children, role, permission }) => {
	const { user, userRole, permissions, loading } = useContext(AuthContext);

	if (loading) return <p>Loading...</p>;

	if (!user || (role && userRole !== role)) {
		return <Navigate to="/login" replace />;
	}

	if (permission && !permissions.includes(permission)) {
		return <Navigate to="/no-permission" replace />;
	}

	return children;
};

export default ProtectedRoute;
