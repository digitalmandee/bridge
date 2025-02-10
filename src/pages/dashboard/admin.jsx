import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { ArrowDownIcon, ArrowUpIcon, Bell, Building2, FileText, Building } from "lucide-react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import axiosInstance from "@/utils/axiosInstance";
import colors from "@/assets/styles/color";
import { useNavigate } from "react-router-dom";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
	const navigate = useNavigate();
	const [notifications, setNotifications] = useState([]);
	const [unreadNotifications, setUnreadNotifications] = useState(0);

	const chartData = {
		labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
		datasets: [
			{
				label: "Revenue",
				data: [40000, 32000, 35000, 45000, 35000, 45000, 35000, 30000],
				backgroundColor: "#1E40AF",
				barThickness: 15,
			},
			{
				label: "Membership Revenue",
				data: [35000, 30000, 28000, 35000, 28000, 30000, 35000, 32000],
				backgroundColor: "#93C5FD",
				barThickness: 15,
			},
		],
	};

	const chartOptions = {
		responsive: true,
		scales: {
			y: {
				beginAtZero: true,
				max: 50000,
				ticks: {
					stepSize: 10000,
				},
				grid: {
					drawBorder: false,
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
				position: "top",
				align: "start",
				labels: {
					boxWidth: 12,
					usePointStyle: true,
					pointStyle: "circle",
				},
			},
		},
	};

	const metrics = [
		{ label: "Total Revenue", value: "100,000", unit: "Pkr", change: 2.5, increase: true },
		{ label: "Members Revenue", value: "90,000", unit: "Pkr", change: 5, increase: false },
		{ label: "On off Revenue", value: "0.00", unit: "Pkr", change: 2.5, increase: true },
		{ label: "Desk Occupancy", value: "20", unit: "%", change: 5, increase: false },
		{ label: "Occupied Desk Rate", value: "20,000", unit: "Pkr", change: 21.5, increase: true },
		{ label: "Members Revenue", value: "30,000", unit: "Pkr", change: 5, increase: false },
	];

	const stats = [
		{ label: "Customer", new: { value: 35, change: 90.5 }, lost: { value: 0, change: 0.0 } },
		{ label: "Member", new: { value: 70, change: 100 }, lost: { value: 0, change: 0.0 } },
		{ label: "Invoice", paid: { value: 30, change: 90.5 }, overdue: { value: 4, change: 16.75 } },
		{ label: "Booking", new: { value: 2, change: 84.5 }, lost: { value: 0, change: 0.0 } },
	];

	const containerStyle = {
		// padding: '1.5rem',
		backgroundColor: "transparent",
		minHeight: "100vh",
		marginLeft: "0px",
	};

	const cardStyle = {
		backgroundColor: "#FFFFFF",
		borderRadius: "0.2rem",
		padding: "1rem",
		boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
		border: "1px solid #E5E7EB",
	};

	const metricsGridStyle = {
		display: "grid",
		gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
		gap: "0.5rem",
	};

	const analyticsStyle = {
		marginTop: "1rem",
		height: "30rem",
		width: "45rem",
		backgroundColor: "#FFFFFF",
		borderRadius: "0.2rem",
		boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
		border: "1px solid #E5E7EB",
	};

	const notificationsStyle = {
		marginTop: "1rem",
		backgroundColor: "#FFFFFF",
		borderRadius: "0.2rem",
		boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
		border: "1px solid #E5E7EB",
		height: "30rem",
		width: "21rem",
		padding: "1.5rem",
	};

	const statsGridStyle = {
		marginTop: "1rem",
		display: "grid",
		gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
		gap: "1rem",
	};

	const getNotifications = async () => {
		try {
			const res = await axiosInstance.get(import.meta.env.VITE_BASE_API + "notifications?limit=4");

			setNotifications(res.data.notifications);
			setUnreadNotifications(res.data.unread);
		} catch (error) {
			console.error("Error fetching notifications:", error.response.data);
		}
	};

	useEffect(() => {
		getNotifications();
	}, []);

	return (
		<>
			<TopNavbar />
			<div className="main">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div style={containerStyle}>
						{/* Metrics */}
						<div style={metricsGridStyle}>
							{metrics.map((metric, i) => (
								<div key={i} style={cardStyle}>
									<div style={{ display: "flex", flexDirection: "column" }}>
										<div style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "0.25rem" }}>{metric.label}</div>
										<div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
											<span style={{ fontSize: "1.5rem", fontWeight: "600", color: "#111827" }}>{metric.value}</span>
											<span style={{ fontSize: "0.875rem", color: "#6B7280" }}>{metric.unit}</span>
										</div>
										<div style={{ display: "flex", alignItems: "center", marginTop: "1rem", fontSize: "0.875rem", color: metric.increase ? "#16A34A" : "#DC2626" }}>
											{metric.increase ? <ArrowUpIcon style={{ width: "0.75rem", height: "0.75rem", marginRight: "0.25rem" }} /> : <ArrowDownIcon style={{ width: "0.75rem", height: "0.75rem", marginRight: "0.25rem" }} />}
											<span>{metric.change}%</span>
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Analytics and Notifications */}
						<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
							<div style={analyticsStyle}>
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

							<div style={notificationsStyle}>
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
									<h2 onClick={() => navigate("/branch/notifications")} style={{ cursor: "pointer", fontSize: "1.125rem", fontWeight: "600", color: "#111827" }}>
										Notifications
									</h2>
									<div style={{ position: "relative", backgroundColor: "#0A2156", padding: "0.5rem", borderRadius: "0.375rem" }}>
										<Bell style={{ width: "1.25rem", height: "1.25rem", color: "white" }} />
										<span style={{ position: "absolute", top: "4px", right: "4px", backgroundColor: "white", padding: "1px 5px", borderRadius: "50%", fontSize: "9px", color: colors.primary, marginLeft: "0.25rem" }}>{unreadNotifications >= 100 ? "99+" : unreadNotifications}</span>
										<sup> </sup>
									</div>
								</div>
								<div style={{ marginTop: "0.5rem" }}>
									{notifications.length > 0 ? (
										notifications.map((notification, i) => (
											<div key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.5rem" }}>
												<div style={{ marginTop: "0.05rem" }}>
													<FileText style={{ width: "1.25rem", height: "1.25rem", color: "#0A2156" }} />
												</div>
												<div style={{ flex: 1, minWidth: 0 }}>
													<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
														<span style={{ fontWeight: "500", fontSize: "0.875rem", color: "#111827" }}>{notification.title}</span>
														<span style={{ fontSize: "0.75rem", color: "#6B7280", whiteSpace: "nowrap", marginLeft: "0.5rem" }}>{notification.created_at}</span>
													</div>
													<p style={{ fontSize: "0.875rem", color: "#4B5563", marginTop: "0.25rem", lineHeight: "1.25" }}>{notification.message}</p>
												</div>
											</div>
										))
									) : (
										<p style={{ color: "#6B7280", fontSize: "0.875rem", textAlign: "center" }}>No notifications</p>
									)}
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
				</div>
			</div>
		</>
	);
};

export default AdminDashboard;
