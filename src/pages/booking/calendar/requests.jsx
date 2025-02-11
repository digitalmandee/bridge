import React, { useContext, useEffect, useState } from "react";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Menu, MenuItem, IconButton, Modal, Box, TextField, Button, Select, Snackbar, Alert, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import Loader from "@/components/Loader";
import axios from "axios";
import colors from "@/assets/styles/color";
import { AuthContext } from "@/contexts/AuthContext";
import { Grid } from "@mui/system";
import axiosInstance from "@/utils/axiosInstance";

const Requests = () => {
	const { user } = useContext(AuthContext);

	const [bookings, setBookings] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [openEditModal, setOpenEditModal] = useState(false);
	const [selectedBooking, setSelectedBooking] = useState(null);
	const [newStatus, setNewStatus] = useState("");
	const [timeExist, setTimeExist] = useState("");
	const [userLimitError, setUserLimitError] = useState("");
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState("success");

	const [menuAnchor, setMenuAnchor] = useState(null);
	const [selectedBookingId, setSelectedBookingId] = useState(null);

	const handleMenuOpen = (event, bookingId) => {
		setMenuAnchor(event.currentTarget);
		setSelectedBookingId(bookingId);
	};

	const handleMenuClose = () => {
		setMenuAnchor(null);
		setSelectedBookingId(null);
	};

	const handleEditClick = (booking) => {
		setOpenEditModal(true);
		setSelectedBooking(booking);
		setNewStatus(booking.status);
	};

	const handleCloseEditModal = () => setOpenEditModal(false);

	const handleUpdateBooking = async () => {
		try {
			const response = await axiosInstance.post(`${import.meta.env.VITE_BASE_API}booking-schedule/update`, {
				booking_id: selectedBooking.event_id,
				status: newStatus,
			});

			if (response.data.success) {
				setBookings((prev) => prev.map((booking) => (booking.event_id === selectedBooking.event_id ? { ...booking, status: newStatus } : booking)));
				setOpenEditModal(false);
				setSnackbarMessage("Booking updated successfully!");
				setSnackbarSeverity("success");
			} else {
				setSnackbarMessage("Failed to update booking.");
				setSnackbarSeverity("error");
			}
		} catch (error) {
			console.error("Error updating booking:", error.response.data);
			if (error.response.data.already_exist) setTimeExist(error.response.data.already_exist);
			else if (error.response.data.user_limit_error) setUserLimitError(error.response.data.user_limit_error);

			setSnackbarMessage("An error occurred. Please try again.");
			setSnackbarSeverity("error");
		} finally {
			setSnackbarOpen(true);
		}
	};

	const handleSnackbarClose = () => setSnackbarOpen(false);

	const fetchBookings = async () => {
		setIsLoading(true);
		try {
			const res = await axios.get(`${import.meta.env.VITE_BASE_API}booking-schedule/requests`, { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}`, "Content-Type": "application/json" } });
			console.log(res.data);

			if (res.data && Array.isArray(res.data.schedules)) {
				setBookings(res.data.schedules);
			}
		} catch (error) {
			console.error("Error fetching bookings:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchBookings();
	}, []);

	return (
		<>
			<TopNavbar />
			<div className="main">
				<div className="sidebarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<Box className="page-content" p={2}>
						<Box className="d-flex justify-content-between align-items-center flex-wrap" mb={3}>
							<Typography variant="h5">Room Booking Requests</Typography>
						</Box>

						{/* Filter and Search */}
						<Box
							className="mt-2 ms-2 me-2 d-flex justify-content-between align-items-center"
							p={2}
							sx={{
								display: "flex",
								gap: "16px",
							}}>
							{/* Filter and Search Box */}
							<Box
								className="filter-search-container"
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "flex-end",
									gap: "16px",
									flex: 1,
								}}>
								{/* Filter Button */}
								<Button
									variant="outlined"
									startIcon={<FilterAltOutlinedIcon />}
									sx={{
										borderRadius: "20px",
										color: "#000",
										borderColor: "#dcdcdc",
										backgroundColor: "#fff",
										"&:hover": {
											backgroundColor: "#f1f1f1",
										},
									}}>
									Filter
								</Button>

								{/* Search Box */}
								<Box
									className="search-form"
									sx={{
										display: "flex",
										alignItems: "center",
										backgroundColor: "#fff",
										border: "1px solid #dcdcdc",
										borderRadius: "20px",
										padding: "4px 10px",
										flexGrow: 1,
										maxWidth: "400px",
									}}>
									<SearchOutlinedIcon style={{ marginRight: "8px", color: "#000" }} />
									<TextField
										placeholder="Search by room number"
										size="small"
										variant="standard"
										InputProps={{ disableUnderline: true }}
										sx={{
											flex: 1,
											"& input::placeholder": {
												color: "#6c757d",
											},
										}}
									/>
								</Box>
							</Box>
						</Box>
						<div className="row card col-md-12">
							<table className="table table-responsive">
								<thead>
									<tr>
										<th>Booking ID</th>
										<th>Member Name</th>
										<th>Floor</th>
										<th>Room</th>
										<th>Date</th>
										<th>Start Time</th>
										<th>End Time</th>
										<th>Status</th>
										{user.type === "admin" && <th>Actions</th>}
									</tr>
								</thead>
								<tbody>
									{isLoading ? (
										<tr>
											<td colSpan="9">
												<Loader variant="C" />
											</td>
										</tr>
									) : bookings.length > 0 ? (
										bookings.map((booking) => (
											<tr key={booking.event_id}>
												<td>#{booking.event_id}</td>
												<td>{booking.user?.name}</td>
												<td>{booking.floor?.name}</td>
												<td>{booking.room?.name}</td>
												<td>{new Date(booking.date).toLocaleDateString()}</td>
												<td>{new Date(booking.startTime).toLocaleTimeString()}</td>
												<td>{new Date(booking.endTime).toLocaleTimeString()}</td>
												<td>
													<span className={`status ${booking.status}`}>{booking.status}</span>
												</td>
												{user.type === "user" && (
													<td>
														<IconButton onClick={() => handleEditClick(booking)}>
															<VisibilityIcon />{" "}
														</IconButton>
													</td>
												)}
												{user.type === "admin" && (
													<td>
														<IconButton onClick={(e) => handleMenuOpen(e, booking.event_id)}>
															<MoreVertIcon />
														</IconButton>
														<Menu anchorEl={menuAnchor} open={Boolean(menuAnchor) && selectedBookingId === booking.event_id} onClose={handleMenuClose}>
															<MenuItem onClick={() => handleEditClick(booking)}>Edit</MenuItem>
														</Menu>
													</td>
												)}
											</tr>
										))
									) : (
										<tr>
											<td colSpan="9" className="text-center">
												No booking requests available
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</Box>
				</div>
			</div>

			{/* Edit Booking Modal */}
			<Modal open={openEditModal} onClose={handleCloseEditModal}>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						backgroundColor: "white",
						padding: 4,
						borderRadius: 2,
						boxShadow: 24, // Added shadow for better emphasis
						width: 600, // Adjust width for better fitting
						maxWidth: "90%", // Responsive design for smaller screens
					}}>
					<Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 600 }}>
						{user.type === "user" ? "Booking Details" : "Edit Booking"}
					</Typography>

					{timeExist != "" && (
						<p className="mb-3" style={{ color: "red" }}>
							{timeExist}
						</p>
					)}
					{userLimitError != "" && (
						<p className="mb-3" style={{ color: "red" }}>
							{userLimitError}
						</p>
					)}

					{/* Information Section */}
					{selectedBooking && (
						<Grid container spacing={2} sx={{ marginBottom: 3 }}>
							<Grid item xs={12}>
								<Typography variant="body1">
									<strong>Title:</strong> {selectedBooking?.title}
								</Typography>
							</Grid>

							<Grid item xs={12} sm={6}>
								<Typography variant="body1">
									<strong>Start Time:</strong> {new Date(selectedBooking?.startTime).toLocaleTimeString()}
								</Typography>
							</Grid>

							<Grid item xs={12} sm={6}>
								<Typography variant="body1">
									<strong>End Time:</strong> {new Date(selectedBooking?.endTime).toLocaleTimeString()}
								</Typography>
							</Grid>

							<Grid item xs={12} sm={6}>
								<Typography variant="body1">
									<strong>Date:</strong> {new Date(selectedBooking?.date).toLocaleDateString()}
								</Typography>
							</Grid>

							<Grid item xs={12} sm={6}>
								<Typography variant="body1">
									<strong>Floor:</strong> {selectedBooking?.floor?.name}
								</Typography>
							</Grid>

							<Grid item xs={12} sm={6}>
								<Typography variant="body1">
									<strong>Room:</strong> {selectedBooking?.room?.name}
								</Typography>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Typography variant="body1">
									<strong>Persons:</strong> {selectedBooking?.persons}
								</Typography>
							</Grid>

							<Grid item xs={12} sm={6}>
								<Typography variant="body1">
									<strong>User:</strong> {selectedBooking?.user?.name} ({selectedBooking?.user?.email})
								</Typography>
							</Grid>
							{user.type === "user" && (
								<Grid item xs={12} sm={6}>
									<Typography variant="body1">
										<strong>Status:</strong> <span className={`status ${selectedBooking.status}`}>{selectedBooking.status}</span>
									</Typography>
								</Grid>
							)}
						</Grid>
					)}

					{/* Status Selection */}
					{user.type === "admin" && (
						<Select fullWidth label="Status" id="select-status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)} sx={{ marginBottom: 3 }}>
							<MenuItem value="approved">Approved</MenuItem>
							<MenuItem value="pending">Pending</MenuItem>
							<MenuItem value="rejected">Rejected</MenuItem>
						</Select>
					)}

					{/* Action Buttons */}
					<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
						<Button variant="outlined" color="secondary" onClick={handleCloseEditModal} sx={{ marginRight: 2 }}>
							Cancel
						</Button>

						{user.type === "admin" && (
							<Button variant="contained" color="primary" onClick={handleUpdateBooking}>
								Update Booking
							</Button>
						)}
					</Box>
				</Box>
			</Modal>

			<Snackbar open={snackbarOpen} autoHideDuration={1500} onClose={handleSnackbarClose}>
				<Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</>
	);
};

export default Requests;
