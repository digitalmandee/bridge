import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import colors from "@/assets/styles/color";
import { Box, Card, CardContent, Typography, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import GroupsIcon from "@mui/icons-material/Groups";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PaymentsIcon from "@mui/icons-material/Payments";
import { Link, useNavigate } from "react-router-dom";
import { Bell, FileText } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import DashboardNotifications from "@/components/notifications";

const UserDashboard = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState([]);

	useEffect(() => {
		const getData = async () => {
			await axiosInstance.get("user/dashboard").then((res) => {
				// console.log(res.data);
				setData(res.data);
			});
			setIsLoading(false);
		};
		getData();
	}, []);

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

								<DashboardNotifications />
							</div>
						</Box>
					</div>
				</div>
			</div>
		</>
	);
};

export default UserDashboard;
