import React, { useEffect, useState } from "react";
import TopNavbar from "../topNavbar";
import Sidebar from "../leftSideBar";
import { Link } from "react-router-dom";
import axios from "axios";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Three-dot icon
import { Menu, MenuItem, IconButton, Modal, Box, TextField, Button, Select, Snackbar, Alert } from "@mui/material";

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

  // New state variables for date and time
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleMenuOpen = (event, booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setOpenEditModal(true);
    setNewPrice(selectedBooking.total_price);
    setNewStatus(selectedBooking.status);
    setReceiptImage(selectedBooking.receipt_image || null); // Set receipt image if it exists

    // Set initial values for start and end date/time
    setStartDate(selectedBooking.start_date);
    setStartTime(selectedBooking.start_time);
    setEndDate(selectedBooking.end_date);
    setEndTime(selectedBooking.end_time);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handlePriceChange = (e) => {
    setNewPrice(e.target.value);
  };

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const handleUpdateBooking = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_API}bookings/update`, {
        booking_id: selectedBooking.id,
        price: newPrice,
        status: newStatus,
        start_date: startDate,
        start_time: startTime,
        end_date: endDate,
        end_time: endTime,
      });

      if (response.data.success) {
        // Update the booking data locally
        setBookings(bookings.map((booking) => (booking.id === selectedBooking.id ? { ...booking, total_price: newPrice, status: newStatus, start_date: startDate, start_time: startTime, end_date: endDate, end_time: endTime } : booking)));
        setOpenEditModal(false);
        setSnackbarMessage("Plan created successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    } catch (error) {
      // console.error("Error updating booking", error);
      setSnackbarMessage("An error occurred.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const branchId = 1;
        const response = await axios.get(`${process.env.REACT_APP_BASE_API}bookings?branch_id=${branchId}`);

        if (response.data && Array.isArray(response.data.bookings)) {
          setBookings(response.data.bookings);
        }
      } catch (error) {
        console.error("Error fetching booking plan data", error);
      } finally {
        setIsLoading(false);
      }
    };

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
          <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin py-4">
            <h3>Booking Requests</h3>
            <Link
              to={"/booking/plans/create"}
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                backgroundColor: "#f5b500",
                color: "#fff",
                border: "none",
                fontSize: "16px",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Add Plan
            </Link>
          </div>
          <div className="row card col-md-12">
            <table className="table table-responsive">
              <thead>
                <tr>
                  <th className="p-3">Booking ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Floor</th>
                  <th className="p-3">Room</th>
                  <th className="p-3">Seats</th>
                  <th className="p-3">Start Date</th>
                  <th className="p-3">End Date</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? "Loading..."
                  : bookings.map((booking, index) => (
                      <tr key={index}>
                        <td className="px-3">#{booking.id}</td>
                        <td className="px-3">{booking.name}</td>
                        <td className="px-3">{booking.floor.name}</td>
                        <td className="px-3">{booking.rooms.join(", ")}</td>
                        <td className="px-3">{booking.total_chairs}</td>
                        <td className="px-3">{booking.start_date}</td>
                        <td className="px-3">{booking.end_date ? booking.end_date : "N/A"}</td>
                        <td className="px-3">Rs. {booking.total_price}</td>
                        <td className="d-flex justify-content-end align-items-center">
                          <span className={`status ${booking.status}`}>{booking.status}</span>
                          <IconButton onClick={(e) => handleMenuOpen(e, booking)}>
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            PaperProps={{
                              style: {
                                boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
                              },
                            }}
                          >
                            <MenuItem onClick={handleEditClick}>Edit</MenuItem>
                          </Menu>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
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
            padding: "20px",
            borderRadius: "8px",
            width: "700px",
          }}
        >
          <h3>Edit Booking</h3>
          <br />
          <div>
            <TextField label="Price" variant="outlined" fullWidth value={newPrice} onChange={handlePriceChange} style={{ marginBottom: "20px" }} />
            <Select id="select-status" className="w-100" value={newStatus} label="Status" onChange={handleStatusChange}>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="accepted">Accepted</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
            <br />
            <br />

            {/* Date and Time Fields */}
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginBottom: "20px", width: "47.5%", marginRight: "10px" }}
            />
            <TextField
              label="Start Time"
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginBottom: "20px", width: "47.5%" }}
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginBottom: "20px", width: "47.5%", marginRight: "10px" }}
            />
            <TextField
              label="End Time"
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginBottom: "20px", width: "47.5%" }}
            />

            {/* Display Receipt Image if available */}
            {receiptImage && (
              <div>
                <img src={receiptImage} alt="Receipt" style={{ width: "100px", height: "100px", marginBottom: "20px" }} />
              </div>
            )}

            <Button variant="contained" color="primary" onClick={handleUpdateBooking}>
              Update Booking
            </Button>
          </div>
        </Box>
      </Modal>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackbarOpen} autoHideDuration={1500} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} variant="filled" severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Requests;
