import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Pagination, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Snackbar, Alert } from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";

const Management = () => {
	const navigate = useNavigate();
	const [departments, setDepartments] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit] = useState(10);
	const [open, setOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deleteDepartmentId, setDeleteDepartmentId] = useState(null);
	const [editDepartment, setEditDepartment] = useState(null);
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

	useEffect(() => {
		fetchDepartments(currentPage);
	}, [currentPage]);

	const fetchDepartments = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get("departments", { params: { page, limit } });
			if (res.data.success) {
				setDepartments(res.data.deparments.data);
				setTotalPages(res.data.deparments.last_page);
				setCurrentPage(res.data.deparments.current_page);
			}
		} catch (error) {
			setSnackbar({ open: true, message: "Error fetching departments!", severity: "error" });
		} finally {
			setIsLoading(false);
		}
	};

	const handleOpen = (department = null) => {
		if (department) {
			setEditDepartment(department);
			setName(department.name);
		} else {
			setEditDepartment(null);
			setName("");
		}
		setError("");
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setError("");
		setName("");
	};

	const handleSubmit = async () => {
		if (!name.trim()) {
			setError("Department name is required");
			return;
		}
		setIsSaving(true);
		try {
			if (editDepartment) {
				await axiosInstance.put(`departments/${editDepartment.id}`, { name });
				setSnackbar({ open: true, message: "Department updated successfully!", severity: "success" });
			} else {
				await axiosInstance.post("departments", { name });
				setSnackbar({ open: true, message: "Department added successfully!", severity: "success" });
			}
			fetchDepartments();
			handleClose();
		} catch (error) {
			setSnackbar({ open: true, message: "Error saving department!", severity: "error" });
		} finally {
			setIsSaving(false);
		}
	};

	const openDeleteDialog = (departmentId) => {
		setDeleteDepartmentId(departmentId);
		setDeleteDialogOpen(true);
	};

	const closeDeleteDialog = () => {
		setDeleteDialogOpen(false);
		setDeleteDepartmentId(null);
	};

	const handleDelete = async () => {
		try {
			await axiosInstance.delete(`departments/${deleteDepartmentId}`);
			setSnackbar({ open: true, message: "Department deleted successfully!", severity: "success" });
			fetchDepartments();
		} catch (error) {
			setSnackbar({ open: true, message: "Error deleting department!", severity: "error" });
		} finally {
			closeDeleteDialog();
		}
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
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
									Departments
								</Typography>
							</div>
							<div className="col-auto ms-auto">
								<Button variant="contained" sx={{ bgcolor: "#0F172A", borderRadius: "10px", "&:hover": { bgcolor: "#1E293B" } }} onClick={() => handleOpen()}>
									New Department
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
											<TableCell colSpan={2} align="center">
												<CircularProgress sx={{ color: "#0F172A" }} />
											</TableCell>
										</TableRow>
									) : departments.length > 0 ? (
										departments.map((department) => (
											<TableRow key={department.id}>
												<TableCell>{department.name}</TableCell>
												<TableCell>
													<Button onClick={() => handleOpen(department)} color="primary">
														Edit
													</Button>
													<Button onClick={() => openDeleteDialog(department.id)} color="secondary">
														Delete
													</Button>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={2} align="center">
												No departments found.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>

						{/* Pagination */}
						<div className="d-flex justify-content-end mt-4">
							<Pagination count={totalPages} page={currentPage} onChange={(e, page) => setCurrentPage(page)} shape="rounded" />
						</div>
					</div>
				</div>
			</div>

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteDialogOpen} onClose={closeDeleteDialog} maxWidth="xs" fullWidth>
				<DialogTitle>Confirm Delete</DialogTitle>
				<DialogContent>Are you sure you want to delete this department?</DialogContent>
				<DialogActions>
					<Button onClick={closeDeleteDialog} color="secondary">
						Cancel
					</Button>
					<Button onClick={handleDelete} variant="contained" color="error">
						Delete
					</Button>
				</DialogActions>
			</Dialog>

			{/* Add/Edit Department Modal */}
			<Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
				<DialogTitle>{editDepartment ? "Edit Department" : "New Department"}</DialogTitle>
				<DialogContent>
					<TextField fullWidth label="Department Name" variant="outlined" margin="normal" value={name} onChange={(e) => setName(e.target.value)} error={!!error} helperText={error} />
					<DialogActions>
						<Button onClick={handleClose} color="secondary">
							Cancel
						</Button>
						<Button onClick={handleSubmit} variant="contained" color="primary" disabled={isSaving} loading={isSaving}>
							{editDepartment ? "Update" : "Save"}
						</Button>
					</DialogActions>
				</DialogContent>
			</Dialog>

			{/* Snackbar */}
			<Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
				<Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
					{snackbar.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default Management;
