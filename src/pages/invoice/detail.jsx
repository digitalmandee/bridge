import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Select, MenuItem, styled, CircularProgress } from "@mui/material";
import { ArrowBack as ArrowBackIcon, Download as DownloadIcon, FilterAlt as FilterIcon, Notifications as NotificationsIcon } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "@/utils/axiosInstance";

const InvoiceDetail = () => {
	const navigate = useNavigate();

	const { customerId } = useParams(); // Get invoice ID from URL
	const [customer, setCustomer] = useState({});
	const [invoices, setInvoices] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(10);
	const [isLoading, setIsLoading] = useState(true);

	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

	const sendNotification = async (invoiceId, userId, status) => {
		try {
			const res = await axiosInstance.post(`notifications/send`, {
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

	useEffect(() => {
		setIsLoading(true);
		const fetchInvoiceDetail = async () => {
			try {
				const res = await axiosInstance.get(`invoices/customer-detail/${customerId}`, {
					params: {
						page: currentPage,
						limit,
						from_date: fromDate,
						to_date: toDate,
						status: statusFilter === "all" ? "" : statusFilter,
					},
				});

				if (res.data.success) {
					setCustomer(res.data.customer);
					setInvoices(res.data.invoices);
					setTotalPages(res.data.totalPages); // will come from backend
				}
			} catch (error) {
				console.error("Error fetching invoice details:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchInvoiceDetail();
	}, [customerId, currentPage, limit, fromDate, toDate, statusFilter]);

	const downloadCSV = () => {
		if (!invoices.length) return;

		const headers = ["Invoice #", "Type", "Client Name", "Client Email", "Issue Date", "Payment Date", "Status", "Amount"];

		const rows = invoices.map((invoice) => [`#BRIDGE-${invoice.id}`, customer.type, customer.name, customer.email, new Date(invoice.created_at).toISOString().split("T")[0], invoice.due_date, invoice.status, `Rs. ${invoice.amount}`]);

		// Build CSV string
		const csvString = [headers, ...rows].map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")).join("\n");

		// Create Blob and trigger download
		const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", "invoices.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	return (
		<>
			<TopNavbar />
			<div className="main d-flex">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div className="container-fluid p-4">
						{/* Header */}
						<div className="row mb-4 align-items-center">
							<div className="col">
								<Box display="flex" alignItems="center" gap={2}>
									<div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
										<MdArrowBackIos style={{ fontSize: "20px" }} />
									</div>
									<Typography variant="h5">Detail</Typography>
								</Box>
							</div>
							<div className="col-auto">
								<Box display="flex" gap={2}>
									<Box display="flex" gap={2}>
										<Button variant="outlined" startIcon={<DownloadIcon />} sx={{ borderColor: "#e0e0e0", color: "text.secondary" }} onClick={downloadCSV}>
											CSV
										</Button>

										{/* From / To Date */}
										<input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={{ padding: "6px", border: "1px solid #ccc", margin: 0, borderRadius: "6px" }} />
										<input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={{ padding: "6px", border: "1px solid #ccc", margin: 0, borderRadius: "6px" }} />

										{/* Status filter */}
										<Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} size="small" sx={{ minWidth: 120 }}>
											<MenuItem value="all">All</MenuItem>
											<MenuItem value="pending">Pending</MenuItem>
											<MenuItem value="paid">Paid</MenuItem>
											<MenuItem value="overdue">Overdue</MenuItem>
										</Select>

										<Button
											variant="outlined"
											color="secondary"
											onClick={() => {
												setFromDate("");
												setToDate("");
												setStatusFilter("all");
											}}>
											Clear
										</Button>
									</Box>
								</Box>
							</div>
						</div>

						{/* Customer Profile */}
						<Paper sx={{ p: 3, mb: 4 }}>
							<Box display="flex" gap={3} alignItems="center">
								<Avatar src={import.meta.env.VITE_ASSET_API + customer.profile_image} sx={{ width: 80, height: 80 }} />
								<Box display="flex" flexDirection="column" gap={2}>
									<Box display="flex" gap={2}>
										<Typography color="text.secondary" variant="body2" sx={{ width: "40px" }}>
											Name:
										</Typography>
										<Typography variant="body1">{customer.name}</Typography>
									</Box>

									<Box display="flex" gap={2}>
										<Typography color="text.secondary" variant="body2" sx={{ width: "40px" }}>
											Type:
										</Typography>
										<Typography variant="body1" sx={{ textTransform: "capitalize" }}>
											{customer.type}
										</Typography>
									</Box>

									<Box display="flex" gap={2}>
										<Typography color="text.secondary" variant="body2" sx={{ width: "40px" }}>
											Phone:
										</Typography>
										<Typography variant="body1">{customer.phone_no ?? "N/A"}</Typography>
									</Box>

									<Box display="flex" gap={2}>
										<Typography color="text.secondary" variant="body2" sx={{ width: "40px" }}>
											Email:
										</Typography>
										<Typography variant="body1">{customer.email}</Typography>
									</Box>
								</Box>
							</Box>
						</Paper>

						{/* Table */}
						<TableContainer component={Paper} sx={{ boxShadow: "none" }}>
							{isLoading ? (
								<Box display="flex" justifyContent="center" alignItems="center" p={3}>
									<CircularProgress sx={{ color: "#FFCC16" }} />
								</Box>
							) : (
								<Table>
									<TableHead sx={{ bgcolor: "#F8FAFC" }}>
										<TableRow>
											<TableCell>Invoice #</TableCell>
											<TableCell>Issue date</TableCell>
											<TableCell>Payment Date</TableCell>
											<TableCell>Status</TableCell>
											<TableCell>Amount</TableCell>
											<TableCell>Action</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{invoices && invoices.length > 0 ? (
											invoices.map((invoice) => (
												<TableRow key={invoice.id}>
													<TableCell>#BRIDGE-{invoice.id}</TableCell>
													<TableCell>{new Date(invoice.created_at).toISOString().split("T")[0]}</TableCell>
													<TableCell>{invoice.due_date}</TableCell>
													<TableCell>
														<Button
															size="small"
															variant="contained"
															sx={{
																bgcolor: invoice.status === "paid" ? "#FFCC16" : "#E5E7EB",
																color: invoice.status === "paid" ? "white" : "#6B7280",
																"&:hover": { bgcolor: invoice.status === "paid" ? "#FFCC16" : "#D1D5DB" },
															}}>
															{invoice.status}
														</Button>
													</TableCell>
													<TableCell>Rs. {invoice.amount}</TableCell>
													<TableCell>
														<Button size="small" variant="outlined" startIcon={<NotificationsIcon />} sx={{ borderColor: "#e0e0e0", color: "text.secondary" }} onClick={() => sendNotification(invoice.user.id, invoice.user.id, invoice.status)}>
															Notify
														</Button>
													</TableCell>
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
								<Button key={index} variant={currentPage === index + 1 ? "contained" : "outlined"} sx={currentPage === index + 1 ? { bgcolor: "#FFCC16" } : {}} onClick={() => setCurrentPage(index + 1)}>
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

export default InvoiceDetail;
