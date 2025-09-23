import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../../../assets/logopic.png";
import profile from "../../../assets/profile.png";
import "./login.css";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import axiosInstance from "@/utils/axiosInstance";
import SplashScreen from "@/components/splashscreen";

const LoginPage = () => {
	const { branch } = useParams();
	const { user, setUser, setRole, setPermissions, loading: authLoading } = useContext(AuthContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const [isExist, setIsExist] = useState(null);

	useEffect(() => {
		const checkBranch = async () => {
			try {
				const res = await axiosInstance.get(`branch/check?branch=${branch}`);
				setIsExist(res.data.exist);
			} catch (err) {
				console.error("Error checking branch:", err);
				setIsExist(false);
			}
		};

		if (branch) checkBranch();
		else setIsExist(false);
	}, [branch]);

	if (isExist === null || authLoading) {
		return <SplashScreen />;
	}

	if (!isExist) {
		return <p>Branch does not exist</p>;
	}

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await axios.post(import.meta.env.VITE_BASE_API + "branch/login", { email, password }, { headers: { Accept: "application/json", Branch: branch } });
			console.log(response.data);

			localStorage.setItem("authToken", response.data.data.token);
			setUser(response.data.data);
			setRole(response.data.data.role);
			setPermissions(response.data.data.permissions);
			if (response.data.data.type === "superadmin") window.location.href = "/super-admin/dashboard";
			else if (response.data.data.type === "admin") window.location.href = `/${branch}/branch/dashboard`;
			else if (response.data.data.type === "user") window.location.href = `/${branch}/user/dashboard`;
			else if (response.data.data.type === "company") window.location.href = `/${branch}/company/dashboard`;
		} catch (error) {
			console.log(error.response.data);
			alert("Login failed. Check credentials.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="login-container">
			<div className="logo-container">
				<img src={logo} width={"270px"} alt="Welcome to Bridge" className="logo-image" />
			</div>
			<div className="login-card mt-5">
				<div className="avatar-container">
					<img src={profile} alt="User" className="avatar-icon" />
				</div>
				{user ? (
					<h2 className="login-heading">You are already logged in as {user.name}.</h2>
				) : (
					<>
						<h2 className="login-heading">Log In</h2>
						<form className="login-form" onSubmit={handleLogin}>
							<label htmlFor="email">Email</label>
							<input type="email" id="email" name="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
							<label htmlFor="password">
								Password <span className="required">*</span>
							</label>
							<input type="password" id="password" name="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />

							<button type="submit" className={`login-button ${loading ? "loading" : ""}`}>
								{loading ? <div className="spinner"></div> : "Log in"}
							</button>
						</form>
					</>
				)}
			</div>
		</div>
	);
};

export default LoginPage;
