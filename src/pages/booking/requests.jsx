import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Menu, MenuItem, IconButton, Modal, Box, TextField, Button, Select, Snackbar, Alert, Typography, Pagination } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TopNavbar from "../../components/topNavbar";
import Sidebar from "../../components/leftSideBar";
import Loader from "../../components/Loader";
import axios from "axios";
import colors from "../../assets/styles/color";
import axiosInstance from "../../utils/axiosInstance";

const Requests = () => {
	const [bookings, setBookings] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [openEditModal, setOpenEditModal] = useState(false);
	const [selectedBooking, setSelectedBooking] = useState(null);
	const [newPrice, setNewPrice] = useState("");
	const [newStatus, setNewStatus] = useState("");
	const [receiptImage, setReceiptImage] = useState(null);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState("success");
	const [searchQuery, setSearchQuery] = useState("");
	const [filterOpen, setFilterOpen] = useState(false);

	const [filterStartDate, setFilterStartDate] = useState("");
	const [filterEndDate, setFilterEndDate] = useState("");
	const [filterStatus, setFilterStatus] = useState("");
	const [filterFloor, setFilterFloor] = useState("");

	const [startDate, setStartDate] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endDate, setEndDate] = useState("");
	const [endTime, setEndTime] = useState("");

	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit] = useState(10);

	const handleMenuOpen = (event, booking) => {
		setAnchorEl(event.currentTarget);
		setSelectedBooking(booking);
	};

	const handleMenuClose = () => setAnchorEl(null);

	const handleEditClick = () => {
		setOpenEditModal(true);
		setNewPrice(selectedBooking.total_price);
		setNewStatus(selectedBooking.status);
		setReceiptImage(selectedBooking.receipt_image || null);
		setStartDate(selectedBooking.start_date || "");
		setStartTime(selectedBooking.start_time || "");
		setEndDate(selectedBooking.end_date || "");
		setEndTime(selectedBooking.end_time || "");
	};

	const handleCloseEditModal = () => setOpenEditModal(false);

	const handleUpdateBooking = async () => {
		try {
			const response = await axiosInstance.post(`booking/update`, {
				booking_id: selectedBooking.id,
				price: newPrice,
				status: newStatus,
				start_date: startDate,
				start_time: startTime,
				end_date: endDate,
				end_time: endTime,
			});

			if (response.data.success) {
				setBookings((prev) =>
					prev.map((booking) =>
						booking.id === selectedBooking.id
							? {
									...booking,
									total_price: newPrice,
									status: newStatus,
									start_date: startDate,
									start_time: startTime,
									end_date: endDate,
									end_time: endTime,
							  }
							: booking
					)
				);
				setOpenEditModal(false);
				setSnackbarMessage("Booking updated successfully!");
				setSnackbarSeverity("success");
			} else {
				setSnackbarMessage("Failed to update booking.");
				setSnackbarSeverity("error");
			}
		} catch (error) {
			console.error("Error updating booking:", error.response.data);
			setSnackbarMessage("An error occurred. Please try again.");
			setSnackbarSeverity("error");
		} finally {
			setSnackbarOpen(true);
		}
	};

	const handleSnackbarClose = () => setSnackbarOpen(false);

	const fetchBookings = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get(`bookings`, {
				params: {
					page,
					limit,
					search: searchQuery, // booking id or name
					start_date: filterStartDate,
					end_date: filterEndDate,
					status: filterStatus,
					floor: filterFloor,
				},
			});

			if (res.data.success) {
				setBookings(res.data.bookings.data);
				setTotalPages(res.data.bookings.last_page);
				setCurrentPage(res.data.bookings.current_page);
			}
		} catch (error) {
			console.error("Error fetching bookings:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchBookings(currentPage);
	}, [currentPage]);

	const totalPrice = (booking) => (booking?.plan?.discount && booking.plan.discount > 0 ? Math.round(booking.total_price - (booking.total_price * booking.plan.discount) / 100) : booking.total_price);

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
							<Typography variant="h5">Booking Request</Typography>
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
							<Box sx={{ display: "flex", justifyContent: "end", gap: "16px", flex: 1 }}>
								{/* Filter Button */}
								<Button
									variant="outlined"
									startIcon={<FilterAltOutlinedIcon />}
									onClick={() => setFilterOpen(true)}
									sx={{
										borderRadius: "20px",
										color: "#000",
										borderColor: "#dcdcdc",
										backgroundColor: "#fff",
										"&:hover": { backgroundColor: "#f1f1f1" },
									}}>
									Filter
								</Button>

								{/* Search Box */}
								<Box
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
										placeholder="Search by booking ID or name"
										size="small"
										variant="standard"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") fetchBookings(1);
										}}
										InputProps={{ disableUnderline: true }}
										sx={{ flex: 1, "& input::placeholder": { color: "#6c757d" } }}
									/>
								</Box>
							</Box>
						</Box>
						<Modal open={filterOpen} onClose={() => setFilterOpen(false)}>
							<Box
								sx={{
									position: "absolute",
									top: "20px",
									right: "20px",
									backgroundColor: "white",
									padding: 4,
									borderRadius: 2,
									width: 400,
								}}>
								<Typography variant="h6" mb={2}>
									Filter Bookings
								</Typography>

								{/* Date Range */}
								<TextField label="Start Date" type="date" fullWidth value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
								<TextField label="End Date" type="date" fullWidth value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />

								{/* Status */}
								<Select fullWidth value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} displayEmpty sx={{ mb: 2 }}>
									<MenuItem value="">Select Status</MenuItem>
									<MenuItem value="pending">Pending</MenuItem>
									<MenuItem value="confirmed">Confirmed</MenuItem>
									<MenuItem value="vacated">Vacated</MenuItem>
									<MenuItem value="rejected">Rejected</MenuItem>
								</Select>

								{/* Floor */}
								<Select fullWidth value={filterFloor} onChange={(e) => setFilterFloor(e.target.value)} displayEmpty sx={{ mb: 2 }}>
									<MenuItem value="">Select Floor</MenuItem>
									<MenuItem value="1">G Floor</MenuItem>
								</Select>

								<Button
									variant="contained"
									sx={{ backgroundColor: colors.primary }}
									fullWidth
									onClick={() => {
										setFilterOpen(false);
										fetchBookings(1);
									}}>
									Apply Filter
								</Button>
							</Box>
						</Modal>

						<div className="row card col-md-12">
							<table className="table table-responsive">
								<thead>
									<tr>
										<th>Booking ID</th>
										<th>Name</th>
										<th>Floor</th>
										<th>Seats</th>
										<th>Start Date</th>
										<th>End Date</th>
										<th>Amount</th>
										<th>Status</th>
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
											<tr key={booking.id}>
												<td>#{booking.id}</td>
												<td>{booking.name}</td>
												<td>{booking.floor?.name}</td>
												<td>{booking.chairs.length}</td>
												<td>{booking.start_date}</td>
												<td>{booking.end_date || "N/A"}</td>
												<td>Rs. {totalPrice(booking)}</td>
												<td>
													<div className="d-flex align-items-center">
														<span className={`status ${booking.status}`}>{booking.status}</span>
														<IconButton onClick={(e) => handleMenuOpen(e, booking)}>
															<MoreVertIcon />
														</IconButton>
													</div>
													<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
														<MenuItem onClick={handleEditClick}>Edit</MenuItem>
													</Menu>
												</td>
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
						{/* Pagination */}
						<div className="d-flex justify-content-end mt-4">
							<Pagination count={totalPages} page={currentPage} onChange={(e, page) => setCurrentPage(page)} shape="rounded" />
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
						width: 700,
					}}>
					<h3 style={{ marginBottom: 20 }}>Edit Booking</h3>
					<Select fullWidth value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
						{selectedBooking?.status === "pending" && <MenuItem value="pending">Pending</MenuItem>}
						{selectedBooking?.status !== "vacated" && <MenuItem value="confirmed">Confirmed</MenuItem>}
						<MenuItem value="vacated">Vacated</MenuItem>
						<MenuItem value="rejected">Rejected</MenuItem>
					</Select>
					<div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
						<TextField label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} style={{ marginBottom: 20, width: "48%" }} />
						<TextField label="Start Time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} InputLabelProps={{ shrink: true }} style={{ marginBottom: 20, width: "48%" }} />
					</div>
					{newStatus === "vacated" && (
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<TextField label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} style={{ marginBottom: 10, width: "48%" }} />
							<TextField label="End Time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} InputLabelProps={{ shrink: true }} style={{ marginBottom: 10, width: "48%" }} />
						</div>
					)}
					<div style={{ textTransform: "capitalize", marginBottom: 10 }}>
						<b>Price:</b> Rs: {selectedBooking && totalPrice(selectedBooking)}
					</div>
					<div style={{ textTransform: "capitalize", marginBottom: 10 }}>
						<b>Payment Method:</b> {selectedBooking?.payment_method}
					</div>
					<div style={{ textTransform: "capitalize", marginBottom: 10 }}>
						<b>Package Detail:</b> {selectedBooking?.package_detail}
					</div>
					<div style={{ textTransform: "capitalize", marginBottom: 10 }}>
						<b>Duration:</b> {selectedBooking?.duration}
					</div>
					{receiptImage && (
						<div style={{ marginBottom: 20 }}>
							<img src={receiptImage} alt="Receipt" style={{ width: 100, height: 100, objectFit: "contain" }} />
						</div>
					)}
					{selectedBooking && selectedBooking.chairs.length > 0 && (
						<ul className="selected-booking-chair">
							{selectedBooking.chairs.map((chair) => (
								<li key={chair.id} style={{ backgroundColor: colors.primary }}>
									{chair.table_id}
									{chair.chair_id}
								</li>
							))}
						</ul>
					)}
					<Button variant="contained" color="primary" onClick={handleUpdateBooking}>
						Update Booking
					</Button>
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
