import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Snackbar, Alert, Select, MenuItem, FormControl, InputLabel, Pagination } from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import colors from "@/assets/styles/color";

const ScheduleRoomManagement = () => {
	const navigate = useNavigate();

	// States
	const [scheduleRooms, setScheduleRooms] = useState([]);
	const [scheduleFloors, setScheduleFloors] = useState([]); // Dropdown
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit] = useState(10);

	// Dialog States
	const [open, setOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	// Editing & Deleting
	const [deleteScheduleRoomId, setDeleteScheduleRoomId] = useState(null);
	const [editScheduleRoom, setEditScheduleRoom] = useState(null);

	// Form Fields
	const [name, setName] = useState("");
	const [scheduleFloorId, setScheduleFloorId] = useState("");
	const [error, setError] = useState("");

	// Snackbar (Alerts)
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

	useEffect(() => {
		fetchScheduleRooms(currentPage);
	}, [currentPage]);

	useEffect(() => {
		fetchScheduleFloors();
	}, []);

	// Fetch Meeting Rooms
	const fetchScheduleRooms = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get("schedule/room", { params: { page, limit } });
			if (res.data.success) {
				setScheduleRooms(res.data.scheduleRooms.data);
				setTotalPages(res.data.scheduleRooms.last_page);
				setCurrentPage(res.data.scheduleRooms.current_page);
			}
		} catch (error) {
			setSnackbar({ open: true, message: "Error fetching Meeting rooms!", severity: "error" });
		} finally {
			setIsLoading(false);
		}
	};

	// Fetch Schedule Floors for Dropdown
	const fetchScheduleFloors = async () => {
		try {
			const res = await axiosInstance.get("booking-schedule/filter");
			if (res.data.success) {
				setScheduleFloors(res.data.locations);
			}
		} catch (error) {
			setSnackbar({ open: true, message: "Error fetching floors!", severity: "error" });
		}
	};

	// Open Create/Edit Dialog
	const handleOpen = (scheduleRoom = null) => {
		if (scheduleRoom) {
			setEditScheduleRoom(scheduleRoom);
			setName(scheduleRoom.name);
			setScheduleFloorId(scheduleRoom.floor.id);
		} else {
			setEditScheduleRoom(null);
			setName("");
			setScheduleFloorId("");
		}
		setError("");
		setOpen(true);
	};

	// Close Dialog
	const handleClose = () => {
		setOpen(false);
		setError("");
		setName("");
		setScheduleFloorId("");
	};

	// Create or Update Meeting Room
	const handleSubmit = async () => {
		if (!name.trim() || !scheduleFloorId) {
			setError("Both fields are required.");
			return;
		}

		setIsSaving(true);
		try {
			if (editScheduleRoom) {
				await axiosInstance.put(`schedule/room/${editScheduleRoom.id}`, { name, schedule_floor_id: scheduleFloorId });
				setSnackbar({ open: true, message: "Meeting Room updated successfully!", severity: "success" });
			} else {
				await axiosInstance.post("schedule/room", { name, schedule_floor_id: scheduleFloorId });
				setSnackbar({ open: true, message: "Meeting Room added successfully!", severity: "success" });
			}
			fetchScheduleRooms();
			handleClose();
		} catch (error) {
			setSnackbar({ open: true, message: "Error saving Meeting room!", severity: "error" });
		} finally {
			setIsSaving(false);
		}
	};

	// Open Delete Dialog
	const openDeleteDialog = (scheduleRoomId) => {
		setDeleteScheduleRoomId(scheduleRoomId);
		setDeleteDialogOpen(true);
	};

	// Close Delete Dialog
	const closeDeleteDialog = () => {
		setDeleteDialogOpen(false);
		setDeleteScheduleRoomId(null);
	};

	// Handle Delete
	const handleDelete = async () => {
		try {
			await axiosInstance.delete(`schedule/room/${deleteScheduleRoomId}`);
			setSnackbar({ open: true, message: "Meeting Room deleted successfully!", severity: "success" });
			fetchScheduleRooms();
		} catch (error) {
			setSnackbar({ open: true, message: "Error deleting Meeting room!", severity: "error" });
		} finally {
			closeDeleteDialog();
		}
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	return (
		<>
			<TopNavbar />
			<div className="main d-flex">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div className="container-fluid py-4">
						{/* Header */}
						<div className="row mb-4 align-items-center">
							<div className="col-auto d-flex align-items-center">
								<div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
									<MdArrowBackIos style={{ fontSize: "20px" }} />
								</div>
								<Typography variant="h6" className="mb-0 ms-2">
									Meeting Rooms
								</Typography>
							</div>
							<div className="col-auto ms-auto">
								<Button variant="contained" sx={{ bgcolor: colors.primary }} onClick={() => handleOpen()}>
									New Meeting Room
								</Button>
							</div>
						</div>

						{/* Table */}
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Name</TableCell>
										<TableCell>Floor</TableCell>
										<TableCell>Action</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{isLoading ? (
										<TableRow>
											<TableCell colSpan={3} align="center">
												<CircularProgress />
											</TableCell>
										</TableRow>
									) : scheduleRooms.length > 0 ? (
										scheduleRooms.map((room) => (
											<TableRow key={room.id}>
												<TableCell>{room.name}</TableCell>
												<TableCell>{room.floor?.name}</TableCell>
												<TableCell>
													<Button onClick={() => handleOpen(room)} color="primary">
														Edit
													</Button>
													<Button onClick={() => openDeleteDialog(room.id)} color="secondary">
														Delete
													</Button>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={3} align="center">
												No Meeting rooms found.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>

						{/* Pagination */}
						<div className="d-flex justify-content-end mt-4">
							<Pagination count={totalPages} page={currentPage} onChange={(e, page) => setCurrentPage(page)} shape="rounded" />
						</div>

						{/* Create & Edit Dialog */}
						<Dialog open={open} onClose={handleClose}>
							<DialogTitle>{editScheduleRoom ? "Edit Meeting Room" : "Create Meeting Room"}</DialogTitle>
							<DialogContent>
								<TextField fullWidth margin="dense" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
								<FormControl margin="dense" fullWidth>
									<InputLabel id="demo-simple-select-label">Schedule Floor</InputLabel>
									<Select labelId="demo-simple-select-label" id="demo-simple-select" value={scheduleFloorId} label="Schedule Floor" onChange={(e) => setScheduleFloorId(e.target.value)}>
										{scheduleFloors.length > 0 &&
											scheduleFloors.map((floor) => (
												<MenuItem key={floor.id} value={floor.id}>
													{floor.name}
												</MenuItem>
											))}
									</Select>
								</FormControl>
							</DialogContent>
							<DialogActions>
								<Button onClick={handleClose}>Cancel</Button>
								<Button onClick={handleSubmit} disabled={isSaving}>
									{isSaving ? "Saving..." : "Save"}
								</Button>
							</DialogActions>
						</Dialog>

						{/* Delete Dialog */}
						<Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
							<DialogTitle>Confirm Delete</DialogTitle>
							<DialogActions>
								<Button onClick={closeDeleteDialog}>Cancel</Button>
								<Button onClick={handleDelete} color="error">
									Delete
								</Button>
							</DialogActions>
						</Dialog>
					</div>
				</div>
			</div>
		</>
	);
};

export default ScheduleRoomManagement;
