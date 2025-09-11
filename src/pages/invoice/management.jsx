import React, { useContext, useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, MenuItem, Avatar, Select, CircularProgress, Snackbar, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, RadioGroup, FormControlLabel, DialogActions, Radio, Alert, Tooltip } from "@mui/material";
import { Search as SearchIcon, Download as DownloadIcon, Notifications as NotificationsIcon } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "@/utils/axiosInstance";
import { AuthContext } from "@/contexts/AuthContext";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import colors from "@/assets/styles/color";

const isToday = (dateStr) => {
	if (!dateStr) return false;
	const date = new Date(dateStr);
	const today = new Date();
	return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
};

const InvoiceManagement = () => {
	const { user } = useContext(AuthContext);
	const { branch } = useParams();

	const navigate = useNavigate();

	const [invoices, setInvoices] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(10);
	const [statusFilter, setStatusFilter] = useState("");
	const [loadingInvoiceId, setLoadingInvoiceId] = useState(null);
	const [search, setSearch] = useState("");

	const [openDialog, setOpenDialog] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState("");
	const [dialogData, setDialogData] = useState({
		due_date: null,
		paid_date: null,
		payment_type: "",
		receipt: null,
	});

	// Snackbar
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

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
				params: { page, limit, status: statusFilter, search },
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
		setLoadingInvoiceId(invoiceId); // start loading this one

		try {
			const res = await axiosInstance.post(`notifications/send`, {
				user_id: userId,
				invoice_id: invoiceId,
				type: "invoice_conformation",
				invoice_status: status,
			});

			if (res.data.success) {
				setSnackbar({ open: true, message: "Notification sent successfully!", severity: "success" });
				const updatedNotify = res.data.notify_date;
				setInvoices((prev) => prev.map((inv) => (inv.id === invoiceId ? { ...inv, notify: updatedNotify } : inv)));
			} else {
				setSnackbar({ open: true, message: "Failed to send notification.", severity: "error" });
			}
		} catch (error) {
			console.error("Error sending notification:", error?.response?.data);
			setSnackbar({ open: true, message: "An error occurred while sending the notification.", severity: "error" });
		} finally {
			setLoadingInvoiceId(null); // stop loading
		}
	};

	const [errors, setErrors] = useState({});

	// Function to validate input fields
	const validateFields = () => {
		let tempErrors = {};

		if (!selectedStatus === "pending") tempErrors.status = "Status is required.";
		if (selectedStatus === "paid" || selectedStatus === "overdue") {
			if (!dialogData.paid_date) tempErrors.paid_date = "Paid date is required.";
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
				setSnackbar({ open: true, message: "Invoice updated successfully!", severity: "success" });
				setOpenDialog(false);
				getInvoices();
			} else {
				setSnackbar({ open: true, message: "Failed to update invoice.", severity: "error" });
			}
		} catch (error) {
			console.error("Error updating invoice:", error);
			setSnackbar({ open: true, message: "An error occurred while updating the invoice.", severity: "error" });
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
		const timeout = setTimeout(() => {
			getInvoices(currentPage); // Reset to page 1 on search
		}, 500); // debounce
		return () => clearTimeout(timeout);
	}, [search, currentPage, limit, statusFilter]);

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
											bgcolor: colors.primary,
											borderRadius: "10px",
											"&:hover": {
												bgcolor: colors.primary,
											},
										}}
										onClick={() => navigate(`/${branch}/branch/invoice/create`)}>
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
												bgcolor: statusFilter === label ? colors.primary : "",
												color: statusFilter === label ? "white" : colors.primary,
												borderRadius: "20px",

												"&:hover": {
													bgcolor: colors.primary,
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
									value={search}
									onChange={(e) => setSearch(e.target.value)}
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
												<CircularProgress sx={{ color: "#FFCC16" }} />
											</TableCell>
										</TableRow>
									) : invoices.length > 0 ? (
										invoices.map((invoice) => {
											const isNotifiedToday = isToday(invoice.notify);
											const isDisabled = isNotifiedToday || loadingInvoiceId === invoice.id;
											return (
												<TableRow key={invoice.id}>
													<TableCell style={{ cursor: "pointer" }} onClick={() => navigate(`/${branch}/branch/invoice/view/${invoice.id}`)}>
														#BRIDGE-{invoice.id}
													</TableCell>
													<TableCell style={{ textTransform: "capitalize" }}>{invoice.invoice_type}</TableCell>
													{user.type === "admin" && (
														<TableCell>
															<Box display="flex" alignItems="center" gap={1} onClick={() => navigate(`/${branch}/branch/invoice/customer-detail/${invoice.user.id}`)} sx={{ cursor: "pointer" }}>
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
																bgcolor: invoice.status === "paid" ? "#FFCC16" : invoice.status === "overdue" ? "#E53935" : colors.primary,
																color: "white",
																"&:hover": { opacity: 0.8 },
															}}
															onClick={() => user.type === "admin" && handleStatusClick(invoice)}
															disabled={invoice.status === "paid" || invoice.status === "overdue"}>
															{invoice.status}
														</Button>
													</TableCell>

													<TableCell>Rs. {invoice.discount > 0 ? Math.round(invoice.amount - invoice.amount * (invoice.discount / 100)) : invoice.amount}</TableCell>
													{user.type === "admin" && (
														<TableCell>
															<Tooltip title={isNotifiedToday ? `Already notified today` : "Click to notify this customer"}>
																<span>
																	<Button
																		size="small"
																		variant="outlined"
																		startIcon={<NotificationsIcon />}
																		sx={{
																			borderColor: "#e0e0e0",
																			color: isNotifiedToday ? "green" : "text.secondary",
																			backgroundColor: isNotifiedToday ? "#ccffcc" : "white",
																			"&:hover": {
																				backgroundColor: isNotifiedToday ? "#ccffcc" : "#f5f5f5",
																			},
																		}}
																		onClick={() => sendNotification(invoice.id, invoice.user.id, invoice.status)}
																		disabled={isDisabled}>
																		{loadingInvoiceId === invoice.id ? <CircularProgress size={18} sx={{ color: "#999" }} /> : isNotifiedToday ? "Notified" : "Notify"}
																	</Button>
																</span>
															</Tooltip>
														</TableCell>
													)}
												</TableRow>
											);
										})
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
								<Button key={index} variant={currentPage === index + 1 ? "contained" : "outlined"} sx={currentPage === index + 1 ? { bgcolor: colors.primary } : {}} onClick={() => setCurrentPage(index + 1)}>
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
			<Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
				<Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
					{snackbar.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default InvoiceManagement;
