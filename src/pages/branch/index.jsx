import React, { useContext, useEffect, useState } from "react";
import TopNavbar from "@/components/superadmin/topNavbar";
import Sidebar from "@/components/superadmin/leftSideBar";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, MenuItem, Select, CircularProgress, Pagination, Modal, FormControl, InputLabel } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "@/utils/axiosInstance";
import { AuthContext } from "@/contexts/SuperContext";
import { FileText } from "lucide-react";
import colors from "@/assets/styles/color";
const BranchManagement = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	const [branches, setBranches] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(10);
	const [open, setOpen] = useState(false);
	const [selectedBranch, setSelectedBranch] = useState(null);
	const [formData, setFormData] = useState({});
	const [errors, setErrors] = useState({});

	const getBranches = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get("branches", { params: { page, limit } });
			setBranches(res.data.branches.data);
			setTotalPages(res.data.last_page);
		} catch (error) {
			console.error("Error fetching branches:", error.response);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getBranches(currentPage);
	}, [currentPage, limit]);

	const handleOpen = (branch) => {
		setSelectedBranch(branch);
		setFormData({
			name: branch.name,
			floors: branch.floors,
			rooms: branch.rooms,
			seats: branch.seats,
			tables: branch.tables,
			status: branch.status,
		});
		setErrors({});
		setOpen(true);
	};

	const handleClose = () => setOpen(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const validate = () => {
		let tempErrors = {};
		if (!formData.name) tempErrors.name = "Branch Name is required";
		if (!formData.floors) tempErrors.floors = "Floors are required";
		if (!formData.rooms) tempErrors.rooms = "Rooms are required";
		if (!formData.seats) tempErrors.seats = "Seats are required";
		if (!formData.tables) tempErrors.tables = "Tables are required";
		setErrors(tempErrors);
		return Object.keys(tempErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validate()) return;
		try {
			console.log(formData);

			await axiosInstance.put(`branches/${selectedBranch.id}`, formData);
			handleClose();
			getBranches(currentPage);
		} catch (error) {
			console.error("Error updating branch:", error.response);
		}
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
							<div className="col-auto ">
								<Typography variant="h4" className="mb-0 ms-2">
									Branches
								</Typography>
							</div>
						</div>

						{/* Filters and Search */}
						<div className="row mb-4 align-items-center">
							<div className="col-md-4">
								<TextField
									fullWidth
									size="small"
									placeholder="Search"
									InputProps={{
										startAdornment: <SearchIcon sx={{ color: "#64748B", mr: 1 }} />,
									}}
								/>
							</div>
						</div>

						{/* Table */}
						<TableContainer component={Paper} sx={{ boxShadow: "none" }}>
							{isLoading ? (
								<Box display="flex" justifyContent="center" alignItems="center" p={3}>
									<CircularProgress sx={{ color: "#0F172A" }} />
								</Box>
							) : (
								<Table>
									<TableHead sx={{ bgcolor: "#F8FAFC" }}>
										<TableRow>
											<TableCell>ID</TableCell>
											<TableCell>User Name</TableCell>
											<TableCell>Email</TableCell>
											<TableCell>Branch Name</TableCell>
											<TableCell>Branch Location</TableCell>
											<TableCell>Floor</TableCell>
											<TableCell>Room</TableCell>
											<TableCell>Seats</TableCell>
											<TableCell>Action</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{branches.length > 0 ? (
											branches.map((branch, i) => (
												<TableRow key={i}>
													<TableCell>{branch.id}</TableCell>
													<TableCell>{branch.username}</TableCell>
													<TableCell>{branch.email}</TableCell>
													<TableCell>{branch.name}</TableCell>
													<TableCell>{branch.location}</TableCell>
													<TableCell>{branch.floors}</TableCell>
													<TableCell>{branch.rooms}</TableCell>
													<TableCell>{branch.seats}</TableCell>
													<TableCell>
														<Button size="small" variant="contained" sx={{ bgcolor: colors.primary }} onClick={() => handleOpen(branch)}>
															Edit
														</Button>
													</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell colSpan={7} align="center">
													No branches found.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							)}
						</TableContainer>

						{/* Pagination */}
						<Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
							<Pagination count={totalPages} page={currentPage} onChange={(event, page) => setCurrentPage(page)} />
						</Box>
					</div>
				</div>
			</div>

			<Modal open={open} onClose={handleClose} style={{ overflowY: "auto" }} position="top">
				<Box className="modal-box" sx={modalStyle}>
					<Typography variant="h6">Edit Branch</Typography>
					<Box display="flex" flexWrap="wrap" justifyContent="space-between" gap={1}>
						<TextField fullWidth margin="normal" label="Username" value={selectedBranch?.username} InputProps={{ readOnly: true, style: { color: "#888" } }} sx={{ flex: "0 0 48%" }} />
						<TextField fullWidth margin="normal" label="Email" value={selectedBranch?.email} InputProps={{ readOnly: true, style: { color: "#888" } }} sx={{ flex: "0 0 48%" }} />
						<TextField fullWidth margin="normal" label="Location" value={selectedBranch?.location} InputProps={{ readOnly: true, style: { color: "#888" } }} sx={{ flex: "0 0 48%" }} />
						<TextField fullWidth margin="normal" label="Branch Name" name="name" value={formData.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} sx={{ flex: "0 0 48%" }} />
						<TextField fullWidth margin="normal" label="Floors" name="floors" value={formData.floors} onChange={handleChange} error={!!errors.floors} helperText={errors.floors} sx={{ flex: "0 0 48%" }} />
						<TextField fullWidth margin="normal" label="Rooms" name="rooms" value={formData.rooms} onChange={handleChange} error={!!errors.rooms} helperText={errors.rooms} sx={{ flex: "0 0 48%" }} />
						<TextField fullWidth margin="normal" label="Tables" name="tables" value={formData.tables} onChange={handleChange} error={!!errors.tables} helperText={errors.tables} sx={{ flex: "0 0 48%" }} />
						<TextField fullWidth margin="normal" label="Seats" name="seats" value={formData.seats} onChange={handleChange} error={!!errors.seats} helperText={errors.seats} sx={{ flex: "0 0 48%" }} />
						<FormControl fullWidth>
							<InputLabel id="status">Status</InputLabel>
							<Select name="status" labelId="status" value={formData.status} onChange={handleChange}>
								<MenuItem value="active">Active</MenuItem>
								<MenuItem value="inactive">Inactive</MenuItem>
								<MenuItem value="blocked">Blocked</MenuItem>
							</Select>
						</FormControl>
					</Box>
					<Box display="flex" justifyContent="end" sx={{ mt: 2 }}>
						<Button variant="outlined" onClick={handleClose} sx={{ mr: 1 }}>
							Close
						</Button>
						<Button variant="contained" onClick={handleSubmit}>
							Save
						</Button>
					</Box>
				</Box>
			</Modal>
		</>
	);
};

export default BranchManagement;

const modalStyle = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 700,
	bgcolor: "background.paper",
	boxShadow: 24,
	marginTop: 10,
	marginBottom: 10,
	p: 4,
	borderRadius: 2,
};
