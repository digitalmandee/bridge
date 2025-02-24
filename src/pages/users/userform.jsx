import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { Container, TextField, Button, MenuItem, Select, InputLabel, FormControl, Card, Typography } from "@mui/material";
import Sidebar from "@/components/leftSideBar";
import TopNavbar from "@/components/topNavbar";

const UserForm = () => {
	const { id: userId } = useParams(); // Get userId from route
	const navigate = useNavigate();
	const [user, setUser] = useState({ name: "", email: "", password: "", role: "" }); // 'role' is now a single string
	const [roles, setRoles] = useState([]);

	useEffect(() => {
		// Fetch available roles
		axiosInstance.get("roles").then((res) => setRoles(res.data));

		// Fetch user data if editing
		if (userId) {
			axiosInstance.get(`branch-users/${userId}`).then((res) => {
				console.log(res.data);

				setUser({ ...res.data, role: res.data.roles[0]?.name || "" }); // Ensure role is set correctly
			});
		}
	}, [userId]);

	const handleChange = (e) => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};

	const handleRoleChange = (e) => {
		setUser({ ...user, role: e.target.value }); // Store role as a single string
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const endpoint = userId ? `branch-users/${userId}` : "branch-users";
		const method = userId ? "put" : "post";

		console.log(user);

		try {
			const res = await axiosInstance[method](endpoint, user);
			console.log(res.data);

			alert("User saved successfully");
			// navigate("/users"); // Redirect after save
		} catch (error) {
			console.error("Error saving user:", error);
			alert("Failed to save user");
		}
	};

	return (
		<>
			<TopNavbar />
			<div className="main d-flex">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<Container sx={{ py: 4 }}>
						<Card sx={{ p: 4 }}>
							<Typography variant="h5" gutterBottom>
								{userId ? "Edit User" : "Create User"}
							</Typography>
							<form onSubmit={handleSubmit}>
								<TextField fullWidth label="Name" name="name" value={user.name} onChange={handleChange} margin="normal" required />
								<TextField disabled={userId} fullWidth label="Email" type="email" name="email" value={user.email} onChange={handleChange} margin="normal" required />

								{/* Password only for new users */}
								{/* {userId && <TextField fullWidth label="Password" type="password" name="password" value={user.password} onChange={handleChange} margin="normal" required />} */}

								<FormControl fullWidth margin="normal">
									<InputLabel>Role</InputLabel>
									<Select value={user.role} onChange={handleRoleChange}>
										{roles.map((role) => (
											<MenuItem key={role.id} value={role.name}>
												{role.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>

								<Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
									{userId ? "Update User" : "Create User"}
								</Button>
							</form>
						</Card>
					</Container>
				</div>
			</div>
		</>
	);
};

export default UserForm;
