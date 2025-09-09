import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Button, Card, CardContent, Grid, Table, TableBody, TableCell, IconButton, TableContainer, TableHead, TableRow, Paper, CircularProgress, MenuItem, Select, InputLabel, FormControl, Modal, TextField } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import axiosInstance from "@/utils/axiosInstance";
import CloseIcon from "@mui/icons-material/Close";
import colors from "@/assets/styles/color";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const FinanceDashboard = () => {
	const navigate = useNavigate();
	const { branch } = useParams();

	const [open, setOpen] = React.useState(false);
	const [selectedItem, setSelectedItem] = useState(null);

	const [finances, setFinances] = useState([]);
	const [stats, setStats] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(10);

	const [fromDate, setFromDate] = useState(() => {
		const now = new Date();
		return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]; // 1st of this month
	});
	const [toDate, setToDate] = useState(() => {
		const now = new Date();
		return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0]; // End of this month
	});

	const getStats = async () => {
		try {
			const res = await axiosInstance.get("finance/stats", {
				params: {
					from_date: fromDate,
					to_date: toDate,
				},
			});
			if (res.data.success) {
				setStats(res.data);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const getFinances = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get("finances", {
				params: { page, limit, from_date: fromDate, to_date: toDate },
			});

			if (res.data.success) {
				setFinances(res.data.finances.data);
				setTotalPages(res.data.finances.last_page);
				setCurrentPage(res.data.finances.current_page);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getStats();
		getFinances(currentPage);
	}, [fromDate, toDate, currentPage]);

	const handleDownload = async () => {
		const fileName = selectedItem.receipt;

		try {
			const { data } = await axiosInstance.post("download", { fileName }, { responseType: "blob" });

			const blob = new Blob([data]);
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = fileName;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url); // Clean up blob URL
		} catch (error) {
			console.error("Download failed:", error);
		}
	};

	const downloadFinancialReport = () => {
		if (!finances.length) return;

		const headers = ["Category", "Name", "Description", "Amount", "Issue Date", "Due Date", "Quantity"];
		const rows = finances.map((finance) => [finance.category?.name || "", finance.name, finance.description, `Rs. ${finance.amount}`, finance.issue_date, finance.due_date, finance.quantity]);

		const csvString = [headers, ...rows].map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")).join("\n");

		const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		// Format file name using fromDate and toDate
		const formattedFrom = fromDate.replace(/-/g, "");
		const formattedTo = toDate.replace(/-/g, "");
		a.download = `financial-report-${formattedFrom}-to-${formattedTo}.csv`;
		document.body.appendChild(a);
		a.click();
		a.remove();
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
					<Box sx={{ mt: 1, bgcolor: "#f5f6fa" }}>
						{/* Header */}
						<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
							<Typography variant="h5" sx={{ fontWeight: "bold" }}>
								Dashboard
							</Typography>
							<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
								{/* Month and Year Selection */}
								<Box sx={{ display: "flex", justifyContent: "end", alignItems: "center", pt: 1 }}>
									{/* Month and Year Selection */}
									<Box sx={{ display: "flex", gap: 2 }}>
										<FormControl>
											<TextField label="From Date" type="date" size="small" value={fromDate} onChange={(e) => setFromDate(e.target.value)} InputLabelProps={{ shrink: true }} />
										</FormControl>
										<FormControl>
											<TextField label="To Date" type="date" size="small" value={toDate} onChange={(e) => setToDate(e.target.value)} InputLabelProps={{ shrink: true }} />
										</FormControl>
									</Box>
								</Box>
								<Button variant="outlined" color="primary" onClick={downloadFinancialReport}>
									Financial Report
								</Button>
								<Button variant="contained" sx={{ bgcolor: "#FFCC16" }} onClick={() => navigate(`/${branch}/branch/finance/create`)}>
									Add New Entry
								</Button>
							</Box>
						</Box>

						{/* Metric Cards */}
						<Grid container spacing={2} sx={{ mb: 3 }}>
							{[
								{ title: "Total Revenue", amount: (stats?.total_revenue || 0) + " Rs", change: stats?.growth?.total_revenue, icon: <ShoppingCartIcon />, color: "#ff9800" },
								{ title: "Total Expense", amount: (stats?.total_expense || 0) + " Rs", change: stats?.growth?.total_expense, icon: <ReceiptIcon />, color: "#e91e63" },
								{
									title: "Total P&L",
									amount: (stats?.total_pl || 0) + " Rs",
									change: stats?.growth?.total_pl,
									icon: <AccountBalanceWalletIcon />,
									color: "#f44336",
								},
							].map((item, index) => (
								<Grid item xs={12} sm={6} md={4} key={index}>
									<Card sx={{ bgcolor: "white", boxShadow: "none", borderRadius: 3, border: "1px solid #e0e0e0" }}>
										<CardContent>
											<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
												<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
													<Box
														sx={{
															bgcolor: `${item.color}15`,
															p: 1,
															borderRadius: 1,
															display: "flex",
															alignItems: "center",
														}}>
														{React.cloneElement(item.icon, { sx: { color: item.color } })}
													</Box>
												</Box>
												<IconButton size="small">
													<MoreVertIcon />
												</IconButton>
											</Box>
											<Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
												{item.title}
											</Typography>
											<Typography variant="h6" sx={{ mt: 1, fontWeight: "bold" }}>
												{item.amount}
											</Typography>
											<Typography
												variant="body2"
												sx={{
													color: item.change < 0 ? "error.main" : "success.main",
												}}>
												{item.change}%
											</Typography>
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>

						{/* Table */}
						<TableContainer component={Paper} sx={{ boxShadow: "none", borderRadius: 3, border: "1px solid #e0e0e0" }}>
							<Table>
								<TableHead sx={{ bgcolor: "#C5D9F0" }}>
									<TableRow>
										<TableCell>Categories</TableCell>
										<TableCell>Name</TableCell>
										<TableCell>Description</TableCell>
										<TableCell>Amount</TableCell>
										<TableCell>Issue Date</TableCell>
										<TableCell>Due Date</TableCell>
										<TableCell>Quantity</TableCell>
										<TableCell>Receipt</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{isLoading ? (
										<TableRow>
											<TableCell colSpan={7} align="center">
												<CircularProgress sx={{ color: "#FFCC16" }} />
											</TableCell>
										</TableRow>
									) : finances.length > 0 ? (
										finances.map((row, index) => (
											<TableRow key={index}>
												<TableCell>{row.category.name}</TableCell>
												<TableCell>{row.name}</TableCell>
												<TableCell>{row.description}</TableCell>
												<TableCell>{row.amount}</TableCell>
												<TableCell>{row.issue_date}</TableCell>
												<TableCell>{row.due_date}</TableCell>
												<TableCell>{row.quantity}</TableCell>

												<TableCell>
													{row.receipt ? (
														<Button
															variant="outlined"
															size="small"
															onClick={() => {
																setSelectedItem(row);
																setOpen(true);
															}}>
															View
														</Button>
													) : (
														"N/A"
													)}

													<Modal
														open={open}
														onClose={() => setOpen(false)}
														BackdropProps={{
															sx: {
																backgroundColor: "transparent",
															},
														}}>
														<Box
															sx={{
																position: "absolute",
																top: "50%",
																left: "50%",
																transform: "translate(-50%, -50%)",
																width: 500,
																bgcolor: "background.paper",
																borderRadius: 2,
																boxShadow: 5,
																p: 4,
																maxHeight: "90vh",
																overflowY: "auto",
															}}>
															<IconButton
																onClick={() => setOpen(false)}
																sx={{
																	position: "absolute",
																	top: 8,
																	right: 8,
																	color: "text.primary",
																}}>
																<CloseIcon />
															</IconButton>

															{selectedItem ? (
																<>
																	{selectedItem.receipt && (
																		<Box mt={2}>
																			<Typography variant="body2" gutterBottom>
																				<strong>Receipt:</strong>
																			</Typography>
																			<img
																				src={`${import.meta.env.VITE_ASSET_API}${selectedItem.receipt}`}
																				alt="Receipt"
																				style={{
																					width: "100%",
																					borderRadius: "8px",
																					maxHeight: "300px",
																					objectFit: "contain",
																				}}
																			/>
																		</Box>
																	)}

																	<Box mt={3} display="flex" justifyContent="center">
																		<Button variant="outlined" color="primary" onClick={handleDownload}>
																			Download Receipt
																		</Button>
																	</Box>
																</>
															) : (
																<Typography>Loading...</Typography>
															)}
														</Box>
													</Modal>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={7} align="center">
												No finance found.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>
					</Box>
				</div>
			</div>
		</>
	);
};

export default FinanceDashboard;
