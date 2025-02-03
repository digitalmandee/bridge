import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logopic.png";
import profile from "../../../assets/profile.png";
import "./login.css";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";

const LoginPage = () => {
	const { setUser, setRole, setPermissions } = useContext(AuthContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();

	const handleLogin = async (e) => {
		try {
			const response = await axios.post(import.meta.env.VITE_BASE_API + "login", { email, password }, { headers: { "Content-Type": "application/json" } });
			localStorage.setItem("authToken", response.data.data.token);

			setUser(response.data.data);
			setRole(response.data.data.role);
			setPermissions(response.data.data.permissions);
			if (response.data.data.type === "superadmin") navigate("/super-admin/dashboard");
			else if (response.data.data.type === "admin") navigate("/branch/dashboard");
			else if (response.data.data.type === "investor") navigate("/investor/dashboard");
			else if (response.data.data.type === "user") navigate("/user/dashboard");
			else if (response.data.data.type === "company") navigate("/company/dashboard");
		} catch (error) {
			console.log(error.response.data);
			alert("Login failed. Check credentials.");
		}
	};

	return (
		<>
			<div className="login-container">
				<div className="logo-container">
					<img src={logo} width={"270px"} alt="Welcome to Bridge" className="logo-image" />
				</div>
				<div className="login-card mt-5">
					<div className="avatar-container">
						<img src={profile} alt="User" className="avatar-icon" />
					</div>
					<h2 className="login-heading">Log In</h2>
					<form className="login-form">
						<label htmlFor="email">Email</label>
						<input type="email" id="email" name="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
						<label htmlFor="password">
							Password <span className="required">*</span>
						</label>
						<input type="password" id="password" name="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
						<div className="forgot-password">Forgot password?</div>

						<button type="button" className="login-button" onClick={() => handleLogin()}>
							Log in
						</button>
					</form>
				</div>
			</div>
		</>
	);
};

export default LoginPage;
