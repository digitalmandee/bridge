import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Pagination, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Snackbar, Alert } from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import colors from "@/assets/styles/color";

const InvestmentTypes = () => {
	const navigate = useNavigate();
	const [investmentTypes, setInvestmentTypes] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit] = useState(10);
	const [open, setOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deleteInvestmentTypeId, setDeleteInvestmentTypeId] = useState(null);
	const [editInvestmentType, setEditInvestmentType] = useState(null);
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

	useEffect(() => {
		fetchInvestmentTypes(currentPage);
	}, [currentPage]);

	const fetchInvestmentTypes = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get("investor/investment-types", { params: { page, limit } });

			if (res.data.success) {
				setInvestmentTypes(res.data.investmentTypes.data);
				setTotalPages(res.data.investmentTypes.last_page);
				setCurrentPage(res.data.investmentTypes.current_page);
			}
		} catch (error) {
			setSnackbar({ open: true, message: "Error fetching Investment Types!", severity: "error" });
		} finally {
			setIsLoading(false);
		}
	};

	const handleOpen = (scheduleFloor = null) => {
		if (scheduleFloor) {
			setEditInvestmentType(scheduleFloor);
			setName(scheduleFloor.name);
		} else {
			setEditInvestmentType(null);
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
			setError("Investment Type name is required");
			return;
		}
		setIsSaving(true);
		try {
			if (editInvestmentType) {
				await axiosInstance.put(`investor/investment-types/${editInvestmentType.id}`, { name });
				setSnackbar({ open: true, message: "Investment Type updated successfully!", severity: "success" });
			} else {
				await axiosInstance.post("investor/investment-types", { name });
				setSnackbar({ open: true, message: "Investment Type added successfully!", severity: "success" });
			}
			fetchInvestmentTypes();
			handleClose();
		} catch (error) {
			setSnackbar({ open: true, message: "Error saving Investment Type!", severity: "error" });
		} finally {
			setIsSaving(false);
		}
	};

	const openDeleteDialog = (scheduleFloorId) => {
		setDeleteInvestmentTypeId(scheduleFloorId);
		setDeleteDialogOpen(true);
	};

	const closeDeleteDialog = () => {
		setDeleteDialogOpen(false);
		setDeleteInvestmentTypeId(null);
	};

	const handleDelete = async () => {
		try {
			await axiosInstance.delete(`investor/investment-types/${deleteInvestmentTypeId}`);
			setSnackbar({ open: true, message: "Investment Type deleted successfully!", severity: "success" });
			fetchInvestmentTypes();
		} catch (error) {
			setSnackbar({ open: true, message: "Error deleting Investment Type!", severity: "error" });
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
									Investment Types
								</Typography>
							</div>
							<div className="col-auto ms-auto">
								<Button variant="contained" sx={{ bgcolor: colors.primary, borderRadius: "10px", "&:hover": { bgcolor: "#FFCC16" } }} onClick={() => handleOpen()}>
									New Investment Type
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
												<CircularProgress sx={{ color: "#FFCC16" }} />
											</TableCell>
										</TableRow>
									) : investmentTypes.length > 0 ? (
										investmentTypes.map((scheduleFloor) => (
											<TableRow key={scheduleFloor.id}>
												<TableCell>{scheduleFloor.name}</TableCell>
												<TableCell>
													<Button onClick={() => handleOpen(scheduleFloor)} color="primary">
														Edit
													</Button>
													<Button onClick={() => openDeleteDialog(scheduleFloor.id)} color="secondary">
														Delete
													</Button>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={2} align="center">
												No Investment Types found.
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
				<DialogContent>Are you sure you want to delete this Investment Type?</DialogContent>
				<DialogActions>
					<Button onClick={closeDeleteDialog} color="secondary">
						Cancel
					</Button>
					<Button onClick={handleDelete} variant="contained" color="error">
						Delete
					</Button>
				</DialogActions>
			</Dialog>

			{/* Add/Edit Investment Type Modal */}
			<Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
				<DialogTitle>{editInvestmentType ? "Edit Investment Type" : "New Investment Type"}</DialogTitle>
				<DialogContent>
					<TextField fullWidth label="Investment Type Name" variant="outlined" margin="normal" value={name} onChange={(e) => setName(e.target.value)} error={!!error} helperText={error} />
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="secondary">
						Cancel
					</Button>
					<Button onClick={handleSubmit} variant="contained" color="primary" disabled={isSaving}>
						{editInvestmentType ? "Update" : "Save"}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Snackbar for success/failure message */}
			<Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
				<Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
					{snackbar.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default InvestmentTypes;
