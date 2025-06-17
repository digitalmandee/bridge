import { useState, useEffect, useContext } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import axiosInstance from "@/utils/axiosInstance";
import SeatBooking from "@/components/SeatBooking";
import dayjs from "dayjs";
import { AuthContext } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const BookingRequest = () => {
	const { user } = useContext(AuthContext);

	const [bookings, setBookings] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	function formatCreatedAt(createdAt) {
		const today = dayjs().startOf("day"); // 00:00 today
		const yesterday = today.subtract(1, "day"); // 00:00 yesterday

		const bookingDate = dayjs(createdAt).startOf("day"); // 00:00 booking

		if (bookingDate.isSame(today)) {
			return "Today";
		} else if (bookingDate.isSame(yesterday)) {
			return "Yesterday";
		} else {
			return bookingDate.format("D-M-YYYY"); // fallback to "3-10-2025"
		}
	}

	const fetchBookings = async () => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get("booking-request");
			if (res.data && Array.isArray(res.data.data)) {
				setBookings(res.data.data);
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
					<div className="d-flex justify-content-between align-items-center flex-wrap grid-margin py-4 mb-4">
						<h3 className="mb-3 mb-md-0">Booking Seat Requests</h3>
						{user?.type === "user" || (user?.type === "company" && <SeatBooking onBookingSuccess={fetchBookings} />)}
					</div>
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
									<TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
									<TableCell sx={{ fontWeight: "bold" }}>Number of Seats</TableCell>
									<TableCell sx={{ fontWeight: "bold" }}>Created</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{isLoading ? (
									<TableRow>
										<TableCell colSpan={3} align="center">
											Loading...
										</TableCell>
									</TableRow>
								) : bookings.length === 0 ? (
									<TableRow>
										<TableCell colSpan={3} align="center">
											No booking requests found
										</TableCell>
									</TableRow>
								) : (
									bookings.map((booking) => (
										<TableRow key={booking.id}>
											<TableCell>{booking.id}</TableCell>
											<TableCell>{booking.user?.name || "Unknown"}</TableCell>
											<TableCell>{booking.no_of_seats}</TableCell>
											<TableCell>{formatCreatedAt(booking.created_at)}</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</div>
			</div>
		</>
	);
};

export default BookingRequest;
