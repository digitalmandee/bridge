import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Select, MenuItem, Card, CardContent, CircularProgress, Menu, FormControl } from "@mui/material";
import { Search as SearchIcon, FilterAlt as FilterIcon, Download as DownloadIcon, Notifications as NotificationsIcon, Wallet as WalletIcon, Assignment as AssignmentIcon, Timeline as TimelineIcon, Group as GroupIcon } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import colors from "@/assets/styles/color";

const InvoiceDashboard = () => {
	const navigate = useNavigate();
	const { branch } = useParams();

	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");

	const [invoices, setInvoices] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
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

	const [anchorEl, setAnchorEl] = useState(null);

	const handleOpenFilter = (event) => {
		setAnchorEl(event.currentTarget); // anchor to the clicked button
	};

	const handleCloseFilter = () => {
		setAnchorEl(null); // close the menu
	};

	const stats = [
		{ title: "Invoices", value: dashboardStats.totalInvoices, icon: <AssignmentIcon /> },
		{ title: "Paid", value: dashboardStats.totalPaid, icon: <WalletIcon /> },
		{ title: "Overdue", value: dashboardStats.totalOverdue, icon: <TimelineIcon /> },
		{ title: "Payment", value: Number(dashboardStats.totalPayment).toFixed(2), icon: <GroupIcon /> },
	];

	const getDashboardStats = async () => {
		try {
			const res = await axiosInstance.get(`invoices/dashboard`, {
				params: { from_date: fromDate, to_date: toDate },
			});
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

	const downloadCSV = () => {
		if (!invoices.length) return;

		const headers = ["Invoice #", "Type", "Client Name", "Client Email", "Issue Date", "Payment Date", "Status", "Amount"];

		const rows = invoices.map((invoice) => [`#BRIDGE-${invoice.id}`, invoice.user.type, invoice.user.name, invoice.user.email, new Date(invoice.created_at).toISOString().split("T")[0], invoice.due_date, invoice.status, `Rs. ${invoice.amount}`]);

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

	const getInvoices = async (page = 1) => {
		setIsLoading(true);
		try {
			console.log("Fetching invoices with:", { page, limit, search: searchQuery, status: statusFilter, from_date: fromDate, to_date: toDate });
			
			const params = {
				page,
				limit,
				search: searchQuery,
				status: statusFilter,
			};

			if (fromDate) params.from_date = fromDate;
			if (toDate) params.to_date = toDate;

			const res = await axiosInstance.get(`invoices`, { params });
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
		const delayDebounce = setTimeout(() => {
			getInvoices(currentPage);
			getDashboardStats();
		}, 500);
		return () => clearTimeout(delayDebounce);
	}, [searchQuery, statusFilter,currentPage, limit, fromDate, toDate]);

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
									<Button variant="outlined" startIcon={<DownloadIcon />} sx={{ borderColor: "#e0e0e0", color: "text.secondary" }} onClick={downloadCSV}>
										CSV
									</Button>
									<FormControl>
										<TextField label="From Date" type="date" size="small" value={fromDate} onChange={(e) => setFromDate(e.target.value)} InputLabelProps={{ shrink: true }} />
									</FormControl>

									<FormControl>
										<TextField label="To Date" type="date" size="small" value={toDate} onChange={(e) => setToDate(e.target.value)} InputLabelProps={{ shrink: true }} />
									</FormControl>

									<Button
										variant="outlined"
										color="secondary"
										onClick={() => {
											setFromDate("");
											setToDate("");
										}}>
										Clear
									</Button>

									<Button variant="contained" sx={{ bgcolor: colors.primary, "&:hover": { bgcolor: colors.primary } }} onClick={() => navigate(`/${branch}/branch/invoice/create`)}>
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
												<Avatar sx={{ bgcolor: colors.primary }}>{stat.icon}</Avatar>
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
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										InputProps={{
											startAdornment: <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />,
										}}
										sx={{ minWidth: 300 }}
									/>
									<Button variant="outlined" startIcon={<FilterIcon />} sx={{ borderColor: "#e0e0e0", color: "text.secondary" }} onClick={handleOpenFilter}>
										Filter
									</Button>

									<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseFilter}>
										{["", "Pending", "Paid", "Overdue"].map((status) => (
											<MenuItem
												key={status}
												onClick={() => {
													setStatusFilter(status);
													handleCloseFilter();
												}}>
												{status === "" ? "All" : status}
											</MenuItem>
										))}
									</Menu>
								</Box>
							</div>
						</div>

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
											<TableCell>Type</TableCell>
											<TableCell>Clients</TableCell>
											<TableCell>Issue date</TableCell>
											<TableCell>Payment Date</TableCell>
											<TableCell>Status</TableCell>
											<TableCell>Amount</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{invoices.length > 0 ? (
											invoices.map((invoice) => (
												<TableRow key={invoice.id}>
													<TableCell>#BRIDGE-{invoice.id}</TableCell>
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
																bgcolor: invoice.status === "paid" ? "#FFCC16" : invoice.status === "overdue" ? "#E53935" : colors.primary,
																color: "white",
															}}
															disabled={invoice.status === "paid" || invoice.status === "overdue"}>
															{invoice.status}
														</Button>
													</TableCell>
													<TableCell>Rs. {invoice.amount}</TableCell>
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
		</>
	);
};

export default InvoiceDashboard;
