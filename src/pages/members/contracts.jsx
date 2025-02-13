import React, { useState } from "react";
import { Container, Paper, Typography, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Modal, Pagination, Box, TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Stepper, Step, StepLabel, ThemeProvider, createTheme } from "@mui/material";
import { ArrowBack, Add as AddIcon, Remove as RemoveIcon, Close as CloseIcon, Download } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";

const theme = createTheme({
	palette: {
		primary: {
			main: "#1a3353",
		},
		secondary: {
			main: "#f5f7fb",
		},
	},
	components: {
		MuiChip: {
			styleOverrides: {
				root: {
					borderRadius: 4,
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				head: {
					fontWeight: 600,
					color: "#1a3353",
				},
			},
		},
	},
});

const contractData = [
	{
		id: 1,
		agreement: {
			name: "Agreement",
			date: "October 10,2025",
			status: "Not signed",
			isNew: true,
			user: "Nameofuser",
		},
		company: "Digit",
		location: "Lahore",
		period: "10/10/2025 - 10/10/2026",
		duration: "3 months period",
		value: "$1000.00",
	},
	{
		id: 2,
		agreement: {
			name: "Agreement",
			date: "October 10,2025",
			status: ["Not signed", "Signed"],
			isNew: true,
			user: "Nameofuser",
		},
		company: "Digit",
		location: "Lahore",
		period: "10/10/2025 - 10/10/2026",
		duration: "3 months period",
		value: "$1000.00",
	},
];

// Modal style
const modalStyle = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 700,
	bgcolor: "background.paper",
	borderRadius: 2,
	boxShadow: 24,
	p: 4,
};

// Steps for the modal
const steps = ["Company Information", "Duration", "Items", "Terms & Condition"];

const MemberContract = () => {
	const [open, setOpen] = useState(false);
	const [activeStep, setActiveStep] = useState(0);
	const [formData, setFormData] = useState({
		company: "",
		members: "",
		type: "",
		number: "",
		startDate: "",
		endDate: "",
		noticePeriod: 1,
		allowRoll: false,
		recurringPlan: "",
		deposit: "",
		contractTeam: "",
		agreement: false,
	});

	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setOpen(false);
		setActiveStep(0);
	};

	const handleNext = () => {
		setActiveStep((prevStep) => prevStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevStep) => prevStep - 1);
	};

	const handleInputChange = (field) => (event) => {
		setFormData({
			...formData,
			[field]: event.target.type === "checkbox" ? event.target.checked : event.target.value,
		});
	};

	// Modal content based on current step
	const getStepContent = (step) => {
		switch (step) {
			case 0:
				return (
					<Box sx={{ mt: 2 }}>
						<FormControl fullWidth sx={{ mb: 2 }}>
							<InputLabel>Company *</InputLabel>
							<Select value={formData.company} onChange={handleInputChange("company")} label="Company *">
								<MenuItem value="select">Select Company</MenuItem>
							</Select>
						</FormControl>
						<FormControl fullWidth>
							<InputLabel>Members *</InputLabel>
							<Select value={formData.members} onChange={handleInputChange("members")} label="Members *">
								<MenuItem value="select">Select Members</MenuItem>
							</Select>
						</FormControl>
					</Box>
				);

			case 1:
				return (
					<Box sx={{ mt: 2 }}>
						<TextField fullWidth label="Type" value={formData.type} onChange={handleInputChange("type")} sx={{ mb: 2 }} />
						<TextField fullWidth label="Number" value={formData.number} onChange={handleInputChange("number")} sx={{ mb: 2 }} />
						<div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
							<TextField label="Start Date" type="date" InputLabelProps={{ shrink: true }} value={formData.startDate} onChange={handleInputChange("startDate")} fullWidth />
							<TextField label="End Date" type="date" InputLabelProps={{ shrink: true }} value={formData.endDate} onChange={handleInputChange("endDate")} fullWidth />
						</div>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								border: "1px solid #ccc",
								borderRadius: "8px",
							}}>
							<Typography style={{ padding: "8px 12px", fontWeight: "bold" }}>Notice Period</Typography>

							<IconButton
								onClick={() => handleInputChange("noticePeriod")({ target: { value: Math.max(1, formData.noticePeriod - 1) } })}
								style={{
									backgroundColor: "#0c2c51",
									color: "white",
									borderRadius: 0,
									padding: "8px",
									"&:hover": { backgroundColor: "#0a2443" },
								}}>
								<RemoveIcon />
							</IconButton>

							<Typography
								style={{
									backgroundColor: "#f5f7fb",
									padding: "8px 20px",
									minWidth: "300px",
									textAlign: "center",
									fontWeight: "bold",
								}}>
								{formData.noticePeriod}
							</Typography>

							<IconButton
								onClick={() => handleInputChange("noticePeriod")({ target: { value: formData.noticePeriod + 1 } })}
								style={{
									backgroundColor: "#0c2c51",
									color: "white",
									borderRadius: 0,
									padding: "8px",
									"&:hover": { backgroundColor: "#0a2443" },
								}}>
								<AddIcon />
							</IconButton>

							<Typography style={{ padding: "8px 12px", fontWeight: "bold" }}>Months</Typography>
						</div>
						<FormControlLabel control={<Checkbox checked={formData.allowRoll} onChange={handleInputChange("allowRoll")} />} label="Allow this contract to roll" />
					</Box>
				);

			case 2:
				return (
					<Box sx={{ mt: 2 }}>
						<FormControl fullWidth sx={{ mb: 2 }}>
							<InputLabel>Recurring Plan</InputLabel>
							<Select value={formData.recurringPlan} onChange={handleInputChange("recurringPlan")} label="Recurring Plan">
								<MenuItem value="meeting">Meeting room</MenuItem>
							</Select>
						</FormControl>
						<div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
							<TextField label="Start Date" type="date" InputLabelProps={{ shrink: true }} fullWidth />
							<TextField label="End Date" type="date" InputLabelProps={{ shrink: true }} fullWidth />
						</div>
						<TextField fullWidth label="Deposit amount" value={formData.deposit} onChange={handleInputChange("deposit")} />

						<div
							style={{
								display: "flex",
								alignItems: "center",
								border: "1px solid #ccc",
								borderRadius: "8px",
								marginTop: "15px",
							}}>
							<Typography style={{ padding: "8px 12px", fontWeight: "bold" }}>Notice Period</Typography>

							<IconButton
								onClick={() => handleInputChange("noticePeriod")({ target: { value: Math.max(1, formData.noticePeriod - 1) } })}
								style={{
									backgroundColor: "#0c2c51",
									color: "white",
									borderRadius: 0,
									padding: "8px",
									"&:hover": { backgroundColor: "#0a2443" },
								}}>
								<RemoveIcon />
							</IconButton>

							<Typography
								style={{
									backgroundColor: "#f5f7fb",
									padding: "8px 20px",
									minWidth: "300px",
									textAlign: "center",
									fontWeight: "bold",
								}}>
								{formData.noticePeriod}
							</Typography>

							<IconButton
								onClick={() => handleInputChange("noticePeriod")({ target: { value: formData.noticePeriod + 1 } })}
								style={{
									backgroundColor: "#0c2c51",
									color: "white",
									borderRadius: 0,
									padding: "8px",
									"&:hover": { backgroundColor: "#0a2443" },
								}}>
								<AddIcon />
							</IconButton>
						</div>
					</Box>
				);

			case 3:
				return (
					<Box sx={{ mt: 2 }}>
						<TextField fullWidth label="Contract Team" value={formData.contractTeam} onChange={handleInputChange("contractTeam")} sx={{ mb: 2 }} />
						<FormControlLabel control={<Checkbox checked={formData.agreement} onChange={handleInputChange("agreement")} />} label="Check for the agreement" />
					</Box>
				);

			default:
				return null;
		}
	};

	return (
		<>
			<TopNavbar />
			<div className="main">
				<div className="sidebarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<ThemeProvider theme={theme}>
						<Container maxWidth="lg">
							{/* Header */}
							<Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
								<IconButton sx={{ mr: 2, color: "primary.main" }}>
									<ArrowBack />
								</IconButton>
								<Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600, color: "primary.main" }}>
									Contracts
								</Typography>
								<Box sx={{ display: "flex", gap: 1 }}>
									<Button
										variant="contained"
										color="primary"
										onClick={handleOpen}
										sx={{
											textTransform: "none",
											bgcolor: "#1a3353",
											"&:hover": { bgcolor: "#142942" },
										}}>
										Add Contract
									</Button>
									<Button
										variant="outlined"
										color="primary"
										startIcon={<Download />}
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											padding: "10px 0px 10px 10px",
										}}
									/>
								</Box>
							</Box>

							<Paper sx={{ mt: 3, boxShadow: 3 }}>
								{/* Contracts Table */}
								<TableContainer component={Paper} sx={{ boxShadow: "none" }}>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Number</TableCell>
												<TableCell>Documents</TableCell>
												<TableCell>Stage</TableCell>
												<TableCell>Company</TableCell>
												<TableCell>Period</TableCell>
												<TableCell>Value</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{contractData.map((row, index) => (
												<TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
													<TableCell>{index + 1}</TableCell>
													<TableCell>
														<Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
															<Typography variant="body2" sx={{ fontWeight: 500 }}>
																{row.agreement.name}
															</Typography>
															<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
																<Typography variant="caption" sx={{ color: "text.secondary" }}>
																	{row.agreement.user}
																</Typography>
																<Typography variant="caption" sx={{ color: "text.secondary" }}>
																	{row.agreement.date}
																</Typography>
															</Box>
														</Box>
													</TableCell>
													<TableCell>
														<Box sx={{ display: "flex", gap: 1 }}>
															{Array.isArray(row.agreement.status) ? (
																row.agreement.status.map((status, i) => (
																	<Chip
																		key={i}
																		label={status}
																		size="small"
																		sx={{
																			bgcolor: status === "Signed" ? "#E8E8E8" : "#1a3353",
																			color: status === "Signed" ? "#666" : "white",
																		}}
																	/>
																))
															) : (
																<Chip
																	label={row.agreement.status}
																	size="small"
																	sx={{
																		bgcolor: row.agreement.status === "Signed" ? "#E8E8E8" : "#1a3353",
																		color: row.agreement.status === "Signed" ? "#666" : "white",
																	}}
																/>
															)}
															{row.agreement.isNew && <Chip label="New" size="small" sx={{ bgcolor: "#E3F5FF", color: "#2196F3" }} />}
														</Box>
													</TableCell>
													<TableCell>
														<Typography variant="body2">{row.company}</Typography>
														<Typography variant="caption" sx={{ color: "text.secondary" }}>
															{row.location}
														</Typography>
													</TableCell>
													<TableCell>
														<Typography variant="body2">{row.period}</Typography>
														<Typography variant="caption" sx={{ color: "text.secondary" }}>
															{row.duration}
														</Typography>
													</TableCell>
													<TableCell>{row.value}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>

								{/* Add Contract Modal */}
								<Modal open={open} onClose={handleClose}>
									<Box sx={modalStyle}>
										<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
											<Typography variant="h6" sx={{ fontWeight: "bold" }}>
												Add Contract
											</Typography>
											<IconButton onClick={handleClose} size="small">
												<CloseIcon />
											</IconButton>
										</Box>

										<Stepper activeStep={activeStep} sx={{ mb: 4 }}>
											{steps.map((label) => (
												<Step key={label}>
													<StepLabel>{label}</StepLabel>
												</Step>
											))}
										</Stepper>

										{getStepContent(activeStep)}

										<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
											<Button onClick={handleClose} variant="outlined" sx={{ textTransform: "none" }}>
												Close
											</Button>
											<Button variant="contained" onClick={activeStep === steps.length - 1 ? handleClose : handleNext} sx={{ textTransform: "none" }}>
												{activeStep === steps.length - 1 ? "Submit" : "Next"}
											</Button>
										</Box>
									</Box>
								</Modal>
								{/* Pagination */}
								<Box sx={{ display: "flex", justifyContent: "end", mt: 3, paddingBottom: "10px" }}>
									<Pagination count={10} />
								</Box>
							</Paper>
						</Container>
					</ThemeProvider>
				</div>
			</div>
		</>
	);
};

export default MemberContract;
