import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, userRole, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  if (!user || (role && userRole !== role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
