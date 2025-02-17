import React, { useContext, useEffect, useState } from "react";
import { Container, Paper, Typography, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Pagination, Box, CircularProgress } from "@mui/material";
import { ArrowBack, Download } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import AddContract from "@/components/members/AddContract";
import ViewContract from "@/components/members/ViewContract";
import axiosInstance from "@/utils/axiosInstance";
import "./contract.css";
import { AuthContext } from "@/contexts/AuthContext";
import EditContract from "@/components/members/EditContract";

const MemberContract = () => {
	const { user } = useContext(AuthContext);

	const [contracts, setContracts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(10);
	const [selectedContract, setSelectedContract] = useState(null);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [viewModalOpen, setViewModalOpen] = useState(false);

	const getContracts = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get("member/contracts", { params: { page, limit } });
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

	const handleEditContract = (contract) => {
		setSelectedContract(contract);
		setEditModalOpen(true);
	};
	const handleViewContract = (contract) => {
		setSelectedContract(contract);
		setViewModalOpen(true);
	};

	const handleCloseEditModal = () => {
		setEditModalOpen(false);
		getContracts(currentPage); // Refresh table after editing
	};

	const handleCloseViewModal = () => {
		setViewModalOpen(false);
		getContracts(currentPage); // Refresh table after editing
	};

	return (
		<>
			<TopNavbar />
			<div className="main">
				<div className="sidebarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<Container maxWidth="lg">
						{/* Header */}
						<Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
							<IconButton sx={{ mr: 2, color: "primary.main" }}>
								<ArrowBack />
							</IconButton>
							<Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
								Contracts
							</Typography>
							<Box sx={{ display: "flex", gap: 1 }}>
								{/* Add Contract */}
								{user.type === "admin" && <AddContract />}
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
										{isLoading ? (
											<TableRow>
												<TableCell colSpan={6} align="center">
													<CircularProgress sx={{ color: "#0F172A" }} />
												</TableCell>
											</TableRow>
										) : contracts.length > 0 ? (
											contracts.map((contract) => (
												<TableRow key={contract.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
													<TableCell>#{contract.id}</TableCell>
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
																	bgcolor: contract.status === "Signed" ? "#E8E8E8" : "#1a3353",
																	color: contract.status === "Signed" ? "#666" : "white",
																}}
															/>
															{contract.status === "not signed" && user.type === "admin" && (
																<>
																	<Chip label="New" size="small" sx={{ bgcolor: "#E3F5FF", color: "#2196F3" }} />
																	<Button variant="contained" size="small" color="primary" onClick={() => handleEditContract(contract)}>
																		Edit
																	</Button>
																</>
															)}
															<Button variant="contained" size="small" color="primary" onClick={() => handleViewContract(contract)}>
																View
															</Button>
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
												<TableCell colSpan={6} align="center">
													No contracts found.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</TableContainer>

							{/* Pagination */}
							<Box sx={{ display: "flex", justifyContent: "end", mt: 3, paddingBottom: "10px" }}>
								<Pagination count={totalPages} page={currentPage} onChange={(e, page) => setCurrentPage(page)} />
							</Box>
						</Paper>
					</Container>
				</div>
			</div>

			{/* Edit Contract Modal */}
			{viewModalOpen && <ViewContract contract={selectedContract} open={viewModalOpen} onClose={handleCloseViewModal} />}
			{selectedContract && <EditContract contract={selectedContract} open={editModalOpen} onClose={handleCloseEditModal} />}
		</>
	);
};

export default MemberContract;
