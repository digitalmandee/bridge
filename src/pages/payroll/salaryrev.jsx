import React, { useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Table, Container } from "react-bootstrap";
import { IconButton, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Pagination, Box, Typography, Chip, Divider, Button, TextField } from "@mui/material";
import { MoreVert as MoreVertIcon, ArrowBack as ArrowBackIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";

const SalaryRevesion = () => {
	const navigate = useNavigate();

	const initialData = [
		{
			id: 1,
			name: "Gladys",
			ctc1: "-",
			ctc2: "-",
			joinDate: "Dec 01, 2024",
			totalYear: "00,00",
			basicSalary: "500",
			status: "Paid",
		},
		{
			id: 2,
			name: "Gladys",
			ctc1: "-",
			ctc2: "-",
			joinDate: "Dec 01, 2024",
			totalYear: "00,00",
			basicSalary: "500",
			status: "Unpaid",
		},
		{
			id: 3,
			name: "Gladys",
			ctc1: "-",
			ctc2: "-",
			joinDate: "Dec 01, 2024",
			totalYear: "00,00",
			basicSalary: "500",
			status: "Paid",
		},
		{
			id: 4,
			name: "Gladys",
			ctc1: "-",
			ctc2: "-",
			joinDate: "Dec 01, 2024",
			totalYear: "00,00",
			basicSalary: "500",
			status: "Paid",
		},
		{
			id: 5,
			name: "Gladys",
			ctc1: "-",
			ctc2: "-",
			joinDate: "Dec 01, 2024",
			totalYear: "00,00",
			basicSalary: "500",
			status: "Paid",
		},
		{
			id: 6,
			name: "Gladys",
			ctc1: "-",
			ctc2: "-",
			joinDate: "Dec 01, 2024",
			totalYear: "00,00",
			basicSalary: "500",
			status: "Unpaid",
		},
	];

	// State variables
	const [data, setData] = useState(initialData);
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedItem, setSelectedItem] = useState(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [page, setPage] = useState(1);
	const [editForm, setEditForm] = useState({
		name: "",
		basicSalary: "",
		status: "",
	});

	// Handle opening the action menu
	const handleMenuOpen = (event, item) => {
		setAnchorEl(event.currentTarget);
		setSelectedItem(item);
	};

	// Handle closing the action menu
	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	// Handle edit button click
	const handleEdit = () => {
		setEditForm({
			name: selectedItem.name,
			basicSalary: selectedItem.basicSalary,
			status: selectedItem.status,
		});
		setEditDialogOpen(true);
		handleMenuClose();
	};

	// Handle edit form input changes
	const handleEditFormChange = (e) => {
		const { name, value } = e.target;
		console.log(`Changing ${name} to ${value}`); // For debugging
		setEditForm({
			...editForm,
			[name]: value,
		});
	};

	// Handle edit form submission
	const handleEditSubmit = () => {
		console.log("Submitting with status:", editForm.status);

		// Update the data with edited values
		const updatedData = data.map((item) => {
			if (item.id === selectedItem.id) {
				console.log(`Updating item ${item.id} status from ${item.status} to ${editForm.status}`);
				return {
					...item,
					name: editForm.name,
					basicSalary: editForm.basicSalary,
					status: editForm.status,
				};
			}
			return item;
		});

		console.log("Updated data:", updatedData);
		setData(updatedData);
		setEditDialogOpen(false);
	};

	// Handle delete button click
	const handleDeleteClick = () => {
		setDeleteDialogOpen(true);
		handleMenuClose();
	};

	// Handle confirming delete
	const handleDeleteConfirm = () => {
		setData(data.filter((item) => item.id !== selectedItem.id));
		setDeleteDialogOpen(false);
	};

	// Handle canceling delete
	const handleDeleteCancel = () => {
		setDeleteDialogOpen(false);
	};

	// Handle pagination change
	const handlePageChange = (event, value) => {
		setPage(value);
	};

	return (
		<>
			<TopNavbar />
			<div className="main d-flex">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div style={{ paddingTop: "1rem", display: "flex", alignItems: "center", marginBottom: "20px", cursor: "pointer" }}>
						<div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
							<MdArrowBackIos style={{ fontSize: "20px", marginRight: "10px" }} />
						</div>
						<h4 style={{ margin: 0 }}>Salary Revisions</h4>
					</div>
					<div style={{ minHeight: "100vh", padding: 10 }}>
						<Container fluid className="p-0">
							<Paper elevation={0} style={{ borderRadius: "8px", overflow: "hidden" }}>
								<Table responsive hover>
									<thead style={{ backgroundColor: "#f8f9fa" }}>
										<tr>
											<th>Employ Name</th>
											<th>CTC per month</th>
											<th>CTC per month</th>
											<th>Date of join</th>
											<th>Total Year</th>
											<th>Basic Salary</th>
											<th>Status</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>
										{data.map((item) => (
											<tr key={item.id}>
												<td>{item.name}</td>
												<td>{item.ctc1}</td>
												<td>{item.ctc2}</td>
												<td>{item.joinDate}</td>
												<td>{item.totalYear}</td>
												<td>{item.basicSalary}</td>
												<td>
													<Chip
														label={item.status}
														size="small"
														sx={{
															backgroundColor: item.status === "Paid" ? "#1a3c61" : "#e3f2fd",
															color: item.status === "Paid" ? "white" : "#1a3c61",
															fontWeight: "bold",
															borderRadius: "16px",
															fontSize: "0.75rem",
															padding: "0 8px",
														}}
													/>
												</td>
												<td>
													<IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={(e) => handleMenuOpen(e, item)}>
														<MoreVertIcon />
													</IconButton>
												</td>
											</tr>
										))}
									</tbody>
								</Table>
							</Paper>
						</Container>

						{/* Action Menu */}
						<Menu
							id="action-menu"
							anchorEl={anchorEl}
							keepMounted
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}
							PaperProps={{
								style: {
									width: "120px",
									boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
								},
							}}>
							<MenuItem onClick={handleEdit} style={{ display: "flex", alignItems: "center" }}>
								<EditIcon fontSize="small" style={{ marginRight: "8px" }} />
								Edit
							</MenuItem>
							<Divider />
							<MenuItem onClick={handleDeleteClick} style={{ display: "flex", alignItems: "center" }}>
								<DeleteIcon fontSize="small" style={{ marginRight: "8px", color: "#f44336" }} />
								<span style={{ color: "#f44336" }}>Delete</span>
							</MenuItem>
						</Menu>

						{/* Pagination */}
						<Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
							<Pagination count={10} />
						</Box>

						{/* Delete Confirmation Dialog */}
						<Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
							<DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
							<DialogContent>
								<DialogContentText id="alert-dialog-description">Are you sure you want to delete this salary revision record?</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button onClick={handleDeleteCancel} color="primary">
									Cancel
								</Button>
								<Button onClick={handleDeleteConfirm} color="primary" autoFocus style={{ color: "#f44336" }}>
									Delete
								</Button>
							</DialogActions>
						</Dialog>

						{/* Edit Salary Dialog */}
						<Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} aria-labelledby="edit-dialog-title" maxWidth="xs" fullWidth>
							<DialogTitle id="edit-dialog-title" sx={{ fontWeight: "bold", pb: 1 }}>
								Salary Edit
							</DialogTitle>
							<DialogContent sx={{ pt: 2 }}>
								<Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
									<Box>
										<Typography variant="body2" sx={{ mb: 0.5, fontWeight: "medium" }}>
											Name*
										</Typography>
										<TextField fullWidth name="name" value={editForm.name} onChange={handleEditFormChange} size="small" required />
									</Box>

									<Box>
										<Typography variant="body2" sx={{ mb: 0.5, fontWeight: "medium" }}>
											Basic Salary*
										</Typography>
										<TextField fullWidth name="basicSalary" value={editForm.basicSalary} onChange={handleEditFormChange} size="small" required />
									</Box>

									<Box>
										<Typography variant="body2" sx={{ mb: 0.5, fontWeight: "medium" }}>
											Status*
										</Typography>
										<div className="" style={{ padding: "8px 0", justifyContent: "center" }}>
											<div style={{ display: "flex", gap: "10px" }}>
												<div
													onClick={() => setEditForm({ ...editForm, status: "Paid" })}
													style={{
														cursor: "pointer",
														display: "inline-block",
													}}>
													<Chip
														label="Paid"
														size="small"
														sx={{
															backgroundColor: editForm.status === "Paid" ? "#1a3c61" : "#e3f2fd",
															color: editForm.status === "Paid" ? "white" : "#1a3c61",
															fontWeight: "bold",
															borderRadius: "16px",
															fontSize: "0.75rem",
															padding: "0 8px",
															border: editForm.status === "Paid" ? "2px solid #1a3c61" : "none",
														}}
													/>
												</div>
												<div
													onClick={() => setEditForm({ ...editForm, status: "Unpaid" })}
													style={{
														cursor: "pointer",
														display: "inline-block",
													}}>
													<Chip
														label="Unpaid"
														size="small"
														sx={{
															backgroundColor: editForm.status === "Unpaid" ? "#1a3c61" : "#e3f2fd",
															color: editForm.status === "Unpaid" ? "white" : "#1a3c61",
															fontWeight: "bold",
															borderRadius: "16px",
															fontSize: "0.75rem",
															padding: "0 8px",
															border: editForm.status === "Unpaid" ? "2px solid #1a3c61" : "none",
														}}
													/>
												</div>
											</div>
										</div>
									</Box>
								</Box>
							</DialogContent>
							<DialogActions sx={{ px: 3, pb: 3, justifyContent: "center", gap: 1 }}>
								<Button
									onClick={() => setEditDialogOpen(false)}
									variant="outlined"
									sx={{
										borderRadius: "4px",
										minWidth: "100px",
										borderColor: "#d0d0d0",
										color: "#333",
									}}>
									Cancel
								</Button>
								<Button
									onClick={handleEditSubmit}
									variant="contained"
									sx={{
										borderRadius: "4px",
										minWidth: "100px",
										backgroundColor: "#1a3c61",
										"&:hover": {
											backgroundColor: "#132e4a",
										},
									}}>
									Submit
								</Button>
							</DialogActions>
						</Dialog>
					</div>
				</div>
			</div>
		</>
	);
};

export default SalaryRevesion;
