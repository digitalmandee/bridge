import React, { useEffect, useState } from "react";
import { TextField, Select, MenuItem, Typography, Avatar, Chip, Box, IconButton, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, createTheme, InputAdornment, CircularProgress } from "@mui/material";
import { ArrowBack, Search } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import axiosInstance from "@/utils/axiosInstance";
import dayjs from "dayjs";

const Company = () => {
	const [companies, setCompanies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(10);

	const getCompanies = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get("member/companies", {
				params: { page, limit },
			});

			if (res.data.success) {
				setCompanies(res.data.companies.data);
				setTotalPages(res.data.companies.last_page);
				setCurrentPage(res.data.companies.current_page);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getCompanies(currentPage);
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
						<div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
							{/* Header */}
							<Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
								<IconButton sx={{ mr: 1 }} size="small">
									<ArrowBack />
								</IconButton>
								<Typography variant="h6" component="h1">
									Companies
								</Typography>
							</Box>

							{/* Search and Filter */}
							<Box sx={{ display: "flex", gap: 2, mb: 3 }}>
								<TextField
									placeholder="Search"
									size="small"
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<Search sx={{ color: "#6C757D" }} />
											</InputAdornment>
										),
									}}
									sx={{
										width: "200px",
										"& .MuiOutlinedInput-root": {
											borderRadius: "4px",
											backgroundColor: "#fff",
										},
									}}
								/>
								<Select
									value=""
									displayEmpty
									size="small"
									sx={{
										width: "200px",
										backgroundColor: "#fff",
										"& .MuiOutlinedInput-notchedOutline": {
											borderColor: "#dee2e6",
										},
									}}>
									<MenuItem disabled value="">
										Select Company
									</MenuItem>
									<MenuItem value="digital">Digital</MenuItem>
									<MenuItem value="tech">Tech</MenuItem>
								</Select>
							</Box>

							{/* Company List */}
							<TableContainer component={Paper} sx={{ mb: 3 }}>
								{isLoading ? (
									<Box display="flex" justifyContent="center" alignItems="center" p={3}>
										<CircularProgress sx={{ color: "#0F172A" }} />
									</Box>
								) : (
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Company</TableCell>
												<TableCell>Status</TableCell>
												<TableCell>Details</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{companies.length > 0 ? (
												companies.map((company) => (
													<TableRow key={company.id}>
														<TableCell>
															<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
																<Avatar src={company.profile_image ? import.meta.env.VITE_ASSET_API + company.profile_image : ""} />
																<Box>
																	<Typography>{company.name}</Typography>
																	<Typography variant="body2" color="text.secondary">
																		{company.user_branch.name}
																	</Typography>
																</Box>
															</Box>
														</TableCell>
														<TableCell>
															<Box sx={{ display: "flex", gap: 1 }}>
																<Chip
																	label={company.status}
																	size="small"
																	sx={{
																		backgroundColor: "#002B5B",
																		color: "#fff",
																		borderRadius: "4px",
																		height: "24px",
																		textTransform: "capitalize",
																	}}
																/>
																<Chip
																	label="Owner"
																	size="small"
																	sx={{
																		backgroundColor: "#E8F1FF",
																		color: "#002B5B",
																		borderRadius: "4px",
																		height: "24px",
																	}}
																/>
															</Box>
														</TableCell>
														<TableCell>
															<Typography variant="body2" color="text.secondary">
																{company.price} • {company.total_members} member
																<br />
																Created: {dayjs(company.created_at).format("MMMM D, YYYY")}
															</Typography>
														</TableCell>
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
							<Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
								<Pagination count={totalPages} page={currentPage} onChange={(event, page) => setCurrentPage(page)} />
							</Box>
						</div>
					</ThemeProvider>
				</div>
			</div>
		</>
	);
};

export default Company;

const theme = createTheme({
	palette: {
		primary: {
			main: "#002B5B",
		},
		secondary: {
			main: "#E8F1FF",
		},
		text: {
			primary: "#212529",
			secondary: "#6C757D",
		},
	},
	typography: {
		fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
		h6: {
			fontWeight: 600,
			fontSize: "1.1rem",
		},
		body2: {
			fontSize: "0.875rem",
		},
	},
	components: {
		MuiTableCell: {
			styleOverrides: {
				root: {
					borderColor: "#dee2e6",
					padding: "1rem",
				},
				head: {
					fontWeight: 600,
					backgroundColor: "#f8f9fa",
				},
			},
		},
		MuiTableRow: {
			styleOverrides: {
				root: {
					"&:last-child td": {
						borderBottom: 0,
					},
				},
			},
		},
	},
});

// Sample company data
const companies = [
	{
		id: 1,
		name: "Digital",
		location: "Lahore",
		avatar: "/placeholder.svg?height=40&width=40",
		status: "Active",
		isAdmin: true,
		price: "$100.00",
		members: 1,
		created: "10/10/2023",
	},
	{
		id: 2,
		name: "Digital",
		location: "Lahore",
		avatar: "/placeholder.svg?height=40&width=40",
		status: "Active",
		isAdmin: false,
		price: "$100.00",
		members: 1,
		created: "10/10/2023",
	},
	{
		id: 3,
		name: "Digital",
		location: "Lahore",
		avatar: "/placeholder.svg?height=40&width=40",
		status: "Active",
		isAdmin: true,
		price: "$100.00",
		members: 1,
		created: "10/10/2023",
	},
	{
		id: 4,
		name: "Digital",
		location: "Lahore",
		avatar: "/placeholder.svg?height=40&width=40",
		status: "Active",
		isAdmin: false,
		price: "$100.00",
		members: 1,
		created: "10/10/2023",
	},
	{
		id: 5,
		name: "Digital",
		location: "Lahore",
		avatar: "/placeholder.svg?height=40&width=40",
		status: "Active",
		isAdmin: true,
		price: "$100.00",
		members: 1,
		created: "10/10/2023",
	},
];
