import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Pagination, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Snackbar, Alert } from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import colors from "@/assets/styles/color";

const ScheduleFloorManagement = () => {
	const navigate = useNavigate();
	const [scheduleFloors, setScheduleFloors] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit] = useState(10);
	const [open, setOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deleteScheduleFloorId, setDeleteScheduleFloorId] = useState(null);
	const [editScheduleFloor, setEditScheduleFloor] = useState(null);
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

	useEffect(() => {
		fetchScheduleFloors(currentPage);
	}, [currentPage]);

	const fetchScheduleFloors = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get("schedule/floor", { params: { page, limit } });

			if (res.data.success) {
				setScheduleFloors(res.data.scheduleFloors.data);
				setTotalPages(res.data.scheduleFloors.last_page);
				setCurrentPage(res.data.scheduleFloors.current_page);
			}
		} catch (error) {
			setSnackbar({ open: true, message: "Error fetching Meeting Locations!", severity: "error" });
		} finally {
			setIsLoading(false);
		}
	};

	const handleOpen = (scheduleFloor = null) => {
		if (scheduleFloor) {
			setEditScheduleFloor(scheduleFloor);
			setName(scheduleFloor.name);
		} else {
			setEditScheduleFloor(null);
			setName("");
		}
		setError("");
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setError("");
		setName("");
	};

	const handleSubmit = async () => {
		if (!name.trim()) {
			setError("Meeting Location name is required");
			return;
		}
		setIsSaving(true);
		try {
			if (editScheduleFloor) {
				await axiosInstance.put(`schedule/floor/${editScheduleFloor.id}`, { name });
				setSnackbar({ open: true, message: "Meeting Location updated successfully!", severity: "success" });
			} else {
				await axiosInstance.post("schedule/floor", { name });
				setSnackbar({ open: true, message: "Meeting Location added successfully!", severity: "success" });
			}
			fetchScheduleFloors();
			handleClose();
		} catch (error) {
			setSnackbar({ open: true, message: "Error saving Meeting Location!", severity: "error" });
		} finally {
			setIsSaving(false);
		}
	};

	const openDeleteDialog = (scheduleFloorId) => {
		setDeleteScheduleFloorId(scheduleFloorId);
		setDeleteDialogOpen(true);
	};

	const closeDeleteDialog = () => {
		setDeleteDialogOpen(false);
		setDeleteScheduleFloorId(null);
	};

	const handleDelete = async () => {
		try {
			await axiosInstance.delete(`schedule/floor/${deleteScheduleFloorId}`);
			setSnackbar({ open: true, message: "Meeting Location deleted successfully!", severity: "success" });
			fetchScheduleFloors();
		} catch (error) {
			setSnackbar({ open: true, message: "Error deleting Meeting Location!", severity: "error" });
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
									Meeting Locations
								</Typography>
							</div>
							<div className="col-auto ms-auto">
								<Button variant="contained" sx={{ bgcolor: colors.primary, borderRadius: "10px", "&:hover": { bgcolor: "#FFCC16" } }} onClick={() => handleOpen()}>
									New Meeting Location
								</Button>
							</div>
						</div>

						{/* Table */}
						<TableContainer component={Paper} sx={{ boxShadow: "none" }}>
							<Table>
								<TableHead sx={{ bgcolor: "#F8FAFC" }}>
									<TableRow>
										<TableCell>Name</TableCell>
										<TableCell>Action</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{isLoading ? (
										<TableRow>
											<TableCell colSpan={2} align="center">
												<CircularProgress sx={{ color: "#FFCC16" }} />
											</TableCell>
										</TableRow>
									) : scheduleFloors.length > 0 ? (
										scheduleFloors.map((scheduleFloor) => (
											<TableRow key={scheduleFloor.id}>
												<TableCell>{scheduleFloor.name}</TableCell>
												<TableCell>
													<Button onClick={() => handleOpen(scheduleFloor)} color="primary">
														Edit
													</Button>
													<Button onClick={() => openDeleteDialog(scheduleFloor.id)} color="secondary">
														Delete
													</Button>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={2} align="center">
												No Meeting Locations found.
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
					</div>
				</div>
			</div>

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteDialogOpen} onClose={closeDeleteDialog} maxWidth="xs" fullWidth>
				<DialogTitle>Confirm Delete</DialogTitle>
				<DialogContent>Are you sure you want to delete this Meeting Location?</DialogContent>
				<DialogActions>
					<Button onClick={closeDeleteDialog} color="secondary">
						Cancel
					</Button>
					<Button onClick={handleDelete} variant="contained" color="error">
						Delete
					</Button>
				</DialogActions>
			</Dialog>

			{/* Add/Edit Meeting Location Modal */}
			<Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
				<DialogTitle>{editScheduleFloor ? "Edit Meeting Location" : "New Meeting Location"}</DialogTitle>
				<DialogContent>
					<TextField fullWidth label="Meeting Location Name" variant="outlined" margin="normal" value={name} onChange={(e) => setName(e.target.value)} error={!!error} helperText={error} />
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="secondary">
						Cancel
					</Button>
					<Button onClick={handleSubmit} variant="contained" color="primary" disabled={isSaving}>
						{editScheduleFloor ? "Update" : "Save"}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default ScheduleFloorManagement;
