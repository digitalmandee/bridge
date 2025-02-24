import React, { useContext, useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, MenuItem, Avatar, Select, CircularProgress, Snackbar, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, RadioGroup, FormControlLabel, DialogActions, Radio } from "@mui/material";
import { Search as SearchIcon, Download as DownloadIcon, Notifications as NotificationsIcon } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "@/utils/axiosInstance";
import { AuthContext } from "@/contexts/AuthContext";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const InvoiceManagement = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	const [invoices, setInvoices] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(10);
	const [statusFilter, setStatusFilter] = useState("");
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");

	const [openDialog, setOpenDialog] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState("");
	const [dialogData, setDialogData] = useState({
		due_date: null,
		paid_date: null,
		payment_type: "",
		receipt: null,
	});

	const handleStatusClick = (invoice) => {
		if (invoice.status === "pending") {
			const formattedDueDate = invoice.due_date ? dayjs(invoice.due_date) : null;

			setDialogData((prevData) => ({
				...prevData,
				id: invoice.id,
				due_date: formattedDueDate,
			}));

			setSelectedStatus(invoice.status);
			setOpenDialog(true);
		}
	};

	const getInvoices = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get(`invoices`, {
				params: { page, limit, status: statusFilter },
			});

			if (res.data.success) {
				setInvoices(res.data.invoices.data);
				setTotalPages(res.data.invoices.last_page);
				setCurrentPage(res.data.invoices.current_page);
			}
		} catch (error) {
			console.error("Error fetching invoices:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const sendNotification = async (invoiceId, userId, status) => {
		try {
			const res = await axiosInstance.post(`notifications/send`, {
				user_id: userId,
				invoice_id: invoiceId,
				type: "invoice_conformation",
				invoice_status: status,
			});

			if (res.data.success) {
				setSnackbarMessage("Notification sent successfully!");
				setSnackbarOpen(true);
			} else {
				setSnackbarMessage("Failed to send notification.");
				setSnackbarOpen(true);
			}
		} catch (error) {
			console.error("Error sending notification:", error.response.data);
			setSnackbarMessage("An error occurred while sending the notification.");
			setSnackbarOpen(true);
		}
	};

	const [errors, setErrors] = useState({});

	// Function to validate input fields
	const validateFields = () => {
		let tempErrors = {};

		if (!selectedStatus === "pending") tempErrors.status = "Status is required.";
		if (selectedStatus === "paid" || selectedStatus === "overdue") {
			if (!dialogData.paid_date) tempErrors.paid_date = "Paid date is required.";
			if (dialogData.paid_date && dayjs(dialogData.paid_date).isBefore(dialogData.due_date)) {
				tempErrors.paid_date = "Paid date cannot be before the due date.";
			}
			if (!dialogData.payment_type) tempErrors.payment_type = "Payment type is required.";

			if (dialogData.receipt) {
				const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
				if (!allowedTypes.includes(dialogData.receipt.type)) {
					tempErrors.receipt = "Invalid file type. Only PDF, JPG, and PNG are allowed.";
				}
			}
		}
		setErrors(tempErrors);
		return Object.keys(tempErrors).length === 0;
	};

	// Function to handle update submission
	const handleUpdateInvoice = async () => {
		if (!validateFields()) return;

		try {
			const formData = new FormData();
			formData.append("invoice_id", dialogData.id);
			formData.append("status", selectedStatus);
			formData.append("due_date", dayjs(dialogData.due_date).format("YYYY-MM-DD"));

			if (selectedStatus === "paid" || selectedStatus === "overdue") {
				if (selectedStatus === "paid") formData.append("paid_date", dayjs(dialogData.paid_date).format("YYYY-MM-DD"));
				if (dialogData.payment_type) formData.append("payment_type", dialogData.payment_type);
				if (dialogData.receipt) formData.append("receipt", dialogData.receipt);
			}

			const response = await axiosInstance.post(`/invoices/update`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			if (response.data.success) {
				setSnackbarMessage("Invoice updated successfully!");
				setSnackbarOpen(true);
				setOpenDialog(false);
				getInvoices(); // Refresh invoices list
			} else {
				setSnackbarMessage("Failed to update invoice.");
				setSnackbarOpen(true);
			}
		} catch (error) {
			console.error("Error updating invoice:", error);
			setSnackbarMessage("An error occurred while updating the invoice.");
			setSnackbarOpen(true);
		}
	};

	const closeUpdateInvoiceDialog = async () => {
		setOpenDialog(false);
		setErrors({});
		setDialogData({
			due_date: null,
			paid_date: null,
			payment_type: "",
			receipt: null,
		});
	};

	// Run getInvoices when filter changes
	useEffect(() => {
		getInvoices(currentPage);
	}, [currentPage, limit, statusFilter]);

	useEffect(() => {
		getInvoices(currentPage);
	}, [currentPage, limit]);

	const handleSnackbarClose = () => {
		setSnackbarOpen(false);
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
									Invoice
								</Typography>
							</div>
							<div className="col-auto ms-auto">
								<Button variant="outlined" startIcon={<DownloadIcon />} sx={{ color: "#64748B", borderColor: "#E2E8F0", mr: 2 }}>
									CSV
								</Button>
								{user.type === "admin" && (
									<Button
										variant="contained"
										sx={{
											bgcolor: "#0F172A",
											borderRadius: "10px",
											"&:hover": {
												bgcolor: "#1E293B",
											},
										}}
										onClick={() => navigate("/branch/invoice/create")}>
										New Invoice
									</Button>
								)}
							</div>
						</div>

						{/* Filters and Search */}
						<div className="row mb-4 align-items-center">
							<div className="col-md-8 mb-3 mb-md-0">
								<div className="d-flex flex-wrap gap-2">
									{["", "Pending", "Paid", "Overdue"].map((label) => (
										<Button
											key={label}
											variant={statusFilter === label ? "contained" : "outlined"}
											sx={{
												bgcolor: statusFilter === label ? "#0F172A" : "",
												color: statusFilter === label ? "white" : "#0D2B4E",
												borderRadius: "20px",
												border: "1px solid #0D2B4E",
												"&:hover": {
													bgcolor: "#0D2B4E",
													color: "#fff",
												},
											}}
											onClick={() => setStatusFilter(label)}>
											{label === "" ? "All" : label}
										</Button>
									))}
								</div>
							</div>
							<div className="col-md-4">
								<TextField
									fullWidth
									size="small"
									placeholder="Search"
									InputProps={{
										startAdornment: <SearchIcon sx={{ color: "#64748B", mr: 1 }} />,
									}}
								/>
							</div>
						</div>

						{/* Table */}
						<TableContainer component={Paper} sx={{ boxShadow: "none" }}>
							<Table>
								<TableHead sx={{ bgcolor: "#F8FAFC" }}>
									<TableRow>
										<TableCell>Invoice #</TableCell>
										<TableCell>Type</TableCell>
										{user.type === "admin" && <TableCell>Clients</TableCell>}
										<TableCell>Issue date</TableCell>
										<TableCell>Payment Date</TableCell>
										<TableCell>Status</TableCell>
										<TableCell>Amount</TableCell>
										{user.type === "admin" && <TableCell>Action</TableCell>}
									</TableRow>
								</TableHead>
								<TableBody>
									{isLoading ? (
										<TableRow>
											<TableCell colSpan={7} align="center">
												<CircularProgress sx={{ color: "#0F172A" }} />
											</TableCell>
										</TableRow>
									) : invoices.length > 0 ? (
										invoices.map((invoice) => (
											<TableRow key={invoice.id}>
												<TableCell>#NASTP-{invoice.id}</TableCell>
												<TableCell style={{ textTransform: "capitalize" }}>{invoice.invoice_type}</TableCell>
												{user.type === "admin" && (
													<TableCell>
														<Box display="flex" alignItems="center" gap={1} onClick={() => navigate(`/branch/invoice/customer-detail/${invoice.user.id}`)} sx={{ cursor: "pointer" }}>
															<Avatar sx={{ width: 32, height: 32 }} src={import.meta.env.VITE_ASSET_API + invoice.user.profile_image}></Avatar>
															<Box>
																<Typography variant="body2">
																	{invoice.user.name} <span style={{ color: "#6C757D", fontSize: "0.875rem" }}>({invoice.user.type})</span>
																</Typography>
																<Typography variant="caption" color="text.secondary">
																	{invoice.user.email}
																</Typography>
															</Box>
														</Box>
													</TableCell>
												)}
												<TableCell>{new Date(invoice.created_at).toISOString().split("T")[0]}</TableCell>
												<TableCell>{invoice.due_date}</TableCell>
												<TableCell>
													<Button
														size="small"
														variant="contained"
														sx={{
															bgcolor: invoice.status === "paid" ? "#0F172A" : invoice.status === "overdue" ? "#E53935" : "#0D2B4E",
															color: "white",
															"&:hover": { opacity: 0.8 },
														}}
														onClick={() => handleStatusClick(invoice)}
														disabled={invoice.status === "paid" || invoice.status === "overdue"}>
														{invoice.status}
													</Button>
												</TableCell>

												<TableCell>Rs. {invoice.amount}</TableCell>
												{user.type === "admin" && (
													<TableCell>
														<Button size="small" variant="outlined" startIcon={<NotificationsIcon />} sx={{ borderColor: "#e0e0e0", color: "text.secondary" }} onClick={() => sendNotification(invoice.user.id, invoice.user.id, invoice.status)}>
															Notify
														</Button>
													</TableCell>
												)}
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={7} align="center">
												No invoices found.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>

						{/* Pagination */}
						<Box display="flex" justifyContent="center" mt={3} gap={1}>
							<Button variant="outlined" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
								Previous
							</Button>
							{[...Array(totalPages)].map((_, index) => (
								<Button key={index} variant={currentPage === index + 1 ? "contained" : "outlined"} sx={currentPage === index + 1 ? { bgcolor: "#0F172A" } : {}} onClick={() => setCurrentPage(index + 1)}>
									{index + 1}
								</Button>
							))}
							<Button variant="outlined" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>
								Next
							</Button>
							<Select value={limit} onChange={(e) => setLimit(e.target.value)} size="small" sx={{ minWidth: 80 }}>
								<MenuItem value={5}>5</MenuItem>
								<MenuItem value={10}>10</MenuItem>
								<MenuItem value={20}>20</MenuItem>
							</Select>
						</Box>
					</div>
				</div>
			</div>

			<Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
				<DialogTitle>Update Invoice Status</DialogTitle>
				<DialogContent>
					<FormControl fullWidth margin="normal">
						<InputLabel>Status</InputLabel>
						<Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
							<MenuItem value="pending">Pending</MenuItem>
							<MenuItem value="paid">Paid</MenuItem>
							<MenuItem value="overdue">Overdue</MenuItem>
						</Select>
						{errors.status && <Typography color="error">{errors.status}</Typography>}
					</FormControl>

					<div className="selectPicker">
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker label="Due Date" value={dialogData.due_date} onChange={(newValue) => setDialogData({ ...dialogData, dueDate: newValue })} renderInput={(params) => <TextField fullWidth {...params} />} />
						</LocalizationProvider>
					</div>

					{(selectedStatus === "paid" || selectedStatus === "overdue") && (
						<>
							<div className="selectPicker mt-2">
								<LocalizationProvider dateAdapter={AdapterDayjs}>
									<DatePicker label="Paid Date" value={dialogData.paid_date} onChange={(newValue) => setDialogData({ ...dialogData, paid_date: newValue })} renderInput={(params) => <TextField fullWidth {...params} />} />
								</LocalizationProvider>
								{errors.paid_date && <Typography color="error">{errors.paid_date}</Typography>}
							</div>

							<FormControl fullWidth margin="normal">
								<RadioGroup row value={dialogData.payment_type} onChange={(e) => setDialogData({ ...dialogData, payment_type: e.target.value })}>
									<FormControlLabel value="Cash" control={<Radio />} label="Cash" />
									<FormControlLabel value="Bank" control={<Radio />} label="Bank" />
								</RadioGroup>
								{errors.payment_type && <Typography color="error">{errors.payment_type}</Typography>}
							</FormControl>

							<div style={{ marginTop: 10, border: "2px dashed #ccc", padding: 10, textAlign: "center" }}>
								<label htmlFor="file-upload" style={{ cursor: "pointer" }}>
									Upload Receipt (Optional)
								</label>
								<input id="file-upload" type="file" style={{ display: "none" }} onChange={(e) => setDialogData({ ...dialogData, receipt: e.target.files[0] })} />
								{dialogData.receipt && (
									<Typography variant="body2" style={{ marginTop: 10 }}>
										{dialogData.receipt.name}
									</Typography>
								)}
								{errors.receipt && <Typography color="error">{errors.receipt}</Typography>}
							</div>
						</>
					)}
				</DialogContent>

				<DialogActions>
					<Button onClick={() => closeUpdateInvoiceDialog()}>Cancel</Button>
					<Button variant="contained" color="primary" onClick={handleUpdateInvoice}>
						Update
					</Button>
				</DialogActions>
			</Dialog>

			{/* Snackbar */}
			<Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} message={snackbarMessage} />
		</>
	);
};

export default InvoiceManagement;
