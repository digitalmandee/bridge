import React, { useContext, useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, MenuItem, Select, CircularProgress } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "@/utils/axiosInstance";
import { AuthContext } from "@/contexts/AuthContext";
import { FileText } from "lucide-react";

const NotificationManagement = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	const [notifications, setNotifications] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(10);
	const [statusFilter, setStatusFilter] = useState("All");

	const redirectToPage = (notificationId, notificationtype, isRead) => {
		if (!isRead) {
			markAsRead(notificationId);
		}
		if (notificationtype === "invoice") {
			if (user.type === "user" || user.type === "company") {
				navigate("/" + user.type + "/user/invoices/management");
			} else {
				navigate("/branch/invoices/management");
			}
		} else if (notificationtype === "booking") {
			if (user.type === "admin") {
				navigate("/branch/booking/requests");
			}
		} else if (notificationtype === "booking_schedule") {
			if (user.type === "user" || user.type === "company") {
				navigate("/" + user.type + "/booking-schedule/requests");
			} else {
				navigate("/branch/booking-schedule/requests");
			}
		}
	};

	const markAsRead = (notificationId) => {
		axiosInstance
			.post(`notifications/${notificationId}/read`, {})
			.then(() => {
				setNotifications(
					notifications.map((n) => {
						if (n.id === notificationId) n.is_read = true;
						return n;
					})
				);
			})
			.catch((error) => console.error("Error marking as read:", error));
	};

	const getNotifications = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get("notifications", {
				params: { page, limit, status: statusFilter },
			});
			setNotifications(res.data.notifications);
			setTotalPages(res.data.last_page);
			setCurrentPage(res.data.current_page);
			setUnreadNotifications(res.data.unread);
		} catch (error) {
			console.error("Error fetching notifications:", error.response);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getNotifications(currentPage);
	}, [currentPage, limit, statusFilter]);

	return (
		<>
			<TopNavbar />
			<div className="main d-flex">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div className="container-fluid py-4">
						{/* Header */}
						<div className="row mb-4 align-items-center">
							<div className="col-auto ">
								<Typography variant="h4" className="mb-0 ms-2">
									Notifications
								</Typography>
							</div>
						</div>

						{/* Filters and Search */}
						<div className="row mb-4 align-items-center">
							<div className="col-md-8 mb-3 mb-md-0">
								<div className="d-flex flex-wrap gap-2">
									{["All", "Read", "Unread"].map((label) => (
										<Button
											key={label}
											variant={statusFilter === label ? "contained" : "outlined"}
											sx={{
												bgcolor: statusFilter === label ? "#0F172A" : "",
												color: statusFilter === label ? "white" : "#0D2B4E",
												borderRadius: "20px",
												border: "1px solid #0D2B4E",
												"&:hover": {
													bgcolor: "#0D2B4E",
													color: "#fff",
												},
											}}
											onClick={() => setStatusFilter(label)}>
											{label === "" ? "All" : label}
										</Button>
									))}
								</div>
							</div>
							<div className="col-md-4">
								<TextField
									fullWidth
									size="small"
									placeholder="Search"
									InputProps={{
										startAdornment: <SearchIcon sx={{ color: "#64748B", mr: 1 }} />,
									}}
								/>
							</div>
						</div>

						{/* Table */}
						<TableContainer component={Paper} sx={{ boxShadow: "none" }}>
							{isLoading ? (
								<Box display="flex" justifyContent="center" alignItems="center" p={3}>
									<CircularProgress sx={{ color: "#0F172A" }} />
								</Box>
							) : (
								<Table>
									<TableHead sx={{ bgcolor: "#F8FAFC" }}>
										<TableRow>
											<TableCell>Messages</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{notifications.length > 0 ? (
											notifications.map((notification, i) => (
												<TableRow key={i} sx={{ backgroundColor: notification.is_read ? "#F8FAFC" : "", cursor: "pointer" }} onClick={() => redirectToPage(notification.id, notification.type, notification.is_read)}>
													<TableCell>
														<div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.5rem" }}>
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
													</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell colSpan={7} align="center">
													No invoices found.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							)}
						</TableContainer>

						{/* Pagination */}
						<Box display="flex" justifyContent="center" mt={3} gap={1}>
							<Button variant="outlined" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
								Previous
							</Button>
							{[...Array(totalPages)].map((_, index) => (
								<Button key={index} variant={currentPage === index + 1 ? "contained" : "outlined"} sx={currentPage === index + 1 ? { bgcolor: "#0F172A" } : {}} onClick={() => setCurrentPage(index + 1)}>
									{index + 1}
								</Button>
							))}
							<Button variant="outlined" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>
								Next
							</Button>
							<Select value={limit} onChange={(e) => setLimit(e.target.value)} size="small" sx={{ minWidth: 80 }}>
								<MenuItem value={5}>5</MenuItem>
								<MenuItem value={10}>10</MenuItem>
								<MenuItem value={20}>20</MenuItem>
							</Select>
						</Box>
					</div>
				</div>
			</div>
		</>
	);
};

export default NotificationManagement;
