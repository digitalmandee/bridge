import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { Button, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import DashboardNotifications from "@/components/notifications";

const CompanyDashboard = () => {
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState({});

	useEffect(() => {
		const getData = async () => {
			await axiosInstance.get(import.meta.env.VITE_BASE_API + "company/dashboard").then((res) => {
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
							<DashboardNotifications />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default CompanyDashboard;
