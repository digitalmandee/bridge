import React from "react";
import { TextField, Select, MenuItem, Typography, Avatar, Chip, Box, IconButton, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, createTheme, InputAdornment } from "@mui/material";
import { ArrowBack, Search } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";

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

const Company = () => {
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
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>Company</TableCell>
											<TableCell>Status</TableCell>
											<TableCell>Details</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{companies.map((company) => (
											<TableRow key={company.id}>
												<TableCell>
													<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
														<Avatar src={company.avatar} />
														<Box>
															<Typography>{company.name}</Typography>
															<Typography variant="body2" color="text.secondary">
																{company.location}
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
															}}
														/>
														{company.isAdmin && (
															<Chip
																label="Admin"
																size="small"
																sx={{
																	backgroundColor: "#E8F1FF",
																	color: "#002B5B",
																	borderRadius: "4px",
																	height: "24px",
																}}
															/>
														)}
													</Box>
												</TableCell>
												<TableCell>
													<Typography variant="body2" color="text.secondary">
														{company.price} • {company.members} member
														<br />
														Created: {company.created}
													</Typography>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>

							{/* Pagination */}
							<Box sx={{ display: "flex", justifyContent: "end", mt: 3 }}>
								<Pagination count={10} />
							</Box>
						</div>
					</ThemeProvider>
				</div>
			</div>
		</>
	);
};

export default Company;
