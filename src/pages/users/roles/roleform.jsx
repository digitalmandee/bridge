import React, { useEffect, useState } from "react";
import { Button, Checkbox, FormControlLabel, TextField, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { MdArrowBackIos } from "react-icons/md";

const RoleForm = () => {
	const { id } = useParams();
	const [roleName, setRoleName] = useState("");
	const [permissions, setPermissions] = useState({});
	const [selectedPermissions, setSelectedPermissions] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		fetchPermissions();
		if (id) fetchRole();
	}, [id]);

	// Fetch available permissions
	const fetchPermissions = async () => {
		try {
			const response = await axiosInstance.get("permissions");
			setPermissions(response.data); // Expecting grouped data (subcategory-wise)
		} catch (error) {
			console.error("Error fetching permissions", error);
		}
	};

	// Fetch role details if editing
	const fetchRole = async () => {
		try {
			const response = await axiosInstance.get(`roles/${id}`);

			setRoleName(response.data.name);
			// Store permission IDs instead of names
			setSelectedPermissions(response.data.permissions.map((p) => p.id));
		} catch (error) {
			console.error("Error fetching role", error);
		}
	};

	// Handle permission checkbox changes
	const handleCheckboxChange = (permissionId) => {
		setSelectedPermissions((prev) => (prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId]));
	};

	// Handle form submission
	const handleSubmit = async () => {
		const roleData = { name: roleName, permissions: selectedPermissions }; // Use IDs instead of names
		try {
			if (id) {
				await axiosInstance.put(`roles/${id}`, roleData);
			} else {
				await axiosInstance.post("roles", roleData);
			}
			navigate("/branch/users/roles");
		} catch (error) {
			console.error("Error saving role", error);
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
					<div className="container-fluid py-4">
						{/* Header */}
						<div className="row mb-4 align-items-center">
							<div className="col-auto d-flex align-items-center">
								<div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
									<MdArrowBackIos style={{ fontSize: "20px" }} />
								</div>
								<Typography variant="h6" className="mb-0 ms-2">
									{id ? "Edit Role" : "Create Role"}
								</Typography>
							</div>
						</div>

						{/* Role Name Input */}
						<TextField label="Role Name" variant="outlined" fullWidth value={roleName} onChange={(e) => setRoleName(e.target.value)} style={{ marginBottom: "20px" }} />

						{/* Permissions List */}
						<div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
							{Object.entries(permissions).map(([subcategory, perms]) => (
								<div key={subcategory} style={{ flex: "1 1 30%", minWidth: "250px", border: "1px solid #ccc", borderRadius: "8px", padding: "10px" }}>
									<Typography variant="h6" component="div" style={{ marginBottom: "10px" }}>
										<strong>{subcategory}</strong>
									</Typography>
									<div>
										{perms.map((permission) => (
											<FormControlLabel
												key={permission.id} // Use ID as key
												control={
													<Checkbox
														checked={selectedPermissions.includes(permission.id)} // Check by ID
														onChange={() => handleCheckboxChange(permission.id)} // Handle by ID
													/>
												}
												label={permission.name}
											/>
										))}
									</div>
								</div>
							))}
						</div>

						{/* Submit Button */}
						<Button variant="contained" color="primary" onClick={handleSubmit} style={{ marginTop: "20px" }}>
							Save Role
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};

export default RoleForm;
