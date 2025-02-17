import React, { useCallback, useContext, useEffect, useState } from "react";
import { Typography, Button, IconButton, Modal, Box, TextField, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, Stepper, Step, StepLabel, ToggleButton, ToggleButtonGroup, CircularProgress, Snackbar, Alert, Autocomplete } from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon, Close as CloseIcon } from "@mui/icons-material";
import axiosInstance from "@/utils/axiosInstance";
import { AuthContext } from "@/contexts/AuthContext";

const ViewContract = ({ contract, open, onClose }) => {
	const { user } = useContext(AuthContext);

	const [activeStep, setActiveStep] = useState(0);
	const [contractType, setContractType] = useState(contract.type || "user");
	const [loading, setLoading] = useState(false);
	const [alertOpen, setAlertOpen] = useState(false);

	const [formData, setFormData] = useState({
		status: "",
		signature: contract.signature || "",
	});

	useEffect(() => {
		setContractType(contract.type || "user");
		setFormData({
			status: "",
			signature: contract.signature || "",
		});
	}, [contract]);

	const handleInputChange = (field) => (event) => {
		setFormData({
			...formData,
			[field]: event.target.value,
		});
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

		try {
			const res = await axiosInstance.put("member/contract/user/update", updatedFormData);

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
				return true;
			case 2:
				return true;
			case 3:
				return formData.signature;
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
						Type: {contract.type} <br />
						Registration Number: {contract.company_number} <br />
						Start Date: {contract.start_date} <br />
						End Date: {contract.end_date} <br />
						Notice Periods: {contract.notice_period} - {contract.duration} <br />
					</Box>
				);

			case 2:
				return (
					<Box sx={{ mt: 2 }}>
						Plan: {contract.plan.name} <br />
						Plan Price: {contract.plan.price} <br />
						Deposit: {contract.amount} <br />
						Plan Start Date: {contract.plan_start_date} <br />
						Plan End Date: {contract.plan_end_date || "N/A"} <br />
					</Box>
				);

			case 3:
				return (
					<Box sx={{ mt: 2 }}>
						Contract Team: {contract.contract} <br />
						Terms & Conditions: {contract.agreement ? "Agree" : "N/A"} <br />
						<br />
						{user.type === "admin" && (
							<FormControl fullWidth className="mb-2">
								<InputLabel id="status-label">Status</InputLabel>
								<Select labelId="status-label" label="Status" onChange={(event) => handleInputChange("status", event)}>
									<MenuItem value=" " selected>
										Select status
									</MenuItem>
									<MenuItem value="cancelled">Cancelled</MenuItem>
								</Select>
							</FormControl>
						)}
						{/* For User and Company */}
						{user.type !== "admin" && contract.status == "not signed" && <TextField fullWidth label="Signature" value={formData.signature} onChange={handleInputChange("signature")} sx={{ mb: 2 }} required />}
						{/* For All */}
						{formData.signature ? (
							<>
								<b>Signature</b>
								<div style={{ fontSize: "60px" }} className="font-signature">
									{formData.signature}
								</div>
							</>
						) : (
							""
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
						View Contract
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

export default ViewContract;

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
