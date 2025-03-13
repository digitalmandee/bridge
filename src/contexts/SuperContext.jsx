import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";

export const AuthContext = createContext();

const SuperAuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [userRole, setRole] = useState("");
	const [permissions, setPermissions] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await axiosInstance.get("super/user");

				setUser(response.data);
				setRole(response.data.role);
				setPermissions(response.data.permissions);
			} catch (error) {
				console.log(error.response.data);

				setUser(null);
				setRole("");
				setPermissions([]);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	const logout = async () => {
		try {
			await axiosInstance.post("super/logout", {});
			setUser(null);
			setRole("");
			setPermissions([]);
			localStorage.removeItem("token");
		} catch (error) {
			console.error(error.response.data);
		}
	};

	return <AuthContext.Provider value={{ user, userRole, permissions, loading, setUser, setRole, setPermissions, logout }}>{children}</AuthContext.Provider>;
};

export default SuperAuthProvider;
