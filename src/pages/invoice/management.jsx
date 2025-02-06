import React, { useContext, useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Menu, MenuItem, IconButton, Avatar, Select, CircularProgress } from "@mui/material";
import { MoreVert as MoreVertIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, ArrowBack as ArrowBackIcon, Download as DownloadIcon, Notifications as NotificationsIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../../utils/axiosInstance";
import { AuthContext } from "../../contexts/AuthContext";

const InvoiceManagement = () => {
	const { user } = useContext(AuthContext);

	const navigate = useNavigate();

	const [invoices, setInvoices] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(10);
	const [statusFilter, setStatusFilter] = useState("");

	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedInvoice, setSelectedInvoice] = useState(null);

	const handleMenuClick = (event, invoiceId) => {
		setAnchorEl(event.currentTarget);
		setSelectedInvoice(invoiceId);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setSelectedInvoice(null);
	};

	const getInvoices = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get(`${import.meta.env.VITE_BASE_API}invoices`, {
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
			const res = await axiosInstance.post(`${import.meta.env.VITE_BASE_API}notifications/send`, {
				user_id: userId,
				invoice_id: invoiceId,
				type: "invoice_conformation",
				invoice_status: status,
			});

			if (res.data.success) {
				alert("Notification sent successfully!");
			} else {
				alert("Failed to send notification.");
			}
		} catch (error) {
			console.error("Error sending notification:", error.response.data);
			alert("An error occurred while sending the notification.");
		}
	};

	// Run getInvoices when filter changes
	useEffect(() => {
		getInvoices(currentPage);
	}, [currentPage, limit, statusFilter]);

	useEffect(() => {
		getInvoices(currentPage);
	}, [currentPage, limit]);

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
							{isLoading ? (
								<Box display="flex" justifyContent="center" alignItems="center" p={3}>
									<CircularProgress sx={{ color: "#0F172A" }} />
								</Box>
							) : (
								<Table>
									<TableHead sx={{ bgcolor: "#F8FAFC" }}>
										<TableRow>
											<TableCell>Invoice #</TableCell>
											<TableCell>Type</TableCell>
											<TableCell>Clients</TableCell>
											<TableCell>Issue date</TableCell>
											<TableCell>Payment Date</TableCell>
											<TableCell>Status</TableCell>
											<TableCell>Amount</TableCell>
											{user.type === "admin" && <TableCell>Action</TableCell>}
										</TableRow>
									</TableHead>
									<TableBody>
										{invoices.length > 0 ? (
											invoices.map((invoice) => (
												<TableRow key={invoice.id}>
													<TableCell>{invoice.id}</TableCell>
													<TableCell style={{ textTransform: "capitalize" }}>{invoice.user.type}</TableCell>
													<TableCell>
														<Box display="flex" alignItems="center" gap={1} onClick={() => navigate(`/branch/invoice/customer-detail/${invoice.user.id}`)} sx={{ cursor: "pointer" }}>
															<Avatar sx={{ width: 32, height: 32 }} src={import.meta.env.VITE_ASSET_API + invoice.user.profile_image}></Avatar>
															<Box>
																<Typography variant="body2">{invoice.user.name}</Typography>
																<Typography variant="caption" color="text.secondary">
																	{invoice.user.email}
																</Typography>
															</Box>
														</Box>
													</TableCell>
													<TableCell>{new Date(invoice.created_at).toISOString().split("T")[0]}</TableCell>
													<TableCell>{invoice.due_date}</TableCell>
													<TableCell>
														<Button
															size="small"
															variant="contained"
															sx={{
																bgcolor: invoice.status === "paid" ? "#0F172A" : "#E5E7EB",
																color: invoice.status === "paid" ? "white" : "#6B7280",
																"&:hover": { bgcolor: invoice.status === "paid" ? "#1E293B" : "#D1D5DB" },
															}}>
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
							)}
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
		</>
	);
};

export default InvoiceManagement;
