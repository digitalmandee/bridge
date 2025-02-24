import React, { useEffect, useState } from "react";
import { Grid, Typography, Button, Divider, TextField } from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";

const PersonalDetails = ({ employeeId }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
	const [personalDetails, setPersonalDetails] = useState({
		employee_id: "",
		address: null,
		emergency_no: null,
		gender: "male",
		marital_status: "single",
		national_id: null,
		account_no: null,
		salary: 0,
		joining_date: "",
		user: {
			name: "",
			email: "",
			designation: "",
			phone_no: "",
		},
		department: {
			name: "",
		},
	});

	const getEmployeeData = async () => {
		try {
			const res = await axiosInstance.get("employees/show/" + employeeId);

			if (res.data.success) {
				setPersonalDetails(res.data.employee);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getEmployeeData();
	}, []);

	const validate = () => {
		let newErrors = {};
		if (!personalDetails.user.name) newErrors.name = "Name is required";
		if (!personalDetails.employee_id) newErrors.employee_id = "Employee ID is required";
		if (!personalDetails.user.email) newErrors.email = "Email is required";
		if (!personalDetails.user.phone_no) newErrors.phone_no = "Phone number is required";
		if (!personalDetails.salary) newErrors.salary = "Salary is required";
		if (!personalDetails.joining_date) newErrors.joining_date = "Joining date is required";
		if (!personalDetails.gender) newErrors.gender = "Gender is required";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validate()) return;

		setIsLoading(true);
		try {
			const payload = {
				...personalDetails,
			};
			await axiosInstance.put("employees/update/" + employeeId, payload);
			setSnackbar({ open: true, message: "Employee update successfully!", severity: "success" });
			setTimeout(() => navigate(-1), 1500);
		} catch (error) {
			// console.log(error.response.data);
			setSnackbar({ open: true, message: error.response.data.message, severity: "error" });
		} finally {
			setIsLoading(false);
		}
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};
	return (
		<>
			<Typography variant="h6">Personal Detail</Typography>
			<Divider sx={{ backgroundColor: "black", height: 2, marginTop: 1 }} />
			<Grid
				container
				spacing={2}
				style={{
					marginTop: "0.5rem",
				}}>
				<Grid item xs={12} md={6}>
					<Typography variant="body2" fontWeight="bold">
						Employee Name
					</Typography>
					<TextField fullWidth value={personalDetails.user.name || "N/A"} onChange={(e) => setPersonalDetails({ ...personalDetails, user: { ...personalDetails.user, name: e.target.value } })} margin="normal" variant="outlined" />
				</Grid>
				<Grid item xs={12} md={6}>
					<Typography variant="body2" fontWeight="bold">
						Employee ID
					</Typography>
					<TextField fullWidth value={personalDetails.employee_id || "N/A"} onChange={(e) => setPersonalDetails({ ...personalDetails, employee_id: e.target.value })} margin="normal" variant="outlined" />
				</Grid>
				<Grid item xs={12} md={6}>
					<Typography variant="body2" fontWeight="bold">
						National ID
					</Typography>
					<TextField fullWidth value={personalDetails.national_id || "N/A"} onChange={(e) => setPersonalDetails({ ...personalDetails, national_id: e.target.value })} margin="normal" variant="outlined" />
				</Grid>

				{/* Bank Account Number */}
				<Grid item xs={12} md={6}>
					<Typography variant="body2" fontWeight="bold">
						Bank Account Number
					</Typography>
					<TextField fullWidth value={personalDetails.account_no || "N/A"} onChange={(e) => setPersonalDetails({ ...personalDetails, account_no: e.target.value })} margin="normal" variant="outlined" />
				</Grid>

				<Grid item xs={12} md={6}>
					<Typography variant="body2" fontWeight="bold">
						Gender
					</Typography>
					<TextField sx={{ mt: 2 }} select name="gender" value={personalDetails.gender} onChange={(e) => setPersonalDetails({ ...personalDetails, gender: e.target.value })} fullWidth variant="outlined" SelectProps={{ native: true }}>
						<option value="">Select Gender</option>
						<option value="male">Male</option>
						<option value="female">Female</option>
					</TextField>
				</Grid>
				<Grid item xs={12} md={6}>
					<Typography variant="body2" fontWeight="bold">
						Marital Status
					</Typography>
					<TextField sx={{ mt: 2 }} select name="gender" value={personalDetails.marital_status} onChange={(e) => setPersonalDetails({ ...personalDetails, marital_status: e.target.value })} fullWidth variant="outlined" SelectProps={{ native: true }}>
						<option value="">Select Marital Status</option>
						<option value="single">Single</option>
						<option value="married">Married</option>
						<option value="divorced">Divorced</option>
						<option value="widowed">Widowed</option>
					</TextField>
				</Grid>

				<Grid item xs={12}>
					<Divider sx={{ backgroundColor: "black", height: 0.01, marginY: 1 }} />
				</Grid>

				<Grid item xs={12}>
					<Typography variant="h6" fontWeight="">
						Contact Detail
					</Typography>
					<Divider sx={{ backgroundColor: "black", height: 2, marginTop: 1 }} />
				</Grid>

				{/* Email */}
				<Grid item xs={12} md={6}>
					<Typography variant="body2" fontWeight="bold">
						Email
					</Typography>
					<TextField fullWidth value={personalDetails.user.email || "N/A"} onChange={(e) => setPersonalDetails({ ...personalDetails, user: { ...personalDetails.user, email: e.target.value } })} margin="normal" variant="outlined" />
				</Grid>

				{/* Contact Number */}
				<Grid item xs={12} md={6}>
					<Typography variant="body2" fontWeight="bold">
						Contact Number
					</Typography>
					<TextField fullWidth value={personalDetails.user.phone_no || "N/A"} onChange={(e) => setPersonalDetails({ ...personalDetails, user: { ...personalDetails.user, phone_no: e.target.value } })} margin="normal" variant="outlined" />
				</Grid>

				{/* Emergency Contact */}
				<Grid item xs={12} md={6}>
					<Typography variant="body2" fontWeight="bold">
						Emergency Number
					</Typography>
					<TextField fullWidth value={personalDetails.emergency_no || "N/A"} onChange={(e) => setPersonalDetails({ ...personalDetails, emergency_no: e.target.value })} margin="normal" variant="outlined" />
				</Grid>

				<Divider sx={{ backgroundColor: "black", height: 5, marginTop: 1 }} />

				{/* Address (Full width to avoid cramping) */}
				<Grid item xs={12} md={6}>
					<Typography variant="body2" fontWeight="bold">
						Address
					</Typography>
					<TextField fullWidth value={personalDetails.address || "N/A"} onChange={(e) => setPersonalDetails({ ...personalDetails, address: e.target.value })} margin="normal" variant="outlined" />
				</Grid>

				<Grid item xs={12} style={{ display: "flex", justifyContent: "flex-end" }}>
					<Button disabled={isLoading} onClick={handleSubmit} variant="contained" sx={{ backgroundColor: "#0D2B4E", "&:hover": { backgroundColor: "#0A223D" } }}>
						Save
					</Button>
				</Grid>
			</Grid>
		</>
	);
};

export default PersonalDetails;
