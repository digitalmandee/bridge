import React, { useState, useEffect } from "react";
import { TextField, Autocomplete, MenuItem, InputAdornment, Button as MuiButton, Snackbar, Alert, Box, Grid } from "@mui/material";
import { Modal, Button, Form } from "react-bootstrap";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axiosInstance from "@/utils/axiosInstance";
import { width } from "@mui/system";
import TopNavbar from "@/components/superadmin/topNavbar";
import Sidebar from "@/components/superadmin/leftSideBar";
import { MdArrowBackIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import colors from "@/assets/styles/color";

const NewInvestorEntry = () => {
	const navigate = useNavigate();

	const [searchResults, setSearchResults] = useState([]);
	const [selectedInvestor, setSelectedInvestor] = useState(null);
	const [showAddInvestorModal, setShowAddInvestorModal] = useState(false);
	const [newInvestor, setNewInvestor] = useState({ name: "", email: "" });

	const [investmentType, setInvestmentType] = useState("");
	const [location, setLocation] = useState("");
	const [amount, setAmount] = useState("");
	const [date, setDate] = useState(dayjs());
	const [invoice, setInvoice] = useState(null);
	const [profitPercent, setProfitPercent] = useState("");
	const [sharePercent, setSharePercent] = useState("");
	const [shareType, setShareType] = useState("");

	const [notes, setNotes] = useState("");
	// Snackbar
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

	// ✅ New states
	const [investmentTypes, setInvestmentTypes] = useState([]);
	const [locations, setLocations] = useState([]);

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	// 📡 Fetch options on mount
	useEffect(() => {
		const fetchOptions = async () => {
			try {
				const [typesRes, locationsRes] = await Promise.all([axiosInstance.get("investor/investment/types"), axiosInstance.get("investor/locations")]);
				console.log(typesRes, locationsRes);

				setInvestmentTypes(typesRes.data || []);
				setLocations(locationsRes.data || []);
			} catch (err) {
				console.error("Error fetching options:", err);
			}
		};
		fetchOptions();
	}, []);

	const handleConfirmInvestor = () => {
		if (!newInvestor.name || !newInvestor.email) {
			setSnackbar({ open: true, message: "Please enter name and email", severity: "error" });
			return;
		}

		if (newInvestor.email && !/\S+@\S+\.\S+/.test(newInvestor.email)) {
			setSnackbar({ open: true, message: "Please enter a valid email", severity: "error" });
			return;
		}

		// set this as selected investor (frontend only)
		setSelectedInvestor(newInvestor);

		// close modal
		setShowAddInvestorModal(false);
	};

	// 🔍 Search API
	const handleSearch = async (query) => {
		try {
			const res = await axiosInstance.get(`investor/users/search?q=${query}`);
			setSearchResults(Array.isArray(res.data) ? res.data : []);
		} catch (err) {
			console.error(err);
			setSearchResults([]);
		}
	};

	useEffect(() => {
		handleSearch("");
	}, []);

	// 📌 Handle form submit
	const handleSubmit = async (e) => {
		e.preventDefault();

		if ((!selectedInvestor && !newInvestor.email) || !amount || !investmentType) {
			alert("Please fill required fields!");
			return;
		}

		try {
			const formData = new FormData();
			formData.append("name", selectedInvestor ? selectedInvestor.name : newInvestor.name);
			formData.append("email", selectedInvestor ? selectedInvestor.email : newInvestor.email);
			formData.append("type", investmentType);
			formData.append("location", location);
			formData.append("amount", amount);
			formData.append("profit_percent", profitPercent || "");
			formData.append("share_percent", sharePercent || "");
			formData.append("share_type", shareType || "");
			formData.append("date", date.format("YYYY-MM-DD"));
			formData.append("notes", notes);
			if (invoice) formData.append("invoice", invoice);

			const res = await axiosInstance.post("investor/users/create-investment", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			setSnackbar({ open: true, message: "Investment Added Successfully", severity: "success" });

			// reset form
			setSelectedInvestor(null);
			setInvestmentType("");
			setLocation("");
			setAmount("");
			setDate(dayjs());
			setInvoice(null);
			setNotes("");
		} catch (err) {
			console.error(err);
			setSnackbar({ open: true, message: err.response?.data?.message || "Something went wrong.", severity: "error" });
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
					<div style={{ paddingTop: "1rem", display: "flex", alignItems: "center", justifyContent:'center', marginBottom: "20px" }}>
						<div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
							<MdArrowBackIos style={{ fontSize: "20px", marginRight: "1rem" }} />
						</div>
						<h4 style={{ margin: 0 }}>New Investor</h4>
					</div>
					<div className="container-fluid p-3 border rounded shadow-sm" style={{ maxWidth: 1000, backgroundColor: "white" }}>
						<h4>New Investor Entry</h4>
						<form onSubmit={handleSubmit}>
							<Box>
								<Grid spacing={2} container>
									<Grid md={12} item>
										{/* Investor Autocomplete */}
										<Autocomplete
											value={selectedInvestor}
											onChange={(event, newValue) => {
												if (newValue?.inputValue === "ADD_NEW") {
													setShowAddInvestorModal(true);
												} else {
													setSelectedInvestor(newValue);
												}
											}}
											onInputChange={(event, newInputValue) => handleSearch(newInputValue)}
											filterOptions={(options, params) => {
												const filtered = options.filter((o) => o.name.toLowerCase().includes(params.inputValue.toLowerCase()));
												if (params.inputValue !== "" && !filtered.length) {
													filtered.push({ name: "Add New Investor", inputValue: "ADD_NEW" });
												}
												return filtered;
											}}
											getOptionLabel={(option) => option?.name || ""}
											options={searchResults}
											renderInput={(params) => <TextField sx={{ m: 0 }} {...params} label="Investor" required />}
											freeSolo
										/>

										{selectedInvestor && (
											<div style={{ marginTop: "10px", marginBottom: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", backgroundColor: "#f9f9f9" }}>
												<strong>Selected Investor:</strong> {selectedInvestor.name} ({selectedInvestor.email})
											</div>
										)}
									</Grid>

									<Grid md={6} item>
										{/* Investment Type */}
										<TextField sx={{ m: 0 }} select label="Investment Type" value={investmentType} onChange={(e) => setInvestmentType(e.target.value)} fullWidth margin="normal" required>
											{investmentTypes.map((type) => (
												<MenuItem key={type.id || type} value={type.id || type}>
													{type.name || type}
												</MenuItem>
											))}
										</TextField>
									</Grid>

									<Grid md={6} item>
										{/* Location */}
										<TextField sx={{ m: 0 }} select label="Location" value={location} onChange={(e) => setLocation(e.target.value)} fullWidth margin="normal">
											<MenuItem value="">None</MenuItem>
											{locations.map((loc) => (
												<MenuItem key={loc.id || loc} value={loc.id || loc}>
													{loc.name || loc}
												</MenuItem>
											))}
										</TextField>
									</Grid>

									<Grid md={6} item>
										{/* Amount */}
										<TextField sx={{ m: 0 }} label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} fullWidth margin="normal" required InputProps={{ startAdornment: <InputAdornment position="start">PKR</InputAdornment> }} />
									</Grid>

									<Grid md={6} item>
										{/* Profit % */}
										<TextField sx={{ m: 0 }} label="Profit %" type="number" value={profitPercent} onChange={(e) => setProfitPercent(e.target.value)} fullWidth margin="normal" />
									</Grid>

									<Grid md={6} item>
										{/* Share % */}
										<TextField sx={{ m: 0 }} label="Share %" type="number" value={sharePercent} onChange={(e) => setSharePercent(e.target.value)} fullWidth margin="normal" />
									</Grid>

									<Grid md={6} item>
										{/* Share Type */}
										<TextField sx={{ m: 0 }} select label="Share Type" value={shareType} onChange={(e) => setShareType(e.target.value)} fullWidth margin="normal">
											<MenuItem value="equity">Equity</MenuItem>
											<MenuItem value="fixed">Fixed</MenuItem>
											<MenuItem value="other">Other</MenuItem>
										</TextField>
									</Grid>

									<Grid md={6} item>
										{/* Notes */}
										<TextField sx={{ m: 0 }} label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} fullWidth multiline rows={2} margin="normal" />
									</Grid>

									<Grid md={6} item>
										{/* Date */}
										<LocalizationProvider dateAdapter={AdapterDayjs}>
											<DatePicker label="Date of Investment" sx={{ width: "100%" }} value={date} onChange={(newValue) => setDate(newValue)} renderInput={(params) => <TextField sx={{ m: 0 }} {...params} fullWidth margin="normal" />} />
										</LocalizationProvider>
									</Grid>

									<Grid md={6} item>
										{/* Invoice Upload */}
										<Form.Group className="mb-3">
											<Form.Label>Upload Invoice</Form.Label>
											<Form.Control type="file" accept="application/pdf,image/*" onChange={(e) => setInvoice(e.target.files[0])} />
										</Form.Group>
									</Grid>
								</Grid>
							</Box>
							<MuiButton type="submit" variant="contained" sx={{ bgcolor: colors.primary, "&:hover": { bgcolor: colors.primary } }} fullWidth>
								Add Investment
							</MuiButton>
						</form>
					</div>
				</div>
			</div>

			{/* Add Investor Modal (only used if you want manual create) */}
			<Modal show={showAddInvestorModal} onHide={() => setShowAddInvestorModal(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Add New Investor</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Box>
						<Form.Group className="mb-2">
							<Form.Label>Name</Form.Label>
							<Form.Control type="text" value={newInvestor.name} onChange={(e) => setNewInvestor({ ...newInvestor, name: e.target.value })} />
						</Form.Group>
						<Form.Group className="mb-2">
							<Form.Label>Email</Form.Label>
							<Form.Control type="email" value={newInvestor.email} onChange={(e) => setNewInvestor({ ...newInvestor, email: e.target.value })} />
						</Form.Group>
					</Box>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowAddInvestorModal(false)}>
						Cancel
					</Button>
					<MuiButton variant="contained" sx={{ bgcolor: colors.primary, "&:hover": { bgcolor: colors.primary } }} onClick={handleConfirmInvestor}>
						Select Investor
					</MuiButton>
				</Modal.Footer>
			</Modal>
			{/* Snackbar for success/failure message */}
			<Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
				<Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
					{snackbar.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default NewInvestorEntry;
