import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Box, TextField, Typography, Button, Card, CardContent, Grid, Snackbar, FormHelperText, Autocomplete } from "@mui/material";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import axiosInstance from "@/utils/axiosInstance";

const CreateFinanceEntry = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: "",
		category: null,
		description: "",
		amount: "",
		quantity: "",
		status: "unpaid",
		file: null,
		issue_date: "",
		due_date: "",
	});
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [categories, setCategories] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

	// Fetch categories based on search input
	useEffect(() => {
		axiosInstance
			.get(`finance/categories?type=search&query=${searchTerm}`)
			.then((res) => setCategories(res.data.results))
			.catch((err) => console.error("Error fetching categories", err));
	}, [searchTerm]);

	// Form Validation
	const validate = () => {
		let tempErrors = {};
		if (!formData.name) tempErrors.name = "Name is required";
		if (!formData.category) tempErrors.category = "Category is required";
		if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) tempErrors.amount = "Valid amount is required";
		if (!formData.quantity || isNaN(formData.quantity) || Number(formData.quantity) <= 0) tempErrors.quantity = "Valid quantity is required";
		if (!formData.issue_date) tempErrors.issue_date = "Issue date is required";
		if (!formData.due_date) tempErrors.due_date = "Due date is required";
		setErrors(tempErrors);
		return Object.keys(tempErrors).length === 0;
	};

	// Handle Form Submission
	const handleSubmit = () => {
		if (!validate()) return;
		setLoading(true);

		// Create FormData and append fields
		const payload = new FormData();
		payload.append("name", formData.name);
		payload.append("description", formData.description);
		payload.append("amount", formData.amount);
		payload.append("quantity", formData.quantity);
		payload.append("status", formData.status);
		payload.append("category_id", formData.category?.id || null);
		payload.append("file", formData.file || null);
		payload.append("issue_date", formData.issue_date);
		payload.append("due_date", formData.due_date);

		// Append file if selected
		if (formData.file && formData.status === "paid") {
			console.log("Appending file:", formData.file);

			payload.append("receipt", formData.file);
		}

		axiosInstance
			.post("finances", payload, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then(() => {
				setSnackbar({ open: true, message: "Finance entry created successfully!", severity: "success" });
				navigate(-1);
			})
			.catch((error) => {
				setSnackbar({ open: true, message: error.response?.data?.message || "Failed to create entry", severity: "error" });
				console.error("API Error:", error);
			})
			.finally(() => setLoading(false));
	};
	// Handle file selection
	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setFormData({ ...formData, file });
		}
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
						<div onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
							<MdArrowBackIos style={{ fontSize: "20px", marginRight: "10px" }} />
							<h4 style={{ margin: 0 }}>New Finance Entry</h4>
						</div>
					</div>
					<Box sx={{ display: "flex", justifyContent: "center", p: 3, bgcolor: "#f8f9fa" }}>
						<Card sx={{ width: "100%", maxWidth: 800, boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)", borderRadius: 2 }}>
							<CardContent sx={{ p: 4 }}>
								<Grid container spacing={3}>
									{[
										{ label: "Name", name: "name" },
										{ label: "Description", name: "description" },
										{ label: "Amount", name: "amount", type: "number" },
										{ label: "Quantity", name: "quantity", type: "number" },
									].map(({ label, name, type = "text" }) => (
										<Grid item xs={12} md={6} key={name}>
											<Typography variant="body2" sx={{ mb: 1 }}>
												{label}
											</Typography>
											<TextField fullWidth type={type} variant="outlined" size="small" sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }} value={formData[name]} onChange={(e) => setFormData({ ...formData, [name]: e.target.value })} error={!!errors[name]} helperText={errors[name]} />
										</Grid>
									))}
									<Grid item xs={12} md={6}>
										<Typography variant="body2" sx={{ mb: 1 }}>
											Category
										</Typography>
										<Autocomplete options={categories} getOptionLabel={(option) => option.name} value={formData.category} onInputChange={(event, value) => setSearchTerm(value)} onChange={(event, value) => setFormData({ ...formData, category: value })} renderInput={(params) => <TextField {...params} variant="outlined" size="small" fullWidth error={!!errors.category} helperText={errors.category} />} />
									</Grid>
									{[
										{ label: "Issue Date", name: "issue_date" },
										{ label: "Due Date", name: "due_date" },
									].map(({ label, name }) => (
										<Grid item xs={12} md={6} key={name}>
											<Typography variant="body2" sx={{ mb: 1 }}>
												{label}
											</Typography>
											<TextField fullWidth type="date" variant="outlined" size="small" sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }} value={formData[name]} onChange={(e) => setFormData({ ...formData, [name]: e.target.value })} InputLabelProps={{ shrink: true }} error={!!errors[name]} helperText={errors[name]} />
										</Grid>
									))}

									<Grid item xs={12} md={6}>
										<Typography variant="body2" sx={{ mb: 1 }}>
											Status
										</Typography>
										<TextField select fullWidth variant="outlined" size="small" sx={{ "& .MuiOutlinedInput-root": { backgroundColor: "#fff" } }} value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} SelectProps={{ native: true }} error={!!errors.status} helperText={errors.status}>
											<option value="unpaid">Unpaid</option>
											<option value="paid">Paid</option>
										</TextField>
									</Grid>

									{/* Conditionally show receipt upload only when status is 'paid' */}
									{formData.status === "paid" && (
										<Grid item xs={12}>
											<div
												style={{
													display: "flex",
													flexDirection: "column",
													alignItems: "center",
													border: "2px dotted #ccc",
													padding: "10px",
													borderRadius: "10px",
													textAlign: "center",
												}}>
												<label htmlFor="file-upload" style={{ cursor: "pointer" }}>
													Upload Receipt (Optional)
												</label>
												<input id="file-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
											</div>
											{formData.file && (
												<Typography variant="body2" style={{ marginTop: "10px" }}>
													{formData.file.name}
												</Typography>
											)}
										</Grid>
									)}

									<Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
										<Button
											variant="contained"
											sx={{
												mt: 2,
												px: 6,
												py: 1,
												bgcolor: "#FFCC16",
												"&:hover": {
													bgcolor: "#FFCC16",
												},
												textTransform: "none",
												borderRadius: 1,
												minWidth: "120px",
											}}
											onClick={handleSubmit}
											disabled={loading}>
											{loading ? "Saving..." : "Save"}
										</Button>
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					</Box>
					<Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} message={snackbar.message} />
				</div>
			</div>
		</>
	);
};

export default CreateFinanceEntry;
