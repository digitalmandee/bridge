import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem, InputLabel, FormControl, Snackbar, Alert } from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";

const FinanceReport = () => {
	const navigate = useNavigate();
	const { categoryid } = useParams();

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

	const openDetailModal = (status, data) => {
		setStatus(status); // Set the current status (paid or unpaid)
		setModalData(data); // Pass data to the modal
		setOpenModal(true); // Open modal
	};

	const closeModal = () => {
		setOpenModal(false);
		setModalData(null);
		setStatus("");
	};

	const handleActionClick = (status, row) => {
		if (status === "unpaid") {
			openDetailModal("unpaid", row); // Open modal for update when unpaid
		} else {
			openDetailModal("paid", row); // Open modal for viewing when paid
		}
	};

	// Handle form field changes
	const handleChange = (e) => {
		const { name, value } = e.target;
		setModalData({ ...modalData, [name]: value });
		// setErrors({ ...errors, [name]: "" }); // Clear error on change
	};

	const handleSaveUpdate = async () => {
		// update logic for "unpaid" status
		try {
			const res = await axiosInstance.put(`finances/${modalData.id}`, modalData);
			if (res.data.success) {
				closeModal();
				setSnackbar({ open: true, message: res.data.message, severity: "success" });
				getFinances(currentPage);
			}
		} catch (error) {
			setSnackbar({ open: true, message: error.response.data.message, severity: "error" });
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
									bgcolor: timeFilter === "weekly" ? "#0c4a6e" : "white",
									color: timeFilter === "weekly" ? "white" : "#64748b",
									"&:hover": {
										bgcolor: timeFilter === "weekly" ? "#0c4a6e" : "#f1f5f9",
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
									bgcolor: timeFilter === "daily" ? "#0c4a6e" : "white",
									color: timeFilter === "daily" ? "white" : "#64748b",
									"&:hover": {
										bgcolor: timeFilter === "daily" ? "#0c4a6e" : "#f1f5f9",
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
									</TableRow>
								</TableHead>
								<TableBody>
									{isLoading ? (
										<TableRow>
											<TableCell colSpan={8} align="center">
												<CircularProgress sx={{ color: "#0F172A" }} />
											</TableCell>
										</TableRow>
									) : financeData.length > 0 ? (
										financeData.map((row, index) => (
											<TableRow key={row.id} sx={{ "&:nth-of-type(even)": { bgcolor: "#f8fafc" }, "&:last-child td, &:last-child th": { border: 0 } }}>
												<TableCell component="th" scope="row" sx={{ py: 2 }}>
													{row.id}
												</TableCell>
												<TableCell sx={{ py: 2 }}>{row.name}</TableCell>
												<TableCell sx={{ py: 2 }}>{row.description}</TableCell>
												<TableCell sx={{ py: 2 }}>{row.quantity}</TableCell>
												<TableCell sx={{ py: 2 }}>Rs. {row.amount}</TableCell>
												<TableCell sx={{ py: 2 }}>{row.issue_date}</TableCell>
												<TableCell sx={{ py: 2 }}>{row.due_date}</TableCell>
												<TableCell sx={{ py: 2 }}>
													<Chip label={row.status} size="small" sx={{ bgcolor: getStatusColor(row.status).bg, color: getStatusColor(row.status).text, fontWeight: 500, borderRadius: 1, px: 0.5 }} />
												</TableCell>
												<TableCell sx={{ py: 2 }}>
													<Button variant="contained" onClick={() => handleActionClick(row.status, row)} sx={{ bgcolor: row.status === "unpaid" ? "#d97706" : "#0c4a6e", color: "white", "&:hover": { bgcolor: row.status === "unpaid" ? "#b45309" : "#055b6e" } }}>
														{row.status === "unpaid" ? "Edit" : "View"}
													</Button>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={8} align="center">
												No finance found.
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
			<Dialog open={openModal} onClose={closeModal}>
				<DialogTitle>{status === "unpaid" ? "Update Finance" : "View Finance"}</DialogTitle>
				<DialogContent>
					{modalData && (
						<>
							<TextField className="mt-2" fullWidth label="Name" value={modalData.name} onChange={handleChange} name="name" disabled={status === "paid"} sx={{ mb: 2 }} />
							<TextField fullWidth label="Description" value={modalData.description} onChange={handleChange} name="description" disabled={status === "paid"} sx={{ mb: 2 }} />
							<TextField fullWidth label="Quantity" value={modalData.quantity} onChange={handleChange} name="quantity" disabled={status === "paid"} sx={{ mb: 2 }} />
							<TextField fullWidth label="Amount" value={modalData.amount} onChange={handleChange} name="amount" disabled={status === "paid"} sx={{ mb: 2 }} />
							<FormControl fullWidth>
								<InputLabel id="status">Status</InputLabel>
								<Select label="Status" name="status" labelId="status" value={modalData.status} onChange={handleChange} disabled={status === "paid"}>
									<MenuItem value="paid">Paid</MenuItem>
									<MenuItem value="unpaid">UnPaid</MenuItem>
								</Select>
							</FormControl>
						</>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={closeModal} color="primary">
						Close
					</Button>
					{status === "unpaid" && (
						<Button onClick={handleSaveUpdate} color="primary">
							Save/Update
						</Button>
					)}
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
