import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import colors from "@/assets/styles/color";
import { Box, Card, CardContent, Typography, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import GroupsIcon from "@mui/icons-material/Groups";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PaymentsIcon from "@mui/icons-material/Payments";
import { Link } from "react-router-dom";
import axios from "axios";
import { Bell, FileText } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axiosInstance from "../../utils/axiosInstance";

dayjs.extend(relativeTime); // Enable relative time formatting

const UserDashboard = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState([]);
	const [notifications, setNotifications] = useState([]);

	useEffect(() => {
		const getData = async () => {
			await axiosInstance.get(import.meta.env.VITE_BASE_API + "user/dashboard").then((res) => {
				// console.log(res.data);
				setData(res.data);
			});
			setIsLoading(false);
		};
		getData();
	}, []);

	const getNotifications = async () => {
		try {
			const res = await axiosInstance.get(import.meta.env.VITE_BASE_API + "notifications?limit=4");
			setNotifications(res.data);
		} catch (error) {
			console.error("Error fetching notifications:", error.response.data);
		}
	};

	useEffect(() => {
		getNotifications();
	}, []);

	//   const markAsRead = (notificationId) => {
	//     axios.post(import.meta.env.VITE_BASE_API + `notifications/${notificationId}/read`, {}, {
	//         headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
	//     }).then(() => {
	//         setNotifications(notifications.filter(n => n.id !== notificationId)); // Remove from list
	//     })
	//     .catch(error => console.error("Error marking as read:", error));
	// };

	const notificationsStyle = {
		backgroundColor: "#FFFFFF",
		borderRadius: "1rem",
		boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
		border: "1px solid #E5E7EB",
		height: "30rem",
		width: "21rem",
		padding: "1rem",
		marginLeft: "1rem",
	};

	return (
		<>
			<TopNavbar />
			<div className="main d-flex">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div className="right-content">
						<Box
							sx={{
								p: 3,
								// bgcolor: '#F8F9FA'
							}}>
							{/* Header */}
							<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
								<Typography variant="h5" sx={{ fontWeight: "bold" }}>
									Dashboard
								</Typography>
								<Box sx={{ display: "flex", gap: 2 }}>
									<Link to="/user/booking-schedule">
										<Button
											variant="outlined"
											sx={{
												color: "text.primary",
												borderColor: "divider",
												bgcolor: "white",
											}}>
											Create Booking
										</Button>
									</Link>
								</Box>
							</Box>

							{/* Metric Cards */}
							<Grid container spacing={3} sx={{ mb: 3 }}>
								{[
									{ title: "Available Booking", value: data.totalBookings ?? 0, icon: DirectionsCarIcon, color: colors.primary },
									{ title: "Remaing Booking", value: data.remainingbookings ?? 0, icon: GroupsIcon, color: colors.primary },
									{ title: "Available Printing Papers", value: data.totalPrintingPapers ?? 0, icon: AccountBalanceWalletIcon, color: colors.primary },
									{ title: "Available Printing Papers", value: data.remainingPrintingPapers ?? 0, icon: GroupsIcon, color: colors.primary },
									{ title: "Over Due Amount", value: data.overDueAmount ?? 0, icon: PaymentsIcon, color: colors.primary },
								].map((item, index) => (
									<Grid item xs={12} sm={6} md={3} key={index}>
										<Card
											sx={{
												boxShadow: "none",
												border: "1px solid",
												borderColor: "divider",
												borderRadius: "8px",
												height: "100%",
												bgcolor: "white",
											}}>
											<CardContent>
												<Typography variant="body2" color="text.secondary" gutterBottom>
													{item.title}
												</Typography>
												<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
													<Typography variant="h5" sx={{ fontWeight: "bold" }}>
														{item.value}
													</Typography>
													<Box
														sx={{
															bgcolor: item.color,
															borderRadius: "8px",
															p: 1,
														}}>
														<item.icon sx={{ color: "#fff" }} />
													</Box>
												</Box>
											</CardContent>
										</Card>
									</Grid>
								))}
							</Grid>

							{/* Main Content */}
							<div style={{ display: "flex", marginBottom: "1rem" }}>
								{/* Booking Table */}
								<TableContainer component={Paper} style={{ width: "65%", backgroundColor: "#FFFFFF", borderRadius: "1rem", boxShadow: "none", border: "1px solid #ccc", marginBottom: "24px" }}>
									<Table>
										<TableHead style={{ backgroundColor: "#C5D9F0" }}>
											<TableRow>
												<TableCell style={{ color: "black", fontWeight: "700" }}>Booking ID</TableCell>
												<TableCell style={{ color: "black", fontWeight: "700" }}>Floor</TableCell>
												<TableCell style={{ color: "black", fontWeight: "700" }}>Room Name</TableCell>
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
															<span style={{ fontSize: "0.75rem", color: "#6B7280", whiteSpace: "nowrap", marginLeft: "0.5rem" }}>{notification.created_at}</span>
														</div>
														<p style={{ fontSize: "0.875rem", color: "#4B5563", marginTop: "0.25rem", lineHeight: "1.25" }}>{notification.message}</p>
													</div>
												</div>
											))}
									</div>
								</div>
							</div>
						</Box>
					</div>
				</div>
			</div>
		</>
	);
};

export default UserDashboard;
