import React, { useCallback, useState } from "react";
import { Typography, Button, IconButton, Modal, Box, TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Stepper, Step, StepLabel, ToggleButton, ToggleButtonGroup, CircularProgress, Snackbar, Alert, Autocomplete } from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon, Close as CloseIcon } from "@mui/icons-material";
import axiosInstance from "@/utils/axiosInstance";

const AddContract = () => {
	const [open, setOpen] = useState(false);
	const [activeStep, setActiveStep] = useState(0);
	const [contractType, setContractType] = useState("individual");
	const [loading, setLoading] = useState(false);
	const [alertOpen, setAlertOpen] = useState(false);
	const [companies, setCompanies] = useState([]);
	const [members, setMembers] = useState([]);
	const [bookingPlans, setBookingPlans] = useState([]);

	const initialFormData = {
		company: "",
		members: "",
		type: "",
		number: "",
		startDate: "",
		endDate: "",
		noticePeriod: 1,
		periodUnit: "week",
		recurringPlan: "",
		planStartDate: "",
		planEndDate: "",
		deposit: "",
		contractTeam: "",
		agreement: false,
	};

	const [formData, setFormData] = useState(initialFormData);

	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setOpen(false);
		setActiveStep(0);
		setFormData(initialFormData);
	};

	const handleNext = () => {
		if (activeStep === steps.length - 1) {
			handleSubmit();
		} else {
			setActiveStep((prevStep) => prevStep + 1);
		}
	};

	const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

	const handleInputChange = (field) => (event) => {
		setFormData({
			...formData,
			[field]: event.target.type === "checkbox" ? event.target.checked : event.target.value,
		});
	};

	const fetchSearchResults = useCallback(async (query, type) => {
		if (!query) return []; // Don't make a request if the query is empty.
		setLoading(true);
		try {
			const response = await axiosInstance.get("search", {
				params: { query: query, type: type },
			});
			setLoading(false);
			if (response.data.success) {
				return response.data.results;
			} else {
				setLoading(false);
				return [];
			}
		} catch (error) {
			setLoading(false);
			console.error("Error fetching search results:", error);
			return [];
		}
	}, []);
	const fetchPlanSearchResults = useCallback(async (query) => {
		if (!query) return []; // Don't make a request if the query is empty.
		setLoading(true);
		try {
			const response = await axiosInstance.get("search-plan", {
				params: { query: query },
			});
			setLoading(false);
			if (response.data.success) {
				return response.data.results;
			} else {
				setLoading(false);
				return [];
			}
		} catch (error) {
			setLoading(false);
			console.error("Error fetching search results:", error);
			return [];
		}
	}, []);

	const handleMemberSearch = async (event, newValue) => {
		// Ensure event exists before accessing event.target
		const query = event?.target?.value || "";

		if (query) {
			const results = await fetchSearchResults(query, "user");
			setMembers(results);
		} else {
			setMembers([]);
		}
	};

	const handleCompanySearch = async (event, newValue) => {
		const query = event?.target?.value || "";

		if (query) {
			const results = await fetchSearchResults(query, "company");
			setCompanies(results);
		} else {
			setCompanies([]);
		}
	};
	const handlePlanSearch = async (event, newValue) => {
		const query = event?.target?.value || "";

		if (query) {
			const results = await fetchPlanSearchResults(query);
			setBookingPlans(results);
		} else {
			setCompanies([]);
		}
	};

	// Handle Autocomplete change
	const handleAutocompleteChange = (event, value, field) => {
		setFormData({ ...formData, [field]: value });
		// setErrors({ ...errors, [field]: "" }); // Clear error on change
	};

	const handleSubmit = async () => {
		setLoading(true);
		// Update formData with user_id
		const UserId = contractType === "individual" ? formData.members?.id : formData.company?.id;
		const updatedFormData = { ...formData, user_id: UserId };

		try {
			const res = await axiosInstance.post("member/contract/create", updatedFormData);
			if (res.data.success) {
				setAlertOpen(true);
				handleClose();
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const isStepValid = () => {
		switch (activeStep) {
			case 0:
				return contractType === "individual" ? formData.members !== "" : formData.company !== "";
			case 1:
				return formData.type !== "" && formData.number !== "" && formData.startDate !== "" && formData.endDate !== "" && formData.noticePeriod > 0;
			case 2:
				return formData.recurringPlan !== "" && formData.deposit !== "" && formData.planStartDate !== "";
			case 3:
				return formData.contractTeam !== "" && formData.agreement;
			default:
				return false;
		}
	};

	const getStepContent = (step) => {
		switch (step) {
			case 0:
				return (
					<Box sx={{ mt: 2 }}>
						<ToggleButtonGroup
							value={contractType}
							exclusive
							onChange={(e, newType) => {
								setContractType(newType);
								setFormData({ ...formData, periodUnit: newType === "individual" ? "week" : "month" });
							}}>
							<ToggleButton value="individual">Individual</ToggleButton>
							<ToggleButton value="company">Company</ToggleButton>
						</ToggleButtonGroup>

						{contractType === "company" ? (
							<>
								<Autocomplete
									sx={{ mt: 2 }}
									options={companies}
									getOptionLabel={(option) => option.name || ""} // Return just the name
									value={formData.company}
									onInputChange={handleCompanySearch} // Trigger search on input change
									onChange={(event, value) => handleAutocompleteChange(event, value, "company")}
									renderInput={(params) => <TextField {...params} label="Company *" variant="outlined" />}
									renderOption={(props, option) => {
										const { key, ...restProps } = props; // Extract key from props
										return (
											<li key={key} {...restProps}>
												<span>{option.name}</span>
												<span style={{ color: "gray", fontSize: "0.875rem" }}> ({option.email})</span>
											</li>
										);
									}}
								/>
							</>
						) : (
							<>
								<Autocomplete
									sx={{ mt: 2 }}
									options={members}
									getOptionLabel={(option) => option.name || ""} // Return just the name
									value={formData.members}
									onInputChange={handleMemberSearch} // Trigger search on input change
									onChange={(event, value) => handleAutocompleteChange(event, value, "members")}
									renderInput={(params) => <TextField {...params} label="Members *" variant="outlined" />}
									renderOption={(props, option) => {
										const { key, ...restProps } = props; // Extract key from props
										return (
											<li key={key} {...restProps}>
												<span>{option.name}</span>
												<span style={{ color: "gray", fontSize: "0.875rem" }}> ({option.email})</span>
											</li>
										);
									}}
								/>
							</>
						)}
					</Box>
				);

			case 1:
				return (
					<Box sx={{ mt: 2 }}>
						<TextField fullWidth label="Type" value={formData.type} onChange={handleInputChange("type")} sx={{ mb: 2 }} required />
						<TextField fullWidth label="Registration Number" value={formData.number} onChange={handleInputChange("number")} sx={{ mb: 2 }} required />
						<div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
							<TextField
								label="Start Date"
								type="date"
								InputLabelProps={{ shrink: true }}
								value={formData.startDate}
								onChange={(e) => {
									const newStartDate = e.target.value;
									setFormData({
										...formData,
										startDate: newStartDate,
										endDate: formData.endDate && formData.endDate < newStartDate ? "" : formData.endDate, // Reset end date if it's before start date
									});
								}}
								fullWidth
								required
							/>

							<TextField
								label="End Date"
								type="date"
								InputLabelProps={{ shrink: true }}
								value={formData.endDate}
								onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
								inputProps={{ min: formData.startDate || "" }} // Restrict to only allow dates after Start Date
								fullWidth
								required
							/>
						</div>

						{/* Notice Period Selection */}
						<div style={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: "8px" }}>
							<Typography style={{ padding: "8px 12px", fontWeight: "bold" }}>Notice Period</Typography>

							<IconButton onClick={() => setFormData({ ...formData, noticePeriod: Math.max(1, formData.noticePeriod - 1) })} style={{ backgroundColor: "#0c2c51", color: "white", borderRadius: 0, padding: "8px", "&:hover": { backgroundColor: "#0a2443" } }}>
								<RemoveIcon />
							</IconButton>

							<Typography style={{ backgroundColor: "#f5f7fb", padding: "8px 20px", minWidth: "300px", textAlign: "center", fontWeight: "bold" }}>{formData.noticePeriod}</Typography>

							<IconButton onClick={() => setFormData({ ...formData, noticePeriod: formData.noticePeriod + 1 })} style={{ backgroundColor: "#0c2c51", color: "white", borderRadius: 0, padding: "8px", "&:hover": { backgroundColor: "#0a2443" } }}>
								<AddIcon />
							</IconButton>

							<Typography sx={{ ml: 2, padding: "8px 12px", fontWeight: "bold" }}>{contractType === "individual" ? "Weeks" : "Months"}</Typography>
						</div>
					</Box>
				);

			case 2:
				return (
					<Box sx={{ mt: 2 }}>
						<Autocomplete
							sx={{ mb: 2 }}
							options={bookingPlans}
							getOptionLabel={(option) => option.name || ""} // Return just the name
							value={formData.recurringPlan}
							onInputChange={handlePlanSearch} // Trigger search on input change
							onChange={(event, value) => handleAutocompleteChange(event, value, "recurringPlan")}
							renderInput={(params) => <TextField {...params} label="Recurring Plan" variant="outlined" />}
							renderOption={(props, option) => {
								const { key, ...restProps } = props; // Extract key from props
								return (
									<li key={option.id} {...restProps}>
										{option.name} - Rs. {option.price}
									</li>
								);
							}}
						/>
						<TextField fullWidth label="Deposit Amount" value={formData.deposit} onChange={handleInputChange("deposit")} sx={{ mb: 2 }} required />

						<div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
							<TextField
								label="Start Date"
								type="date"
								InputLabelProps={{ shrink: true }}
								value={formData.planStartDate}
								onChange={(e) => {
									const newStartDate = e.target.value;
									setFormData({
										...formData,
										planStartDate: newStartDate,
										planEndDate: formData.planEndDate && formData.planEndDate < newStartDate ? "" : formData.planEndDate, // Reset end date if it's before start date
									});
								}}
								fullWidth
								required
							/>

							<TextField
								label="End Date (Optional)"
								type="date"
								InputLabelProps={{ shrink: true }}
								value={formData.planEndDate}
								onChange={(e) => setFormData({ ...formData, planEndDate: e.target.value })}
								inputProps={{ min: formData.planStartDate || "" }} // Restrict to only allow dates after Start Date
								fullWidth
								required
							/>
						</div>
					</Box>
				);

			case 3:
				return (
					<Box sx={{ mt: 2 }}>
						<TextField fullWidth label="Contract Team" value={formData.contractTeam} onChange={handleInputChange("contractTeam")} sx={{ mb: 2 }} required />
						<FormControlLabel control={<Checkbox checked={formData.agreement} onChange={handleInputChange("agreement")} />} label="Agree to Terms & Conditions" />
					</Box>
				);

			default:
				return null;
		}
	};

	return (
		<>
			<Button variant="contained" color="primary" onClick={handleOpen}>
				Add Contract
			</Button>
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
						{activeStep > 0 && (
							<Button onClick={handleBack} variant="outlined">
								Back
							</Button>
						)}
						<Button variant="contained" onClick={handleNext} disabled={!isStepValid() || loading}>
							{loading ? <CircularProgress size={24} /> : activeStep === steps.length - 1 ? "Submit" : "Next"}
						</Button>
					</Box>
				</Box>
			</Modal>

			<Snackbar open={alertOpen} autoHideDuration={3000} onClose={() => setAlertOpen(false)}>
				<Alert severity="success">Contract successfully created!</Alert>
			</Snackbar>
		</>
	);
};

export default AddContract;

const steps = ["Company/Individual", "Duration", "Plan", "Terms"];

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
