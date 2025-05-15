import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, InputLabel, FormControl, Snackbar, Alert, Modal, IconButton, Typography, Pagination } from "@mui/material";
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
	const [timeFilter, setTimeFilter] = useState("weekly");
	const [category, setCategory] = useState("");
	const [financeData, setFinanceData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(10);
	const [openModal, setOpenModal] = useState(false);

	const [modalData, setModalData] = useState(null); // Holds data to show in modal
	const [status, setStatus] = useState(""); // Track current status to show update or view
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

	const [open, setOpen] = React.useState(false);
	const [selectedItem, setSelectedItem] = useState(null);

	// add status modal by usama
	const [openDialog, setOpenDialog] = useState(false);
	const [dialogType, setDialogType] = useState(""); // 'view' or 'edit'
	const [dialogData, setDialogData] = useState(null);

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
				return { bg: "#e6f7ff", text: colors.primary };
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
			const res = await axiosInstance.get(`finance/category/${categoryid}`, {
				params: {
					page,
					limit,
				},
			});
			if (res.data.success) {
				setCategory(res.data.category);
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

	useEffect(() => {
		getFinances(currentPage);
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
			formData.append("description", dialogData.description);
			formData.append("quantity", dialogData.quantity);
			formData.append("amount", dialogData.amount);
			formData.append("status", dialogData.status);
			formData.append("receipt", dialogData.receipt || null);

			const res = await axiosInstance.put(`finances/${dialogData.id}?_method=PUT`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			console.log("Update response:", res.data);
			"Update response:", res.data;
		} catch (error) {
			console.log("Error updating finance:", error);

			setSnackbar({ open: true, message: error.response.data.message, severity: "error" });
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
							<h4 style={{ margin: 0 }}>{category?.name}</h4>
						</div>
					</div>
					<Box sx={{ p: 3 }}>
						<Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2, gap: 2 }}>
							<Button
								variant="contained"
								onClick={() => setTimeFilter("weekly")}
								sx={{
									px: 3,
									bgcolor: timeFilter === "weekly" ? colors.primary : "white",
									color: timeFilter === "weekly" ? "white" : "#64748b",
									"&:hover": {
										bgcolor: timeFilter === "weekly" ? colors.primary : "#f1f5f9",
									},
									textTransform: "none",
									fontWeight: 500,
									border: "1px solid #e2e8f0",
									borderRadius: "10px",
									boxShadow: timeFilter === "weekly" ? "0px 2px 4px rgba(0, 0, 0, 0.2)" : "none",
								}}>
								Weekly
							</Button>

							<Button
								variant="contained"
								onClick={() => setTimeFilter("daily")}
								sx={{
									px: 3,
									bgcolor: timeFilter === "daily" ? colors.primary : "white",
									color: timeFilter === "daily" ? "white" : "#64748b",
									"&:hover": {
										bgcolor: timeFilter === "daily" ? colors.primary : "#f1f5f9",
									},
									textTransform: "none",
									fontWeight: 500,
									border: "1px solid #e2e8f0",
									borderRadius: "10px",
									boxShadow: timeFilter === "daily" ? "0px 2px 4px rgba(0, 0, 0, 0.2)" : "none",
								}}>
								Daily
							</Button>
						</Box>
						<TableContainer component={Paper} sx={{ boxShadow: "none", borderRadius: 2, overflow: "hidden" }}>
							<Table sx={{ minWidth: 650 }}>
								<TableHead>
									<TableRow sx={{ bgcolor: "#dbeafe" }}>
										<TableCell sx={{ fontWeight: "bold", color: "#1e293b", py: 2 }}>SL No</TableCell>
										<TableCell sx={{ fontWeight: "bold", color: "#1e293b", py: 2 }}>Name</TableCell>
										<TableCell sx={{ fontWeight: "bold", color: "#1e293b", py: 2 }}>Description</TableCell>
										<TableCell sx={{ fontWeight: "bold", color: "#1e293b", py: 2 }}>Qty</TableCell>
										<TableCell sx={{ fontWeight: "bold", color: "#1e293b", py: 2 }}>Amount</TableCell>
										<TableCell sx={{ fontWeight: "bold", color: "#1e293b", py: 2 }}>Issue Date</TableCell>
										<TableCell sx={{ fontWeight: "bold", color: "#1e293b", py: 2 }}>Due Date</TableCell>
										<TableCell sx={{ fontWeight: "bold", color: "#1e293b", py: 2 }}>Status</TableCell>
										<TableCell sx={{ fontWeight: "bold", color: "#1e293b", py: 2 }}>Actions</TableCell>
										<TableCell sx={{ fontWeight: "bold", color: "#1e293b", py: 2 }}>Receipt</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{isLoading ? (
										<TableRow>
											<TableCell colSpan={10} align="center">
												<CircularProgress sx={{ color: "#0F172A" }} />
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
			<Box mt={2} display="flex" justifyContent="center">
				<Pagination count={totalPages} page={currentPage} onChange={(e, value) => setCurrentPage(value)} color="primary" />
			</Box>

			<Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
				<Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
					{snackbar.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default FinanceReport;
