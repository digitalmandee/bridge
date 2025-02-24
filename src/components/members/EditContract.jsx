import React, { useCallback, useContext, useEffect, useState } from "react";
import { Typography, Button, IconButton, Modal, Box, TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Stepper, Step, StepLabel, ToggleButton, ToggleButtonGroup, CircularProgress, Snackbar, Alert, Autocomplete } from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon, Close as CloseIcon } from "@mui/icons-material";
import axiosInstance from "@/utils/axiosInstance";
import { AuthContext } from "@/contexts/AuthContext";

const EditContract = ({ contract, open, onClose }) => {
	const { user } = useContext(AuthContext);

	const [activeStep, setActiveStep] = useState(0);
	const [contractType, setContractType] = useState(contract.type || "user");
	const [loading, setLoading] = useState(false);
	const [alertOpen, setAlertOpen] = useState(false);
	const [companies, setCompanies] = useState([]);
	const [members, setMembers] = useState([]);
	const [bookingPlans, setBookingPlans] = useState([]);

	const isReadOnly = user.type == "admin" ? contract.status !== "not signed" : true;

	const [formData, setFormData] = useState({
		type: contract.type || "",
		company_number: contract.company_number || "",
		start_date: contract.start_date || "",
		end_date: contract.end_date || "",
		notice_period: contract.notice_period || 1,
		duration: contract.duration || "week",
		plan: contract.plan || "",
		plan_start_date: contract.plan_start_date || "",
		plan_end_date: contract.plan_end_date || "",
		deposit: contract.deposit || "",
		contract: contract.contract || "",
		agreement: contract.agreement || false,
		status: "",
		signature: contract.signature || "",
	});

	useEffect(() => {
		setContractType(contract.type || "user");
		setFormData({
			type: contract.type || "",
			company_number: contract.company_number || "",
			start_date: contract.start_date || "",
			end_date: contract.end_date || "",
			notice_period: contract.notice_period || 1,
			duration: contract.duration || "week",
			plan: contract.plan || "",
			plan_start_date: contract.plan_start_date || "",
			plan_end_date: contract.plan_end_date || "",
			amount: contract.amount || "",
			contract: contract.contract || "",
			agreement: contract.agreement || false,
			status: "",
			signature: contract.signature || "",
		});
	}, [contract]);

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

	const handleInputChange = (field) => (event) => {
		console.log(event.target.value);

		if (isReadOnly && field !== "signature") return;
		setFormData({
			...formData,
			[field]: event.target.type === "checkbox" ? event.target.checked : event.target.value,
		});
	};

	const handleAutocompleteChange = (event, value, field) => {
		if (isReadOnly) return;
		setFormData({ ...formData, [field]: value });
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

	const handleNext = () => {
		if (activeStep === steps.length - 1) {
			handleSubmit();
		} else {
			setActiveStep((prevStep) => prevStep + 1);
		}
	};

	const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

	const handleSubmit = async () => {
		setLoading(true);
		const updatedFormData = { ...formData, contractId: contract.id };

		console.log(updatedFormData);

		try {
			const res = await axiosInstance.put("member/contract/update", updatedFormData);

			if (res.data.success) {
				setAlertOpen(true);
				onClose();
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
				return true;
			case 1:
				return formData.type && formData.company_number && formData.start_date && formData.end_date && formData.notice_period > 0;
			case 2:
				return formData.plan && formData.amount && formData.plan_start_date;
			case 3:
				return formData.contract && formData.agreement;
			default:
				return false;
		}
	};

	const getStepContent = (step) => {
		switch (step) {
			case 0:
				return (
					<Box sx={{ my: 4 }}>
						Name: {contract?.user?.name} <br />
						Email: {contract?.user?.email} <br />
						Type: {contract?.user?.type}
					</Box>
				);

			case 1:
				return (
					<Box sx={{ mt: 2 }}>
						<TextField fullWidth label="Type" value={formData.type} onChange={handleInputChange("type")} sx={{ mb: 2 }} required disabled={isReadOnly} />
						<TextField fullWidth label="Registration Number" value={formData.company_number} onChange={handleInputChange("company_number")} sx={{ mb: 2 }} required disabled={isReadOnly} />
						<div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
							<TextField
								fullWidth
								label="Start Date"
								type="date"
								value={formData.start_date}
								onChange={(e) => {
									const newStartDate = e.target.value;
									setFormData({
										...formData,
										start_date: newStartDate,
										end_date: formData.end_date && formData.end_date < newStartDate ? "" : formData.end_date, // Reset end date if it's before start date
									});
								}}
								required
								disabled={isReadOnly}
							/>
							<TextField fullWidth label="End Date" type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} inputProps={{ min: formData.start_date || "" }} required disabled={isReadOnly} />
						</div>

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

							<Typography sx={{ ml: 2, padding: "8px 12px", fontWeight: "bold" }}>{contractType === "user" ? "Weeks" : "Months"}</Typography>
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

						<TextField fullWidth label="Deposit Amount" value={formData.amount} onChange={handleInputChange("amount")} sx={{ mb: 2 }} required disabled={isReadOnly} />

						<div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
							<TextField
								label="Start Date"
								type="date"
								InputLabelProps={{ shrink: true }}
								value={formData.plan_start_date}
								onChange={(e) => {
									const newStartDate = e.target.value;
									setFormData({
										...formData,
										plan_start_date: newStartDate,
										plan_end_date: formData.plan_end_date && formData.plan_end_date < newStartDate ? "" : formData.plan_end_date, // Reset end date if it's before start date
									});
								}}
								disabled={isReadOnly}
								fullWidth
								required
							/>

							<TextField
								label="End Date (Optional)"
								type="date"
								InputLabelProps={{ shrink: true }}
								value={formData.plan_end_date}
								onChange={(e) => setFormData({ ...formData, plan_end_date: e.target.value })}
								inputProps={{ min: formData.plan_start_date || "" }} // Restrict to only allow dates after Start Date
								fullWidth
								required
								disabled={isReadOnly}
							/>
						</div>
					</Box>
				);

			case 3:
				return (
					<Box sx={{ mt: 2 }}>
						<TextField fullWidth label="Contract" value={formData.contract} onChange={handleInputChange("contract")} sx={{ mb: 2 }} required disabled={isReadOnly} />
						<FormControlLabel control={<Checkbox checked={formData.agreement} onChange={handleInputChange("agreement")} disabled={isReadOnly} />} label="Agree to Terms & Conditions" />
						<br />
						{user.type === "admin" && (
							<FormControl fullWidth className="mb-2">
								<InputLabel id="status-label">Status</InputLabel>
								<Select labelId="status-label" label="Status" value={formData.status} onChange={handleInputChange("status")} disabled={isReadOnly}>
									<MenuItem value="" selected>
										Select status
									</MenuItem>
									<MenuItem value="cancelled">Cancelled</MenuItem>
								</Select>
							</FormControl>
						)}
						{user.type !== "admin" && (
							<>
								<TextField fullWidth label="Signature" value={formData.signature} onChange={handleInputChange("signature")} sx={{ mb: 2 }} required />
								{formData.signature ? (
									<div style={{ fontSize: "60px" }} className="font-signature">
										{formData.signature}
									</div>
								) : (
									""
								)}
							</>
						)}
					</Box>
				);

			default:
				return null;
		}
	};

	return (
		<Modal open={open} onClose={onClose}>
			<Box sx={modalStyle}>
				<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
					<Typography variant="h6" sx={{ fontWeight: "bold" }}>
						Edit Contract
					</Typography>
					<IconButton
						onClick={() => {
							onClose();
							setActiveStep(0);
						}}
						size="small">
						<CloseIcon />
					</IconButton>
				</Box>
				<Stepper activeStep={activeStep}>
					{steps.map((label) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
				{getStepContent(activeStep)}
				<Button onClick={handleBack} disabled={activeStep === 0}>
					Back
				</Button>
				<Button onClick={handleNext} disabled={!isStepValid() || loading}>
					{activeStep === steps.length - 1 ? "Save" : "Next"}
				</Button>
			</Box>
		</Modal>
	);
};

export default EditContract;

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
