import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { Button, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PrintIcon from "@mui/icons-material/Print";
import { ArrowDownIcon, ArrowUpIcon, Bell, Building2, FileText, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime); // Enable relative time formatting

const notificationsStyle = {
	// marginTop:'1rem',
	backgroundColor: "#FFFFFF",
	borderRadius: "1rem",
	boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
	border: "1px solid #E5E7EB",
	height: "30rem",
	width: "21rem",
	padding: "1rem",
	marginLeft: "1rem",
};

const CompanyDashboard = () => {
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState({});
	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		const getData = async () => {
			await axios.get(import.meta.env.VITE_BASE_API + "company/dashboard", { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}`, "Content-Type": "application/json" } }).then((res) => {
				console.log(res.data);
				setData(res.data);
			});
			setIsLoading(false);
		};
		getData();
	}, []);

	useEffect(() => {
		axios
			.get(import.meta.env.VITE_BASE_API + "notifications", {
				headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}`, "Content-Type": "application/json" },
			})
			.then((response) => {
				setNotifications(response.data);
			});
	}, []);

	return (
		<>
			<TopNavbar />
			<div className="main d-flex">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div style={{ paddingTop: "1rem", backgroundColor: "transparent" }}>
						{/* Header */}
						<div style={{ display: "flex", width: "98%", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
							<Typography variant="h5" style={{ fontWeight: "bold" }}>
								Dashboard
							</Typography>
							<Button style={{ color: "white", backgroundColor: "#0D2B4E" }} onClick={() => navigate("/company/staff/add")}>
								Add Staff
							</Button>
						</div>

						{/* Metric Cards */}
						<div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
							{[
								{ title: "Available Seats", value: data.totalSeats ?? 0, icon: EventSeatIcon, color: "#0D2B4E" },
								{ title: "Occupied Seats", value: data.occupiedSeats ?? 0, icon: PeopleIcon, color: "#0D2B4E" },
								{ title: "Booking", value: data.remainingBookings ?? 0, icon: AssignmentIcon, color: "#0D2B4E" },
								{ title: "Printing Papers", value: data.remainingPrinting ?? 0, icon: PrintIcon, color: "#0D2B4E" },
							].map((item, index) => (
								<div key={index} style={{ flex: 1, margin: "0 10px" }}>
									<Card style={{ boxShadow: "none", border: "1px solid #ccc", borderRadius: "8px", height: "100%", backgroundColor: "white" }}>
										<CardContent>
											<Typography variant="body2" color="text.secondary" gutterBottom>
												{item.title}
											</Typography>
											<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
												<Typography variant="h5" style={{ fontWeight: "bold" }}>
													{item.value}
												</Typography>
												<div style={{ backgroundColor: item.color, borderRadius: "8px", padding: "0.5rem" }}>
													<item.icon style={{ color: "#fff", width: "40px", height: "40px" }} />
												</div>
											</div>
										</CardContent>
									</Card>
								</div>
							))}
						</div>
						<div style={{ display: "flex", marginBottom: "1rem" }}>
							{/* Booking Table */}
							<TableContainer component={Paper} style={{ width: "65%", backgroundColor: "#FFFFFF", borderRadius: "1rem", boxShadow: "none", border: "1px solid #ccc", marginBottom: "24px" }}>
								<Table>
									<TableHead style={{ backgroundColor: "#C5D9F0" }}>
										<TableRow>
											<TableCell style={{ color: "black", fontWeight: "700" }}>Booking ID</TableCell>
											<TableCell style={{ color: "black", fontWeight: "700" }}>Floor</TableCell>
											<TableCell style={{ color: "black", fontWeight: "700" }}>Room Name</TableCell>
											<TableCell style={{ color: "black", fontWeight: "700" }}>Name</TableCell>
											<TableCell style={{ color: "black", fontWeight: "700" }}>Date</TableCell>
											<TableCell style={{ color: "black", fontWeight: "700" }}>Start Time</TableCell>
											<TableCell style={{ color: "black", fontWeight: "700" }}>End Time</TableCell>
											<TableCell style={{ color: "black", fontWeight: "700" }}>Status</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{data.bookingSchedules &&
											data.bookingSchedules.length > 0 &&
											data.bookingSchedules.map((row, index) => (
												<TableRow key={index}>
													<TableCell>#{row.event_id}</TableCell>
													<TableCell>{row.floor.name}</TableCell>
													<TableCell>{row.room.name}</TableCell>
													<TableCell>{row.user.name}</TableCell>
													<TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
													<TableCell>{new Date(row.startTime).toLocaleTimeString()}</TableCell>
													<TableCell>{new Date(row.endTime).toLocaleTimeString()}</TableCell>
													<TableCell>
														<span className={`status ${row.status.toLowerCase()}`}>{row.status}</span>
													</TableCell>
												</TableRow>
											))}
									</TableBody>
								</Table>
							</TableContainer>

							{/* Notifications Section */}
							<div style={notificationsStyle}>
								<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
									<h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#111827" }}>Notifications</h2>
									<div style={{ backgroundColor: "#0A2156", padding: "0.5rem", borderRadius: "0.375rem" }}>
										<Bell style={{ width: "1.25rem", height: "1.25rem", color: "white" }} />
									</div>
								</div>
								<div style={{ marginTop: "0.5rem" }}>
									{notifications.length > 0 &&
										notifications.map((notification, i) => (
											<div key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.5rem" }}>
												<div style={{ marginTop: "0.05rem" }}>
													<FileText style={{ width: "1.25rem", height: "1.25rem", color: "#0A2156" }} />
												</div>
												<div style={{ flex: 1, minWidth: 0 }}>
													<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
														<span style={{ fontWeight: "500", fontSize: "0.875rem", color: "#111827" }}>{notification.title}</span>
														<span style={{ fontSize: "0.75rem", color: "#6B7280", whiteSpace: "nowrap", marginLeft: "0.5rem" }}>{dayjs(notification.created_at).fromNow()}</span>
													</div>
													<p style={{ fontSize: "0.875rem", color: "#4B5563", marginTop: "0.25rem", lineHeight: "1.25" }}>{notification.message}</p>
												</div>
											</div>
										))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default CompanyDashboard;
