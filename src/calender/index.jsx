import React, { useState } from 'react';
import TopNavbar from '../topNavbar/index';
import Sidebar from '../leftSideBar';
import {
    Box,
    Typography,
    Select,
    MenuItem,
    IconButton,
    Button,
    TextField,
    Paper,
    InputAdornment,
    Dialog,
    DialogContent,
    DialogActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const BookingCalender = () => {
    const [capacity, setCapacity] = useState(0);
    const [viewMode, setViewMode] = useState('Day');
    const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
    const [successDialogOpen, setSuccessDialogOpen] = useState(false);

    const timeSlots = [
        '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
    ];

    const days = [
        { date: 'Saturday 07/16', tasks: 0 },
        { date: 'Monday 07/17', tasks: 0 },
        { date: 'Saturday 07/18', tasks: 0 },
        { date: 'Saturday 07/19', tasks: 0 },
        { date: 'Saturday 07/20', tasks: 0 },
        { date: 'Saturday 07/21', tasks: 0 },
    ];

    const handleCellClick = () => {
        setBookingDialogOpen(true);
    };

    const handleBookingSuccess = () => {
        setBookingDialogOpen(false);
        setSuccessDialogOpen(true);
    };


    return (
        <>
            <TopNavbar />
            <div className='main'>
                <div className='sideBarWrapper'>
                    <Sidebar />
                </div>
                <div className='content'>
                    <div className='right-content'>
                        <h2
                            style={{
                                margin: 0,
                                color: "#333", // Dark text color
                                fontSize: "18px",
                                fontWeight: "500",
                            }}
                        >
                            Booking Calendar
                        </h2>

                        {/* Button Section */}
                        <button
                            style={{
                                backgroundColor: "#f0c040", // Yellow background
                                color: "#000", // Dark text color
                                padding: "10px 20px",
                                border: "none",
                                borderRadius: "5px",
                                fontSize: "14px",
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                        >
                            Room/Event Booking
                        </button>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingTop: "20px",
                            backgroundColor: "transparent", // Light background color
                            borderRadius: "5px",
                        }}
                    >
                        {/* Left Section - Reserved and Available Buttons */}
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                style={{
                                    backgroundColor: "#fff", // White background
                                    color: "#000", // Dark text color
                                    padding: "5px 15px",
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                }}
                            >
                                Reserved 40%
                            </button>
                            <button
                                style={{
                                    backgroundColor: "#fff", // White background
                                    color: "#000", // Dark text color
                                    padding: "5px 15px",
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                }}
                            >
                                Available 60%
                            </button>
                        </div>

                        {/* Center Section - Month and Year */}
                        <div>
                            <h3
                                style={{
                                    margin: 0,
                                    color: "#333", // Dark text color
                                    fontSize: "18px",
                                    fontWeight: "500",
                                }}
                            >
                                January 2025
                            </h3>
                        </div>

                        {/* Right Section - Day, Week, Month Buttons */}
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                style={{
                                    backgroundColor: "#f0c040", // Yellow background for active button
                                    color: "#000", // Dark text color
                                    padding: "5px 15px",
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                }}
                            >
                                Day
                            </button>
                            <button
                                style={{
                                    backgroundColor: "#fff", // White background
                                    color: "#000", // Dark text color
                                    padding: "5px 15px",
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                }}
                            >
                                Week
                            </button>
                            <button
                                style={{
                                    backgroundColor: "#fff", // White background
                                    color: "#000", // Dark text color
                                    padding: "5px 15px",
                                    border: "1px solid #ddd",
                                    borderRadius: "5px",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                }}
                            >
                                Month
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BookingCalender
