import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Pagination, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Snackbar, Alert } from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";

const Management = () => {
	const navigate = useNavigate();
	const { branch } = useParams();

	const [financeCategories, setFinanceCategories] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit] = useState(10);
	const [open, setOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deleteCategoryId, setDeleteCategoryId] = useState(null);
	const [editCategory, setEditCategory] = useState(null);
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

	useEffect(() => {
		fetchFinanceCategories(currentPage);
	}, [currentPage]);

	const fetchFinanceCategories = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get("finance/categories", { params: { page, limit } });
			if (res.data.success) {
				setFinanceCategories(res.data.financeCategories.data);
				setTotalPages(res.data.financeCategories.last_page);
				setCurrentPage(res.data.financeCategories.current_page);
			}
		} catch (error) {
			setSnackbar({ open: true, message: "Error fetching finance categories!", severity: "error" });
		} finally {
			setIsLoading(false);
		}
	};

	const handleOpen = (category = null) => {
		if (category) {
			setEditCategory(category);
			setName(category.name);
		} else {
			setEditCategory(null);
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
			setError("Finance category name is required");
			return;
		}
		setIsSaving(true);
		try {
			if (editCategory) {
				await axiosInstance.put(`finance/categories/${editCategory.id}`, { name });
				setSnackbar({ open: true, message: "Finance category updated successfully!", severity: "success" });
			} else {
				await axiosInstance.post("finance/categories", { name });
				setSnackbar({ open: true, message: "Finance category added successfully!", severity: "success" });
			}
			fetchFinanceCategories();
			handleClose();
		} catch (error) {
			setSnackbar({ open: true, message: "Error saving finance category!", severity: "error" });
		} finally {
			setIsSaving(false);
		}
	};

	const openDeleteDialog = (categoryId) => {
		setDeleteCategoryId(categoryId);
		setDeleteDialogOpen(true);
	};

	const closeDeleteDialog = () => {
		setDeleteDialogOpen(false);
		setDeleteCategoryId(null);
	};

	const handleDelete = async () => {
		try {
			await axiosInstance.delete(`finance/categories/${deleteCategoryId}`);
			setSnackbar({ open: true, message: "Finance category deleted successfully!", severity: "success" });
			fetchFinanceCategories();
		} catch (error) {
			setSnackbar({ open: true, message: "Error deleting finance category!", severity: "error" });
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
									Finance Categories
								</Typography>
							</div>
							<div className="col-auto ms-auto">
								<Button variant="contained" sx={{ bgcolor: "#0F172A", borderRadius: "10px", "&:hover": { bgcolor: "#1E293B" } }} onClick={() => handleOpen()}>
									New Finance Category
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
									) : financeCategories.length > 0 ? (
										financeCategories.map((category) => (
											<TableRow key={category.id}>
												<TableCell style={{ cursor: "pointer" }} onClick={() => navigate(`/${branch}/branch/finance/category/${category.id}`)}>
													{category.name}
												</TableCell>
												<TableCell>
													<Button onClick={() => handleOpen(category)} color="primary">
														Edit
													</Button>
													<Button onClick={() => openDeleteDialog(category.id)} color="secondary">
														Delete
													</Button>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={2} align="center">
												No finance categories found.
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
				<DialogContent>Are you sure you want to delete this finance category?</DialogContent>
				<DialogActions>
					<Button onClick={closeDeleteDialog} color="secondary">
						Cancel
					</Button>
					<Button onClick={handleDelete} variant="contained" color="error">
						Delete
					</Button>
				</DialogActions>
			</Dialog>

			{/* Add/Edit Finance Category Modal */}
			<Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
				<DialogTitle>{editCategory ? "Edit Finance Category" : "New Finance Category"}</DialogTitle>
				<DialogContent>
					<TextField fullWidth label="Finance Category Name" variant="outlined" margin="normal" value={name} onChange={(e) => setName(e.target.value)} error={!!error} helperText={error} />
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="secondary">
						Cancel
					</Button>
					<Button onClick={handleSubmit} variant="contained" color="primary" disabled={isSaving}>
						{editCategory ? "Update" : "Save"}
					</Button>
				</DialogActions>
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
