import React, { useState, createContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import SplashScreen from "@/components/splashscreen";
import ProtectedRoute from "@/ProtectedRoute";

// Authentication
import LoginPage from "@/pages/auth/login/login";
import Welcome from "@/pages/welcome/welcome";

import NoPermission from "./pages/nopermission";
import SuperAdminLogin from "./pages/auth/login/superadminlogin";
import SuperAdminRoutes from "./SuperAdminRoutes";
import AuthProvider from "./contexts/AuthContext";
import SuperAuthProvider from "./contexts/SuperContext";
import AuthRoutes from "./AuthRoutes";

function App() {
	// const [isToggleSideBar, setIsToggleSidebar] = useState(false);
	const [showSplash, setShowSplash] = useState(true);

	if (showSplash) {
		return <SplashScreen onComplete={() => setShowSplash(false)} />;
	}

	return (
		<BrowserRouter>
			<Routes>
				{/* Public Routes */}
				<Route path="/" element={<SuperAdminLogin />} />

				{/* Super Admin Routes */}
				<Route
					path="/super-admin/*"
					element={
						<SuperAuthProvider>
							<SuperAdminRoutes />
						</SuperAuthProvider>
					}
				/>

				{/* Authenticated Routes */}
				<Route
					path="/:branch/*"
					element={
						<AuthProvider>
							<AuthRoutes />
						</AuthProvider>
					}
				/>

				{/* 404 Page */}
				<Route path="*" element={<p>404 Not Found</p>} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
