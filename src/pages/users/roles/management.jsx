import React, { useContext, useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "@/utils/axiosInstance";
import { AuthContext } from "@/contexts/AuthContext";

const RoleManagement = () => {
	const navigate = useNavigate();
	const [roles, setRoles] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchRoles();
	}, []);

	const fetchRoles = async () => {
		setIsLoading(true);
		try {
			const response = await axiosInstance.get("roles");
			setRoles(response.data);
		} catch (error) {
			console.error("Error fetching roles", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (roleId) => {
		if (!window.confirm("Are you sure you want to delete this role?")) return;

		try {
			await axiosInstance.delete(`roles/${roleId}`);
			fetchRoles();
		} catch (error) {
			console.error("Error deleting role", error);
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
									Roles
								</Typography>
							</div>
							<div className="col-auto ms-auto">
								<Button
									variant="contained"
									sx={{
										bgcolor: "#0F172A",
										borderRadius: "10px",
										"&:hover": {
											bgcolor: "#1E293B",
										},
									}}
									onClick={() => navigate("/branch/users/roles/new")}>
									New Role
								</Button>
							</div>
						</div>

						{/* Table */}
						<TableContainer component={Paper} sx={{ boxShadow: "none" }}>
							<Table>
								<TableHead sx={{ bgcolor: "#F8FAFC" }}>
									<TableRow>
										<TableCell>Name</TableCell>
										<TableCell>Action</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{isLoading ? (
										<TableRow>
											<TableCell colSpan={7} align="center">
												<CircularProgress sx={{ color: "#0F172A" }} />
											</TableCell>
										</TableRow>
									) : roles.length > 0 ? (
										roles.map((role) => (
											<TableRow key={role.id}>
												<TableCell>{role.name}</TableCell>
												<TableCell>
													<Button onClick={() => navigate(`/branch/users/roles/edit/${role.id}`)} color="primary">
														Edit
													</Button>
													<Button onClick={() => handleDelete(role.id)} color="secondary">
														Delete
													</Button>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={7} align="center">
												No roles found.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>

						{/* Pagination */}
					</div>
				</div>
			</div>

			{/* Snackbar */}
			{/* <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} message={snackbarMessage} /> */}
		</>
	);
};

export default RoleManagement;
