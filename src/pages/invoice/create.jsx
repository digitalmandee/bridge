import React, { useState, useEffect, useCallback } from "react";
import { TextField, Button, Grid, Typography, Tabs, Tab, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio, Select, MenuItem, Autocomplete, FormHelperText, Snackbar, Alert } from "@mui/material";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { MdArrowBackIos } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axiosInstance from "@/utils/axiosInstance";
import dayjs from "dayjs";
import colors from "@/assets/styles/color";

const InvoiceCreate = () => {
	const navigate = useNavigate();
	const { branch } = useParams();

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
		discount: "",
		amount: "",
		file: null,
		status: "pending",
		paidMonth: [new Date().toLocaleString("default", { month: "long" })],
		paidYear: new Date().getFullYear(),
	});

	const [members, setMembers] = useState([]);
	const [companies, setCompanies] = useState([]);
	const [bookingPlans, setBookingPlans] = useState([]);
	const [errors, setErrors] = useState({});
	const [searchloading, setSearchLoading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [invoiceTypes, setInvoiceTypes] = useState([]);
	const [userBooking, setUserBooking] = useState(null);
	const [activeBookings, setActiveBookings] = useState([]);
	const [selectedBooking, setSelectedBooking] = useState(null);
	const [userBookingError, setUserBookingError] = useState({
		success: false,
		message: "",
	});

	// Snackbar
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

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
		const fetchActiveBookings = async () => {
			try {
				const res = await axiosInstance.get("invoices/user-booking", {
					params: { user_id: selectedTab == "individual" ? formData.member.id : formData.company.id },
				});
				if (res.data.success && res.data.bookings) {
					// Got list of active bookings
					setActiveBookings(res.data.bookings);
					setSelectedBooking(null);
					setUserBooking(null);
					setUserBookingError({ success: false, message: "" });
				}
			} catch (error) {
				console.error("Error fetching bookings:", error.response?.data);
				if (error.response?.data?.message === "No booking found") {
					setUserBookingError({ success: false, message: error.response.data.message });
					setActiveBookings([]);
				}
			}
		};

		if ((formData.member || formData.company) && formData.invoiceType == "Monthly") {
			fetchActiveBookings();
		}
	}, [formData.member, formData.company, formData.invoiceType]);

	// Fetch specific booking details when a booking is selected
	useEffect(() => {
		const fetchBookingDetails = async () => {
			try {
				const res = await axiosInstance.get("invoices/user-booking", {
					params: {
						user_id: selectedTab == "individual" ? formData.member.id : formData.company.id,
						booking_id: selectedBooking.id,
					},
				});
				if (res.data.success) {
					setUserBooking(res.data);
					setFormData({ ...formData, paidMonth: [] });
				}
			} catch (error) {
				console.error("Error fetching booking details:", error.response?.data);
			}
		};

		if (selectedBooking) {
			fetchBookingDetails();
		}
	}, [selectedBooking]);

	const fetchSearchResults = useCallback(async (query, type) => {
		// if (!query) return []; // Don't make a request if the query is empty.
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

	const handleMemberSearch = async (event, newValue) => {
		const query = event.target.value;
		const results = await fetchSearchResults(query, "user");
		setMembers(results);
	};

	const handleCompanySearch = async (event, newValue) => {
		const query = event.target.value;
		const results = await fetchSearchResults(query, "company");
		setCompanies(results);
	};

	useEffect(() => {
		const loadResults = async () => {
			const results = await fetchSearchResults("", selectedTab === "individual" ? "user" : "company");
			if (selectedTab === "individual") {
				setMembers(results);
			} else {
				setCompanies(results);
			}
		};
		loadResults();
	}, [selectedTab, fetchSearchResults]);

	// Handle Autocomplete change
	const handleAutocompleteChange = (event, value, field) => {
		setFormData({ ...formData, [field]: value });
		setErrors({ ...errors, [field]: "" }); // Clear error on change
	};

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name === "paidMonth") {
			const selected = typeof value === "string" ? value.split(",") : value;

			const selectedIndexes = selected.map((month) => allMonths.indexOf(month)).sort((a, b) => a - b);

			const firstIndex = selectedIndexes[0];
			const expected = Array.from({ length: selectedIndexes.length }, (_, i) => firstIndex + i);

			const isConsecutive = expected.every((val, idx) => val === selectedIndexes[idx]);

			if (!isConsecutive) {
				setSnackbar({ open: true, message: "Please select consecutive months starting from your first choice.", severity: "warning" });
				return;
			}

			setFormData((prev) => ({ ...prev, [name]: selected }));
		} else if (name === "paidYear") {
			setFormData((prev) => ({ ...prev, [name]: value, paidMonth: [] }));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}

		setErrors((prev) => ({ ...prev, [name]: "" }));
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

	const fetchInvoiceTypes = async () => {
		try {
			const res = await axiosInstance.get("invoice-types", { params: { type: "search" } });
			if (res.data.success) {
				setInvoiceTypes(res.data.results);
			}
		} catch (error) {
			setSnackbar({ open: true, message: "Error fetching invoice types!", severity: "error" });
		}
	};

	useEffect(() => {
		fetchInvoiceTypes();
	}, []);

	// Submit Form to API
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		const newErrors = {};
		const { invoiceType, member, company, dueDate, paidDate, paidMonth, paidYear, paymentType, quantity, hours, amount, packageDetail, status, file, discount } = formData;

		// ==== Validation ====
		if (!invoiceType) newErrors.invoiceType = "Invoice Type is required";
		if (selectedTab === "individual" && !member) newErrors.member = "Member is required for Individual invoices";
		if (selectedTab === "company" && !company) newErrors.company = "Company is required for Company invoices";
		if (!dueDate) newErrors.dueDate = "Due Date is required";

		const typeChecks = {
			Monthly: () => {
				if (!paidMonth || paidMonth.length === 0) newErrors.paidMonth = "At least one month must be selected";
			},
			"Printing Papers": () => {
				if (!quantity) newErrors.quantity = "Quantity is required";
			},
			"Meeting Rooms": () => {
				if (!hours) newErrors.hours = "Hours are required";
			},
		};

		if (invoiceType in typeChecks) {
			typeChecks[invoiceType]();
		} else if (!amount) {
			newErrors.amount = "Amount is required";
		}

		if (status !== "pending") {
			if (!paidDate) newErrors.paidDate = "Paid Date is required";
			if (!paymentType) newErrors.paymentType = "Payment Type is required";
		}

		// ==== Stop if errors ====
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			setLoading(false);
			return;
		}

		// ==== Prepare FormData ====
		const formDataToSend = new FormData();
		formDataToSend.append("selectedTab", selectedTab);
		formDataToSend.append("invoiceType", invoiceType);
		formDataToSend.append("paidYear", paidYear);
		formDataToSend.append("dueDate", dayjs(dueDate).format("YYYY-MM-DD"));
		formDataToSend.append("paidDate", paidDate ? dayjs(paidDate).format("YYYY-MM-DD") : "");
		formDataToSend.append("paymentType", paymentType || "");
		formDataToSend.append("company_id", company?.id || "");
		formDataToSend.append("member_id", member?.id || "");
		formDataToSend.append("quantity", quantity || "");
		formDataToSend.append("hours", hours || "");
		formDataToSend.append("amount", amount || "");
		formDataToSend.append("discount", discount || "");
		formDataToSend.append("packageDetail", packageDetail || "");
		formDataToSend.append("status", status);

		// Add booking_id for Monthly invoices
		if (invoiceType === "Monthly" && selectedBooking) {
			formDataToSend.append("booking_id", selectedBooking.id);
		}

		// Handle multiple paid months (array)
		if (Array.isArray(paidMonth)) {
			paidMonth.forEach((month) => formDataToSend.append("paidMonth[]", month));
		} else {
			formDataToSend.append("paidMonth[]", paidMonth);
		}

		// Append file if selected
		if (file) {
			formDataToSend.append("receipt", file);
		}

		// ==== Submit ====
		try {
			const response = await axiosInstance.post("invoices/create", formDataToSend, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			if (response.data.success) {
				setSnackbar({ open: true, message: "Invoice successfully created!", severity: "success" });
				navigate(`/${branch}/branch/invoice/management`);
			}
		} catch (error) {
			console.log(error);

			const message = error?.response?.data?.message;
			if (message === "This month invoice already paid") {
				setSnackbar({ open: true, message: "This month invoice already paid!", severity: "error" });
			} else {
				setSnackbar({ open: true, message: message ?? "Something went wrong", severity: "error" });
			}
		} finally {
			setLoading(false);
		}
	};

	const totalBookingPrice = (price) => {
		const planPrice = Number(price) || 0;
		let totalPrice = 0;
		let packageDetail = "";
		let dueDates = []; // Multiple due dates per selected month

		if (formData.invoiceType === "Monthly" && userBooking) {
			const today = new Date();
			const currentYear = Number(formData.paidYear);
			const totalChairs = userBooking.booking.chairs.length;

			// Ensure paidMonth is an array
			const selectedMonths = Array.isArray(formData.paidMonth) ? formData.paidMonth : [formData.paidMonth];

			selectedMonths.forEach((monthName) => {
				const monthIndex = new Date(`${monthName} 1, ${currentYear}`).getMonth();
				const lastDayOfMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
				const dailyRate = planPrice / lastDayOfMonth;

				let extraPricePerChair = 0;
				let detail = "";
				let dueDate = null;

				const isCurrentMonth = monthIndex === today.getMonth() && currentYear === today.getFullYear();

				if (isCurrentMonth) {
					const remainingDays = lastDayOfMonth - today.getDate();
					if (remainingDays >= lastDayOfMonth) {
						extraPricePerChair = planPrice;
						detail = "1 month";
					} else if (remainingDays > 0) {
						extraPricePerChair = dailyRate * remainingDays;
						detail = `${remainingDays} days`;
					} else {
						extraPricePerChair = planPrice;
						detail = "1 month";
					}
					dueDate = dayjs(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5));
				} else {
					// Future month
					extraPricePerChair = planPrice;
					detail = "1 month";
					dueDate = dayjs(new Date(currentYear, monthIndex, 5));
				}

				totalPrice += totalChairs * extraPricePerChair;
				dueDates.push({ month: monthName, dueDate });
				packageDetail += `${monthName}: ${detail}, `;
			});
		} else {
			// Fallback if invoiceType is not monthly
			const monthIndex = new Date(`${formData.paidMonth} 1, ${formData.paidYear}`).getMonth();
			const fallbackDueDate = dayjs(new Date(formData.paidYear, monthIndex, 5));
			dueDates.push({ month: formData.paidMonth, dueDate: fallbackDueDate });
		}

		return {
			totalPrice: Math.round(totalPrice),
			packageDetail: packageDetail.trim().replace(/,\s*$/, ""), // clean trailing comma
			dueDates,
		};
	};

	useEffect(() => {
		if (userBooking && formData.invoiceType === "Monthly") {
			const totalBookingPriceResult = totalBookingPrice(userBooking?.booking?.plan?.price || 0);

			setFormData((prev) => ({
				...prev,
				dueDate: totalBookingPriceResult.dueDate,
				amount: totalBookingPriceResult.totalPrice,
				packageDetail: totalBookingPriceResult.packageDetail,
			}));
		}
	}, [formData.paidMonth, userBooking]);

	// Get all months
	const allMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const currentMonthIndex = new Date().getMonth();

	// Flatten and normalize paid months array to handle nested arrays
	const paidMonths = userBooking?.payed_months ? userBooking.payed_months.flat().filter((month) => month && typeof month === "string") : [];

	return (
		<>
			<TopNavbar />
			<div className="main d-flex">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div className="container-fluid">
						<div style={{ paddingTop: "1rem", display: "flex", alignItems: "center", marginBottom: "20px" }}>
							<div onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
								<MdArrowBackIos style={{ fontSize: "20px", marginRight: "1rem" }} />
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
											</Grid>
										)}
										{/* Invoice Type Dropdown */}
										<Grid item xs={12}>
											<FormControl fullWidth error={Boolean(errors.invoiceType)}>
												<InputLabel id="invoiceType">Invoice Type</InputLabel>
												<Select label="Invoice Type" name="invoiceType" labelId="invoiceType" value={formData.invoiceType} onChange={handleChange}>
													{invoiceTypes.length > 0 ? (
														invoiceTypes.map((type) => (
															<MenuItem key={type.id} value={type.name}>
																{type.name}
															</MenuItem>
														))
													) : (
														<MenuItem value="" disabled>
															No invoice types found
														</MenuItem>
													)}
												</Select>
												{errors.invoiceType && <FormHelperText error>{errors.invoiceType}</FormHelperText>}
											</FormControl>
										</Grid>

										{/* Booking Selection Dropdown - Show when Monthly invoice type is selected */}
										{formData.invoiceType === "Monthly" && activeBookings.length > 0 && (
											<Grid item xs={12}>
												<FormControl fullWidth>
													<InputLabel id="booking-select-label">Select Booking</InputLabel>
													<Select
														labelId="booking-select-label"
														value={selectedBooking?.id || ""}
														onChange={(e) => {
															const booking = activeBookings.find((b) => b.id === e.target.value);
															setSelectedBooking(booking);
														}}
														label="Select Booking">
														{activeBookings.map((booking) => (
															<MenuItem key={booking.id} value={booking.id}>
																Booking #{booking.id} - {booking.plan_name} - Started: {new Date(booking.start_date).toLocaleDateString()} - Rs. {booking.total_price}
															</MenuItem>
														))}
													</Select>
												</FormControl>
											</Grid>
										)}

										{/* Show error if no bookings found */}
										{formData.invoiceType === "Monthly" && userBookingError.message && (
											<Grid item xs={12}>
												<div style={{ color: "red", padding: "10px", backgroundColor: "#ffebee", borderRadius: "4px" }}>{userBookingError.message}</div>
											</Grid>
										)}

										{formData.invoiceType === "Monthly" && userBooking && (
											<Grid item xs={12}>
												Booking Status: {userBooking.message} <br />
												{userBooking.unavailable_chairs && (
													<>
														Unavailable Chairs: {userBooking.unavailable_chairs.map((chair) => chair).join(", ")} <br />
													</>
												)}
												Booking Chairs: {userBooking.booking.chairs.length > 3 ? `${userBooking.booking.chairs.slice(0, 3).join(", ")} and ${userBooking.booking.chairs.length - 3} more` : userBooking.booking.chairs.map((chair) => chair).join(", ")} <br />
												Booking Plan: {userBooking.booking.plan.name} - Rs. {userBooking.booking.plan.price} <br />
												Package Detail: {formData.packageDetail} <br />
												TotalPrice: Rs. {formData.amount} <br />
											</Grid>
										)}
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
										{/* Dropdown to select the Paid month */}
										{formData.invoiceType === "Monthly" && (
											<Grid item xs={12}>
												<FormControl fullWidth error={Boolean(errors.paidMonth)}>
													<InputLabel id="paidMonth-label">Select Booking Months</InputLabel>
													<Select labelId="paidMonth-label" multiple value={formData.paidMonth} name="paidMonth" onChange={handleChange} variant="outlined" fullWidth renderValue={(selected) => (Array.isArray(selected) ? selected.join(", ") : "")}>
														{allMonths
															.filter((month, index) => {
																// Get booking start month index
																const bookingStartDate = userBooking?.booking?.start_date ? new Date(userBooking.booking.start_date) : new Date();
																const bookingStartMonthIndex = bookingStartDate.getMonth();
																const bookingStartYear = bookingStartDate.getFullYear();
																const currentPaidYear = Number(formData.paidYear);

																// Check if this month is before the booking start month
																let isBeforeBookingStart = false;

																if (currentPaidYear < bookingStartYear) {
																	isBeforeBookingStart = true;
																} else if (currentPaidYear === bookingStartYear) {
																	isBeforeBookingStart = index < bookingStartMonthIndex;
																} else {
																	isBeforeBookingStart = false;
																}

																const isPaid = paidMonths.includes(month);

																// Debug logging
																if (userBooking && paidMonths.length > 0) {
																	console.log(`Month: ${month}, Index: ${index}, StartYear: ${bookingStartYear}, PaidYear: ${currentPaidYear}, IsBefore: ${isBeforeBookingStart}, IsPaid: ${isPaid}, PaidMonths:`, paidMonths);
																}

																// Show months from booking start date onwards, excluding paid months
																return !isBeforeBookingStart && !isPaid;
															})
															.map((month, index) => {
																const selectedIndexes = formData.paidMonth.map((m) => allMonths.indexOf(m)).sort((a, b) => a - b);
																const bookingStartDate = userBooking?.booking?.start_date ? new Date(userBooking.booking.start_date) : new Date();
																const bookingStartMonthIndex = bookingStartDate.getMonth();
																const maxIndex = Math.max(...selectedIndexes, bookingStartMonthIndex);
																const isDisabled = selectedIndexes.length > 0 && allMonths.indexOf(month) > maxIndex + 1;

																return (
																	<MenuItem key={index} value={month} disabled={isDisabled}>
																		{month}
																	</MenuItem>
																);
															})}
													</Select>
													{errors.paidMonth && <FormHelperText>{errors.paidMonth}</FormHelperText>}
												</FormControl>
											</Grid>
										)}

										{/* Paid Year Selection */}
										{formData.invoiceType === "Monthly" && (
											<Grid item xs={12}>
												<FormControl fullWidth error={Boolean(errors.paidYear)}>
													<InputLabel id="paidYear-label">Invoice Year</InputLabel>
													<Select labelId="paidYear-label" name="paidYear" value={formData.paidYear} onChange={handleChange} label="Invoice Year">
														{Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
															<MenuItem key={year} value={year}>
																{year}
															</MenuItem>
														))}
													</Select>
													<FormHelperText>{errors.paidYear || "Year for the selected month(s)"}</FormHelperText>
												</FormControl>
											</Grid>
										)}

										<Grid item xs={12}>
											<TextField label="Discount (%) - Optional" type="number" name="discount" value={formData.discount} onChange={handleChange} variant="outlined" fullWidth placeholder="%" error={Boolean(errors.discount)} helperText={errors.discount} min={0} />
										</Grid>

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

										<Grid item xs={12}>
											<Typography variant="h6" gutterBottom>
												Total Amount: Rs. {formData.amount ? (formData.discount ? Math.round(formData.amount - formData.amount * (formData.discount / 100)) : formData.amount) : 0}
											</Typography>
										</Grid>
									</Grid>

									{/* Save Button */}
									<div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
										<Button disabled={formData.invoiceType === "Monthly" ? (selectedBooking && userBooking && userBooking.success === true ? false : true) : loading} variant="contained" type="submit" sx={{ bgcolor: colors.primary, "&:hover": { bgcolor: colors.primary } }}>
											Save Invoice
										</Button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Snackbar for success/failure message */}
			<Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
				<Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
					{snackbar.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default InvoiceCreate;
