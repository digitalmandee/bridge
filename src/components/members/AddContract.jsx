import React, { useCallback, useEffect, useState } from "react";
import { Typography, Button, IconButton, Modal, Box, TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Stepper, Step, StepLabel, ToggleButton, ToggleButtonGroup, CircularProgress, Snackbar, Alert, Autocomplete } from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon, Close as CloseIcon } from "@mui/icons-material";
import axiosInstance from "@/utils/axiosInstance";
import colors from "@/assets/styles/color";
import { objectToFormData } from "@/helpers/objectToFormData";

const AddContract = ({ getContracts }) => {
	const [open, setOpen] = useState(false);
	const [activeStep, setActiveStep] = useState(0);
	const [contractType, setContractType] = useState("individual");
	const [loading, setLoading] = useState(false);
	const [alertOpen, setAlertOpen] = useState(false);
	const [companies, setCompanies] = useState([]);
	const [members, setMembers] = useState([]);
	const [bookingPlans, setBookingPlans] = useState([]);
	const [errorMsg, setErrorMsg] = useState("");

	const initialFormData = {
		company: "",
		members: "",
		type: "",
		company_number: "",
		start_date: "",
		end_date: "",
		notice_period: 1,
		duration: "week",
		plan: "",
		plan_start_date: "",
		plan_end_date: "",
		amount: "",
		contract: "",
		agreement: false,
		documents: [],
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

		const results = await fetchSearchResults(query, "user");
		setMembers(results);
	};

	const handleCompanySearch = async (event, newValue) => {
		const query = event?.target?.value || "";

		const results = await fetchSearchResults(query, "company");
		setCompanies(results);
	};

	useEffect(() => {
		const fetchMembers = async () => {
			try {
				const members = await fetchSearchResults("", "user");
				setMembers(members);
				const companies = await fetchSearchResults("", "company");
				setCompanies(companies);
				const searchPlan = await fetchPlanSearchResults("");
				setBookingPlans(searchPlan);
			} catch (error) {
				console.log(error.response.data);
			}
		};
		fetchMembers();
	}, []);

	const handlePlanSearch = async (event, newValue) => {
		const query = event?.target?.value || "";

		const results = await fetchPlanSearchResults(query);
		setBookingPlans(results);
	};

	// Handle Autocomplete change
	const handleAutocompleteChange = (event, value, field) => {
		setFormData({ ...formData, [field]: value });
		// setErrors({ ...errors, [field]: "" }); // Clear error on change
	};

	const handleSubmit = async () => {
		setErrorMsg("");
		setLoading(true);
		// Update formData with user_id
		const UserId = contractType === "individual" ? formData.members?.id : formData.company?.id;
		const updatedFormData = { ...formData, user_id: UserId };

		try {
			const payload = objectToFormData(updatedFormData);
			const res = await axiosInstance.post("member/contract/create", payload);
			if (res.data.success) {
				setAlertOpen(true);
				handleClose();
				getContracts();
			}
		} catch (error) {
			console.error(error.response.data);
			setErrorMsg(error.response.data.message);
		} finally {
			setLoading(false);
		}
	};

	const isStepValid = () => {
		switch (activeStep) {
			case 0:
				return contractType === "individual" ? formData.members !== "" : formData.company !== "";
			case 1:
				return formData.type !== "" && formData.company_number !== "" && formData.notice_period > 0;
			case 2:
				return formData.plan !== "" && formData.amount !== "" && formData.start_date !== "";
			case 3:
				return formData.contract !== "" && formData.agreement;
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
								setFormData({ ...formData, duration: newType === "individual" ? "week" : "month" });
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
						<TextField fullWidth label="Registration Number" value={formData.company_number} onChange={handleInputChange("company_number")} sx={{ mb: 2 }} required />

						{/* Notice Period Selection */}
						<div style={{ display: "flex", alignItems: "center", border: "1px solid #ccc", borderRadius: "8px" }}>
							<Typography style={{ padding: "8px 12px", fontWeight: "bold" }}>Notice Period</Typography>

							<IconButton onClick={() => setFormData({ ...formData, notice_period: Math.max(1, formData.notice_period - 1) })} style={{ backgroundColor: "#0c2c51", color: "white", borderRadius: 0, padding: "8px", "&:hover": { backgroundColor: "#0a2443" } }}>
								<RemoveIcon />
							</IconButton>

							<Typography style={{ backgroundColor: "#f5f7fb", padding: "8px 20px", minWidth: "300px", textAlign: "center", fontWeight: "bold" }}>{formData.notice_period}</Typography>

							<IconButton onClick={() => setFormData({ ...formData, notice_period: formData.notice_period + 1 })} style={{ backgroundColor: "#0c2c51", color: "white", borderRadius: 0, padding: "8px", "&:hover": { backgroundColor: "#0a2443" } }}>
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
							value={formData.plan}
							onInputChange={handlePlanSearch} // Trigger search on input change
							onChange={(event, value) => handleAutocompleteChange(event, value, "plan")}
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
						<TextField fullWidth label="Deposit Amount" value={formData.amount} onChange={handleInputChange("amount")} sx={{ mb: 2 }} required />

						<div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
							<TextField
								label="Start Date"
								type="date"
								InputLabelProps={{ shrink: true }}
								value={formData.start_date}
								onChange={(e) => {
									const newStartDate = e.target.value;
									setFormData({
										...formData,
										start_date: newStartDate,
										end_date: formData.end_date && formData.end_date < newStartDate ? "" : formData.end_date, // Reset end date if it's before start date
									});
								}}
								fullWidth
								required
							/>

							<TextField
								label="End Date (Optional)"
								type="date"
								InputLabelProps={{ shrink: true }}
								value={formData.end_date}
								onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
								inputProps={{ min: formData.start_date || "" }} // Restrict to only allow dates after Start Date
								fullWidth
								required
							/>
						</div>
					</Box>
				);

			case 3:
				return (
					<Box sx={{ mt: 2 }}>
						<TextField fullWidth label="Contract" value={formData.contract} onChange={handleInputChange("contract")} sx={{ mb: 2 }} required />

						{/* Multiple File Upload (PDF + Images) */}
						<Button variant="outlined" component="label" sx={{ mb: 2 }}>
							Upload Documents (Optional)
							<input
								type="file"
								hidden
								multiple
								accept="application/pdf,image/*"
								onChange={(e) => {
									const files = Array.from(e.target.files);
									setFormData({ ...formData, documents: files });
								}}
							/>
						</Button>

						{formData.documents.length > 0 && (
							<Box sx={{ mb: 2 }}>
								<Typography variant="body2" sx={{ fontWeight: "bold" }}>
									Selected Documents:
								</Typography>
								<ul>
									{formData.documents.map((file, idx) => (
										<li key={idx}>{file.name}</li>
									))}
								</ul>
							</Box>
						)}

						<FormControlLabel control={<Checkbox checked={formData.agreement} onChange={handleInputChange("agreement")} />} label="Agree to Terms & Conditions" />
					</Box>
				);

			default:
				return null;
		}
	};

	return (
		<>
			<Button
				variant="contained"
				color="primary"
				sx={{
					textTransform: "none",
					bgcolor: colors.primary,
					"&:hover": { bgcolor: colors.primary },
				}}
				onClick={handleOpen}>
				Add Contract
			</Button>
			<Modal open={open} onClose={handleClose}>
				<Box sx={modalStyle}>
					<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
						<Typography variant="h6" sx={{ fontWeight: "bold" }}>
							Add Contract
						</Typography>
						<IconButton
							onClick={() => {
								handleClose();
								setErrorMsg("");
							}}
							size="small">
							<CloseIcon />
						</IconButton>
					</Box>
					<Stepper activeStep={activeStep} sx={{ mb: 3 }}>
						{steps.map((label) => (
							<Step key={label}>
								<StepLabel>{label}</StepLabel>
							</Step>
						))}
					</Stepper>

					{errorMsg && (
						<p className="mb-4" style={{ color: "red" }}>
							{errorMsg}
						</p>
					)}

					{getStepContent(activeStep)}

					<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
						{activeStep > 0 && (
							<Button onClick={handleBack} variant="outlined" sx={{ textTransform: "none" }}>
								Back
							</Button>
						)}
						<Button variant="contained" onClick={handleNext} disabled={!isStepValid() || loading} sx={{ textTransform: "none" }}>
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
