import React, { useCallback, useEffect, useState } from "react";
import TopNavbar from "../../components/topNavbar";
import Sidebar from "../../components/leftSideBar";
import { useNavigate } from "react-router-dom";
import { Autocomplete, TextField, Button, Alert, Select, MenuItem, FormHelperText, FormControl, InputLabel } from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";

const NewApplication = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		employee: "",
		leave_category_id: "",
		start_date: "",
		end_date: "",
		reason: "",
	});
	const [employees, setEmployees] = useState([]);
	const [categories, setCategories] = useState([]);
	const [errors, setErrors] = useState({});
	const [searchloading, setSearchLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	useEffect(() => {
		const getLeaveCategories = async () => {
			try {
				const res = await axiosInstance.get("employees/leavecategories/all");
				setCategories(res.data.categories);
			} catch (error) {
				console.log(error);
			}
		};
		getLeaveCategories();
	}, []);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const fetchSearchResults = useCallback(async (query, type) => {
		if (!query) return []; // Don't make a request if the query is empty.
		setSearchLoading(true);
		try {
			const response = await axiosInstance.get("search", {
				params: {
					query: query,
					type: type,
				},
			});
			setSearchLoading(false);
			if (response.data.success) {
				return response.data.results;
			} else {
				setSearchLoading(false);
				return [];
			}
		} catch (error) {
			setSearchLoading(false);
			console.error("Error fetching search results:", error);
			return [];
		}
	}, []);

	const handleEmployeeSearch = async (event, newValue) => {
		const query = event.target.value;
		if (query) {
			const results = await fetchSearchResults(query, "employee");
			setEmployees(results);
		} else {
			setEmployees([]);
		}
	};

	// Handle Autocomplete change
	const handleAutocompleteChange = (event, value, field) => {
		setFormData({ ...formData, [field]: value });
		// setErrors({ ...errors, [field]: "" }); // Clear error on change
	};

	const validateForm = () => {
		let tempErrors = {};
		if (!formData.employee) tempErrors.employee = "Employee is required";
		if (!formData.leave_category_id) tempErrors.leave_category_id = "Category is required";
		if (!formData.start_date) tempErrors.start_date = "Start date is required";
		if (!formData.end_date) tempErrors.end_date = "End date is required";
		if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
			tempErrors.end_date = "End date must be after start date";
		}
		if (!formData.reason) tempErrors.reason = "Reason is required";
		setErrors(tempErrors);
		return Object.keys(tempErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;
		try {
			await axiosInstance.post("employees/attendances/leave/create", { ...formData, employee_id: formData.employee.id });
			setSuccessMessage("Leave application submitted successfully!");
			setFormData({ employee: "", leave_category_id: "", start_date: "", end_date: "", reason: "" });
			setErrors({});
		} catch (error) {
			console.error("Error submitting leave application", error);
		}
	};

	return (
		<>
			<TopNavbar />
			<div className="main">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<h3>New Leave Application</h3>
					{successMessage && <Alert severity="success">{successMessage}</Alert>}
					<form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "auto", padding: "24px", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
						<Autocomplete className="mb-3" options={employees} getOptionLabel={(option) => option.name || ""} value={formData.employee} onInputCapture={handleEmployeeSearch} onChange={(event, value) => handleAutocompleteChange(event, value, "employee")} renderInput={(params) => <TextField {...params} label="Search Employee" variant="outlined" error={!!errors.employee} helperText={errors.employee} />} />

						<FormControl fullWidth error={!!errors.leave_category_id}>
							<InputLabel id="leave-category-label">Leave Category</InputLabel>
							<Select labelId="leave-category-label" value={formData.leave_category_id} label="Leave Category" name="leave_category_id" onChange={handleChange}>
								<MenuItem value="">Select one</MenuItem>
								{categories.map((item) => (
									<MenuItem key={item.id} value={item.id}>
										{item.name}
									</MenuItem>
								))}
							</Select>
							{errors.leave_category_id && <FormHelperText error>{errors.leave_category_id}</FormHelperText>}
						</FormControl>

						{formData.start_date}
						<div className="d-flex gap-3">
							<TextField
								type="date"
								label="Start Date"
								InputLabelProps={{ shrink: true }}
								fullWidth
								name="start_date"
								value={formData.start_date}
								onChange={(e) => {
									handleChange(e);
									setFormData((prev) => ({
										...prev,
										end_date: prev.end_date && prev.end_date < e.target.value ? "" : prev.end_date, // Reset end_date if invalid
									}));
								}}
								margin="normal"
								error={!!errors.start_date}
								helperText={errors.start_date}
							/>
							<TextField
								type="date"
								label="End Date"
								InputLabelProps={{ shrink: true }}
								fullWidth
								name="end_date"
								value={formData.end_date}
								onChange={handleChange}
								margin="normal"
								error={!!errors.end_date}
								helperText={errors.end_date}
								inputProps={{ min: formData.start_date }} // Prevents selecting past dates
							/>
						</div>
						<TextField multiline rows={3} label="Reason" fullWidth name="reason" value={formData.reason} onChange={handleChange} margin="normal" error={!!errors.reason} helperText={errors.reason} />
						<div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
							<Button variant="outlined" onClick={() => navigate(-1)}>
								Cancel
							</Button>
							<Button type="submit" variant="contained" color="primary">
								Submit
							</Button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default NewApplication;
