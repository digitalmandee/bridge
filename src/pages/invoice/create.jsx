import React, { useState, useEffect, useCallback } from "react";
import { TextField, Button, Grid, Typography, Tabs, Tab, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio, Select, MenuItem, Autocomplete, FormHelperText, Snackbar, Alert } from "@mui/material";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { MdArrowBackIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axiosInstance from "@/utils/axiosInstance";
import dayjs from "dayjs";

const InvoiceCreate = () => {
	const navigate = useNavigate();
	const [selectedTab, setSelectedTab] = useState("individual");

	const [formData, setFormData] = useState({
		invoiceType: "",
		dueDate: null,
		paidDate: null,
		paymentType: "",
		company: null,
		member: null,
		plan: null,
		quantity: "",
		hours: "",
		amount: "",
		file: null,
		status: "pending",
		paidMonth: null,
		paidYear: new Date().getFullYear(),
	});

	const [members, setMembers] = useState([]);
	const [companies, setCompanies] = useState([]);
	const [bookingPlans, setBookingPlans] = useState([]);
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
	const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message

	// Fetch Members & Companies on Load
	useEffect(() => {
		const fetchData = async () => {
			try {
				const bookingPlansRes = await axiosInstance.get("booking-plans");

				setBookingPlans(bookingPlansRes.data.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		const fetchUserBooking = async () => {
			console.log("yes");
			try {
				const bookingPlansRes = await axiosInstance.get(`booking-plans`);
				// setBookingPlans(bookingPlansRes.data.data);
			} catch (error) {
				// console.error("Error fetching data:", error);
			}
		};
		console.log("no");

		if ((formData.member || formData.company) && formData.invoiceType == "Monthly") fetchUserBooking();
	}, [formData.member, formData.company, formData.invoiceType]);

	const fetchSearchResults = useCallback(async (query, type) => {
		if (!query) return []; // Don't make a request if the query is empty.
		setLoading(true);
		try {
			const response = await axiosInstance.get(import.meta.env.VITE_BASE_API + "search", {
				params: {
					query: query,
					type: type,
				},
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
		const query = event.target.value;
		if (query) {
			const results = await fetchSearchResults(query, "user");
			setMembers(results);
		} else {
			setMembers([]);
		}
	};

	const handleCompanySearch = async (event, newValue) => {
		const query = event.target.value;
		if (query) {
			const results = await fetchSearchResults(query, "company");
			setCompanies(results);
		} else {
			setCompanies([]);
		}
	};

	// Handle Autocomplete change
	const handleAutocompleteChange = (event, value, field) => {
		setFormData({ ...formData, [field]: value });
		setErrors({ ...errors, [field]: "" }); // Clear error on change
	};

	// Handle form field changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		setErrors({ ...errors, [name]: "" }); // Clear error on change
	};

	// Handle file selection
	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setFormData({ ...formData, file });
		}
	};

	// Handle tab switch (Individual or Company)
	const handleTabChange = (event, newValue) => {
		setSelectedTab(newValue);
	};

	// Submit Form to API
	const handleSubmit = async (e) => {
		e.preventDefault();

		const newErrors = {};

		// Basic Validation
		if (!formData.invoiceType) {
			newErrors.invoiceType = "Invoice Type is required";
		}

		if (selectedTab === "individual" && !formData.member) {
			newErrors.member = "Member is required for Individual invoices";
		}

		if (selectedTab === "company" && !formData.company) {
			newErrors.company = "Company is required for Company invoices";
		}

		if (!formData.dueDate) {
			newErrors.dueDate = "Due Date is required";
		}

		// Check dynamic fields
		if (formData.invoiceType === "Monthly" && !formData.plan) {
			newErrors.plan = "Plan is required for Monthly invoices";
		}
		if (formData.invoiceType === "Monthly" && !formData.paidMonth) {
			newErrors.paidMonth = "Paid Month is required for Monthly invoices";
		}
		if (formData.invoiceType === "Printing Papers" && !formData.quantity) {
			newErrors.quantity = "Quantity is required for Printing Papers invoices";
		}

		if (formData.invoiceType === "Meeting Rooms" && !formData.hours) {
			newErrors.hours = "Hours are required for Meeting Rooms invoices";
		}

		if (formData.invoiceType && formData.invoiceType !== "Monthly" && !formData.amount) {
			newErrors.amount = "Amount is required";
		}

		// Show Paid Date & Payment Type validation only if status is Paid or Overdue
		if (formData.status !== "pending") {
			if (!formData.paidDate) {
				newErrors.paidDate = "Paid Date is required";
			}
			if (!formData.paymentType) {
				newErrors.paymentType = "Payment Type is required";
			}
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		// Create FormData and append fields
		const formDataToSend = new FormData();
		formDataToSend.append("selectedTab", selectedTab);
		formDataToSend.append("invoiceType", formData.invoiceType);
		formDataToSend.append("dueDate", dayjs(formData.dueDate).format("YYYY-MM-DD"));
		formDataToSend.append("paidDate", formData.paidDate ? dayjs(formData.paidDate).format("YYYY-MM-DD") : null);
		formDataToSend.append("paymentType", formData.paymentType);
		formDataToSend.append("company_id", formData.company?.id);
		formDataToSend.append("member_id", formData.member?.id);
		formDataToSend.append("plan", JSON.stringify(formData.plan));
		formDataToSend.append("quantity", formData.quantity);
		formDataToSend.append("hours", formData.hours);
		formDataToSend.append("amount", formData.amount);
		formDataToSend.append("paidMonth", formData.paidMonth);
		formDataToSend.append("paidYear", formData.paidYear);
		formDataToSend.append("status", formData.status);

		// Append file if selected
		if (formData.file) {
			formDataToSend.append("reciept", formData.file);
		}

		// Submit the form if no errors
		try {
			const response = await axiosInstance.post(import.meta.env.VITE_BASE_API + "invoices/create", formDataToSend, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			if (response.data.success) {
				setSnackbarMessage("Invoice successfully created!"); // Set success message
				setSnackbarOpen(true); // Show the snackbar
				navigate("/branch/invoice/management");
			}
		} catch (error) {
			console.error("Error submitting invoice:", error.response.data);
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
					<div style={{ paddingTop: "1rem", display: "flex", alignItems: "center", marginBottom: "20px", cursor: "pointer" }}>
						<div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
							<MdArrowBackIos style={{ fontSize: "20px", marginRight: "10px" }} />
						</div>
						<h4 style={{ margin: 0 }}>New Invoice</h4>
					</div>

					<div style={{ flex: 1, padding: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
						<div style={{ width: "100%", maxWidth: "600px", backgroundColor: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
							{/* Tab Switch (Individual | Company) */}
							<Tabs value={selectedTab} onChange={handleTabChange} centered>
								<Tab label="Individual" value="individual" />
								<Tab label="Company" value="company" />
							</Tabs>

							<form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
								<Grid container spacing={2}>
									{/* Autocomplete for Members (Individual) or Companies (Company) */}
									{selectedTab === "individual" ? (
										<Grid item xs={12}>
											<Autocomplete
												options={members}
												getOptionLabel={(option) => option.name} // Return just the name
												value={formData.member}
												onInputChange={handleMemberSearch} // Trigger search on input change
												onChange={(event, value) => handleAutocompleteChange(event, value, "member")}
												renderInput={(params) => (
													<>
														<TextField {...params} label="Search Member" variant="outlined" />
														{errors.member && <FormHelperText error>{errors.member}</FormHelperText>}
													</>
												)}
												renderOption={(props, option) => (
													<li {...props}>
														<span>{option.name}</span>
														<span style={{ color: "gray", fontSize: "0.875rem" }}> ({option.email})</span>
													</li>
												)}
											/>
										</Grid>
									) : (
										<Grid item xs={12}>
											<Autocomplete
												options={companies}
												getOptionLabel={(option) => option.name} // Return just the name
												value={formData.company}
												onInputChange={handleCompanySearch} // Trigger search on input change
												onChange={(event, value) => handleAutocompleteChange(event, value, "company")}
												renderInput={(params) => (
													<>
														<TextField {...params} label="Search Company" variant="outlined" />
														{errors.company && <FormHelperText error>{errors.company}</FormHelperText>}
													</>
												)}
												renderOption={(props, option) => (
													<li {...props}>
														<span>{option.name}</span>
														<span style={{ color: "gray", fontSize: "0.875rem" }}> ({option.email})</span>
													</li>
												)}
											/>
										</Grid>
									)}

									{/* Invoice Type Dropdown */}
									<Grid item xs={12}>
										<FormControl fullWidth error={Boolean(errors.invoiceType)}>
											<InputLabel id="invoiceType">Invoice Type</InputLabel>
											<Select label="Invoice Type" name="invoiceType" labelId="invoiceType" value={formData.invoiceType} onChange={handleChange}>
												<MenuItem value="Monthly">Monthly</MenuItem>
												<MenuItem value="Printing Papers">Printing Papers</MenuItem>
												<MenuItem value="Meeting Rooms">Meeting Rooms</MenuItem>
											</Select>
											{errors.invoiceType && <FormHelperText error>{errors.invoiceType}</FormHelperText>}
										</FormControl>
									</Grid>

									{/* Dynamic Fields: Quantity or Hours */}
									{formData.invoiceType === "Printing Papers" && (
										<Grid item xs={12}>
											<TextField label="Quantity" type="number" fullWidth name="quantity" value={formData.quantity} onChange={handleChange} variant="outlined" error={Boolean(errors.quantity)} helperText={errors.quantity} />
										</Grid>
									)}

									{formData.invoiceType === "Meeting Rooms" && (
										<Grid item xs={12}>
											<TextField label="Hours" type="number" fullWidth name="hours" value={formData.hours} onChange={handleChange} variant="outlined" error={Boolean(errors.hours)} helperText={errors.hours} />
										</Grid>
									)}
									{formData.invoiceType && formData.invoiceType !== "Monthly" && (
										<Grid item xs={12}>
											<TextField label="Amount" type="number" fullWidth name="amount" value={formData.amount} onChange={handleChange} variant="outlined" error={Boolean(errors.amount)} helperText={errors.amount} />
										</Grid>
									)}

									{/* Status Dropdown */}
									<Grid item xs={12}>
										<FormControl fullWidth error={Boolean(errors.status)}>
											<InputLabel id="status">Status</InputLabel>
											<Select label="Status" labelId="status" name="status" value={formData.status} onChange={handleChange}>
												<MenuItem value="pending">Pending</MenuItem>
												<MenuItem value="paid">Paid</MenuItem>
												<MenuItem value="overdue">Overdue</MenuItem>
											</Select>
											{errors.status && <FormHelperText error>{errors.status}</FormHelperText>}
										</FormControl>
									</Grid>
									{/* Dropdown to select the Paid month */}
									{formData.invoiceType === "Monthly" && (
										<Grid item xs={12}>
											<FormControl fullWidth error={Boolean(errors.paidMonth)}>
												<TextField select label="Select Month You Paid" name="paidMonth" value={formData.paidMonth} onChange={handleChange} variant="outlined" fullWidth>
													{["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
														<MenuItem key={index} value={month}>
															{month}
														</MenuItem>
													))}
												</TextField>
												{errors.paidMonth && <FormHelperText error>{errors.paidMonth}</FormHelperText>}
											</FormControl>
										</Grid>
									)}

									{/* Due Date */}
									<Grid item xs={12} className="selectPicker">
										<LocalizationProvider dateAdapter={AdapterDayjs}>
											<DatePicker style={{ width: "100%" }} label="Due Date" value={formData.dueDate} onChange={(newValue) => setFormData({ ...formData, dueDate: newValue })} renderInput={(params) => <TextField {...params} />} />
											{errors.dueDate && <FormHelperText error>{errors.dueDate}</FormHelperText>}
										</LocalizationProvider>
									</Grid>

									{/* Show Paid Date & Payment Type only if status is Paid or Overdue */}
									{formData.status !== "pending" && (
										<>
											<Grid item xs={12} className="selectPicker">
												<LocalizationProvider dateAdapter={AdapterDayjs}>
													<DatePicker label="Paid Date" value={formData.paidDate} onChange={(newValue) => setFormData({ ...formData, paidDate: newValue })} renderInput={(params) => <TextField {...params} />} />
													{errors.paidDate && <FormHelperText error>{errors.paidDate}</FormHelperText>}
												</LocalizationProvider>
											</Grid>

											<Grid item xs={12}>
												<FormControl component="fieldset" error={Boolean(errors.paymentType)}>
													<RadioGroup row name="paymentType" value={formData.paymentType} onChange={handleChange}>
														<FormControlLabel value="Cash" control={<Radio />} label="Cash" />
														<FormControlLabel value="Bank" control={<Radio />} label="Bank" />
													</RadioGroup>
													{errors.paymentType && <FormHelperText error>{errors.paymentType}</FormHelperText>}
												</FormControl>
											</Grid>

											{/* Receipt Upload (Optional) */}
											<Grid item xs={12}>
												<div style={{ display: "flex", flexDirection: "column", alignItems: "center", border: "2px dotted #ccc", padding: "10px", borderRadius: "10px", textAlign: "center" }}>
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
										</>
									)}
								</Grid>

								{/* Save Button */}
								<div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
									<Button variant="contained" type="submit" sx={{ bgcolor: "#0D2B4E", "&:hover": { bgcolor: "#0B1E3E" } }}>
										Save Invoice
									</Button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			{/* Snackbar for success/failure message */}
			<Snackbar open={snackbarOpen} onClose={() => setSnackbarOpen(false)} autoHideDuration={6000}>
				<Alert onClose={() => setSnackbarOpen(false)} severity="success">
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</>
	);
};

export default InvoiceCreate;
