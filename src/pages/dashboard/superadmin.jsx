import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/superadmin/topNavbar";
import Sidebar from "@/components/superadmin/leftSideBar";
import colors from "@/assets/styles/color";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Box, InputLabel, FormControl, TextField, Button, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const SuperAdminDashboard = () => {
	const navigate = useNavigate();
	const [selectedBranch, setSelectedBranch] = useState("");
	const [branches, setBranches] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState(null);

	const [daySeats, setDaySeats] = useState(0);
	const [nightSeats, setNightSeats] = useState(0);
	const [fullSeats, setFullSeats] = useState(0);
	const [totalSeats, setTotalSeats] = useState(0);

	// const navigate = useNavigate();

	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	// Mocked 12 months of revenue
	const [revenue, setRevenue] = useState([]);

	const [membershipRevenue, setMembershipRevenue] = useState([]);

	const chartData = {
		labels: months,
		datasets: [
			{
				label: "Revenue",
				data: revenue,
				backgroundColor: "#FFF0BA",
				barThickness: 15,
			},
			{
				label: "Membership (Bookings)",
				data: membershipRevenue,
				backgroundColor: "#FFCC16",
				barThickness: 15,
			},
		],
	};

	const chartOptions = {
		responsive: true,
		scales: {
			y: {
				beginAtZero: true,
				max: Math.max([...revenue, ...membershipRevenue]) + 5000,
				grid: { drawBorder: false },
			},
			x: { grid: { display: false } },
		},
		plugins: {
			legend: {
				position: "top",
				align: "start",
				labels: { boxWidth: 12, usePointStyle: true, pointStyle: "circle" },
			},
		},
	};

	const chartDataSeats = {
		labels: ["Day seats", "Night seats", "Full day seats", "Total seats"],
		datasets: [
			{
				label: "Seats Booked",
				data: [daySeats, nightSeats, fullSeats, totalSeats],
				backgroundColor: ["#60A5FA", "#34D399", "#FBB6CE", "#FACC15"],
			},
		],
	};

	const seatsChartOptions = {
		responsive: true,
		plugins: {
			legend: { position: "top" },
			title: { display: true, text: "Seats Booking Distribution" },
		},
	};

	const stats = [
		{ label: "Customer", new: { value: 0, change: 90.5 }, lost: { value: 0, change: 0.0 } },
		{ label: "Invoice", paid: { value: 0, change: 90.5 }, overdue: { value: 0, change: 16.75 } },
		{ label: "Booking", new: { value: 0, change: 84.5 }, lost: { value: 0, change: 0.0 } },
	];

	const containerStyle = {
		// padding: '1.5rem',
		backgroundColor: "transparent",
		minHeight: "100vh",
		width: "100%",
		transition: "all 0.3s ease-in-out",
		marginLeft: "0px",
	};

	const cardStyle = {
		backgroundColor: "#FFFFFF",
		width: "100%",
		borderRadius: "0.2rem",
		padding: "1rem",
		boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
		border: "1px solid #E5E7EB",
	};

	const metricsGridStyle = {
		width: "100%",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "flex-start",
		// gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
		gap: "2rem",
	};

	const columnStyle = {
		display: "flex",
		flexDirection: "column",
		width: "50%", // Each section takes half the width
	};

	const statsGridStyle = {
		marginTop: "1rem",
		display: "grid",
		gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
		gap: "1rem",
	};
	// added code finance

	const [stats1, setStats1] = useState(0);
	const [selectedDate, setSelectedDate] = useState("");

	const handleDateChange = (event) => {
		setSelectedDate(event.target.value);
	};

	// State for Month and Year
	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year

	const getBranches = async () => {
		await axiosInstance.get("/dashboard/branches").then((res) => {
			if (res.data.success) {
				setBranches(res.data.branches);
				if (res.data.branches.length > 0) {
					setSelectedBranch(res.data.branches[0].id);
				}
			}
		});
	};

	const getStats = async (month = selectedMonth, year = selectedYear, date = selectedDate) => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get(`/dashboard/branch/stats?branch=${selectedBranch}`, {
				params: {
					month,
					year,
					date, // pass this if it's not ''
				},
			});
			setRevenue(res.data.revenue);
			setMembershipRevenue(res.data.bookings);
			setStats1(res.data);
			setDaySeats(res.data.day_seats);
			setNightSeats(res.data.night_seats);
			setFullSeats(res.data.full_seats);
			setTotalSeats(res.data.total_seats);
			setData(res.data);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getBranches();
	}, []);

	useEffect(() => {
		if (selectedBranch) {
			getStats();
		}
	}, [selectedBranch, selectedMonth, selectedYear, selectedDate]);

	const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	const handleMonthChange = (event) => {
		setSelectedMonth(event.target.value);
	};

	const handleYearChange = (event) => {
		setSelectedYear(event.target.value);
	};

	return (
		<>
			<TopNavbar />
			<div className="main d-flex">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<Box sx={{ p: 1 }}>
						{/* Back to Dashboard Header */}
						<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
							<Button
								// startIcon={<ArrowBackIcon />}
								sx={{
									font: "Nunito Sans",
									color: "#202224",
									fontWeight: "600",
									fontSize: "28px",
									textTransform: "none",
									pl: 0,
								}}>
								Dashboard
							</Button>
							{/* Action Buttons */}
							<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
								<Box></Box> {/* Empty box for spacing */}
								<Box sx={{ display: "flex", gap: 2 }}>
									<Button
										variant="outlined"
										sx={{
											backgroundColor: "background.paper",
											color: "text.primary",
											borderColor: "divider",
											borderRadius: "4px",
											textTransform: "none",
										}}>
										View Report
									</Button>
									<Select
										value={selectedBranch}
										size="small"
										sx={{
											bgcolor: "background.paper",
											minWidth: 120,
											height: "36px",
											borderRadius: "4px",
										}}
										onChange={(e) => setSelectedBranch(e.target.value)}>
										{branches.length > 0 &&
											branches.map((item) => (
												<MenuItem key={item.id} value={item.id}>
													{item.name}
												</MenuItem>
											))}
									</Select>
									<Button
										variant="contained"
										sx={{
											bgcolor: colors.primary,
											"&:hover": { bgcolor: colors.primary },
											borderRadius: "4px",
											textTransform: "none",
										}}
										onClick={() => navigate("/super-admin/branch/create")}>
										Add New Branch
									</Button>
								</Box>
							</Box>
						</Box>

						{/* Dashboard Stats */}
						{isLoading}
						{!isLoading ? (
							<>
								<div style={containerStyle}>
									<Box sx={{ display: "flex", justifyContent: "end", alignItems: "center", pt: 1 }}>
										{/* Month and Year Selection */}
										<Box sx={{ display: "flex", gap: 2 }}>
											<FormControl>
												<TextField label="Select Date" type="date" InputLabelProps={{ shrink: true }} size="small" value={selectedDate} onChange={handleDateChange} />
											</FormControl>
											<FormControl>
												<InputLabel>Month</InputLabel>
												<Select value={selectedMonth} onChange={handleMonthChange} label="Month" size="small">
													<MenuItem value={0}>All Months</MenuItem> {/* Added option for All Months */}
													{monthNames.map((month, index) => (
														<MenuItem key={index} value={index + 1}>
															{month}
														</MenuItem>
													))}
												</Select>
											</FormControl>
											<FormControl>
												<InputLabel>Year</InputLabel>
												<Select value={selectedYear} onChange={handleYearChange} label="Year" size="small">
													{Array.from({ length: 5 }, (_, index) => (
														<MenuItem key={index} value={new Date().getFullYear() - index}>
															{new Date().getFullYear() - index}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</Box>
									</Box>
									{/* Metrics */}

									<div style={metricsGridStyle}>
										{/* Revenue Section */}
										<div style={columnStyle}>
											<h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem" }}>Revenue</h3>
											<div style={{ display: "flex", gap: "0.5rem" }}>
												{[
													{ label: "Total Revenue", value: stats1.total_revenue, unit: "Pkr", change: stats1?.growth?.total_revenue, increase: true },
													{ label: "Total Expense", value: stats1.total_expense, unit: "Pkr", change: stats1?.growth?.total_expense, increase: false },
													{ label: "Total PNL", value: stats1.total_pl, unit: "Pkr", change: stats1?.growth?.total_pl, increase: true },
													{ label: "Total Seats", value: stats1.total_chairs },
													{ label: "Occupied Seats", value: stats1.booked_chairs },
													{ label: "Occupancy %", value: ((stats1.booked_chairs / stats1.total_chairs) * 100).toFixed(2) },
													{ label: "Available Seats", value: stats1.available_chairs },
													{ label: "Total Members", value: stats1.total_members },
												]
													.slice(0, 3)
													.map((metric, i) => (
														<div key={i} style={cardStyle}>
															<div style={{ display: "flex", flexDirection: "column" }}>
																<div style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "0.25rem" }}>{metric.label}</div>
																<div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
																	<span style={{ fontSize: "1.5rem", fontWeight: "600", color: "#111827" }}>{metric.value}</span>
																	<span style={{ fontSize: "0.875rem", color: "#6B7280" }}>{metric.unit}</span>
																</div>
																<div style={{ display: "flex", alignItems: "center", marginTop: "1rem", fontSize: "0.875rem", color: parseFloat(metric.change) >= 0 ? "#16A34A" : "#DC2626" }}>
																	{/* {stats1?.growth?.total_pl >= 0 ? "↑" : "↓"} */}
																	{parseFloat(metric.change) >= 0 ? "↑" : "↓"}
																	<span>{metric.change}%</span>
																</div>
															</div>
														</div>
													))}
											</div>
										</div>
										{/* Occupancy Section */}
										<div style={columnStyle}>
											<h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem" }}>Occupancy</h3>
											<div style={{ display: "flex", gap: "0.5rem" }}>
												{[
													{ label: "Total Revenue", value: stats1.total_revenue, unit: "Pkr", change: stats1?.growth?.total_revenue, increase: true },
													{ label: "Total Expense", value: stats1.total_expense, unit: "Pkr", change: stats1?.growth?.total_expense, increase: false },
													{ label: "Total PNL", value: stats1.total_pl, unit: "Pkr", change: stats1?.growth?.total_pl, increase: true },
													{ label: "Total Seats", value: stats1.total_chairs },
													// { label: "Occupied Seats", value: stats1.booked_chairs },
													{ label: "Occupancy Seats %", value: ((stats1.booked_chairs / stats1.total_chairs) * 100).toFixed(2) },
													{ label: "Available Seats", value: stats1.available_chairs },
													{ label: "Total Members", value: stats1.total_members },
												]
													.slice(3, 7)
													.map((metric, i) => (
														<div key={i} style={cardStyle}>
															<div style={{ display: "flex", flexDirection: "column" }}>
																<div style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "0.25rem" }}>{metric.label}</div>
																<div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
																	<span style={{ fontSize: "1.5rem", fontWeight: "600", color: "#111827" }}>{metric.value}</span>
																</div>
															</div>
														</div>
													))}
											</div>
										</div>
									</div>
									{/* Analytics and Notifications */}
									<div
										style={{
											display: "grid",
											gridTemplateColumns: "minmax(600px, 1fr) auto",
											// gridTemplateColumns: isSidebarOpen ? "minmax(500px, 1fr) 21rem" : "2fr 1fr",
											gap: "0.5rem",
											width: "100%",
											transition: "grid-template-columns 0.3s ease-in-out",
										}}>
										<div
											style={{
												marginTop: "1rem",
												height: "30rem",
												// width: '45rem',
												transition: "width 0.3s ease-in-out",
												width: "45rem",
												backgroundColor: "#FFFFFF",
												borderRadius: "0.2rem",
												boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
												border: "1px solid #E5E7EB",
											}}>
											<div style={{ padding: "1rem" }}>
												<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
													<h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827" }}>Analytics</h2>
													<select style={{ fontSize: "0.875rem", border: "1px solid #D1D5DB", borderRadius: "1rem", padding: "0.25rem 0.5rem", backgroundColor: "white" }}>
														<option>Dec</option>
													</select>
												</div>
												<div style={{ height: "400px" }}>
													<Bar data={chartData} options={chartOptions} />
												</div>
											</div>
										</div>

										{/* Second graph - Booked seats */}
										<div
											style={{
												marginTop: "1rem",
												height: "30rem",
												backgroundColor: "#FFFFFF",
												borderRadius: "0.2rem",
												boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
												border: "1px solid #E5E7EB",
											}}>
											<div style={{ padding: "1rem" }}>
												<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
													<h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827" }}>Seats Booked</h2>
												</div>
												<div style={{ height: "400px" }}>
													<Bar data={chartDataSeats} options={seatsChartOptions} />
												</div>
											</div>
										</div>
									</div>
									{/* Stats */}
									<div style={statsGridStyle}>
										{stats.map((stat, i) => (
											<div key={i} style={cardStyle}>
												<h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827", marginBottom: "1rem" }}>{stat.label}</h3>
												<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
													{"new" in stat && (
														<>
															<div>
																<div style={{ fontSize: "0.875rem", color: "#6B7280" }}>New</div>
																<div style={{ fontSize: "1.5rem", fontWeight: "600", color: "#111827", marginTop: "0.25rem" }}>{stat.new.value}</div>
																<div style={{ fontSize: "0.875rem", color: "#16A34A", display: "flex", alignItems: "center", marginTop: "0.25rem" }}>
																	<ArrowUpIcon style={{ width: "0.75rem", height: "0.75rem", marginRight: "0.25rem" }} />
																	{stat.new.change}%
																</div>
															</div>
															<div>
																<div style={{ fontSize: "0.875rem", color: "#6B7280" }}>Lost</div>
																<div style={{ fontSize: "1.5rem", fontWeight: "600", color: "#111827", marginTop: "0.25rem" }}>{stat.lost.value}</div>
																<div style={{ fontSize: "0.875rem", color: "#DC2626", display: "flex", alignItems: "center", marginTop: "0.25rem" }}>
																	<ArrowDownIcon style={{ width: "0.75rem", height: "0.75rem", marginRight: "0.25rem" }} />
																	{stat.lost.change}%
																</div>
															</div>
														</>
													)}
													{"paid" in stat && (
														<>
															<div>
																<div style={{ fontSize: "0.875rem", color: "#6B7280" }}>Paid</div>
																<div style={{ fontSize: "1.5rem", fontWeight: "600", color: "#111827", marginTop: "0.25rem" }}>{stat.paid.value}</div>
																<div style={{ fontSize: "0.875rem", color: "#16A34A", display: "flex", alignItems: "center", marginTop: "0.25rem" }}>
																	<ArrowUpIcon style={{ width: "0.75rem", height: "0.75rem", marginRight: "0.25rem" }} />
																	{stat.paid.change}%
																</div>
															</div>
															<div>
																<div style={{ fontSize: "0.875rem", color: "#6B7280" }}>Overdue</div>
																<div style={{ fontSize: "1.5rem", fontWeight: "600", color: "#111827", marginTop: "0.25rem" }}>{stat.overdue.value}</div>
																<div style={{ fontSize: "0.875rem", color: "#DC2626", display: "flex", alignItems: "center", marginTop: "0.25rem" }}>
																	<ArrowDownIcon style={{ width: "0.75rem", height: "0.75rem", marginRight: "0.25rem" }} />
																	{stat.overdue.change}%
																</div>
															</div>
														</>
													)}
												</div>
											</div>
										))}
									</div>
								</div>
							</>
						) : (
							""
						)}
					</Box>
				</div>
			</div>
		</>
	);
};

export default SuperAdminDashboard;
