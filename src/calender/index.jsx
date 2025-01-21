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
            <div className='main d-flex'>
                <div className='sideBarWrapper'>
                    <Sidebar />
                </div>
                <div className='content'>
                    <div className='right-content'>
                        <Box sx={{ p: 3, bgcolor: '#F8F9FA' }}>
                            <Box sx={{ display: 'flex', gap: 3 }}>
                                {/* Left Sidebar */}
                                <Box sx={{ width: 280 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <IconButton>
                                            <ArrowBackIcon />
                                        </IconButton>
                                        <Typography variant="h6" sx={{ ml: 1, fontWeight: 500 }}>
                                            Booking Calendar
                                        </Typography>
                                    </Box>

                                    <Paper sx={{ p: 2, borderRadius: 2 }}>
                                        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                sx={{
                                                    bgcolor: '#FFF3E0',
                                                    color: '#000',
                                                    boxShadow: 'none',
                                                    '&:hover': { bgcolor: '#FFE0B2', boxShadow: 'none' },
                                                }}
                                            >
                                                Reserved 40%
                                            </Button>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                sx={{
                                                    bgcolor: '#E8F5E9',
                                                    color: '#000',
                                                    boxShadow: 'none',
                                                    '&:hover': { bgcolor: '#C8E6C9', boxShadow: 'none' },
                                                }}
                                            >
                                                Available 60%
                                            </Button>
                                        </Box>

                                        <Select
                                            fullWidth
                                            value="meeting-room"
                                            sx={{ mb: 2, '.MuiOutlinedInput-notchedOutline': { borderColor: '#E0E0E0' } }}
                                        >
                                            <MenuItem value="meeting-room">Meeting Room</MenuItem>
                                        </Select>

                                        <Select
                                            fullWidth
                                            value="select-location"
                                            sx={{ mb: 3, '.MuiOutlinedInput-notchedOutline': { borderColor: '#E0E0E0' } }}
                                        >
                                            <MenuItem value="select-location">Select Location</MenuItem>
                                        </Select>

                                        <Typography sx={{ mb: 1, fontWeight: 500 }}>Duration</Typography>
                                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="From"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <CalendarTodayIcon fontSize="small" sx={{ color: '#757575' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: '#E0E0E0' } }}
                                            />
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="To"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <CalendarTodayIcon fontSize="small" sx={{ color: '#757575' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: '#E0E0E0' } }}
                                            />
                                        </Box>

                                        <Typography sx={{ mb: 1, fontWeight: 500 }}>Capacity</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <IconButton
                                                onClick={() => setCapacity(Math.max(0, capacity - 1))}
                                                sx={{
                                                    bgcolor: '#FFB800',
                                                    color: 'white',
                                                    '&:hover': { bgcolor: '#FFA000' }
                                                }}
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                            <Typography sx={{ mx: 3, minWidth: 20, textAlign: 'center' }}>
                                                {capacity}
                                            </Typography>
                                            <IconButton
                                                onClick={() => setCapacity(capacity + 1)}
                                                sx={{
                                                    bgcolor: '#FFB800',
                                                    color: 'white',
                                                    '&:hover': { bgcolor: '#FFA000' }
                                                }}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </Box>

                                        <Select
                                            fullWidth
                                            value="available-rooms"
                                            sx={{ mb: 3, '.MuiOutlinedInput-notchedOutline': { borderColor: '#E0E0E0' } }}
                                        >
                                            <MenuItem value="available-rooms">Available Rooms</MenuItem>
                                        </Select>

                                        <Button
                                            fullWidth
                                            variant="contained"
                                            onClick={() => setBookingDialogOpen(true)}
                                            sx={{
                                                bgcolor: '#FFB800',
                                                color: 'white',
                                                '&:hover': { bgcolor: '#FFA000' },
                                                textTransform: 'none',
                                                fontWeight: 500,
                                            }}
                                        >
                                            Quick Booking
                                        </Button>
                                    </Paper>
                                </Box>

                                {/* Main Calendar Area */}
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 3
                                    }}>
                                        <Typography variant="h5" sx={{ fontWeight: 500 }}>
                                            January 2025
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                variant={viewMode === 'Day' ? 'contained' : 'outlined'}
                                                sx={{
                                                    bgcolor: viewMode === 'Day' ? '#FFB800' : 'white',
                                                    color: viewMode === 'Day' ? 'white' : 'black',
                                                    borderColor: '#E0E0E0',
                                                    '&:hover': {
                                                        bgcolor: viewMode === 'Day' ? '#FFA000' : '#F5F5F5',
                                                        borderColor: '#E0E0E0',
                                                    },
                                                    textTransform: 'none',
                                                    fontWeight: 500,
                                                }}
                                                onClick={() => setViewMode('Day')}
                                            >
                                                Day
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                sx={{
                                                    bgcolor: 'white',
                                                    color: 'black',
                                                    borderColor: '#E0E0E0',
                                                    '&:hover': { bgcolor: '#F5F5F5', borderColor: '#E0E0E0' },
                                                    textTransform: 'none',
                                                    fontWeight: 500,
                                                }}
                                                onClick={() => setViewMode('Week')}
                                            >
                                                Week
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                sx={{
                                                    bgcolor: 'white',
                                                    color: 'black',
                                                    borderColor: '#E0E0E0',
                                                    '&:hover': { bgcolor: '#F5F5F5', borderColor: '#E0E0E0' },
                                                    textTransform: 'none',
                                                    fontWeight: 500,
                                                }}
                                                onClick={() => setViewMode('Month')}
                                            >
                                                Month
                                            </Button>
                                        </Box>
                                    </Box>

                                    <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
                                        <Box sx={{ display: 'flex' }}>
                                            <Box sx={{ width: 100 }} />
                                            {days.map((day, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        flex: 1,
                                                        p: 2,
                                                        textAlign: 'center',
                                                        borderLeft: 1,
                                                        borderColor: '#E0E0E0',
                                                        bgcolor: '#FFB800',
                                                        color: 'white'
                                                    }}
                                                >
                                                    <Typography sx={{ fontSize: 14, mb: 0.5 }}>
                                                        Meeting Room Booking
                                                    </Typography>
                                                    <Typography sx={{ fontSize: 14, mb: 0.5, opacity: 0.9 }}>
                                                        5,000/per Hour
                                                    </Typography>
                                                    <Typography sx={{ fontSize: 14, mb: 0.5 }}>
                                                        {day.date}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: 14, opacity: 0.9 }}>
                                                        {day.tasks} Task(s)
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>

                                        {timeSlots.map((time, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    borderTop: 1,
                                                    borderColor: '#E0E0E0',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 100,
                                                        p: 2,
                                                        borderRight: 1,
                                                        borderColor: '#E0E0E0',
                                                    }}
                                                >
                                                    <Typography sx={{ fontSize: 14, color: '#757575' }}>
                                                        {time}
                                                    </Typography>
                                                </Box>
                                                {days.map((_, dayIndex) => (
                                                    <Box
                                                        key={dayIndex}
                                                        sx={{
                                                            flex: 1,
                                                            height: 80,
                                                            borderLeft: dayIndex > 0 ? 1 : 0,
                                                            borderColor: '#E0E0E0',
                                                            bgcolor: Math.random() > 0.7 ? '#F5F5F5' : 'white',
                                                            cursor: 'pointer',
                                                            '&:hover': {
                                                                bgcolor: '#FAFAFA',
                                                            }
                                                        }}
                                                        onClick={handleCellClick}
                                                    />
                                                ))}
                                            </Box>
                                        ))}
                                    </Paper>
                                </Box>
                            </Box>

                            {/* Booking Dialog */}
                            <Dialog
                                open={bookingDialogOpen}
                                onClose={() => setBookingDialogOpen(false)}
                                maxWidth="sm"
                                fullWidth
                                PaperProps={{
                                    sx: {
                                        borderRadius: 2,
                                        p: 2
                                    }
                                }}
                            >
                                <DialogContent sx={{ p: 0, mb: 3 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        <Box>
                                            <Typography sx={{ mb: 1, fontWeight: 500 }}>Member</Typography>
                                            <Box >
                                                <TextField
                                                    fullWidth
                                                    placeholder="Name"
                                                    size="small"
                                                    sx={{
                                                        '.MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#E0E0E0',
                                                            borderRadius: 1
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        bgcolor: '#FFB800',
                                                        '&:hover': { bgcolor: '#FFA000' },
                                                        textTransform: 'none',
                                                        px: 2,
                                                        marginTop: 1
                                                    }}
                                                >
                                                    Add New
                                                </Button>
                                            </Box>
                                        </Box>

                                        <Box>
                                            <Typography sx={{ mb: 1, fontWeight: 500 }}>Title</Typography>
                                            <TextField
                                                fullWidth
                                                placeholder="Title"
                                                size="small"
                                                sx={{
                                                    '.MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#E0E0E0',
                                                        borderRadius: 1
                                                    }
                                                }}
                                            />
                                        </Box>

                                        <Box>
                                            <Typography sx={{ mb: 1, fontWeight: 500 }}>Meeting Room</Typography>
                                            <TextField
                                                fullWidth
                                                placeholder="Meeting Room"
                                                size="small"
                                                sx={{
                                                    '.MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#E0E0E0',
                                                        borderRadius: 1
                                                    }
                                                }}
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography sx={{ mb: 1, fontWeight: 500 }}>From</Typography>
                                                <TextField
                                                    fullWidth
                                                    type="time"
                                                    size="small"
                                                    sx={{
                                                        '.MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#E0E0E0',
                                                            borderRadius: 1
                                                        }
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography sx={{ mb: 1, fontWeight: 500 }}>To</Typography>
                                                <TextField
                                                    fullWidth
                                                    type="time"
                                                    size="small"
                                                    sx={{
                                                        '.MuiOutlinedInput-notchedOutline': {
                                                            borderColor: '#E0E0E0',
                                                            borderRadius: 1
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                </DialogContent>
                                <DialogActions sx={{ p: 0, gap: 1 }}>
                                    <Button
                                        onClick={() => setBookingDialogOpen(false)}
                                        variant="outlined"
                                        sx={{
                                            flex: 1,
                                            color: 'text.primary',
                                            borderColor: '#E0E0E0',
                                            '&:hover': {
                                                borderColor: '#BDBDBD',
                                                bgcolor: 'transparent'
                                            },
                                            textTransform: 'none',
                                            borderRadius: 1
                                        }}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        onClick={handleBookingSuccess}
                                        variant="contained"
                                        sx={{
                                            flex: 1,
                                            bgcolor: '#FFB800',
                                            '&:hover': { bgcolor: '#FFA000' },
                                            textTransform: 'none',
                                            borderRadius: 1
                                        }}
                                    >
                                        Book Now
                                    </Button>
                                </DialogActions>
                            </Dialog>

                            {/* Booking Success Dialog */}
                            <Dialog
                                open={successDialogOpen}
                                onClose={() => setSuccessDialogOpen(false)}
                                maxWidth="xs"
                                fullWidth
                            >
                                <DialogContent sx={{ textAlign: 'center', p: 3 }}>
                                    <CheckCircleIcon sx={{ fontSize: 50, color: '#FFA000' }} />
                                    <Typography variant="h6" sx={{ mt: 2 }}>
                                        SUCCESS!
                                    </Typography>
                                    <Typography sx={{ opacity: 0.7, mt: 1 }}>
                                        Your booking is successful!
                                    </Typography>
                                </DialogContent>
                                <DialogActions sx={{ justifyContent: 'center' }}>
                                    <Button
                                        onClick={() => setSuccessDialogOpen(false)}
                                        variant="contained"
                                        sx={{
                                            bgcolor: '#FFB800',
                                            '&:hover': { bgcolor: '#FFA000' },
                                            textTransform: 'none',
                                        }}
                                    >
                                        Continue
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Box>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BookingCalender
