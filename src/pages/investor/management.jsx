import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Snackbar, Alert, Pagination } from "@mui/material";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import colors from "@/assets/styles/color";
import { MdArrowBackIos } from "react-icons/md";

const InvestorManagement = () => {
	const navigate = useNavigate();
	const [investments, setInvestments] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success",
	});

	useEffect(() => {
		fetchInvestments();
	}, []);

	const fetchInvestments = async () => {
		try {
			setIsLoading(true);
			const { data } = await axiosInstance.get("investor/investments");
			setInvestments(data);
		} catch (error) {
			setSnackbar({
				open: true,
				message: "Failed to fetch investments",
				severity: "error",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handlePageChange = (event, value) => {
		setCurrentPage(value);
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
				<div className="content p-3" style={{ flex: 1 }}>
					<div
						style={{
							paddingTop: "1rem",
							display: "flex",
							alignItems: "center",
							marginBottom: "20px",
						}}>
						<div
							onClick={() => navigate(-1)}
							style={{
								cursor: "pointer",
								marginTop: "5px",
								display: "flex",
								alignItems: "center",
							}}>
							<MdArrowBackIos style={{ fontSize: "20px" }} />
						</div>
						<h3 style={{ margin: 0 }}>Investments</h3>
					</div>

					{/* Table wrapper with scroll */}
					<div style={{ overflowX: "auto" }}>
						<div style={{ maxWidth: "1200px", overflowX: "auto" }}>
							<TableContainer component={Paper}>
								<Table stickyHeader>
									<TableHead>
										<TableRow style={{ backgroundColor: "#fff2c6" }}>
											<TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
											<TableCell sx={{ fontWeight: "bold" }}>Investor</TableCell>
											<TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
											<TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
											<TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
											<TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
											<TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
											<TableCell sx={{ fontWeight: "bold" }}>Profit %</TableCell>
											<TableCell sx={{ fontWeight: "bold" }}>Share %</TableCell>
											<TableCell sx={{ fontWeight: "bold" }}>Share Type</TableCell>
											<TableCell sx={{ fontWeight: "bold" }}>Notes</TableCell>
											<TableCell sx={{ fontWeight: "bold" }}>Invoice</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{isLoading ? (
											<TableRow>
												<TableCell colSpan={12} align="center">
													<CircularProgress sx={{ color: colors.primary }} />
												</TableCell>
											</TableRow>
										) : investments.length > 0 ? (
											investments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((investment, index) => (
												<TableRow key={investment.id}>
													<TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
													<TableCell>{investment.investor?.name || "N/A"}</TableCell>
													<TableCell>{investment.user?.email || "N/A"}</TableCell>
													<TableCell>{investment.investment_type_id}</TableCell>
													<TableCell>{investment.location}</TableCell>
													<TableCell>{investment.amount}</TableCell>
													<TableCell>{investment.date ? new Date(investment.date).toLocaleDateString() : "N/A"}</TableCell>
													<TableCell>{investment.profit_percent || "-"}</TableCell>
													<TableCell>{investment.share_percent || "-"}</TableCell>
													<TableCell>{investment.share_type || "-"}</TableCell>
													<TableCell>{investment.notes || "-"}</TableCell>
													<TableCell>
														{investment.invoice_path ? (
															<a href={`${import.meta.env.VITE_ASSET_API}${investment.invoice_path}`} target="_blank" rel="noopener noreferrer">
																View Invoice
															</a>
														) : (
															"-"
														)}
													</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell colSpan={12} align="center">
													No investments found.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</TableContainer>
						</div>
					</div>

					{/* Keep pagination outside scroll */}
					{investments.length > itemsPerPage && (
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								marginTop: "1rem",
							}}>
							<Pagination count={Math.ceil(investments.length / itemsPerPage)} page={currentPage} onChange={handlePageChange} color="primary" />
						</div>
					)}
				</div>
			</div>

			{/* Snackbar */}
			<Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
				<Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
					{snackbar.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default InvestorManagement;
