import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { FaPrint, FaTrashAlt, FaSearch, FaEdit, FaEye } from "react-icons/fa";
import axios from "axios";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, Snackbar, TextField } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const StaffManagement = () => {
	const [status, setStatus] = useState("all");
	const [totalAll, setTotalAll] = useState(0);
	const [totalActive, setTotalActive] = useState(0);
	const [totalInactive, setTotalInactive] = useState(0);
	const [staffs, setStaffs] = useState([]);
	const [avaiablePrintingQuota, setAvaiablePrintingQuota] = useState(0);
	const [avaiableBookingQuota, setAvaiableBookingQuota] = useState(0);
	const [bookingSeats, setBookingSeats] = useState([]);
	const [openEdit, setOpenEdit] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const [selectedStaff, setSelectedStaff] = useState(null);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const navigate = useNavigate();
	const [errors, setErrors] = useState({});

	useEffect(() => {
		fetchStaffData();
	}, [status]);

	const fetchStaffData = async () => {
		try {
			const res = await axios.get(import.meta.env.VITE_BASE_API + "company/staffs?filter=" + status, {
				headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}`, "Content-Type": "application/json" },
			});
			setAvaiablePrintingQuota(res.data.printingQuota);
			setAvaiableBookingQuota(Number(res.data.bookingQuota));
			setTotalAll(res.data.totalAll);
			setTotalActive(res.data.totalActive);
			setTotalInactive(res.data.totalInactive);
			setStaffs(res.data.staffs);
		} catch (error) {
			console.error("Error fetching staff data", error);
		}
	};

	useEffect(() => {
		const fetchStaffData = async () => {
			try {
				const res = await axios.get(import.meta.env.VITE_BASE_API + "company/dashboard/staff", {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						"Content-Type": "application/json",
					},
				});
				setAvaiablePrintingQuota(res.data.printingQuota);
				setAvaiableBookingQuota(Number(res.data.bookingQuota));
				setBookingSeats(res.data.chairs);
			} catch (error) {
				console.log(error.response.data);
			}
		};
		fetchStaffData();
	}, []);

	// Open Edit Modal
	const handleEditClick = (staff) => {
		setSelectedStaff(staff);
		setOpenEdit(true);
	};

	// Update Staff Data
	const handleEditSave = async () => {
		setErrors({});

		// Check for required fields
		const newErrors = {};

		if (!selectedStaff.name) newErrors.name = "Name is required";

		// Check if printingPaper exceeds available quota
		if (selectedStaff.printingPaper > avaiablePrintingQuota) {
			newErrors.printingPaper = `Printing paper exceeds available quota of ${avaiablePrintingQuota}`;
		}

		// Check if bookingQuota exceeds available quota
		if (selectedStaff.bookingQuota > avaiableBookingQuota) {
			newErrors.bookingQuota = `Booking quota exceeds available quota of ${avaiableBookingQuota}`;
		}

		// If there are errors, set the errors state and return
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		try {
			await axios.put(`${import.meta.env.VITE_BASE_API}company/staffs/${selectedStaff.id}`, selectedStaff, {
				headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
			});
			setSnackbarMessage("Staff details updated successfully!");
			setOpenSnackbar(true);
			setOpenEdit(false);
			fetchStaffData();
		} catch (error) {
			console.error("Error updating staff", error.response.data);
		}
	};

	// Open Delete Confirmation Modal
	const handleDeleteClick = (staff) => {
		setSelectedStaff(staff);
		setOpenDelete(true);
	};

	// Delete Staff
	const handleDeleteConfirm = async () => {
		try {
			await axios.delete(`${import.meta.env.VITE_BASE_API}company/staffs/${selectedStaff.id}`, {
				headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
			});
			setSnackbarMessage("Staff deleted successfully!");
			setOpenSnackbar(true);
			setOpenDelete(false);
			fetchStaffData();
		} catch (error) {
			console.error("Error deleting staff", error);
		}
	};

	return (
		<>
			<TopNavbar />
			<div className="main d-flex">
				<Sidebar />
				<div className="content">
					<div style={{ padding: "1rem", display: "flex", alignItems: "center", cursor: "pointer" }}>
						<MdArrowBackIos style={{ fontSize: "20px", marginRight: "10px" }} onClick={() => navigate(-1)} />
						<h2 style={{ margin: 0 }}>Staff Archive</h2>
					</div>

					<div style={{ padding: "16px", backgroundColor: "#F8F9FA", width: "95%" }}>
						<div>
							{/* First Child Div with Filter Buttons */}
							<div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
								<div style={{ display: "flex", alignItems: "center" }}>
									<button style={{ marginRight: "8px", backgroundColor: "white", border: "1px solid #ccc", borderRadius: "4px", padding: "8px" }}>
										All <span style={{ marginLeft: "4px", color: "gray" }}>{totalAll}</span>
									</button>
									<button style={{ marginRight: "8px", backgroundColor: "white", border: "1px solid #ccc", borderRadius: "4px", padding: "8px" }}>
										Active <span style={{ marginLeft: "4px", color: "gray" }}>{totalActive}</span>
									</button>
									<button style={{ backgroundColor: "white", border: "1px solid #ccc", borderRadius: "4px", padding: "8px" }}>
										Inactive <span style={{ marginLeft: "4px", color: "gray" }}>{totalInactive}</span>
									</button>
								</div>
							</div>
							{/* Line Below the First Child Div */}
							<hr style={{ margin: "16px 0", border: "1px solid #ccc" }} />
							{/* Second Child Div with Search Bar and Action Buttons */}
							<div
								style={{
									display: "flex",
									justifyContent: "flex-end",
									alignItems: "center",
								}}>
								<button style={{ marginRight: "8px", backgroundColor: "#979797", color: "#f2f2f2", border: "none", borderRadius: "4px", padding: "8px", display: "flex", alignItems: "center" }}>
									<FaPrint style={{ marginRight: "4px", color: "#f2f2f2" }} />
									Print
								</button>
								<button style={{ marginRight: "8px", backgroundColor: "#979797", color: "#f2f2f2", border: "none", borderRadius: "4px", padding: "8px", display: "flex", alignItems: "center" }}>
									<FaTrashAlt style={{ marginRight: "4px", color: "#f2f2f2" }} />
									Delete
								</button>
								<div style={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: "4px", padding: "4px", width: "200px" }}>
									<FaSearch style={{ marginRight: "4px", color: "gray" }} />
									<input
										type="text"
										placeholder="Search name, role"
										style={{
											border: "none",
											outline: "none",
											width: "100%",
										}}
									/>
								</div>
							</div>
						</div>
						<table style={{ width: "100%", marginTop: "1rem", borderCollapse: "collapse", backgroundColor: "white" }}>
							<thead style={{ backgroundColor: "#C5D9F0", color: "black" }}>
								<tr>
									<th style={{ padding: "12px" }}>ID</th>
									<th style={{ padding: "12px" }}>Name</th>
									<th style={{ padding: "12px" }}>Email</th>
									<th style={{ padding: "12px" }}>Designation</th>
									<th style={{ padding: "12px" }}>Date Joined</th>
									<th style={{ padding: "12px" }}>Status</th>
									<th style={{ padding: "12px" }}>Action</th>
								</tr>
							</thead>
							<tbody>
								{staffs.length > 0 ? (
									staffs.map((staff, index) => (
										<tr key={index} style={{ borderBottom: "1px solid #ccc" }}>
											<td style={{ padding: "12px" }}>{staff.id}</td>
											<td style={{ padding: "12px" }}>{staff.name}</td>
											<td style={{ padding: "12px" }}>{staff.email}</td>
											<td style={{ padding: "12px" }}>{staff.designation || "N/A"}</td>
											<td style={{ padding: "12px" }}>{new Date(staff.created_at).toLocaleDateString()}</td>
											<td style={{ padding: "12px", color: staff.status === "active" ? "green" : "red" }}>{staff.status}</td>
											<td style={{ padding: "12px" }}>
												<IconButton size="small" onClick={() => handleEditClick(staff)}>
													<FaEdit color="#0D2B4E" />
												</IconButton>
												<IconButton size="small" onClick={() => handleDeleteClick(staff)}>
													<FaTrashAlt color="#0D2B4E" />
												</IconButton>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="7" style={{ padding: "12px", textAlign: "center" }}>
											No staffs found
										</td>
									</tr>
								)}
							</tbody>
						</table>
						<div style={{ marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
							<div>
								<span>Showing 1 to 4 of 67 entries</span>
							</div>
							<div style={{ display: "flex", alignItems: "center" }}>
								<button style={{ marginRight: "8px", backgroundColor: "#F8F9FA", border: "none", borderRadius: "4px", padding: "8px" }}>Previous</button>
								<button style={{ marginRight: "8px", backgroundColor: "#0D2B4E", color: "white", border: "none", borderRadius: "4px", padding: "8px" }}>1</button>
								<button style={{ marginRight: "8px", backgroundColor: "white", border: "none", borderRadius: "4px", padding: "8px" }}>2</button>
								<button style={{ marginRight: "8px", backgroundColor: "white", border: "none", borderRadius: "4px", padding: "8px" }}>3</button>
								<button style={{ marginRight: "8px", backgroundColor: "white", border: "none", borderRadius: "4px", padding: "8px" }}>...</button>
								<button style={{ backgroundColor: "#F8F9FA", border: "none", borderRadius: "4px", padding: "8px" }}>Next</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Edit Modal */}

			<Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="lg">
				<DialogTitle>Edit Staff</DialogTitle>
				<DialogContent>
					<Box
						sx={{
							backgroundColor: "white",
							borderRadius: 2,
							width: "700px",
						}}>
						{selectedStaff && (
							<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", width: "100%" }}>
								<div>
									<TextField label="Name" fullWidth margin="dense" value={selectedStaff?.name || ""} onChange={(e) => setSelectedStaff({ ...selectedStaff, name: e.target.value })} />
									{errors.name && <span style={{ color: "red", fontSize: "12px" }}>{errors.name}</span>}
								</div>
								<TextField label="Email" fullWidth margin="dense" value={selectedStaff?.email || ""} disabled />
								<TextField label="Password" type="password" fullWidth margin="dense" value={selectedStaff?.password || ""} onChange={(e) => setSelectedStaff({ ...selectedStaff, password: e.target.value })} />
								<TextField label="Phone Number" fullWidth margin="dense" value={selectedStaff?.phone_no || ""} onChange={(e) => setSelectedStaff({ ...selectedStaff, phone_no: e.target.value })} />
								<TextField label="Designation" fullWidth margin="dense" value={selectedStaff?.designation || ""} onChange={(e) => setSelectedStaff({ ...selectedStaff, designation: e.target.value })} />
								<TextField label="Address" fullWidth margin="dense" value={selectedStaff?.address || ""} onChange={(e) => setSelectedStaff({ ...selectedStaff, address: e.target.value })} />
								<div>
									<TextField label="Booking Quota" type="number" fullWidth margin="dense" value={selectedStaff?.booking_quota || ""} onChange={(e) => setSelectedStaff({ ...selectedStaff, booking_quota: e.target.value })} />
									{errors.printingPaper && <span style={{ color: "red", fontSize: "12px" }}>{errors.printingPaper}</span>}
								</div>
								<div>
									<TextField label="Printing Paper" type="number" fullWidth margin="dense" value={selectedStaff?.printing_quota || ""} onChange={(e) => setSelectedStaff({ ...selectedStaff, printing_quota: e.target.value })} />
									{errors.bookingQuota && <span style={{ color: "red", fontSize: "12px" }}>{errors.bookingQuota}</span>}
								</div>

								<Select fullWidth label="Select Seat No" id="select-status" value={selectedStaff?.allocated_seat_id} onChange={(e) => setSelectedStaff({ ...selectedStaff, allocated_seat_id: e.target.value })}>
									<MenuItem value="">Select Seat</MenuItem>
									{selectedStaff.chair && (
										<MenuItem value={selectedStaff.chair.id}>
											{selectedStaff.chair.table.table_id} {selectedStaff.chair.chair_id}
										</MenuItem>
									)}
									{bookingSeats.length > 0 &&
										bookingSeats.map((seat, index) => (
											<MenuItem key={index} value={seat.chair_id}>
												{seat.table} {seat.id}
											</MenuItem>
										))}
								</Select>
								<Select fullWidth label="Select Status" id="select-status" value={selectedStaff?.status || ""} onChange={(e) => setSelectedStaff({ ...selectedStaff, status: e.target.value })}>
									<MenuItem value="active">Active</MenuItem>
									<MenuItem value="inactive">Inactive</MenuItem>
								</Select>
							</div>
						)}
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenEdit(false)}>Cancel</Button>
					<Button onClick={handleEditSave} color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>

			{/* Delete Confirmation Modal */}
			<Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
				<DialogTitle>Confirm Delete</DialogTitle>
				<DialogContent>Are you sure you want to delete this staff member?</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDelete(false)}>Cancel</Button>
					<Button onClick={handleDeleteConfirm} color="error">
						Delete
					</Button>
				</DialogActions>
			</Dialog>

			{/* Snackbar Notification */}
			<Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
				<MuiAlert onClose={() => setOpenSnackbar(false)} severity="success">
					{snackbarMessage}
				</MuiAlert>
			</Snackbar>
		</>
	);
};

export default StaffManagement;
