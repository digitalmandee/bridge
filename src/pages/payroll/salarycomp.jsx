import React, { useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Box, Typography, Button, TextField, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, InputAdornment, FormControl, InputLabel, Pagination, Stack, Divider, Modal, Checkbox, FormControlLabel } from "@mui/material";
import { ArrowBack, Search, Add, GetApp, MoreVert, CheckCircle, Cancel } from "@mui/icons-material";

const salaryComponents = [
	{ id: 1, name: "Basic Salary", unitType: "Fixed Salary", deduction: false, active: true },
	{ id: 2, name: "House Rent", unitType: "Variable Salary", deduction: false, active: true },
	{ id: 3, name: "Ful Allowances", unitType: "Fixed Salary", deduction: false, active: true },
	{ id: 4, name: "Miscellaneous", unitType: "Variable Salary", deduction: false, active: true },
];

const SalaryComponent = () => {
	const navigate = useNavigate();
	const { branch } = useParams();
	const [unitType, setUnitType] = useState("");
	const [page, setPage] = useState(1);
	const [openModal, setOpenModal] = useState(false);

	const [componentName, setComponentName] = useState("");
	const [componentOrder, setComponentOrder] = useState("");
	const [componentUnitType, setComponentUnitType] = useState("");
	const [isActive, setIsActive] = useState(false);
	const [isDeduction, setIsDeduction] = useState(false);

	const handleUnitTypeChange = (event) => {
		setUnitType(event.target.value);
	};

	const handlePageChange = (event, value) => {
		setPage(value);
	};

	const handleOpenModal = () => {
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
	};

	const handleSubmit = () => {
		// Handle form submission logic here
		console.log({
			name: componentName,
			order: componentOrder,
			unitType: componentUnitType,
			active: isActive,
			deduction: isDeduction,
		});

		// Reset form and close modal
		setComponentName("");
		setComponentOrder("");
		setComponentUnitType("");
		setIsActive(false);
		setIsDeduction(false);
		setOpenModal(false);
	};

	return (
		<>
			<TopNavbar />
			<div className="main d-flex">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<Box sx={{ maxWidth: 1200, margin: "0 auto", p: 1 }}>
						<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
							<Box sx={{ display: "flex", alignItems: "center" }}>
								<div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
									<MdArrowBackIos style={{ fontSize: "20px", marginRight: "10px" }} />
								</div>
								<Typography variant="h6" component="h1" sx={{ fontWeight: "bold" }}>
									Salary Components
								</Typography>
							</Box>
							<Button
								variant="contained"
								sx={{
									bgcolor: "#0A2647",
									"&:hover": { bgcolor: "#0D3B66" },
									borderRadius: "4px",
									textTransform: "none",
								}}
								onClick={() => navigate(`/${branch}/branch/payroll/cheque`)}>
								Manage Cheque
							</Button>
						</Box>

						<Paper sx={{ p: 3, mb: 3, borderRadius: "8px" }}>
							<Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
								<FormControl sx={{ minWidth: 200 }}>
									<Typography variant="body2" sx={{ mb: 1 }}>
										Unit Type
									</Typography>
									<Select
										value={unitType}
										onChange={handleUnitTypeChange}
										displayEmpty
										size="small"
										sx={{
											borderRadius: "4px",
											"& .MuiOutlinedInput-notchedOutline": {
												borderColor: "#E0E0E0",
											},
										}}>
										<MenuItem value="">
											<Typography color="text.secondary">Select Type</Typography>
										</MenuItem>
										<MenuItem value="fixed">Fixed Salary</MenuItem>
										<MenuItem value="variable">Variable Salary</MenuItem>
									</Select>
								</FormControl>

								<Box sx={{ display: "flex", gap: 1 }}>
									<TextField
										placeholder="Search"
										size="small"
										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<Search fontSize="small" />
												</InputAdornment>
											),
										}}
										sx={{
											width: 250,
											"& .MuiOutlinedInput-root": {
												borderRadius: "4px",
												"& fieldset": {
													borderColor: "#E0E0E0",
												},
											},
										}}
									/>
									<IconButton
										sx={{
											bgcolor: "#F5F5F5",
											height: 50,
											width: 50,
											borderRadius: "50%",
											"&:hover": { bgcolor: "#EEEEEE" },
										}}
										onClick={handleOpenModal}>
										<Add />
									</IconButton>
									<IconButton
										sx={{
											bgcolor: "#F5F5F5",
											height: 50,
											width: 50,
											borderRadius: "50%",
											"&:hover": { bgcolor: "#EEEEEE" },
										}}>
										<GetApp />
									</IconButton>
								</Box>
							</Box>

							<TableContainer component={Paper} sx={{ boxShadow: "none", borderRadius: "8px", overflow: "hidden" }}>
								<Table sx={{ minWidth: 650 }}>
									<TableHead sx={{ bgcolor: "#F0F4F8" }}>
										<TableRow>
											<TableCell sx={{ py: 1.5, width: "5%" }}>#</TableCell>
											<TableCell sx={{ py: 1.5, width: "30%" }}>Component Name</TableCell>
											<TableCell sx={{ py: 1.5, width: "25%" }}>Unit type</TableCell>
											<TableCell sx={{ py: 1.5, width: "15%" }}>Deduction</TableCell>
											<TableCell sx={{ py: 1.5, width: "15%" }}>Active</TableCell>
											<TableCell sx={{ py: 1.5, width: "10%" }}>Action</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{salaryComponents.map((component) => (
											<TableRow key={component.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
												<TableCell>{component.id}</TableCell>
												<TableCell>{component.name}</TableCell>
												<TableCell>{component.unitType}</TableCell>
												<TableCell>
													<Cancel sx={{ color: "#FF5252", fontSize: 20 }} />
												</TableCell>
												<TableCell>
													<CheckCircle sx={{ color: "#4CAF50", fontSize: 20 }} />
												</TableCell>
												<TableCell>
													<IconButton size="small">
														<MoreVert />
													</IconButton>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>

							<Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
								<Stack spacing={2}>
									<Pagination count={10} page={page} onChange={handlePageChange} shape="rounded" siblingCount={0} boundaryCount={1} />
								</Stack>
							</Box>
						</Paper>
						<Modal open={openModal} onClose={handleCloseModal} aria-labelledby="add-salary-component-modal" aria-describedby="modal-to-add-new-salary-component">
							<Box
								sx={{
									position: "absolute",
									top: "50%",
									left: "50%",
									transform: "translate(-50%, -50%)",
									width: 400,
									bgcolor: "background.paper",
									borderRadius: "8px",
									boxShadow: 24,
									p: 4,
								}}>
								<Typography id="add-salary-component-modal" variant="h6" component="h2" sx={{ mb: 3, fontWeight: "bold" }}>
									Add Salary Component
								</Typography>

								<Box component="form" sx={{ mt: 2 }}>
									<Box sx={{ mb: 2 }}>
										<Typography variant="body2" sx={{ mb: 0.5 }}>
											Name<span style={{ color: "red" }}>*</span>
										</Typography>
										<TextField
											fullWidth
											placeholder="Enter Component name"
											value={componentName}
											onChange={(e) => setComponentName(e.target.value)}
											size="small"
											sx={{
												"& .MuiOutlinedInput-root": {
													borderRadius: "4px",
												},
											}}
										/>
									</Box>

									<Box sx={{ mb: 2 }}>
										<Typography variant="body2" sx={{ mb: 0.5 }}>
											#<span style={{ color: "red" }}>*</span>
										</Typography>
										<TextField
											fullWidth
											placeholder="Enter order"
											value={componentOrder}
											onChange={(e) => setComponentOrder(e.target.value)}
											size="small"
											sx={{
												"& .MuiOutlinedInput-root": {
													borderRadius: "4px",
												},
											}}
										/>
									</Box>

									<Box sx={{ mb: 3 }}>
										<Typography variant="body2" sx={{ mb: 0.5 }}>
											Unit type<span style={{ color: "red" }}>*</span>
										</Typography>
										<Select
											fullWidth
											displayEmpty
											value={componentUnitType}
											onChange={(e) => setComponentUnitType(e.target.value)}
											size="small"
											sx={{
												borderRadius: "4px",
											}}
											renderValue={(selected) => {
												if (!selected) {
													return <Typography color="text.secondary">Select unit type</Typography>;
												}
												return selected;
											}}>
											<MenuItem value="Fixed Salary">Fixed Salary</MenuItem>
											<MenuItem value="Variable Salary">Variable Salary</MenuItem>
										</Select>
									</Box>

									<Box sx={{ display: "flex", mb: 3 }}>
										<FormControlLabel control={<Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />} label="Active" />
										<FormControlLabel control={<Checkbox checked={isDeduction} onChange={(e) => setIsDeduction(e.target.checked)} />} label="Deduction" />
									</Box>

									<Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
										<Button
											variant="outlined"
											onClick={handleCloseModal}
											sx={{
												borderRadius: "4px",
												textTransform: "none",
												minWidth: "100px",
											}}>
											Cancel
										</Button>
										<Button
											variant="contained"
											onClick={handleSubmit}
											sx={{
												bgcolor: "#0A2647",
												"&:hover": { bgcolor: "#0D3B66" },
												borderRadius: "4px",
												textTransform: "none",
												minWidth: "100px",
											}}>
											Submit
										</Button>
									</Box>
								</Box>
							</Box>
						</Modal>
					</Box>
				</div>
			</div>
		</>
	);
};

export default SalaryComponent;
