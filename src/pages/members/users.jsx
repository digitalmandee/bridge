import React, { useContext, useEffect, useState } from "react";
import { TextField, Typography, Avatar, Chip, Box, IconButton, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, createTheme, InputAdornment, CircularProgress } from "@mui/material";
import { ArrowBack, Search } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import axiosInstance from "@/utils/axiosInstance";
import { AuthContext } from "@/contexts/AuthContext";
import colors from "@/assets/styles/color";
const MemberUser = () => {
	const { user: userData } = useContext(AuthContext);

	const [users, setUsers] = useState([]);
	const [search, setSearch] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(10);

	const getUsers = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get("member/users", {
				params: { page, limit, search }, // Pass search
			});

			if (res.data.success) {
				setUsers(res.data.users.data);
				setTotalPages(res.data.users.last_page);
				setCurrentPage(res.data.users.current_page);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const delayDebounce = setTimeout(() => {
			getUsers(1);
		}, 500);

		return () => clearTimeout(delayDebounce);
	}, [search, limit]);

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
									User
								</Typography>
							</Box>

							{/* Search */}
							<Box sx={{ mb: 3 }}>
								<TextField
									placeholder="Search"
									size="small"
									fullWidth
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<Search sx={{ color: "#6C757D", fontSize: "1.25rem" }} />
											</InputAdornment>
										),
									}}
									sx={{
										maxWidth: "300px",
										"& .MuiOutlinedInput-root": {
											borderRadius: "4px",
											backgroundColor: "#fff",
											"& fieldset": {
												borderColor: "#dee2e6",
											},
											"&:hover fieldset": {
												borderColor: "#dee2e6",
											},
											"&.Mui-focused fieldset": {
												borderColor: "#FFCC16",
											},
										},
									}}
								/>
							</Box>

							{/* User List */}
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
												<TableCell>Last login</TableCell>
												<TableCell>Status</TableCell>
												{/* <TableCell>Profile</TableCell> */}
												{/* <TableCell>Terms & Condition</TableCell> */}
											</TableRow>
										</TableHead>
										<TableBody>
											{users.length > 0 ? (
												users.map((user) => (
													<TableRow key={user.id}>
														<TableCell>
															<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
																<Avatar src={user.profile_image ? import.meta.env.VITE_ASSET_API + user.profile_image : ""} />
																<Box>
																	<Typography>
																		{user.name} <span style={{ color: "#6C757D", fontSize: "0.875rem" }}>{user.company ? "at " + user.company.name : ""}</span>
																	</Typography>
																	<Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
																		<span style={{ fontSize: "10px" }}>●</span> {userData.branch}
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
																	backgroundColor: colors.primary,
																	color: "#fff",
																	borderRadius: "4px",
																	height: "24px",
																	fontSize: "0.75rem",
																	textTransform: "capitalize",
																}}
															/>
														</TableCell>
														{/* <TableCell>
													<Chip
														label="Public"
														size="small"
														sx={{
															backgroundColor: "#E8F1FF",
															color: "#FFCC16",
															borderRadius: "4px",
															height: "24px",
															fontSize: "0.75rem",
														}}
													/>
												</TableCell> */}
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
					</ThemeProvider>
				</div>
			</div>
		</>
	);
};

export default MemberUser;

const theme = createTheme({
	palette: {
		primary: {
			main: "#FFCC16",
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
					whiteSpace: "nowrap",
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
