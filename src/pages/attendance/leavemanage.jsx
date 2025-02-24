import React, { useState } from "react";
import TopNavbar from "../../components/topNavbar";
import Sidebar from "../../components/leftSideBar";
import { Navigate, useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import { Table, TableBody, TableCell, Button, TableContainer, TableHead, TableRow, Paper, Pagination, IconButton, TextField, Box, Typography } from "@mui/material";
import { Edit as EditIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";

const LeaveManage = () => {
	const navigate = useNavigate();

	const [searchTerm, setSearchTerm] = useState("");
	const [page, setPage] = useState(1);
	const rowsPerPage = 5;
	// Sample data
	const leaveData = [
		{
			id: 1,
			name: "John Doe",
			startDate: "05 Jan 2025",
			endDate: "05 Jan 2025",
			days: 1,
			category: "Casual",
			createdAt: "05 Jan 2025",
			status: "Accepted",
		},
		{
			id: 2,
			name: "John Doe",
			startDate: "05 Jan 2025",
			endDate: "05 Jan 2025",
			days: 1,
			category: "Sick",
			createdAt: "05 Jan 2025",
			status: "Pending",
		},
		{
			id: 3,
			name: "John Doe",
			startDate: "05 Jan 2025",
			endDate: "05 Feb 2025",
			days: 10,
			category: "Business",
			createdAt: "05 Feb 2025",
			status: "Accepted",
		},
		{
			id: 4,
			name: "John Doe",
			startDate: "05 Jan 2025",
			endDate: "05 Oct 2025",
			days: 20,
			category: "Casual",
			createdAt: "05 Oct 2025",
			status: "Pending",
		},
		{
			id: 5,
			name: "John Doe",
			startDate: "05 Jan 2025",
			endDate: "05 Jan 2025",
			days: 25,
			category: "Sick",
			createdAt: "05 Jan 2025",
			status: "Accepted",
		},
	];

	const filteredData = leaveData.filter((row) => row.name.toLowerCase().includes(searchTerm.toLowerCase()) || row.category.toLowerCase().includes(searchTerm.toLowerCase()));

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	return (
		<>
			<TopNavbar />
			<div className="main">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div style={{ paddingTop: "1rem", display: "flex", alignItems: "center", marginBottom: "20px" }}>
						<div onClick={() => navigate(-1)} style={{ cursor: "pointer", marginTop: "5px", display: "flex", alignItems: "center" }}>
							<MdArrowBackIos style={{ fontSize: "20px", cursor: "pointer" }} />
						</div>
						<h3 style={{ margin: 0 }}>Leave Application</h3>
					</div>
					<Box sx={{ backgroundColor: "#FFFFFF", padding: 2, borderRadius: 2 }}>
						<Box className="mb-4">
							<TextField
								variant="outlined"
								placeholder="Search..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								size="small"
								sx={{ width: "20%" }}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Search color="action" />
										</InputAdornment>
									),
								}}
							/>
							<Button
								variant="contained"
								sx={{
									backgroundColor: "#0D2B4E",
									color: "white",
									textTransform: "none",
									marginLeft: "2rem",
									padding: "6px 16px",
									"&:hover": { backgroundColor: "#09203D" }, // Slightly darker shade on hover
								}}>
								Add
							</Button>
						</Box>

						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow style={{ backgroundColor: "#C5D9F0" }}>
										<TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
										<TableCell sx={{ fontWeight: "bold" }}>Employ Name</TableCell>
										<TableCell sx={{ fontWeight: "bold" }}>Start date</TableCell>
										<TableCell sx={{ fontWeight: "bold" }}>End Date</TableCell>
										<TableCell sx={{ fontWeight: "bold" }}>Leaves Days</TableCell>
										<TableCell sx={{ fontWeight: "bold" }}>Leave Category</TableCell>
										<TableCell sx={{ fontWeight: "bold" }}>Created At</TableCell>
										<TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row) => (
										<TableRow key={row.id}>
											<TableCell>{row.id}</TableCell>
											<TableCell>{row.name}</TableCell>
											<TableCell>{row.startDate}</TableCell>
											<TableCell>{row.endDate}</TableCell>
											<TableCell>{row.days}</TableCell>
											<TableCell>{row.category}</TableCell>
											<TableCell>{row.createdAt}</TableCell>
											<TableCell>
												<span
													style={{
														backgroundColor: row.status === "Accepted" ? "#0D2B4E" : "#C5DCF7AB",
														color: row.status === "Accepted" ? "white" : "black",
														padding: "6px 12px",
														borderRadius: "50px",
														display: "inline-block",
													}}>
													{row.status}
												</span>
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
					</Box>
				</div>
			</div>
		</>
	);
};

export default LeaveManage;
