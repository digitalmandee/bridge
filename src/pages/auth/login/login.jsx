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
		e.preventDefault(); // prevent from reloading
		try {
			const response = await axios.post(import.meta.env.VITE_BASE_API + "login", { email, password }, { headers: { "Content-Type": "application/json" } });
			localStorage.setItem("authToken", response.data.data.token);

			console.log(response.data);

			setUser(response.data.data);
			setRole(response.data.data.role);
			setPermissions(response.data.data.permissions);
			if (response.data.data.type === "superadmin") window.location.href = "/super-admin/dashboard";
			else if (response.data.data.type === "admin") window.location.href = "/branch/dashboard";
			else if (response.data.data.type === "investor") window.location.href = "/investor/dashboard";
			else if (response.data.data.type === "user") window.location.href = "/user/dashboard";
			else if (response.data.data.type === "company") window.location.href = "/company/dashboard";
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
					<form className="login-form" onSubmit={handleLogin}>
						<label htmlFor="email">Email</label>
						<input type="email" id="email" name="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
						<label htmlFor="password">
							Password <span className="required">*</span>
						</label>
						<input type="password" id="password" name="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />

						<button type="submit" className="login-button">
							Log in
						</button>
					</form>
				</div>
			</div>
		</>
	);
};

export default LoginPage;
