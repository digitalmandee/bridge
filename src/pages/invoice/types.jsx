// Updated from Department to Invoice Type
import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Pagination, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Snackbar, Alert } from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import colors from "@/assets/styles/color";

const Management = () => {
	const navigate = useNavigate();
	const [invoiceTypes, setInvoiceTypes] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit] = useState(10);
	const [open, setOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deleteTypeId, setDeleteTypeId] = useState(null);
	const [editInvoiceType, setEditInvoiceType] = useState(null);
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

	useEffect(() => {
		fetchInvoiceTypes(currentPage);
	}, [currentPage]);

	const fetchInvoiceTypes = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get("invoice-types", { params: { page, limit } });
			if (res.data.success) {
				setInvoiceTypes(res.data.invoice_types.data);
				setTotalPages(res.data.invoice_types.last_page);
				setCurrentPage(res.data.invoice_types.current_page);
			}
		} catch (error) {
			setSnackbar({ open: true, message: "Error fetching invoice types!", severity: "error" });
		} finally {
			setIsLoading(false);
		}
	};

	const handleOpen = (type = null) => {
		if (type) {
			setEditInvoiceType(type);
			setName(type.name);
		} else {
			setEditInvoiceType(null);
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
			setError("Invoice type name is required");
			return;
		}
		setIsSaving(true);
		try {
			if (editInvoiceType) {
				await axiosInstance.put(`invoice-types/${editInvoiceType.id}`, { name });
				setSnackbar({ open: true, message: "Invoice type updated successfully!", severity: "success" });
			} else {
				await axiosInstance.post("invoice-types", { name });
				setSnackbar({ open: true, message: "Invoice type added successfully!", severity: "success" });
			}
			fetchInvoiceTypes();
			handleClose();
		} catch (error) {
			if (error.response.data.message == "Validation failed") {
				setSnackbar({ open: true, message: error.response.data.errors.name[0], severity: "error" });
			} else {
				setSnackbar({ open: true, message: "Error saving invoice type!", severity: "error" });
			}
		} finally {
			setIsSaving(false);
		}
	};

	const openDeleteDialog = (typeId) => {
		setDeleteTypeId(typeId);
		setDeleteDialogOpen(true);
	};

	const closeDeleteDialog = () => {
		setDeleteDialogOpen(false);
		setDeleteTypeId(null);
	};

	const handleDelete = async () => {
		try {
			await axiosInstance.delete(`invoice-types/${deleteTypeId}`);
			setSnackbar({ open: true, message: "Invoice type deleted successfully!", severity: "success" });
			fetchInvoiceTypes();
		} catch (error) {
			setSnackbar({ open: true, message: "Error deleting invoice type!", severity: "error" });
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
								<Typography variant="h5" className="mb-0 ms-2" style={{ fontSize: "30px", color: "#202224" }}>
									Invoice Types
								</Typography>
							</div>
							<div className="col-auto ms-auto">
								<Button variant="contained" sx={{ bgcolor: colors.primary, borderRadius: "10px", "&:hover": { bgcolor: colors.primary } }} onClick={() => handleOpen()}>
									New Invoice Type
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
									) : invoiceTypes.length > 0 ? (
										invoiceTypes.map((type) => (
											<TableRow key={type.id}>
												<TableCell>{type.name}</TableCell>
												<TableCell>
													{["Monthly", "Printing Papers", "Meeting Rooms"].includes(type.name) ? (
														"—"
													) : (
														<>
															<Button onClick={() => handleOpen(type)} color="primary">
																Edit
															</Button>
															<Button onClick={() => openDeleteDialog(type.id)} color="secondary">
																Delete
															</Button>
														</>
													)}
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={2} align="center">
												No invoice types found.
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
				<DialogContent>Are you sure you want to delete this invoice type?</DialogContent>
				<DialogActions>
					<Button onClick={closeDeleteDialog} color="secondary">
						Cancel
					</Button>
					<Button onClick={handleDelete} variant="contained" color="error">
						Delete
					</Button>
				</DialogActions>
			</Dialog>

			{/* Add/Edit Invoice Type Modal */}
			<Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
				<DialogTitle>{editInvoiceType ? "Edit Invoice Type" : "New Invoice Type"}</DialogTitle>
				<DialogContent>
					<TextField fullWidth label="Name" variant="outlined" margin="normal" value={name} onChange={(e) => setName(e.target.value)} error={!!error} helperText={error} />
					<DialogActions>
						<Button
							onClick={handleClose}
							color="secondary"
							sx={{
								backgroundColor: "#FFFFFF",
								border: "1px solid #000000",
								color: "#000000",
								"&:hover": { backgroundColor: "#f5f5f5", border: "1px solid #000000" },
							}}>
							Cancel
						</Button>
						<Button sx={{ bgcolor: colors.primary }} onClick={handleSubmit} variant="contained" disabled={isSaving}>
							{editInvoiceType ? "Update" : "Save"}
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
