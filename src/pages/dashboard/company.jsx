import React from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { Button, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper } from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PrintIcon from "@mui/icons-material/Print";
import { ArrowDownIcon, ArrowUpIcon, Bell, Building2, FileText, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";

const bookingData = [
	{ id: "#123457", floor: "1", room: "Desk #12", type: "Monthly", startDate: "Jan 01, 2024", endDate: "Jan 31, 2024", status: "Confirmed" },
	{ id: "#123458", floor: "2", room: "Meeting Room", type: "Weekly", startDate: "Jan 15, 2024", endDate: "Jan 22, 2024", status: "Confirmed" },
	{ id: "#123459", floor: "1", room: "Desk #14", type: "Daily", startDate: "Feb 01, 2024", endDate: "Feb 01, 2024", status: "Cancelled" },
	{ id: "#123460", floor: "3", room: "Conference Room", type: "Monthly", startDate: "Feb 05, 2024", endDate: "Feb 29, 2024", status: "Pending" },
	{ id: "#123461", floor: "2", room: "Desk #15", type: "Weekly", startDate: "Feb 10, 2024", endDate: "Feb 17, 2024", status: "Confirmed" },
	{ id: "#123462", floor: "1", room: "Desk #16", type: "Daily", startDate: "Feb 12, 2024", endDate: "Feb 12, 2024", status: "Confirmed" },
	{ id: "#123463", floor: "3", room: "Meeting Room 2", type: "Monthly", startDate: "Feb 20, 2024", endDate: "Mar 20, 2024", status: "Confirmed" },
	{ id: "#123464", floor: "1", room: "Desk #17", type: "Daily", startDate: "Feb 25, 2024", endDate: "Feb 25, 2024", status: "Confirmed" },
];

const notifications = [
	{
		icon: FileText,
		title: "Booking Confirmation",
		message: "Your booking for Desk #12 at Downtown Branch is confirmed for Jan 10, 2025, 9:00 AM",
		time: "2 min ago",
	},
	{
		icon: FileText,
		title: "Upcoming Booking Reminder",
		message: "Reminder: You have an upcoming booking for Meeting Room",
		time: "10 min ago",
	},
	{
		icon: Building2,
		title: "New Amenities Added",
		message: "*New* High-speed internet and ergonomic chairs are now available at Branch 1",
		time: "2 days ago",
	},
	{
		icon: Building,
		title: "Payment Reminder",
		message: "Payment overdue! Please complete payment for your monthly booking",
		time: "3 days ago",
	},
];

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
								{ title: "Available Seats", value: "60", icon: EventSeatIcon, color: "#0D2B4E" },
								{ title: "Occupied Seats", value: "45", icon: PeopleIcon, color: "#0D2B4E" },
								{ title: "Booking", value: "100", icon: AssignmentIcon, color: "#0D2B4E" },
								{ title: "Printing Papers", value: "1000", icon: PrintIcon, color: "#0D2B4E" },
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
											<TableCell style={{ color: "black", fontWeight: "700" }}>Seat/Room Name</TableCell>
											<TableCell style={{ color: "black", fontWeight: "700" }}>Booking Type</TableCell>
											<TableCell style={{ color: "black", fontWeight: "700" }}>Start Date</TableCell>
											<TableCell style={{ color: "black", fontWeight: "700" }}>End Date</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{bookingData.map((row, index) => (
											<TableRow key={index}>
												<TableCell>{row.id}</TableCell>
												<TableCell>{row.floor}</TableCell>
												<TableCell>{row.room}</TableCell>
												<TableCell>{row.type}</TableCell>
												<TableCell>{row.startDate}</TableCell>
												<TableCell>{row.endDate}</TableCell>
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
									{notifications.map((notification, i) => (
										<div key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.5rem" }}>
											<div style={{ marginTop: "0.05rem" }}>
												<notification.icon style={{ width: "1.25rem", height: "1.25rem", color: "#0A2156" }} />
											</div>
											<div style={{ flex: 1, minWidth: 0 }}>
												<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
													<span style={{ fontWeight: "500", fontSize: "0.875rem", color: "#111827" }}>{notification.title}</span>
													<span style={{ fontSize: "0.75rem", color: "#6B7280", whiteSpace: "nowrap", marginLeft: "0.5rem" }}>{notification.time}</span>
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
