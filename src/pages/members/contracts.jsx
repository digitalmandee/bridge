import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Pagination, Box, ThemeProvider, createTheme, CircularProgress } from "@mui/material";
import { ArrowBack, Download } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import AddContract from "@/components/members/AddContract";
import axiosInstance from "@/utils/axiosInstance";

const MemberContract = () => {
	const [contracts, setContracts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(10);

	const getContracts = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get("member/contracts", {
				params: { page, limit },
			});

			if (res.data.success) {
				setContracts(res.data.contracts.data);
				setTotalPages(res.data.contracts.last_page);
				setCurrentPage(res.data.contracts.current_page);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getContracts(currentPage);
	}, [currentPage, limit]);

	return (
		<>
			<TopNavbar />
			<div className="main">
				<div className="sidebarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<ThemeProvider theme={theme}>
						<Container maxWidth="lg">
							{/* Header */}
							<Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
								<IconButton sx={{ mr: 2, color: "primary.main" }}>
									<ArrowBack />
								</IconButton>
								<Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600, color: "primary.main" }}>
									Contracts
								</Typography>
								<Box sx={{ display: "flex", gap: 1 }}>
									{/* Add Contract */}
									<AddContract />
									{/* Download Contracts */}
									<Button
										variant="outlined"
										color="primary"
										startIcon={<Download />}
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											padding: "10px 0px 10px 10px",
										}}
									/>
								</Box>
							</Box>

							<Paper sx={{ mt: 3, boxShadow: 3 }}>
								{/* Contracts Table */}
								<TableContainer component={Paper} sx={{ boxShadow: "none" }}>
									{isLoading ? (
										<Box display="flex" justifyContent="center" alignItems="center" p={3}>
											<CircularProgress sx={{ color: "#0F172A" }} />
										</Box>
									) : (
										<Table>
											<TableHead>
												<TableRow>
													<TableCell>Number</TableCell>
													<TableCell>Documents</TableCell>
													<TableCell>Stage</TableCell>
													<TableCell>Company</TableCell>
													<TableCell>Period</TableCell>
													<TableCell>Value</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{contracts.length > 0 ? (
													contracts.map((contract) => (
														<TableRow key={contract.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
															<TableCell>{contract.id}</TableCell>
															<TableCell>
																<Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
																	<Typography variant="body2" sx={{ fontWeight: 500 }}>
																		Agreement
																	</Typography>
																	<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
																		<Typography variant="caption" sx={{ color: "text.secondary" }}>
																			{contract.user.name}
																		</Typography>
																		<Typography variant="caption" sx={{ color: "text.secondary" }}>
																			{contract.start_date}
																		</Typography>
																	</Box>
																</Box>
															</TableCell>
															<TableCell>
																<Box sx={{ display: "flex", gap: 1 }}>
																	<Chip
																		label={contract.status}
																		size="small"
																		sx={{
																			textTransform: "capitalize",
																			bgcolor: contract.status === "signed" ? "#E8E8E8" : "#1a3353",
																			color: contract.status === "signed" ? "#666" : "white",
																		}}
																	/>
																	{contract.agreement.isNew && <Chip label="New" size="small" sx={{ bgcolor: "#E3F5FF", color: "#2196F3" }} />}
																</Box>
															</TableCell>
															<TableCell>
																<Typography variant="body2">{contract.user.name}</Typography>
																<Typography variant="caption" sx={{ color: "text.secondary" }}>
																	{contract.branch.name}
																</Typography>
															</TableCell>
															<TableCell>
																<Typography variant="body2">{contract.duration}</Typography>
																<Typography variant="caption" sx={{ color: "text.secondary" }}>
																	{contract.notice_period} {contract.duration} period
																</Typography>
															</TableCell>
															<TableCell>Rs. {contract.amount}</TableCell>
														</TableRow>
													))
												) : (
													<TableRow>
														<TableCell colSpan={7} align="center">
															No companies found.
														</TableCell>
													</TableRow>
												)}
											</TableBody>
										</Table>
									)}
								</TableContainer>

								{/* Pagination */}
								<Box sx={{ display: "flex", justifyContent: "end", mt: 3, paddingBottom: "10px" }}>
									<Pagination count={10} />
								</Box>
							</Paper>
						</Container>
					</ThemeProvider>
				</div>
			</div>
		</>
	);
};

export default MemberContract;

const theme = createTheme({
	palette: {
		primary: {
			main: "#1a3353",
		},
		secondary: {
			main: "#f5f7fb",
		},
	},
	components: {
		MuiChip: {
			styleOverrides: {
				root: {
					borderRadius: 4,
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				head: {
					fontWeight: 600,
					color: "#1a3353",
				},
			},
		},
	},
});

const contractData = [
	{
		id: 1,
		agreement: {
			name: "Agreement",
			date: "October 10,2025",
			status: "Not signed",
			isNew: true,
			user: "Nameofuser",
		},
		company: "Digit",
		location: "Lahore",
		period: "10/10/2025 - 10/10/2026",
		duration: "3 months period",
		value: "$1000.00",
	},
	{
		id: 2,
		agreement: {
			name: "Agreement",
			date: "October 10,2025",
			status: ["Not signed", "Signed"],
			isNew: true,
			user: "Nameofuser",
		},
		company: "Digit",
		location: "Lahore",
		period: "10/10/2025 - 10/10/2026",
		duration: "3 months period",
		value: "$1000.00",
	},
];
