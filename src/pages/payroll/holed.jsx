import React, { useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Container, Form, Row, Col, Table } from "react-bootstrap";
import { IconButton, Button, Menu, MenuItem, Paper, Box, Typography, Select, FormControl, OutlinedInput, InputAdornment, Dialog, Pagination, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider } from "@mui/material";
import { ArrowBack, Search, Add, Download, MoreVert, Close, Delete as DeleteIcon, CheckCircle as CheckCircleIcon, Check as CheckIcon } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";

const HoledEmployee = () => {
	const navigate = useNavigate();
	const { branch } = useParams();

	const [department, setDepartment] = useState("");
	const [designation, setDesignation] = useState("");
	const [employees, setEmployees] = useState("");
	const [active, setActive] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [page, setPage] = useState(1);

	// State for action menu
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedItem, setSelectedItem] = useState(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	// State for add modal
	const [addModalOpen, setAddModalOpen] = useState(false);
	const [newEmployeeData, setNewEmployeeData] = useState({
		department: "",
		designation: "",
		employee: "",
		reason: "",
	});

	// Sample data
	const [employData, setEmployData] = useState([
		{ id: 1, name: "Gladys", reason: "Bank Detail Missing", isActive: false },
		{ id: 2, name: "John", reason: "Incomplete Verification of Employ", isActive: false },
		{ id: 3, name: "Jane", reason: "Bank Detail Missing", isActive: false },
		{ id: 4, name: "Doe", reason: "Incomplete Verification of Employ", isActive: false },
	]);

	// Handle menu open/close
	const handleMenuOpen = (event, item) => {
		setAnchorEl(event.currentTarget);
		setSelectedItem(item);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setSelectedItem(null);
	};

	// Handle active toggle
	const handleActiveToggle = () => {
		if (selectedItem) {
			setEmployData(employData.map((item) => (item.id === selectedItem.id ? { ...item, isActive: !item.isActive } : item)));
		}
		handleMenuClose();
	};

	// Handle delete
	const handleDeleteClick = () => {
		console.log("Delete clicked for item:", selectedItem); // Debugging
		setDeleteDialogOpen(true);
		handleMenuClose();
	};

	const handleDeleteConfirm = () => {
		if (selectedItem) {
			console.log("Deleting item:", selectedItem); // Debugging
			setEmployData((prevData) => prevData.filter((item) => item.id !== selectedItem.id));
		} else {
			console.error("No item selected for deletion."); // Debugging
		}
		setDeleteDialogOpen(false);
	};

	const handleDeleteCancel = () => {
		setDeleteDialogOpen(false);
	};

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Form submitted");
	};

	// Handle add modal
	const handleAddModalOpen = () => {
		setAddModalOpen(true);
	};

	const handleAddModalClose = () => {
		setAddModalOpen(false);
		setNewEmployeeData({
			department: "",
			designation: "",
			employee: "",
			reason: "",
		});
	};

	const handleAddModalChange = (field, value) => {
		setNewEmployeeData({
			...newEmployeeData,
			[field]: value,
		});
	};

	const handleAddModalSubmit = () => {
		// Add new employee to the list
		const newEmployee = {
			id: employData.length + 1,
			name: newEmployeeData.employee || "New Employee",
			reason: newEmployeeData.reason || "Not specified",
			isActive: false,
		};

		setEmployData([...employData, newEmployee]);
		handleAddModalClose();
	};

	return (
		<>
			<TopNavbar />
			<div className="main d-flex">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div style={{ minHeight: "100vh" }}>
						<Container fluid>
							{/* Header */}
							<Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
								<div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
									<MdArrowBackIos style={{ fontSize: "20px", marginRight: "10px" }} />
								</div>
								<Typography variant="h5" component="h1" sx={{ ml: 1, fontWeight: "bold" }}>
									Holed Employ
								</Typography>
							</Box>

							{/* Filters */}
							<Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: "8px" }}>
								<Form onSubmit={handleSubmit}>
									<Row className="gap-2 d-flex">
										<Col md={2}>
											<div className="mb-1">Department</div>
											<FormControl fullWidth size="small">
												<Select
													value={department}
													onChange={(e) => setDepartment(e.target.value)}
													displayEmpty
													sx={{
														backgroundColor: "white",
														height: "38px",
														"& .MuiSelect-select": {
															color: "#666",
															padding: "8px 14px",
														},
														"& .MuiOutlinedInput-notchedOutline": {
															borderColor: "#dee2e6",
															borderRadius: "6px",
														},
														"&:hover .MuiOutlinedInput-notchedOutline": {
															borderColor: "#dee2e6",
														},
													}}>
													<MenuItem value="" disabled>
														Select Dep...
													</MenuItem>
												</Select>
											</FormControl>
										</Col>
										<Col md={2}>
											<div className="mb-1">Designation</div>
											<FormControl fullWidth size="small">
												<Select
													value={designation}
													onChange={(e) => setDesignation(e.target.value)}
													displayEmpty
													sx={{
														backgroundColor: "white",
														height: "38px",
														"& .MuiSelect-select": {
															color: "#666",
															padding: "8px 14px",
														},
														"& .MuiOutlinedInput-notchedOutline": {
															borderColor: "#dee2e6",
															borderRadius: "6px",
														},
														"&:hover .MuiOutlinedInput-notchedOutline": {
															borderColor: "#dee2e6",
														},
													}}>
													<MenuItem value="" disabled>
														Select Des...
													</MenuItem>
												</Select>
											</FormControl>
										</Col>
										<Col md={2}>
											<div className="mb-1">Employees</div>
											<FormControl fullWidth size="small">
												<Select
													value={employees}
													onChange={(e) => setEmployees(e.target.value)}
													displayEmpty
													sx={{
														backgroundColor: "white",
														height: "38px",
														"& .MuiSelect-select": {
															color: "#666",
															padding: "8px 14px",
														},
														"& .MuiOutlinedInput-notchedOutline": {
															borderColor: "#dee2e6",
															borderRadius: "6px",
														},
														"&:hover .MuiOutlinedInput-notchedOutline": {
															borderColor: "#dee2e6",
														},
													}}>
													<MenuItem value="" disabled>
														Select Emp...
													</MenuItem>
												</Select>
											</FormControl>
										</Col>
										<Col md={2}>
											<div className="mb-1">Active</div>
											<FormControl fullWidth size="small">
												<Select
													value={active}
													onChange={(e) => setActive(e.target.value)}
													displayEmpty
													sx={{
														backgroundColor: "white",
														height: "38px",
														"& .MuiSelect-select": {
															color: "#666",
															padding: "8px 14px",
														},
														"& .MuiOutlinedInput-notchedOutline": {
															borderColor: "#dee2e6",
															borderRadius: "6px",
														},
														"&:hover .MuiOutlinedInput-notchedOutline": {
															borderColor: "#dee2e6",
														},
													}}>
													<MenuItem value="" disabled>
														Select Dep...
													</MenuItem>
												</Select>
											</FormControl>
										</Col>
										<Col md={2} className="d-flex align-items-end">
											<Button
												variant="contained"
												type="submit"
												fullWidth
												sx={{
													backgroundColor: "#1a3c61",
													textTransform: "none",
													height: "38px",
													borderRadius: "6px",
													"&:hover": {
														backgroundColor: "#152f4a",
													},
												}}>
												Submit
											</Button>
										</Col>
									</Row>
								</Form>
							</Paper>

							{/* Search and Actions */}
							<Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mb: 2 }}>
								<OutlinedInput
									size="small"
									placeholder="Search"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									startAdornment={
										<InputAdornment position="start">
											<Search />
										</InputAdornment>
									}
									sx={{ width: "250px" }}
								/>
								<IconButton sx={{ border: "1px solid rgba(0, 0, 0, 0.23)" }} onClick={handleAddModalOpen}>
									<Add />
								</IconButton>
								<IconButton sx={{ border: "1px solid rgba(0, 0, 0, 0.23)" }}>
									<Download />
								</IconButton>
							</Box>

							{/* Table */}
							<Paper elevation={0} sx={{ borderRadius: "8px", overflow: "hidden" }}>
								<Table hover>
									<thead style={{ backgroundColor: "#f8f9fa" }}>
										<tr>
											<th>Employ Name</th>
											<th>Active</th>
											<th>Reason</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>
										{employData.map((item) => (
											<tr key={item.id}>
												<td>{item.name}</td>
												<td>
													<IconButton
														size="small"
														sx={{
															color: item.isActive ? "#4caf50" : "#f44336",
														}}>
														{item.isActive ? <CheckCircleIcon fontSize="small" /> : <Close fontSize="small" />}
													</IconButton>
												</td>
												<td>{item.reason}</td>
												<td>
													<IconButton size="small" onClick={(e) => handleMenuOpen(e, item)}>
														<MoreVert />
													</IconButton>
												</td>
											</tr>
										))}
									</tbody>
								</Table>

								{/* Pagination */}
								<Box sx={{ display: "flex", justifyContent: "end", p: 2 }}>
									<Pagination count={10} page={page} onChange={(e, value) => setPage(value)} />
								</Box>
							</Paper>

							{/* Action Menu */}
							<Menu
								anchorEl={anchorEl}
								open={Boolean(anchorEl)}
								onClose={handleMenuClose}
								PaperProps={{
									style: {
										width: "120px",
										boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
									},
								}}>
								<MenuItem onClick={handleActiveToggle} style={{ minHeight: "36px" }}>
									<Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
										<CheckIcon
											fontSize="small"
											sx={{
												mr: 1,
												background: "yellowgreen",
												color: "white",
												borderRadius: "20px",
											}}
										/>
										Active
									</Box>
								</MenuItem>
								<Divider />
								<MenuItem onClick={handleDeleteClick} style={{ minHeight: "36px" }}>
									<Box sx={{ display: "flex", alignItems: "center", width: "100%", color: "#f44336" }}>
										<DeleteIcon fontSize="small" sx={{ mr: 1 }} />
										Delete
									</Box>
								</MenuItem>
							</Menu>

							{/* Delete Confirmation Dialog */}
							<Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
								<DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
								<DialogContent>
									<DialogContentText id="alert-dialog-description">Are you sure you want to delete this record?</DialogContentText>
								</DialogContent>
								<DialogActions>
									<Button onClick={handleDeleteCancel}>Cancel</Button>
									<Button onClick={handleDeleteConfirm} color="error" autoFocus>
										Delete
									</Button>
								</DialogActions>
							</Dialog>

							{/* Add Employee Modal */}
							<Dialog open={addModalOpen} onClose={handleAddModalClose} aria-labelledby="add-dialog-title" maxWidth="sm" fullWidth>
								<DialogTitle id="add-dialog-title" sx={{ pb: 1 }}>
									Hold Salary Payout
								</DialogTitle>
								<DialogContent sx={{ pt: 2 }}>
									<Form>
										<div className="mb-3">
											<label className="form-label">
												Department<span className="text-danger">*</span>
											</label>
											<FormControl fullWidth size="small">
												<Select
													value={newEmployeeData.department}
													onChange={(e) => handleAddModalChange("department", e.target.value)}
													displayEmpty
													sx={{
														"& .MuiOutlinedInput-notchedOutline": {
															borderColor: "#dee2e6",
															borderRadius: "6px",
														},
													}}>
													<MenuItem value="" disabled>
														Select Department
													</MenuItem>
													<MenuItem value="hr">HR</MenuItem>
													<MenuItem value="it">IT</MenuItem>
													<MenuItem value="finance">Finance</MenuItem>
												</Select>
											</FormControl>
										</div>

										<div className="mb-3">
											<label className="form-label">
												Designation<span className="text-danger">*</span>
											</label>
											<FormControl fullWidth size="small">
												<Select
													value={newEmployeeData.designation}
													onChange={(e) => handleAddModalChange("designation", e.target.value)}
													displayEmpty
													sx={{
														"& .MuiOutlinedInput-notchedOutline": {
															borderColor: "#dee2e6",
															borderRadius: "6px",
														},
													}}>
													<MenuItem value="" disabled>
														Select Designation
													</MenuItem>
													<MenuItem value="manager">Manager</MenuItem>
													<MenuItem value="developer">Developer</MenuItem>
													<MenuItem value="analyst">Analyst</MenuItem>
												</Select>
											</FormControl>
										</div>

										<div className="mb-3">
											<label className="form-label">
												Employee<span className="text-danger">*</span>
											</label>
											<FormControl fullWidth size="small">
												<Select
													value={newEmployeeData.employee}
													onChange={(e) => handleAddModalChange("employee", e.target.value)}
													displayEmpty
													sx={{
														"& .MuiOutlinedInput-notchedOutline": {
															borderColor: "#dee2e6",
															borderRadius: "6px",
														},
													}}>
													<MenuItem value="" disabled>
														Select employee
													</MenuItem>
													<MenuItem value="john">John Doe</MenuItem>
													<MenuItem value="jane">Jane Smith</MenuItem>
													<MenuItem value="gladys">Gladys</MenuItem>
												</Select>
											</FormControl>
										</div>

										<div className="mb-3">
											<label className="form-label">
												Reason<span className="text-danger">*</span>
											</label>
											<FormControl fullWidth>
												<OutlinedInput
													placeholder="Add comment here..."
													multiline
													rows={4}
													value={newEmployeeData.reason}
													onChange={(e) => handleAddModalChange("reason", e.target.value)}
													sx={{
														"& .MuiOutlinedInput-notchedOutline": {
															borderColor: "#dee2e6",
															borderRadius: "6px",
														},
													}}
												/>
											</FormControl>
										</div>
									</Form>
								</DialogContent>
								<DialogActions sx={{ px: 3, pb: 3 }}>
									<Button
										onClick={handleAddModalClose}
										variant="outlined"
										sx={{
											borderRadius: "4px",
											textTransform: "none",
											minWidth: "100px",
										}}>
										Cancel
									</Button>
									<Button
										onClick={handleAddModalSubmit}
										variant="contained"
										sx={{
											backgroundColor: "#1a3c61",
											textTransform: "none",
											borderRadius: "4px",
											minWidth: "100px",
											"&:hover": {
												backgroundColor: "#152f4a",
											},
										}}>
										Submit
									</Button>
								</DialogActions>
							</Dialog>
						</Container>
					</div>
				</div>
			</div>
		</>
	);
};

export default HoledEmployee;
