import React, { useContext, useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Pagination } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "@/utils/axiosInstance";
import { AuthContext } from "@/contexts/AuthContext";

const UserManagement = () => {
	const navigate = useNavigate();
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(10);

	useEffect(() => {
		fetchUsers(currentPage);
	}, [currentPage, limit]);

	const fetchUsers = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get("branch-users", {
				params: { page, limit },
			});
			if (res.data.success) {
				setUsers(res.data.users.data);
				setTotalPages(res.data.users.last_page);
				setCurrentPage(res.data.users.current_page);
			}
		} catch (error) {
			console.error("Error fetching users", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (userId) => {
		if (!window.confirm("Are you sure you want to delete this user?")) return;

		try {
			await axiosInstance.delete(`branch-users/${userId}`);
			fetchUsers();
		} catch (error) {
			console.error("Error deleting user", error);
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
									Branch User Management
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
									onClick={() => navigate("/branch/users/new")}>
									New User
								</Button>
							</div>
						</div>

						{/* Table */}
						<TableContainer component={Paper} sx={{ boxShadow: "none" }}>
							<Table>
								<TableHead sx={{ bgcolor: "#F8FAFC" }}>
									<TableRow>
										<TableCell>Name</TableCell>
										<TableCell>Role</TableCell>
										<TableCell>Email</TableCell>
										<TableCell>Status</TableCell>
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
									) : users.length > 0 ? (
										users.map((user) => (
											<TableRow key={user.id}>
												<TableCell>{user.name}</TableCell>
												<TableCell>{user?.roles[0]?.name}</TableCell>
												<TableCell>{user.email}</TableCell>
												<TableCell sx={{ textTransform: "capitalize" }}>{user.status}</TableCell>
												<TableCell>
													<Button onClick={() => navigate(`/branch/users/edit/${user.id}`)} color="primary">
														Edit
													</Button>
													<Button onClick={() => handleDelete(user.id)} color="secondary">
														Delete
													</Button>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={7} align="center">
												No users found.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>

						{/* Pagination */}
						<div className="d-flex justify-content-end mt-4">
							<Pagination count={totalPages} page={currentPage} onChange={(e, page) => setCurrentPage(page)} shape="rounded" style={{ color: "#0a2647" }} />
						</div>
					</div>
				</div>
			</div>

			{/* Snackbar */}
			{/* <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} message={snackbarMessage} /> */}
		</>
	);
};

export default UserManagement;
