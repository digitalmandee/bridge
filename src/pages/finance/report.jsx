import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, InputLabel, FormControl, Snackbar, Alert, Modal, IconButton, Typography, Pagination, Autocomplete } from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import CloseIcon from "@mui/icons-material/Close";
import { Grid } from "@mui/system";
import colors from "@/assets/styles/color";

const FinanceReport = () => {
	const navigate = useNavigate();
	const { categoryid } = useParams();

	const [previewUrl, setPreviewUrl] = useState(null);

	// Core Data State
	const [category, setCategory] = useState("");
	const [financeData, setFinanceData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(10);
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

	// Filter State
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [filterCategory, setFilterCategory] = useState("");
	const [categories, setCategories] = useState([]);

	const [open, setOpen] = React.useState(false);
	const [selectedItem, setSelectedItem] = useState(null);

	// add status modal by usama
	const [openDialog, setOpenDialog] = useState(false);
	const [dialogType, setDialogType] = useState(""); // 'view' or 'edit'
	const [dialogData, setDialogData] = useState(null);

	// Fetch Categories for Filter
	useEffect(() => {
		if (!categoryid) {
			axiosInstance.get("finance/categories?limit=100").then((res) => {
				if (res.data.success) {
					setCategories(res.data.categories.data);
				}
			});
		}
	}, [categoryid]);

	const handleFileChange1 = (e) => {
		const file = e.target.files[0];
		setDialogData((prevData) => ({
			...prevData,
			receipt: file,
		}));
		if (file && file.type.startsWith("image/")) {
			const imageUrl = URL.createObjectURL(file);
			setPreviewUrl(imageUrl);
		}
	};

	// add modal by usama
	// add functions by usama
	const handleOpenDialog = (data, type) => {
		setDialogData(data);
		setDialogType(type); // 'view' or 'edit'
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
		setDialogType("");
		setDialogData(null);
	};

	// add functions by usama

	const getStatusColor = (status) => {
		switch (status) {
			case "paid":
				return { bg: "#e6f7ff", text: "#0c4a6e" };
			case "unpaid":
				return { bg: "#fff7e6", text: "#d97706" };
			case "received":
				return { bg: "#f0fdf4", text: "#166534" };
			default:
				return { bg: "#f3f4f6", text: "#6b7280" };
		}
	};

	const getFinances = async (page) => {
		setIsLoading(true);
		try {
			let url = `finances`; // Default All Mode
			const params = {
				page,
				limit,
				from_date: fromDate,
				to_date: toDate,
				search: searchQuery,
				category_id: filterCategory,
			};

			if (categoryid) {
				url = `finance/category/${categoryid}`;
				// finance/category endpoint might NOT support filters if using getFinanceByCategory logic
				// But we pas them just in case or for consistency.
				// NOTE: Currently backend getFinanceByCategory uses: Finance::where('category_id', $categoryId)
				// It does NOT look at from/to/search.
				// However, if we want full consistency, we should update backend there too.
				// But primarily these filters are for the Management view.
			}

			const res = await axiosInstance.get(url, { params });

			if (res.data.success) {
				setCategory(res.data.category || null); // null if All Mode
				setFinanceData(res.data.finances.data);
				setTotalPages(res.data.finances.last_page);
				setCurrentPage(res.data.finances.current_page);
			}
		} catch (error) {
			console.error("Error fetching finance data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleResetFilters = () => {
		setFromDate("");
		setToDate("");
		setSearchQuery("");
		setFilterCategory("");
		// getFinances will be triggered by useEffect dependency on state changes?
		// Wait, useEffect depends on [categoryid, currentPage, limit].
		// I need to add filter dependencies or manually call getFinances.
		// Let's rely on manual search click for Fetch, avoiding too many auto-fetches.
		// But "Reset" should probably trigger fetch.
		// Actually, I'll add `fromDate` etc to dependency array?
		// User might want to type dates without spamming requests.
		// BUT the previous useEffect had [limit].
		// Let's trigger fetch explicitly in Reset.
		setTimeout(() => getFinances(1), 0);
	};

	useEffect(() => {
		getFinances(currentPage);
		// Note: removed [toDate, etc] to avoid auto-fetch on every keystroke.
		// Search button handles fetch. Pagination handles fetch.
	}, [categoryid, currentPage, limit]);

	// Handle form field changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setDialogData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSaveUpdate = async () => {
		// update logic for "unpaid" status
		try {
			const formData = new FormData();

			formData.append("name", dialogData.name);
			formData.append("description", dialogData.description || ""); // Handle null description
			formData.append("quantity", dialogData.quantity);
			formData.append("amount", dialogData.amount);
			formData.append("status", dialogData.status);

			// Only append receipt if it's a File object (new upload)
			// If it's a string (existing URL), don't send it, backend keeps existing.
			// If status is unpaid, backend handles clearing it.
			if (dialogData.receipt instanceof File) {
				formData.append("receipt", dialogData.receipt);
			}

			// Note: We used `_method=PUT` in query string, which is Laravel way to handle PUT with FormData
			const res = await axiosInstance.post(`finances/${dialogData.id}?_method=PUT`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			console.log("Update response:", res.data);

			// Refresh data and close dialog
			getFinances(currentPage);
			handleCloseDialog();
			setSnackbar({ open: true, message: "Finance updated successfully", severity: "success" });
		} catch (error) {
			console.log("Error updating finance:", error);
			setSnackbar({ open: true, message: error.response?.data?.message || "Update failed", severity: "error" });
		}
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};
	const handleDownload = async () => {
		const fileName = selectedItem.receipt;

		try {
			const { data } = await axiosInstance.post("download", { fileName }, { responseType: "blob" });

			const blob = new Blob([data]);
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = fileName;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url); // Clean up blob URL
		} catch (error) {
			console.error("Download failed:", error);
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
							<h4 style={{ margin: 0 }}>{category?.name || "Finance Management"}</h4>
						</div>
					</div>
					<Box sx={{ p: 3 }}>
						{/* Filter Bar */}
						<Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3, alignItems: "center", bgcolor: "white", p: 2, borderRadius: 2 }}>
							<TextField label="From Date" type="date" size="small" value={fromDate} onChange={(e) => setFromDate(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ width: 150 }} />
							<TextField label="To Date" type="date" size="small" value={toDate} onChange={(e) => setToDate(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ width: 150 }} />
							{/* Show Category Filter only in Management Mode (no categoryid in URL) */}
							{!categoryid && (
								<Autocomplete
									sx={{ width: 250 }}
									size="small"
									options={categories}
									getOptionLabel={(option) => option.name || ""}
									value={categories.find((c) => c.id === filterCategory) || null}
									onChange={(event, newValue) => {
										setFilterCategory(newValue ? newValue.id : "");
									}}
									renderInput={(params) => <TextField {...params} label="Category" />}
								/>
							)}
							<TextField label="Search" size="small" placeholder="Name or Description" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} sx={{ width: 200 }} />
							<Button variant="contained" onClick={() => getFinances(1)} sx={{ bgcolor: "#0c4a6e" }}>
								Search
							</Button>
							<Button variant="outlined" onClick={handleResetFilters}>
								Reset
							</Button>
						</Box>
						<TableContainer component={Paper} sx={{ boxShadow: "none", borderRadius: 2, overflow: "hidden" }}>
							<Table sx={{ minWidth: 650 }}>
								<TableHead sx={{ bgcolor: "#F8FAFC" }}>
									<TableRow>
										<TableCell sx={{ fontWeight: "bold", color: "#64748B", py: 2 }}>SL No</TableCell>
										<TableCell sx={{ fontWeight: "bold", color: "#64748B", py: 2 }}>Name</TableCell>
										<TableCell sx={{ fontWeight: "bold", color: "#64748B", py: 2 }}>Description</TableCell>
										<TableCell sx={{ fontWeight: "bold", color: "#64748B", py: 2 }}>Qty</TableCell>
										<TableCell sx={{ fontWeight: "bold", color: "#64748B", py: 2 }}>Amount</TableCell>
										<TableCell sx={{ fontWeight: "bold", color: "#64748B", py: 2 }}>Issue Date</TableCell>
										<TableCell sx={{ fontWeight: "bold", color: "#64748B", py: 2 }}>Due Date</TableCell>
										<TableCell sx={{ fontWeight: "bold", color: "#64748B", py: 2 }}>Status</TableCell>
										<TableCell sx={{ fontWeight: "bold", color: "#64748B", py: 2 }}>Actions</TableCell>
										<TableCell sx={{ fontWeight: "bold", color: "#64748B", py: 2 }}>Receipt</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{isLoading ? (
										<TableRow>
											<TableCell colSpan={10} align="center">
												<CircularProgress sx={{ color: "#FFCC16" }} />
											</TableCell>
										</TableRow>
									) : financeData.length > 0 ? (
										financeData.map((row, index) => {
											const { bg, text } = getStatusColor(row.status);
											return (
												<TableRow key={row.id}>
													<TableCell>{index + 1}</TableCell>
													<TableCell>{row.name}</TableCell>
													<TableCell>{row.description}</TableCell>
													<TableCell>{row.quantity}</TableCell>
													<TableCell>Rs. {row.amount}</TableCell>
													<TableCell>{row.issue_date}</TableCell>
													<TableCell>{row.due_date}</TableCell>
													<TableCell>
														<Chip
															label={row.status}
															sx={{
																bgcolor: bg,
																color: text,
																fontWeight: 500,
																px: 1.5,
																py: 0.5,
																textTransform: "capitalize",
															}}
														/>
													</TableCell>
													<TableCell>
														{row.status === "paid" ? (
															<Button variant="outlined" size="small" sx={{ textTransform: "none" }} onClick={() => handleOpenDialog(row, "view")}>
																View
															</Button>
														) : (
															<Button variant="outlined" size="small" sx={{ textTransform: "none" }} onClick={() => handleOpenDialog(row, "edit")}>
																Edit
															</Button>
														)}
													</TableCell>
													<TableCell>
														{row.receipt ? (
															<Button
																variant="outlined"
																size="small"
																onClick={() => {
																	setSelectedItem(row);
																	setOpen(true);
																}}>
																View
															</Button>
														) : (
															"N/A"
														)}

														<Modal
															open={open}
															onClose={() => setOpen(false)}
															BackdropProps={{
																sx: {
																	backgroundColor: "transparent",
																},
															}}>
															<Box
																sx={{
																	position: "absolute",
																	top: "50%",
																	left: "50%",
																	transform: "translate(-50%, -50%)",
																	width: 500,
																	bgcolor: "background.paper",
																	borderRadius: 2,
																	boxShadow: 5,
																	p: 4,
																	maxHeight: "90vh",
																	overflowY: "auto",
																}}>
																<IconButton
																	onClick={() => setOpen(false)}
																	sx={{
																		position: "absolute",
																		top: 8,
																		right: 8,
																		color: "text.primary",
																	}}>
																	<CloseIcon />
																</IconButton>

																{selectedItem ? (
																	<>
																		{selectedItem.receipt && (
																			<Box mt={2}>
																				<Typography variant="body2" gutterBottom>
																					<strong>Receipt:</strong>
																				</Typography>
																				<img
																					src={`${import.meta.env.VITE_ASSET_API}${selectedItem.receipt}`}
																					alt="Receipt"
																					style={{
																						width: "100%",
																						borderRadius: "8px",
																						maxHeight: "300px",
																						objectFit: "contain",
																					}}
																				/>
																			</Box>
																		)}

																		<Box mt={3} display="flex" justifyContent="center">
																			<Button variant="outlined" color="primary" onClick={handleDownload}>
																				Download Receipt
																			</Button>
																		</Box>
																	</>
																) : (
																	<Typography>Loading...</Typography>
																)}
															</Box>
														</Modal>
													</TableCell>
												</TableRow>
											);
										})
									) : (
										<TableRow>
											<TableCell colSpan={10} align="center">
												No records found.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>
					</Box>

					<Box display="flex" fullWidth justifyContent="center" mt={3} gap={1} mb={3}>
						<Button variant="outlined" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
							Previous
						</Button>
						{[...Array(totalPages)].map((_, index) => (
							<Button key={index} variant={currentPage === index + 1 ? "contained" : "outlined"} sx={currentPage === index + 1 ? { bgcolor: colors.primary } : {}} onClick={() => setCurrentPage(index + 1)}>
								{index + 1}
							</Button>
						))}
						<Button variant="outlined" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>
							Next
						</Button>
						<Select value={limit} onChange={(e) => setLimit(e.target.value)} size="small" sx={{ minWidth: 80 }}>
							<MenuItem value={5}>5</MenuItem>
							<MenuItem value={10}>10</MenuItem>
							<MenuItem value={20}>20</MenuItem>
						</Select>
					</Box>
				</div>
			</div>

			{/* Modal for viewing or updating finance */}
			{/* <Dialog open={openModal} onClose={closeModal}> */}

			{/* VIEW DIALOG */}
			<Dialog open={openDialog && dialogType === "view"} onClose={handleCloseDialog}>
				<DialogTitle>View Finance</DialogTitle>
				<DialogContent>
					{dialogData && (
						<>
							<TextField fullWidth label="Name" value={dialogData.name} disabled sx={{ mb: 2 }} />
							<TextField fullWidth label="Description" value={dialogData.description} disabled sx={{ mb: 2 }} />
							<TextField fullWidth label="Quantity" value={dialogData.quantity} disabled sx={{ mb: 2 }} />
							<TextField fullWidth label="Amount" value={dialogData.amount} disabled sx={{ mb: 2 }} />
							<TextField fullWidth label="Status" value={dialogData.status} disabled sx={{ mb: 2 }} />
							{dialogData?.receipt && (
								<img
									src={`${import.meta.env.VITE_ASSET_API}${dialogData?.receipt}`}
									alt="Receipt"
									style={{
										width: "100%",
										borderRadius: "8px",
										maxHeight: "150px",
										objectFit: "contain",
									}}
								/>
							)}
						</>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog}>Close</Button>
				</DialogActions>
			</Dialog>

			{/* EDIT DIALOG */}
			<Dialog open={openDialog && dialogType === "edit"} onClose={handleCloseDialog}>
				<DialogTitle>Update Finance</DialogTitle>
				<DialogContent>
					{dialogData && (
						<>
							<TextField fullWidth label="Name" value={dialogData.name} onChange={handleChange} name="name" sx={{ mb: 2 }} />
							<TextField fullWidth label="Description" value={dialogData.description} onChange={handleChange} name="description" sx={{ mb: 2 }} />
							<TextField fullWidth label="Quantity" value={dialogData.quantity} onChange={handleChange} name="quantity" sx={{ mb: 2 }} />
							<TextField fullWidth label="Amount" value={dialogData.amount} onChange={handleChange} name="amount" sx={{ mb: 2 }} />
							<FormControl fullWidth sx={{ mb: 2 }}>
								<InputLabel id="status-label">Status</InputLabel>
								<Select label="Status" name="status" labelId="status-label" value={dialogData.status} onChange={handleChange}>
									<MenuItem value="paid">Paid</MenuItem>
									<MenuItem value="unpaid">Unpaid</MenuItem>
								</Select>
							</FormControl>

							{dialogData.status === "paid" && (
								<Grid>
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
										<div>
											<input id="file-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange1} />
											<label htmlFor="file-upload" style={{ cursor: "pointer" }}>
												{previewUrl ? (
													<img
														src={previewUrl}
														alt="Uploaded preview"
														style={{
															width: "50%",
															borderRadius: "8px",
															maxHeight: "150px",
															objectFit: "contain",
														}}
													/>
												) : (
													<label htmlFor="file-upload" style={{ cursor: "pointer" }}>
														Upload Receipt (Optional)
													</label>
												)}
											</label>
										</div>
									</div>
									{dialogData.file && (
										<Typography variant="body2" style={{ marginTop: "10px" }}>
											{dialogData.file.name}
										</Typography>
									)}
								</Grid>
							)}
						</>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog}>Close</Button>
					<Button onClick={handleSaveUpdate}>Save/Update</Button>
				</DialogActions>
			</Dialog>

			<Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
				<Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
					{snackbar.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default FinanceReport;
