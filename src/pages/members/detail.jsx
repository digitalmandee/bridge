import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Select, MenuItem, styled, CircularProgress, Chip, Pagination } from "@mui/material";
import { Download as DownloadIcon, FilterAlt as FilterIcon, Notifications as NotificationsIcon } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "../../utils/axiosInstance";

const MemberCompanyDetail = () => {
	const navigate = useNavigate();

	const [month, setMonth] = useState("Month");

	const { companyId } = useParams(); // Get invoice ID from URL
	const [company, setCompany] = useState({});
	const [companyUsers, setCompanyUsers] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(10);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		const details = async () => {
			try {
				const res = await axiosInstance.get(`member/company-detail/${companyId}`);
				if (res.data.success) {
					setCompany(res.data.company);
					setCompanyUsers(res.data.company_users.data);
					setCurrentPage(res.data.company_users.current_page);
					setTotalPages(res.data.company_users.last_page);
				}
			} catch (error) {
				console.error("Error fetching company details:", error);
			} finally {
				setIsLoading(false);
			}
		};
		details();
	}, [companyId, currentPage, limit]);

	return (
		<>
			<TopNavbar />
			<div className="main d-flex">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div className="container-fluid p-4">
						{/* Header */}
						<div className="row mb-4 align-items-center">
							<div className="col">
								<Box display="flex" alignItems="center" gap={2}>
									<div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
										<MdArrowBackIos style={{ fontSize: "20px" }} />
									</div>
									<Typography variant="h5">Detail</Typography>
								</Box>
							</div>
							<div className="col-auto">
								<Box display="flex" gap={2}>
									<Button variant="outlined" startIcon={<DownloadIcon />} sx={{ borderColor: "#e0e0e0", color: "text.secondary" }}>
										CSV
									</Button>
									<Button variant="outlined" startIcon={<FilterIcon />} sx={{ borderColor: "#e0e0e0", color: "text.secondary" }}>
										Filter
									</Button>
									<Select value={month} onChange={(e) => setMonth(e.target.value)} size="small" sx={{ minWidth: 120 }}>
										<MenuItem value="Month">Month</MenuItem>
										<MenuItem value="January">January</MenuItem>
										<MenuItem value="February">February</MenuItem>
									</Select>
								</Box>
							</div>
						</div>

						{/* company Profile */}
						<Paper sx={{ p: 3, mb: 4 }}>
							<Box display="flex" gap={3} alignItems="center">
								<Avatar src={import.meta.env.VITE_ASSET_API + company.profile_image} sx={{ width: 80, height: 80 }} />
								<Box display="flex" flexDirection="column" gap={2}>
									<Box display="flex" gap={2}>
										<Typography color="text.secondary" variant="body2">
											Name:
										</Typography>
										<Typography variant="body1">{company.name}</Typography>
									</Box>

									<Box display="flex" gap={2}>
										<Typography color="text.secondary" variant="body2">
											Type:
										</Typography>
										<Typography variant="body1" sx={{ textTransform: "capitalize" }}>
											{company.type}
										</Typography>
									</Box>

									<Box display="flex" gap={2}>
										<Typography color="text.secondary" variant="body2">
											Phone:
										</Typography>
										<Typography variant="body1">{company.phone_no ?? "N/A"}</Typography>
									</Box>

									<Box display="flex" gap={2}>
										<Typography color="text.secondary" variant="body2">
											Email:
										</Typography>
										<Typography variant="body1">{company.email}</Typography>
									</Box>
								</Box>
							</Box>
						</Paper>

						{/* Table */}
						<TableContainer component={Paper} sx={{ boxShadow: "none" }}>
							{isLoading ? (
								<Box display="flex" justifyContent="center" alignItems="center" p={3}>
									<CircularProgress sx={{ color: "#0F172A" }} />
								</Box>
							) : (
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>Company</TableCell>
											<TableCell>Last login</TableCell>
											<TableCell>Status</TableCell>
											{/* <TableCell>Profile</TableCell> */}
											<TableCell>Terms & Condition</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{companyUsers && companyUsers.length > 0 ? (
											companyUsers.map((user) => (
												<TableRow key={user.id}>
													<TableCell>
														<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
															<Avatar src={user.profile_image ? import.meta.env.VITE_ASSET_API + user.profile_image : ""} />
															<Box>
																<Typography>
																	{user.name} <span style={{ color: "#6C757D", fontSize: "0.875rem" }}>at {company.name}</span>
																</Typography>
																<Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
																	<span style={{ fontSize: "10px" }}>●</span> {company.user_branch.name}
																</Typography>
															</Box>
														</Box>
													</TableCell>
													<TableCell>
														<Typography variant="body2">{user.last_login_human}</Typography>
													</TableCell>
													<TableCell>
														<Chip
															label={user.status}
															size="small"
															sx={{
																backgroundColor: "#002B5B",
																color: "#fff",
																borderRadius: "4px",
																height: "24px",
																fontSize: "0.75rem",
																textTransform: "capitalize",
															}}
														/>
													</TableCell>
													<TableCell>
														<Typography variant="body2">{user.terms}</Typography>
													</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell colSpan={7} align="center">
													No user found.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							)}
						</TableContainer>

						{/* Pagination */}
						<Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
							<Pagination count={totalPages} page={currentPage} onChange={(event, page) => setCurrentPage(page)} />
						</Box>
					</div>
				</div>
			</div>
		</>
	);
};

export default MemberCompanyDetail;
