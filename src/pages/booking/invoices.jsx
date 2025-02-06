import React, { useContext, useEffect, useState } from "react";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Menu, MenuItem, IconButton, Modal, Box, TextField, Button, Select, Snackbar, Alert, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TopNavbar from "../../components/topNavbar";
import Sidebar from "../../components/leftSideBar";
import Loader from "../../components/Loader";
import axios from "axios";
import colors from "../../assets/styles/color";
import { AuthContext } from "../../contexts/AuthContext";
import axiosInstance from "../../utils/axiosInstance";

const Invoices = () => {
	const { user } = useContext(AuthContext);

	const [invoices, setInvoices] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [openEditModal, setOpenEditModal] = useState(false);
	const [selectedInvoice, setSelectedInvoice] = useState(null);
	const [newPrice, setNewPrice] = useState("");
	const [newStatus, setNewStatus] = useState("");
	const [receiptImage, setReceiptImage] = useState(null);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState("success");

	const [dueDate, setDueDate] = useState("");
	const [paidDate, setPaidDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [endTime, setEndTime] = useState("");

	const handleMenuOpen = (event, invoice) => {
		setAnchorEl(event.currentTarget);
		setSelectedInvoice(invoice);
	};

	const handleMenuClose = () => setAnchorEl(null);

	const handleEditClick = () => {
		setOpenEditModal(true);
		console.log(selectedInvoice);

		setNewPrice(selectedInvoice.amount);
		setNewStatus(selectedInvoice.status);
		setDueDate(selectedInvoice.due_date || "");
		setPaidDate(selectedInvoice.paid_date || "");
		setReceiptImage(selectedInvoice.receipt || null);
	};

	const handleCloseEditModal = () => setOpenEditModal(false);

	const handleUpdateInvoice = async () => {
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_BASE_API}invoices/update`,
				{
					invoice_id: selectedInvoice.id,
					amount: newPrice,
					status: newStatus,
					paid_date: paidDate,
				},
				{ headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}`, "Content-Type": "application/json" } }
			);

			if (response.data.success) {
				setInvoices((prev) =>
					prev.map((invoice) =>
						invoice.id === selectedInvoice.id
							? {
									...invoice,
									amount: newPrice,
									status: newStatus,
									paid_date: paidDate,
							  }
							: invoice
					)
				);
				setOpenEditModal(false);
				setSnackbarMessage("Booking updated successfully!");
				setSnackbarSeverity("success");
			} else {
				setSnackbarMessage("Failed to update booking.");
				setSnackbarSeverity("error");
			}
		} catch (error) {
			console.error("Error updating booking:", error);
			setSnackbarMessage("An error occurred. Please try again.");
			setSnackbarSeverity("error");
		} finally {
			setSnackbarOpen(true);
		}
	};

	const handleSnackbarClose = () => setSnackbarOpen(false);

	useEffect(() => {
		const fetchInvoices = async () => {
			setIsLoading(true);
			try {
				const response = await axiosInstance.get(`${import.meta.env.VITE_BASE_API}invoices`);

				if (response.data && Array.isArray(response.data.invoices)) {
					setInvoices(response.data.invoices);
				}
			} catch (error) {
				console.error("Error fetching bookings:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchInvoices();
	}, []);

	return (
		<>
			<TopNavbar />
			<div className="main">
				<div className="sidebarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<Box className="page-content" p={2}>
						<Box className="d-flex justify-content-between align-items-center flex-wrap" mb={3}>
							<Typography variant="h5">Booking Invoices</Typography>
						</Box>

						{/* Filter and Search */}
						<Box
							className="mt-2 ms-2 me-2 d-flex justify-content-between align-items-center"
							p={2}
							sx={{
								display: "flex",
								gap: "16px",
							}}>
							{/* Filter and Search Box */}
							<Box
								className="filter-search-container"
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "flex-end",
									gap: "16px",
									flex: 1,
								}}>
								{/* Filter Button */}
								<Button
									variant="outlined"
									startIcon={<FilterAltOutlinedIcon />}
									sx={{
										borderRadius: "20px",
										color: "#000",
										borderColor: "#dcdcdc",
										backgroundColor: "#fff",
										"&:hover": {
											backgroundColor: "#f1f1f1",
										},
									}}>
									Filter
								</Button>

								{/* Search Box */}
								<Box
									className="search-form"
									sx={{
										display: "flex",
										alignItems: "center",
										backgroundColor: "#fff",
										border: "1px solid #dcdcdc",
										borderRadius: "20px",
										padding: "4px 10px",
										flexGrow: 1,
										maxWidth: "400px",
									}}>
									<SearchOutlinedIcon style={{ marginRight: "8px", color: "#000" }} />
									<TextField
										placeholder="Search by room number"
										size="small"
										variant="standard"
										InputProps={{ disableUnderline: true }}
										sx={{
											flex: 1,
											"& input::placeholder": {
												color: "#6c757d",
											},
										}}
									/>
								</Box>
							</Box>
						</Box>
						<div className="row card col-md-12">
							<table className="table table-responsive">
								<thead>
									<tr>
										<th>Invoice ID</th>
										<th>Type</th>
										<th>Name</th>
										<th>Issue Date</th>
										<th>Payment Date</th>
										<th>Amount</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									{isLoading ? (
										<tr>
											<td colSpan="9">
												<Loader variant="C" />
											</td>
										</tr>
									) : invoices.length > 0 ? (
										invoices.map((invoice) => (
											<tr key={invoice.id}>
												<td>#{invoice.id}</td>
												<td>#{invoice.booking_id}</td>
												<td>{invoice.user.name}</td>
												<td>{invoice.due_date}</td>
												<td>{invoice.paid_date || "N/A"}</td>
												<td>Rs. {invoice.amount}</td>
												<td>
													<div className="d-flex align-items-center">
														<span className={`status ${invoice.status}`}>{invoice.status}</span>
														{user.type === "admin" && (
															<>
																<IconButton onClick={(e) => handleMenuOpen(e, invoice)}>
																	<MoreVertIcon />
																</IconButton>
																<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
																	<MenuItem onClick={handleEditClick}>Edit</MenuItem>
																</Menu>
															</>
														)}
													</div>
												</td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan="9" className="text-center">
												No booking Invoices available
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</Box>
				</div>
			</div>

			{/* Edit Booking Modal */}
			<Modal open={openEditModal} onClose={handleCloseEditModal}>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						backgroundColor: "white",
						padding: 4,
						borderRadius: 2,
						width: 700,
					}}>
					<h3 style={{ marginBottom: 20 }}>Edit Invoice</h3>
					<TextField label="Price" fullWidth value={newPrice} onChange={(e) => setNewPrice(e.target.value)} style={{ marginBottom: 20 }} />
					<Select fullWidth value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
						<MenuItem value="pending">Pending</MenuItem>
						<MenuItem value="paid">Paid</MenuItem>
						<MenuItem value="overdue">Over Due</MenuItem>
					</Select>
					<TextField label="Due Date" type="date" value={dueDate} InputLabelProps={{ shrink: true }} style={{ marginBottom: 20, marginTop: 20 }} fullWidth />
					<TextField label="Paid Date" type="date" value={paidDate} onChange={(e) => setPaidDate(e.target.value)} InputLabelProps={{ shrink: true }} style={{ marginBottom: 10, width: "48%" }} />
					<div style={{ textTransform: "capitalize", marginBottom: 10 }}>
						<b>Payment Method:</b> {selectedInvoice?.payment_method}
					</div>
					{receiptImage && (
						<div style={{ marginBottom: 20 }}>
							<img src={VITE_ASSET_API + receiptImage} alt="Receipt" style={{ width: 100, height: 100, objectFit: "contain" }} />
						</div>
					)}

					<Button variant="contained" color="primary" onClick={handleUpdateInvoice}>
						Update Invoice
					</Button>
				</Box>
			</Modal>
			<Snackbar open={snackbarOpen} autoHideDuration={1500} onClose={handleSnackbarClose}>
				<Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</>
	);
};

export default Invoices;
