import React, { useState, useEffect } from "react";
import { TextField, Autocomplete, MenuItem, InputAdornment, Button as MuiButton } from "@mui/material";
import { Modal, Button, Form } from "react-bootstrap";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axiosInstance from "@/utils/axiosInstance";
import { width } from "@mui/system";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
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
				const [typesRes, locationsRes] = await Promise.all([axiosInstance.get("investor/investment-types"), axiosInstance.get("investor/locations")]);
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
			alert("Please enter name and email");
			return;
		}

		// set this as selected investor (frontend only)
		setSelectedInvestor(newInvestor);

		// close modal
		setShowAddInvestorModal(false);
	};

	// 🔍 Search API
	const handleSearch = async (query) => {
		if (query.length < 2) return;
		try {
			const res = await axiosInstance.get(`investor/users/search?q=${query}`);
			setSearchResults(Array.isArray(res.data) ? res.data : []);
		} catch (err) {
			console.error(err);
			setSearchResults([]);
		}
	};

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
			alert("Error saving investment");
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
					<div className="container-fluid p-3 border rounded shadow-sm" style={{ maxWidth: 600 }}>
						<h4>New Investor Entry</h4>
						<form onSubmit={handleSubmit}>
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
								renderInput={(params) => <TextField {...params} label="Investor" required />}
								freeSolo
							/>

							{/* Investment Type */}
							<TextField select label="Investment Type" value={investmentType} onChange={(e) => setInvestmentType(e.target.value)} fullWidth margin="normal" required>
								{investmentTypes.map((type) => (
									<MenuItem key={type.id || type} value={type.id || type}>
										{type.name || type}
									</MenuItem>
								))}
							</TextField>

							{/* Location */}
							<TextField select label="Location" value={location} onChange={(e) => setLocation(e.target.value)} fullWidth margin="normal">
								<MenuItem value="">None</MenuItem>
								{locations.map((loc) => (
									<MenuItem key={loc.id || loc} value={loc.id || loc}>
										{loc.name || loc}
									</MenuItem>
								))}
							</TextField>

							{/* Amount */}
							<TextField
								label="Amount"
								type="number"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
								fullWidth
								margin="normal"
								required
								InputProps={{
									startAdornment: <InputAdornment position="start">PKR</InputAdornment>,
								}}
							/>

							{/* Profit % */}
							<TextField label="Profit %" type="number" value={profitPercent} onChange={(e) => setProfitPercent(e.target.value)} fullWidth margin="normal" />

							{/* Share % */}
							<TextField label="Share %" type="number" value={sharePercent} onChange={(e) => setSharePercent(e.target.value)} fullWidth margin="normal" />

							{/* Share Type */}
							<TextField select label="Share Type" value={shareType} onChange={(e) => setShareType(e.target.value)} fullWidth margin="normal">
								<MenuItem value="equity">Equity</MenuItem>
								<MenuItem value="fixed">Fixed</MenuItem>
								<MenuItem value="other">Other</MenuItem>
							</TextField>

							{/* Date */}
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DatePicker label="Date of Investment" sx={{ width: "100%" }} value={date} onChange={(newValue) => setDate(newValue)} renderInput={(params) => <TextField {...params} fullWidth margin="normal" />} />
							</LocalizationProvider>

							{/* Notes */}
							<TextField label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} fullWidth multiline rows={2} margin="normal" />

							{/* Invoice Upload */}
							<Form.Group className="mb-3">
								<Form.Label>Upload Invoice</Form.Label>
								<Form.Control type="file" accept="application/pdf,image/*" onChange={(e) => setInvoice(e.target.files[0])} />
							</Form.Group>

							<MuiButton type="submit" variant="contained" sx={{ bgcolor: colors.primary, "&:hover": { bgcolor: colors.primary } }} fullWidth>
								Add Investment
							</MuiButton>
						</form>

						{/* Add Investor Modal (only used if you want manual create) */}
						<Modal show={showAddInvestorModal} onHide={() => setShowAddInvestorModal(false)}>
							<Modal.Header closeButton>
								<Modal.Title>Add New Investor</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<Form.Group className="mb-2">
									<Form.Label>Name</Form.Label>
									<Form.Control type="text" value={newInvestor.name} onChange={(e) => setNewInvestor({ ...newInvestor, name: e.target.value })} />
								</Form.Group>
								<Form.Group className="mb-2">
									<Form.Label>Email</Form.Label>
									<Form.Control type="email" value={newInvestor.email} onChange={(e) => setNewInvestor({ ...newInvestor, email: e.target.value })} />
								</Form.Group>
							</Modal.Body>
							<Modal.Footer>
								<Button variant="secondary" onClick={() => setShowAddInvestorModal(false)}>
									Cancel
								</Button>
								<Button variant="contained" sx={{ bgcolor: colors.primary, "&:hover": { bgcolor: colors.primary } }} onClick={handleConfirmInvestor}>
									Select Investor
								</Button>
							</Modal.Footer>
						</Modal>
					</div>
				</div>
			</div>
		</>
	);
};

export default NewInvestorEntry;
