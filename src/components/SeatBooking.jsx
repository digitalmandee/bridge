import { useState } from "react";
import { TextField, Button, Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import colors from "@/assets/styles/color";

const SeatBooking = ({ onBookingSuccess }) => {
    const [open, setOpen] = useState(false);
    const [noOfSeats, setNoOfSeats] = useState('');
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNoOfSeats('');
        setError('');
    };

    const handleSubmit = async () => {
        if (!noOfSeats || isNaN(noOfSeats) || noOfSeats <= 0) {
            setError('Please enter a valid number of seats');
            return;
        }

        try {
            const response = await axiosInstance.post('booking-request', {
                no_of_seats: parseInt(noOfSeats),
            });

            setSnackbarMessage('Booking request saved successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleClose();
            if (onBookingSuccess) {
                onBookingSuccess();
            }
        } catch (err) {
            console.error('Error saving booking request:', err);
            const errorMessage = err.response?.data?.error || 'Failed to save booking request';
            setError(errorMessage);
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);

    return (
        <>
            <Button
                variant="contained"
                sx={{ backgroundColor: colors.primary, color: "white" }}
                onClick={handleOpen}
            >
                Seats Request
            </Button>
            <Dialog open={open} onClose={handleClose}>
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
                        helperText={error}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: colors.primary, color: "white" }}
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: colors.primary, color: "white" }}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snackbarOpen} autoHideDuration={1500} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default SeatBooking;