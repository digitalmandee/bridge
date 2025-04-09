import React, { useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, InputAdornment, InputLabel, Menu, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Pagination } from "@mui/material";
import { Add, ArrowBack, ArrowForward, Delete, Download, Edit, MoreVert, Search } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";

const Deduction = () => {
	const navigate = useNavigate();
	const { branch } = useParams();
	const [deductions, setDeductions] = useState([
		{ id: 1, employeeName: "Gladys", department: "Designer", reason: "Company roll", deduction: 10.0 },
		{ id: 2, employeeName: "Gladys", department: "Social Media Marketer", reason: "Company roll", deduction: 20.0 },
		{ id: 3, employeeName: "Gladys", department: "Engineer", reason: "Company roll", deduction: 30.0 },
		{ id: 4, employeeName: "Gladys", department: "Business man", reason: "Company roll", deduction: 40.0 },
	]);

	// State for filters
	const [selectedDepartment, setSelectedDepartment] = useState("");
	const [selectedEmployee, setSelectedEmployee] = useState("");

	// State for modal
	const [openModal, setOpenModal] = useState(false);
	const [editData, setEditData] = useState({
		id: null,
		employeeName: "",
		department: "",
		deduction: "",
		reason: "",
	});

	// State for action menu
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedDeduction, setSelectedDeduction] = useState(null);

	// State for delete confirmation dialog
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [deductionToDelete, setDeductionToDelete] = useState(null);

	// State for pagination
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = 10;

	// List of departments for dropdown
	const departments = ["Designer", "Social Media Marketer", "Engineer", "Business man"];

	// Handle opening the action menu
	const handleOpenActionMenu = (event, deduction) => {
		setAnchorEl(event.currentTarget);
		setSelectedDeduction(deduction);
	};

	// Handle closing the action menu
	const handleCloseActionMenu = () => {
		setAnchorEl(null);
	};

	// Handle opening the edit modal
	const handleOpenEditModal = () => {
		if (selectedDeduction) {
			setEditData({
				id: selectedDeduction.id,
				employeeName: selectedDeduction.employeeName,
				department: selectedDeduction.department,
				deduction: selectedDeduction.deduction,
				reason: selectedDeduction.reason,
			});
			setOpenModal(true);
		}
		handleCloseActionMenu();
	};

	// Handle opening the add modal
	const handleOpenAddModal = () => {
		setEditData({
			id: null,
			employeeName: "Gladys", // Default name for new entries
			department: "",
			deduction: "",
			reason: "",
		});
		setOpenModal(true);
	};

	// Handle closing the modal
	const handleCloseModal = () => {
		setOpenModal(false);
	};

	// Handle opening delete confirmation dialog
	const handleOpenDeleteDialog = () => {
		setDeductionToDelete(selectedDeduction);
		setOpenDeleteDialog(true);
		handleCloseActionMenu();
	};

	// Handle closing delete confirmation dialog
	const handleCloseDeleteDialog = () => {
		setOpenDeleteDialog(false);
		setDeductionToDelete(null);
	};

	// Handle delete confirmation
	const handleConfirmDelete = () => {
		if (deductionToDelete) {
			const updatedDeductions = deductions.filter((item) => item.id !== deductionToDelete.id);
			setDeductions(updatedDeductions);
		}
		handleCloseDeleteDialog();
	};

	// Handle form input changes
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setEditData({
			...editData,
			[name]: value,
		});
	};

	// Handle form submission
	const handleSubmit = () => {
		if (editData.id) {
			// Update existing deduction
			const updatedDeductions = deductions.map((item) =>
				item.id === editData.id
					? {
							...item,
							department: editData.department,
							deduction: Number.parseFloat(editData.deduction),
							reason: editData.reason,
					  }
					: item
			);
			setDeductions(updatedDeductions);
		} else {
			// Add new deduction
			const newDeduction = {
				id: deductions.length + 1,
				employeeName: editData.employeeName,
				department: editData.department,
				reason: editData.reason,
				deduction: Number.parseFloat(editData.deduction),
			};
			setDeductions([...deductions, newDeduction]);
		}
		handleCloseModal();
	};

	// Handle filter submission
	const handleFilterSubmit = () => {
		// In a real application, this would filter the data based on selected department and employee
		console.log("Filter by:", selectedDepartment, selectedEmployee);
	};

	return (
		<>
			<TopNavbar />
			<div className="main d-flex">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<Container maxWidth="lg" sx={{ mt: 4 }}>
						<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
							<div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
								<MdArrowBackIos style={{ fontSize: "20px", marginRight: "10px" }} />
							</div>
							<Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 1 }}>
								Deductions
							</Typography>
							<Button
								variant="contained"
								color="primary"
								sx={{
									bgcolor: "#0f3460",
									borderRadius: "4px",
									"&:hover": {
										bgcolor: "#0a2748",
									},
								}}
								onClick={() => navigate(`/${branch}/branch/payroll/reimbursement`)}>
								Reimbursements
							</Button>
						</Box>

						<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
							<FormControl sx={{ minWidth: 200 }}>
								<InputLabel id="department-label">Select Dep...</InputLabel>
								<Select labelId="department-label" value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} label="Select Dep...">
									{departments.map((dept) => (
										<MenuItem key={dept} value={dept}>
											{dept}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<FormControl sx={{ minWidth: 200 }}>
								<InputLabel id="employee-label">Select Emp...</InputLabel>
								<Select labelId="employee-label" value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} label="Select Emp...">
									<MenuItem value="Gladys">Gladys</MenuItem>
								</Select>
							</FormControl>

							<Button
								variant="contained"
								onClick={handleFilterSubmit}
								sx={{
									bgcolor: "#0f3460",
									"&:hover": {
										bgcolor: "#0a2748",
									},
								}}>
								Submit
							</Button>

							<Box sx={{ flexGrow: 1 }} />

							<TextField
								placeholder="Search"
								variant="outlined"
								size="small"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Search />
										</InputAdornment>
									),
								}}
							/>

							<IconButton
								aria-label="add"
								sx={{
									bgcolor: "#f0f0f0",
									borderRadius: "50%",
									width: "40px",
									height: "40px",
									"&:hover": {
										bgcolor: "#e0e0e0",
									},
								}}
								onClick={handleOpenAddModal}>
								<Add />
							</IconButton>

							<IconButton
								aria-label="download"
								sx={{
									bgcolor: "#f0f0f0",
									borderRadius: "50%",
									width: "40px",
									height: "40px",
									"&:hover": {
										bgcolor: "#e0e0e0",
									},
								}}>
								<Download />
							</IconButton>
						</Box>

						<TableContainer>
							<Table sx={{ minWidth: 650 }} aria-label="deductions table">
								<TableHead sx={{ bgcolor: "#f5f7fa" }}>
									<TableRow>
										<TableCell>Employ Name</TableCell>
										<TableCell>Department</TableCell>
										<TableCell>Reason</TableCell>
										<TableCell>Deduction</TableCell>
										<TableCell>Action</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{deductions.map((row) => (
										<TableRow key={row.id}>
											<TableCell>{row.employeeName}</TableCell>
											<TableCell>{row.department}</TableCell>
											<TableCell>{row.reason}</TableCell>
											<TableCell>{row.deduction.toFixed(2)}</TableCell>
											<TableCell>
												<IconButton size="small" onClick={(e) => handleOpenActionMenu(e, row)}>
													<MoreVert />
												</IconButton>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>

						{/* Pagination */}
						<Box sx={{ display: "flex", justifyContent: "end", p: 2 }}>
							<Pagination count={totalPages} page={currentPage} onChange={(e, value) => setCurrentPage(value)} />
						</Box>

						{/* Action Menu */}
						<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseActionMenu}>
							<MenuItem onClick={handleOpenEditModal}>
								<Edit fontSize="small" sx={{ mr: 1 }} />
								Edit
							</MenuItem>
							<MenuItem onClick={handleOpenDeleteDialog} sx={{ color: "error.main" }}>
								<Delete fontSize="small" sx={{ mr: 1 }} />
								Delete
							</MenuItem>
						</Menu>

						{/* Edit Modal */}
						<Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
							<DialogTitle>Deductions edit</DialogTitle>
							<DialogContent>
								<Box sx={{ mt: 2 }}>
									<FormControl fullWidth sx={{ mb: 2 }}>
										<InputLabel id="edit-department-label">Department*</InputLabel>
										<Select labelId="edit-department-label" name="department" value={editData.department} onChange={handleInputChange} label="Department*">
											{departments.map((dept) => (
												<MenuItem key={dept} value={dept}>
													{dept}
												</MenuItem>
											))}
										</Select>
									</FormControl>

									<TextField margin="dense" name="deduction" label="Deduction*" type="number" fullWidth variant="outlined" value={editData.deduction} onChange={handleInputChange} sx={{ mb: 2 }} />

									<TextField margin="dense" name="reason" label="Reason*" multiline rows={4} fullWidth variant="outlined" placeholder="Add comment here..." value={editData.reason} onChange={handleInputChange} />
								</Box>
							</DialogContent>
							<DialogActions sx={{ p: 3 }}>
								<Button onClick={handleCloseModal} variant="outlined" sx={{ borderRadius: "4px" }}>
									Cancel
								</Button>
								<Button
									onClick={handleSubmit}
									variant="contained"
									sx={{
										bgcolor: "#0f3460",
										borderRadius: "4px",
										"&:hover": {
											bgcolor: "#0a2748",
										},
									}}>
									Submit
								</Button>
							</DialogActions>
						</Dialog>

						{/* Delete Confirmation Dialog */}
						<Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
							<DialogTitle>Confirm Delete</DialogTitle>
							<DialogContent>
								<DialogContentText>Are you sure you want to delete this deduction record? This action cannot be undone.</DialogContentText>
							</DialogContent>
							<DialogActions sx={{ p: 3 }}>
								<Button onClick={handleCloseDeleteDialog} variant="outlined" sx={{ borderRadius: "4px" }}>
									Cancel
								</Button>
								<Button onClick={handleConfirmDelete} variant="outlined" color="error" sx={{ borderRadius: "4px" }}>
									delete
								</Button>
							</DialogActions>
						</Dialog>
					</Container>
				</div>
			</div>
		</>
	);
};

export default Deduction;
