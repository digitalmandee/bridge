import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import axiosInstance from "@/utils/axiosInstance";
import SeatBooking from "@/components/SeatBooking";

const BookingRequest = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const res = await axiosInstance.get('booking-request');
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
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                        <SeatBooking onBookingSuccess={fetchBookings} />
                    </div>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Number of Seats</TableCell>
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
                                            <TableCell>{booking.user?.name || 'Unknown'}</TableCell>
                                            <TableCell>{booking.no_of_seats}</TableCell>
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