import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Select, MenuItem, Card, CardContent, CircularProgress } from "@mui/material";
import { Search as SearchIcon, FilterAlt as FilterIcon, Download as DownloadIcon, Notifications as NotificationsIcon, Wallet as WalletIcon, Assignment as AssignmentIcon, Timeline as TimelineIcon, Group as GroupIcon } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const InvoiceDashboard = () => {
	const navigate = useNavigate();
	const [month, setMonth] = useState("January");
	const [invoices, setInvoices] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(10);
	const [dashboardStats, setDashboardStats] = useState({
		totalInvoices: 0,
		totalPaid: 0,
		totalOverdue: 0,
		totalPayment: 0,
	});

	const stats = [
		{ title: "Invoices", value: dashboardStats.totalInvoices, icon: <AssignmentIcon /> },
		{ title: "Paid", value: dashboardStats.totalPaid, icon: <WalletIcon /> },
		{ title: "Overdue", value: dashboardStats.totalOverdue, icon: <TimelineIcon /> },
		{ title: "Payment", value: Number(dashboardStats.totalPayment).toFixed(2), icon: <GroupIcon /> },
	];

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

	const getDashboardStats = async () => {
		try {
			const res = await axiosInstance.get(`invoices/dashboard`);
			if (res.data.success) {
				setDashboardStats({
					totalInvoices: res.data.totalInvoices,
					totalPaid: res.data.totalPaid,
					totalOverdue: res.data.totalOverdue,
					totalPayment: res.data.totalPayment,
				});
			}
		} catch (error) {
			console.error("Error fetching dashboard stats:", error);
		}
	};

	useEffect(() => {
		getDashboardStats();
	}, [""]);

	const getInvoices = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get(`invoices?page=${page}&limit=${limit}`);
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
					<div className="container-fluid p-4">
						{/* Header */}
						<div className="row mb-4 align-items-center">
							<div className="col">
								<Box display="flex" alignItems="center" gap={2}>
									<Typography variant="h5">Dashboard</Typography>
								</Box>
							</div>
							<div className="col-auto">
								<Box display="flex" gap={2}>
									<Button variant="outlined" startIcon={<DownloadIcon />} sx={{ borderColor: "#e0e0e0", color: "text.secondary" }}>
										CSV
									</Button>
									<Select value={month} onChange={(e) => setMonth(e.target.value)} size="small" sx={{ minWidth: 120 }}>
										<MenuItem value="January">January</MenuItem>
										{/* Add more months */}
									</Select>
									<Button variant="contained" sx={{ bgcolor: "#0D2b4e", "&:hover": { bgcolor: "#1E293B" } }} onClick={() => navigate("/branch/invoice/create")}>
										Create Invoice
									</Button>
								</Box>
							</div>
						</div>

						{/* Stats Cards */}
						<div className="row mb-4">
							{stats.map((stat, index) => (
								<div key={index} className="col-md-3 mb-3">
									<Card>
										<CardContent>
											<Box display="flex" justifyContent="space-between" alignItems="center">
												<Box>
													<Typography color="text.secondary">{stat.title}</Typography>
													<Typography variant="h4">{stat.value}</Typography>
												</Box>
												<Avatar sx={{ bgcolor: "#0F172A" }}>{stat.icon}</Avatar>
											</Box>
										</CardContent>
									</Card>
								</div>
							))}
						</div>

						{/* Search and Filter */}
						<div className="row mb-4">
							<div className="col">
								<Box display="flex" gap={2}>
									<TextField
										placeholder="Search"
										size="small"
										InputProps={{
											startAdornment: <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />,
										}}
										sx={{ minWidth: 300 }}
									/>
									<Button variant="outlined" startIcon={<FilterIcon />} sx={{ borderColor: "#e0e0e0", color: "text.secondary" }}>
										Filter
									</Button>
								</Box>
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
											<TableCell>Action</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{invoices.length > 0 ? (
											invoices.map((invoice) => (
												<TableRow key={invoice.id}>
													<TableCell>#NASTP-{invoice.id}</TableCell>
													<TableCell style={{ textTransform: "capitalize" }}>{invoice.user.type}</TableCell>
													<TableCell>
														<Box display="flex" alignItems="center" gap={1}>
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

export default InvoiceDashboard;
