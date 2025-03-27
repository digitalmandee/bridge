import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Button, Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import axiosInstance from "@/utils/axiosInstance";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const FinanceDashboard = () => {
	const navigate = useNavigate();
	const { branch } = useParams();
	const barChartData = {
		labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
		datasets: [
			{
				label: "Dataset 1",
				data: [35000, 28000, 25000, 45000, 40000, 28000, 35000, 28000],
				backgroundColor: "#8DADD2",
				barThickness: 15,
			},
			{
				label: "Dataset 2",
				data: [30000, 25000, 20000, 35000, 32000, 22000, 30000, 25000],
				backgroundColor: "#0D2B4E",
				barThickness: 15,
			},
			{
				label: "Dataset 3",
				data: [25000, 20000, 15000, 30000, 25000, 18000, 25000, 20000],
				backgroundColor: "#7986cb",
				barThickness: 15,
			},
		],
	};

	const barChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			y: {
				beginAtZero: true,
				grid: {
					display: true,
					drawBorder: false,
				},
				ticks: {
					stepSize: 10000,
					callback: (value) => value / 1000 + "K",
				},
			},
			x: {
				grid: {
					display: false,
				},
			},
		},
		plugins: {
			legend: {
				display: false,
			},
		},
	};

	// Donut Chart Data
	const donutChartData = {
		labels: ["Instock", "Out of Stock", "Damage"],
		datasets: [
			{
				data: [28, 12, 6],
				backgroundColor: ["#4285f4", "#fbbc04", "#34a853"],
				borderWidth: 0,
			},
		],
	};

	const donutChartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		cutout: "70%",
		plugins: {
			legend: {
				position: "bottom",
				labels: {
					usePointStyle: true,
				},
			},
		},
	};

	const [finances, setFinances] = useState([]);
	const [stats, setStats] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(10);

	// Get Finance Data

	// const getStats = async () => {
	// 	try {
	// 		const res = await axiosInstance.get("employees/dashboard");

	// 		if (res.data.success) {
	// 			setStats(res.data);
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	const getFinances = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get("finance", {
				params: { page, limit },
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
		getFinances(currentPage);
	}, [currentPage, limit]);

	// useEffect(() => {
	// 	getStats();
	// }, []);
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
							<Box sx={{ display: "flex", gap: 2 }}>
								<Button variant="outlined" color="primary">
									Financial Report
								</Button>
								<Button variant="contained" sx={{ bgcolor: "#0A2647" }} onClick={() => navigate(`/${branch}/branch/finance/create`)}>
									Add New Entry
								</Button>
							</Box>
						</Box>

						{/* Metric Cards */}
						<Grid container spacing={2} sx={{ mb: 3 }}>
							{[
								{ title: "Total Revenue", amount: "632,000kr", change: "+1.29%", icon: <ShoppingCartIcon />, color: "#ff9800" },
								{ title: "Total Expense", amount: "592,000kr", change: "+0.29%", icon: <ReceiptIcon />, color: "#e91e63" },
								{
									title: "Total P&L",
									amount: "238,000kr",
									change: "+1.29%",
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
											<Typography variant="body2" sx={{ color: "success.main" }}>
												{item.change}
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
									</TableRow>
								</TableHead>
								<TableBody>
									{isLoading ? (
										<TableRow>
											<TableCell colSpan={7} align="center">
												<CircularProgress sx={{ color: "#0F172A" }} />
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
