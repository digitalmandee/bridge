import { useEffect, useState, useContext } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import axiosInstance from "@/utils/axiosInstance";
import DashboardNotifications from "@/components/notifications";
import { SidebarContext } from "../../contexts/sidebar.context";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// added code finance
import { Box, MenuItem, Select, InputLabel, FormControl, TextField } from "@mui/material";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
// added code finance

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = ({ isSidebarOpen }) => {
	const context = useContext(SidebarContext);
	const navigate = useNavigate();
	const { branch } = useParams();

	const [daySeats, setDaySeats] = useState(0);
	const [nightSeats, setNightSeats] = useState(0);
	const [fullSeats, setFullSeats] = useState(0);
	const [totalSeats, setTotalSeats] = useState(0);
	// Mocked 12 months of revenue
	const [revenue, setRevenue] = useState([]);

	const [membershipRevenue, setMembershipRevenue] = useState([]);
	const [analyticsYear, setAnalyticsYear] = useState(new Date().getFullYear());
	const [labels, setLabels] = useState([]);
	// added code finance

	const [stats1, setStats1] = useState(0);

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
				setStats1(res.data);
				setRevenue(res.data.revenue);
				setMembershipRevenue(res.data.bookings);
				setLabels(res.data.labels);
				setDaySeats(res.data.day_seats);
				setNightSeats(res.data.night_seats);
				setFullSeats(res.data.fullday_seats);
				setTotalSeats(res.data.total_seats);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getStats();
	}, [fromDate, toDate]);

	const chartData = {
		labels: labels,
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
				borderColor: "#fff",
				borderWidth: 2,
			},
		],
	};

	const seatsChartOptions = {
		responsive: true,
		plugins: {
			legend: { position: "top" },
			title: {
				display: true,
				text: "Seats Booking Distribution",
			},
		},
	};

	const stats = [
		{ label: "Customer", new: { value: stats1?.customer?.new, change: 0 }, lost: { value: stats1?.customer?.lost, change: 0.0 } },
		{ label: "Invoice", paid: { value: stats1?.invoice?.paid, change: 0 }, overdue: { value: stats1?.invoice?.overdue, change: 0 } },
		{ label: "Booking", new: { value: stats1?.booking?.new, change: 0 }, lost: { value: stats1?.booking?.lost, change: 0.0 } },
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
	return (
		<>
			<TopNavbar />
			<div className="main">
				<div className={`sideBarWrapper ${context.isToggleSidebar === true ? "toggle" : ""}`}>
					<Sidebar />
				</div>

				<div className={`content ${context.isToggleSidebar === true ? "toggle" : ""}`}>
					<div style={containerStyle}>
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
									width: isSidebarOpen ? "45rem" : "100%",
									backgroundColor: "#FFFFFF",
									borderRadius: "0.2rem",
									boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
									border: "1px solid #E5E7EB",
								}}>
								<div style={{ padding: "1rem" }}>
									<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
										<h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827" }}>Analytics</h2>
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
										<Pie data={chartDataSeats} options={seatsChartOptions} />
									</div>
								</div>
							</div>
						</div>
						{/* Stats */}
						<div style={statsGridStyle}>
							{stats.map((stat, i) => (
								<div key={i} style={cardStyle}>
									<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
										<h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827" }}>{stat.label}</h3>
										{stat.label === "Customer" && <CalendarMonthIcon onClick={() => navigate("/" + branch + "/branch/customer/dashboard")} style={{ cursor: "pointer", color: "#2563EB" }} titleAccess="Go to Customer Dashboard" />}
									</div>

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
				</div>
			</div>
		</>
	);
};

export default AdminDashboard;
