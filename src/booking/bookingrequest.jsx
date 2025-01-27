import React from 'react'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Menu,
    MenuItem,
    Typography,
    Box,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import TopNavbar from '../topNavbar/index';
import Sidebar from '../leftSideBar';

const BookingRequest = () => {

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const bookings = [
        {
            id: "#5644",
            name: "Alexander",
            floor: "Floor 1",
            room: "A647",
            seats: "10",
            startDate: "03/07/2024",
            endDate: "03/07/2024",
            amount: "$200",
            status: "Approved",
        },
        {
            id: "#6112",
            name: "Pegasus",
            floor: "Floor 2",
            room: "A456",
            seats: "20",
            startDate: "03/07/2024",
            endDate: "03/07/2024",
            amount: "$250",
            status: "Approved",
        },
        {
            id: "#6141",
            name: "Martin",
            floor: "Ground Floor",
            room: "A645",
            seats: "15",
            startDate: "03/07/2024",
            endDate: "03/07/2024",
            amount: "$400",
            status: "Pending",
        },
        {
            id: "#6535",
            name: "Cecil",
            floor: "Floor 1",
            room: "A684",
            seats: "25",
            startDate: "03/07/2024",
            endDate: "03/07/2024",
            amount: "$2500",
            status: "Approved",
        },
    ];

    return (
        <>
            <TopNavbar />
            <div className='main'>
                <div className='sideBarWrapper'>
                    <Sidebar />
                </div>
                <div className='content'>
                    <Box className="page-content" p={2}>
                        {/* Header */}
                        <Box
                            className="d-flex justify-content-between align-items-center flex-wrap"
                            mb={3}
                        >
                            <Typography variant="h5">Booking Request</Typography>
                        </Box>

                        {/* Filter and Search */}
                        <Box
                            className="mt-2 ms-2 me-2 d-flex justify-content-between align-items-center"
                            p={2}
                            sx={{
                                display: "flex",
                                gap: "16px",
                            }}
                        >
                            {/* Check-in and Check-out Buttons */}
                            <Button
                                variant="contained"
                                sx={{
                                    borderRadius: "20px",
                                    backgroundColor: "#FFD700",
                                    color: "#000",
                                    '&:hover': {
                                        backgroundColor: "#FFC107",
                                    },
                                }}
                            >
                                Check in
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{
                                    borderRadius: "20px",
                                    color: "#000",
                                    borderColor: "#dcdcdc",
                                    backgroundColor: "#fff",
                                    '&:hover': {
                                        backgroundColor: "#f1f1f1",
                                    },
                                }}
                            >
                                Check out
                            </Button>

                            {/* Filter and Search Box */}
                            <Box
                                className="filter-search-container"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                    gap: "16px",
                                    flex: 1,
                                }}
                            >
                                {/* Filter Button */}
                                <Button
                                    variant="outlined"
                                    startIcon={<FilterAltOutlinedIcon />}
                                    sx={{
                                        borderRadius: "20px",
                                        color: "#000",
                                        borderColor: "#dcdcdc",
                                        backgroundColor: "#fff",
                                        '&:hover': {
                                            backgroundColor: "#f1f1f1",
                                        },
                                    }}
                                >
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
                                    }}
                                >
                                    <SearchOutlinedIcon style={{ marginRight: "8px", color: "#000" }} />
                                    <TextField
                                        placeholder="Search by room number"
                                        size="small"
                                        variant="standard"
                                        InputProps={{ disableUnderline: true }}
                                        sx={{
                                            flex: 1,
                                            '& input::placeholder': {
                                                color: "#6c757d",
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        {/* Table */}
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead className="body-bg">
                                    <TableRow>
                                        <TableCell>Booking ID</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Floor</TableCell>
                                        <TableCell>Room</TableCell>
                                        <TableCell>Seats</TableCell>
                                        <TableCell>Start Date</TableCell>
                                        <TableCell>End Date</TableCell>
                                        <TableCell>Amount Paid</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {bookings.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{row.id}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.floor}</TableCell>
                                            <TableCell>{row.room}</TableCell>
                                            <TableCell>{row.seats}</TableCell>
                                            <TableCell>{row.startDate}</TableCell>
                                            <TableCell>{row.endDate}</TableCell>
                                            <TableCell>{row.amount}</TableCell>
                                            <TableCell>
                                                <span
                                                    style={{
                                                        padding: "4px 8px",
                                                        borderRadius: "20px",
                                                        backgroundColor:
                                                            row.status === "Approved" ? "#d4edda" : "#fff3cd",
                                                        color:
                                                            row.status === "Approved" ? "#155724" : "#856404",
                                                    }}
                                                >
                                                    {row.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    onClick={handleMenuClick}
                                                    style={{ background: "none", border: "none" }}
                                                >
                                                    <MoreVert />
                                                </Button>
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    open={Boolean(anchorEl)}
                                                    onClose={handleMenuClose}
                                                >
                                                    <MenuItem onClick={handleMenuClose}>
                                                        <i className="fa fa-edit" /> Edit
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={handleMenuClose}
                                                        style={{ color: "red" }}
                                                    >
                                                        <i className="fa fa-trash" /> Delete
                                                    </MenuItem>
                                                </Menu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </div>
            </div>
        </>
    )
}

export default BookingRequest
