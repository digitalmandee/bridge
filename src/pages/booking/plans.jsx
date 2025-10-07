import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, Snackbar, Alert, InputLabel, FormControl } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Loader from "@/components/Loader";
import colors from "@/assets/styles/color";
import { MdArrowBackIos } from "react-icons/md";

const BookingPlans = () => {
	const navigate = useNavigate();
	const { branch } = useParams();
	const [bookingPlans, setBookingPlans] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [currentPlan, setCurrentPlan] = useState(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const [editData, setEditData] = useState({
		name: "",
		type: "",
		price: "",
		booking_hours: "",
		printing_papers: "",
	});

	const [validationErrors, setValidationErrors] = useState({});
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

	const handleMenuOpen = (event, plan) => {
		setAnchorEl(event.currentTarget);
		setCurrentPlan(plan);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleEditClick = () => {
		setEditData({
			name: currentPlan.name,
			type: currentPlan.type,
			price: currentPlan.price,
			booking_hours: currentPlan.booking_hours || "",
			printing_papers: currentPlan.printing_papers || "",
		});
		setValidationErrors({});
		setIsEditModalOpen(true);
		handleMenuClose();
	};

	const handleDeleteClick = () => {
		setIsDeleteDialogOpen(true);
		handleMenuClose();
	};

	const confirmDelete = async () => {
		try {
			await axiosInstance.delete(`booking-plans/${currentPlan.id}`);
			setBookingPlans((prev) => prev.filter((plan) => plan.id !== currentPlan.id));
			setSnackbar({ open: true, message: "Plan deleted successfully!", severity: "success" });
		} catch (error) {
			console.error("Error deleting booking plan", error);
			setSnackbar({ open: true, message: error.response?.data?.message || "Failed to delete plan", severity: "error" });
		} finally {
			setIsDeleteDialogOpen(false);
		}
	};

	const handleEditSubmit = async () => {
		const errors = {};
		if (!editData.name.trim()) errors.name = "Name is required";
		if (!editData.type) errors.type = "Type is required";
		if (!editData.price || Number(editData.price) <= 0) errors.price = "Valid price is required";

		if (editData.type === "monthly") {
			if (!editData.booking_hours || Number(editData.booking_hours) <= 0) errors.booking_hours = "Booking hours must be greater than 0";
			if (!editData.printing_papers || Number(editData.printing_papers) <= 0) errors.printing_papers = "Printing papers must be greater than 0";
		}

		if (Object.keys(errors).length > 0) {
			setValidationErrors(errors);
			return;
		}

		try {
			const payload = {
				name: editData.name.trim(),
				type: editData.type,
				price: Number(editData.price),
				...(editData.type === "monthly" && {
					booking_hours: Number(editData.booking_hours),
					printing_papers: Number(editData.printing_papers),
				}),
			};

			const response = await axiosInstance.put(`booking-plans/${currentPlan.id}`, payload);
			setBookingPlans((prev) => prev.map((plan) => (plan.id === currentPlan.id ? response.data.data : plan)));
			setIsEditModalOpen(false);
			setSnackbar({ open: true, message: "Plan updated successfully!", severity: "success" });
			setValidationErrors({});
		} catch (error) {
			console.error("Error updating booking plan", error);
			setSnackbar({ open: true, message: error.response?.data?.message || "Failed to update plan", severity: "error" });
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setEditData({ ...editData, [name]: value });
		setValidationErrors((prev) => ({ ...prev, [name]: "" }));
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	useEffect(() => {
		const fetchBookingPlanData = async () => {
			setIsLoading(true);
			try {
				const response = await axiosInstance.get(`booking-plans`);
				if (response.data && Array.isArray(response.data.data)) {
					setBookingPlans(response.data.data);
				}
			} catch (error) {
				console.error("Error fetching booking plan data", error);
				setSnackbar({ open: true, message: "Failed to fetch booking plans", severity: "error" });
			} finally {
				setIsLoading(false);
			}
		};

		fetchBookingPlanData();
	}, []);

	return (
		<>
			<TopNavbar />
			<div className="main">
				<div className="sidebarWrapper">
					<Sidebar />
				</div>
				<div className="content" style={{padding:"0.5rem"}}>
					<div className="d-flex justify-content-between align-items-center">
						<div style={{ paddingTop: "1rem", display: "flex", alignItems: "center", marginBottom: "20px" }}>
							<div onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
								<MdArrowBackIos style={{ fontSize: "20px", marginRight: "1rem" }} />
							</div>
							<h4 style={{ margin: 0 }}>Price Plan</h4>
						</div>
						<Link
							to={`/${branch}/branch/booking/plans/create`}
							style={{
								padding: "10px 20px",
								borderRadius: "5px",
								backgroundColor: colors.primary,
								color: "#fff",
								border: "none",
								fontSize: "16px",
								cursor: "pointer",
								textDecoration: "none",
							}}>
							Add Plan
						</Link>
					</div>
					<div className="row card">
						<table className="table table-responsive">
							<thead>
								<tr>
									<th className="p-3">Name</th>
									<th className="p-3">Plan</th>
									<th className="p-3">Fees</th>
									<th className="p-3 text-end">Actions</th>
								</tr>
							</thead>
							<tbody>
								{isLoading ? (
									<tr>
										<td colSpan="4">
											<Loader variant="C" />
										</td>
									</tr>
								) : bookingPlans.length ? (
									bookingPlans.map((plan, index) => (
										<tr key={index}>
											<td className="px-3">
												<b>{plan.name}</b>
												<br />
												<small>{plan.branch?.name || "No location available"}</small>
											</td>
											<td className="px-3" style={{ textTransform: "capitalize" }}>
												{plan.type}
											</td>
											<td className="px-3">Rs. {plan.price}</td>
											<td className="d-flex justify-content-end">
												<IconButton onClick={(e) => handleMenuOpen(e, plan)}>
													<MoreVertIcon />
												</IconButton>
												<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
													<MenuItem onClick={handleEditClick}>Edit</MenuItem>
													<MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
												</Menu>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="4" className="text-center">
											No booking plans available
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* Edit Modal */}
			<Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
				<DialogTitle>Edit Booking Plan</DialogTitle>
				<DialogContent>
					<TextField className="mb-3" margin="dense" label="Name" name="name" fullWidth value={editData.name} onChange={handleInputChange} error={!!validationErrors.name} helperText={validationErrors.name} />
					<FormControl fullWidth className="mb-3" error={!!validationErrors.type}>
						<InputLabel>Type</InputLabel>
						<Select label="Type" name="type" fullWidth value={editData.type} onChange={handleInputChange}>
							<MenuItem value="full_day">Full Day</MenuItem>
							<MenuItem value="monthly">Monthly</MenuItem>
						</Select>
						{validationErrors.type && <span style={{ color: "#d32f2f", fontSize: "0.75rem", marginTop: "3px" }}>{validationErrors.type}</span>}
					</FormControl>

					<TextField className="mb-3" margin="dense" label="Price" name="price" type="number" fullWidth value={editData.price} onChange={handleInputChange} error={!!validationErrors.price} helperText={validationErrors.price} />

					{editData.type === "monthly" && (
						<>
							<TextField className="mb-3" margin="dense" label="Booking Hours" name="booking_hours" type="number" fullWidth value={editData.booking_hours} onChange={handleInputChange} error={!!validationErrors.booking_hours} helperText={validationErrors.booking_hours} />
							<TextField className="mb-3" margin="dense" label="Printing Papers" name="printing_papers" type="number" fullWidth value={editData.printing_papers} onChange={handleInputChange} error={!!validationErrors.printing_papers} helperText={validationErrors.printing_papers} />
						</>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setIsEditModalOpen(false)} color="secondary">
						Cancel
					</Button>
					<Button onClick={handleEditSubmit} color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
				<DialogTitle>Confirm Delete</DialogTitle>
				<DialogContent>Are you sure you want to delete this plan?</DialogContent>
				<DialogActions>
					<Button onClick={() => setIsDeleteDialogOpen(false)} color="secondary">
						Cancel
					</Button>
					<Button onClick={confirmDelete} color="primary">
						Delete
					</Button>
				</DialogActions>
			</Dialog>

			{/* Snackbar */}
			<Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
				<Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
					{snackbar.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default BookingPlans;
