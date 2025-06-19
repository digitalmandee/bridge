import { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Snackbar,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
} from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import colors from "@/assets/styles/color";

const SeatBooking = ({ onBookingSuccess }) => {
    const [open, setOpen] = useState(false);
    const [noOfSeats, setNoOfSeats] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [selectedFloor, setSelectedFloor] = useState('');
    const [floors, setFloors] = useState([]);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    useEffect(() => {
        // Fetch floors from backend
        const fetchFloors = async () => {
            try {
                const res = await axiosInstance.get("floor-plan/floors");
                setFloors(res.data.floors);
            } catch (err) {
                console.error("Error fetching floors:", err);
            }
        };
        fetchFloors();
    }, []);

    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        setNoOfSeats('');
        setBookingDate('');
        setSelectedFloor('');
        setError('');
    };

    const handleSubmit = async () => {
        if (!noOfSeats || isNaN(noOfSeats) || noOfSeats <= 0 || !bookingDate || !selectedFloor) {
            setError('All fields are required and must be valid.');
            return;
        }

        try {
            await axiosInstance.post('booking-request', {
                no_of_seats: parseInt(noOfSeats),
                booking_date: bookingDate,
                floor_id: selectedFloor,
            });

            setSnackbarMessage('Booking request saved successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleClose();
            onBookingSuccess?.();
        } catch (err) {
            console.error('Error saving booking request:', err);
            const errorMessage = err.response?.data?.error || 'Failed to save booking request';
            setError(errorMessage);
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    return (
        <>
            <Button
                variant="contained"
                sx={{ backgroundColor: colors.primary, color: "white" }}
                onClick={handleOpen}
            >
                Seats Request
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Request Seats</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Number of Seats"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={noOfSeats}
                        onChange={(e) => setNoOfSeats(e.target.value)}
                        error={!!error}
                    />
                    <TextField
                        margin="dense"
                        label="Booking Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        select
                        margin="dense"
                        label="Select Floor"
                        fullWidth
                        value={selectedFloor}
                        onChange={(e) => setSelectedFloor(e.target.value)}
                        sx={{ mt: 2 }}
                    >
                        {floors.map((floor) => (
                            <MenuItem key={floor.id} value={floor.id}>
                                {floor.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={handleClose}
                        sx={{ backgroundColor: colors.primary, color: "white" }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{ backgroundColor: colors.primary, color: "white" }}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snackbarOpen} autoHideDuration={1500} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default SeatBooking;
