import React, { useState, useEffect } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { TextField, Button, Typography, Box, FormHelperText, Snackbar, Alert } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import axiosInstance from "@/utils/axiosInstance";

const EmployeeCreate = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: "",
		employee_id: "",
		email: "",
		designation: "",
		phone_no: "",
		salary: "",
		joining_date: "",
		department: null,
		gender: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const [departments, setDepartments] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

	// Fetch departments based on search input
	useEffect(() => {
		if (searchTerm) {
			axiosInstance
				.get(`departments?type=search&query=${searchTerm}`)
				.then((res) => setDepartments(res.data.results))
				.catch((err) => console.error("Error fetching departments", err));
		}
	}, [searchTerm]);

	const validate = () => {
		let newErrors = {};
		if (!formData.name) newErrors.name = "Name is required";
		if (!formData.employee_id) newErrors.employee_id = "Employee ID is required";
		if (!formData.email) newErrors.email = "Email is required";
		if (!formData.phone_no) newErrors.phone_no = "Phone number is required";
		if (!formData.salary) newErrors.salary = "Salary is required";
		if (!formData.joining_date) newErrors.joining_date = "Joining date is required";
		if (!formData.department) newErrors.department = "Department is required";
		if (!formData.gender) newErrors.gender = "Gender is required";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validate()) return;

		setIsLoading(true);
		try {
			const payload = {
				...formData,
				department_id: formData.department?.id || null,
			};
			await axiosInstance.post("employees/create", payload);
			setSnackbar({ open: true, message: "Employee added successfully!", severity: "success" });
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
			<TopNavbar />
			<div className="main d-flex">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div style={{ paddingTop: "1rem", display: "flex", alignItems: "center", marginBottom: "20px" }}>
						<div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
							<MdArrowBackIos style={{ fontSize: "20px", cursor: "pointer" }} />
						</div>
						<h3 style={{ margin: 0 }}>Personal Detail</h3>
					</div>
					<Box
						sx={{
							padding: "2rem",
							backgroundColor: "white",
							borderRadius: "1rem",
							maxWidth: "65rem",
							margin: "auto",
							boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
						}}>
						<form
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr 1fr",
								gap: "16px",
							}}>
							{[
								{ label: "Employee Name*", name: "name", placeholder: "First Name" },
								{ label: "Employee ID*", name: "employee_id", placeholder: "12345" },
								{ label: "Designation*", name: "designation", placeholder: "HR Manager" },
								{ label: "E-mail*", name: "email", placeholder: "Abc@gmail.com" },
								{ label: "Phone Number*", name: "phone_no", placeholder: "030-0000000" },
								{ label: "Salary*", name: "salary", placeholder: "300-10000" },
							].map((field, index) => (
								<Box key={index}>
									<Typography variant="body1" sx={{ fontWeight: 500, color: "rgba(0, 0, 0, 0.6)", marginBottom: "1rem" }}>
										{field.label}
									</Typography>
									<TextField name={field.name} value={formData[field.name]} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} placeholder={field.placeholder} variant="outlined" fullWidth error={!!errors[field.name]} helperText={errors[field.name]} />
								</Box>
							))}

							<Box>
								<Typography variant="body1" sx={{ fontWeight: 500, color: "rgba(0, 0, 0, 0.6)", marginBottom: "1rem" }}>
									Department*
								</Typography>
								<Autocomplete
									options={departments}
									getOptionLabel={(option) => option.name}
									value={formData.department}
									onInputChange={(event, value) => setSearchTerm(value)}
									onChange={(event, value) => setFormData({ ...formData, department: value })}
									renderInput={(params) => (
										<>
											<TextField {...params} label="Search Department" variant="outlined" />
											{errors.department && <FormHelperText error>{errors.department}</FormHelperText>}
										</>
									)}
								/>
							</Box>

							<Box>
								<Typography variant="body1" sx={{ fontWeight: 500, color: "rgba(0, 0, 0, 0.6)", marginBottom: "1rem" }}>
									Joining Date*
								</Typography>
								<TextField type="date" name="joining_date" value={formData.joining_date} onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })} InputLabelProps={{ shrink: true }} fullWidth error={!!errors.joining_date} helperText={errors.joining_date} />
							</Box>

							<Box>
								<Typography variant="body1" sx={{ fontWeight: 500, color: "rgba(0, 0, 0, 0.6)", marginBottom: "1rem" }}>
									Gender*
								</Typography>
								<TextField select name="gender" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} fullWidth variant="outlined" error={!!errors.gender} helperText={errors.gender} SelectProps={{ native: true }}>
									<option value="">Select Gender</option>
									<option value="male">Male</option>
									<option value="female">Female</option>
								</TextField>
							</Box>
						</form>

						<Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "24px", gap: "12px" }}>
							<Button variant="contained" sx={{ backgroundColor: "white", color: "black" }} onClick={() => navigate(-1)}>
								Cancel
							</Button>
							<Button disabled={isLoading} variant="contained" onClick={handleSubmit} sx={{ backgroundColor: "#0D2B4E", color: "white" }}>
								Submit
							</Button>
						</Box>
					</Box>
				</div>
			</div>

			<Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
				<Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
					{snackbar.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default EmployeeCreate;
