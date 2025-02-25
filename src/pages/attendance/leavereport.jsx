import React, { useState } from "react";
import TopNavbar from "../../components/topNavbar";
import Sidebar from "../../components/leftSideBar";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import { Table, TableBody, TableCell, TableContainer, TableHead, Button, TableRow, Paper, Pagination, IconButton, TextField, Box, Typography } from "@mui/material";
import { Edit as EditIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";

const LeaveReport = () => {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [page, setPage] = useState(1);
	const rowsPerPage = 5;
	// Sample data
	const leaveData = [
		{
			id: 1,
			name: "John Doe",
			casualLeave: "2",
			sickLeave: "",
			advanceLeave: "",
			totalAttendance: "20",
			totalAbsent: "2",
			totalLeave: "0",
		},
		{
			id: 2,
			name: "John Doe",
			casualLeave: "",
			sickLeave: "1",
			advanceLeave: "",
			totalAttendance: "10",
			totalAbsent: "2",
			totalLeave: "5",
		},
		{
			id: 3,
			name: "John Doe",
			casualLeave: "2",
			sickLeave: "",
			advanceLeave: "0",
			totalAttendance: "14",
			totalAbsent: "5",
			totalLeave: "0",
		},
		{
			id: 4,
			name: "John Doe",
			casualLeave: "",
			sickLeave: "",
			advanceLeave: 1,
			totalAttendance: "8",
			totalAbsent: "0",
			totalLeave: "0",
		},
		{
			id: 5,
			name: "John Doe",
			casualLeave: "2",
			sickLeave: "",
			advanceLeave: "0",
			totalAttendance: "5",
			totalAbsent: "4",
			totalLeave: "0",
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
						<h3 style={{ margin: 0 }}>Leave Report</h3>
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
								Go
							</Button>
						</Box>

						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow style={{ backgroundColor: "#C5D9F0" }}>
										<TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
										<TableCell sx={{ fontWeight: "bold" }}>Employ Name</TableCell>
										<TableCell sx={{ fontWeight: "bold" }}>Casual Leave</TableCell>
										<TableCell sx={{ fontWeight: "bold" }}>Sick Leave</TableCell>
										<TableCell sx={{ fontWeight: "bold" }}>Advance Leave</TableCell>
										<TableCell sx={{ fontWeight: "bold" }}>Total Attendance</TableCell>
										<TableCell sx={{ fontWeight: "bold" }}>Total Absence</TableCell>
										<TableCell sx={{ fontWeight: "bold" }}>Total Leave</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row) => (
										<TableRow key={row.id}>
											<TableCell>{row.id}</TableCell>
											<TableCell>{row.name}</TableCell>
											<TableCell>{row.casualLeave}</TableCell>
											<TableCell>{row.sickLeave}</TableCell>
											<TableCell>{row.advanceLeave}</TableCell>
											<TableCell>{row.totalAttendance}</TableCell>
											<TableCell>{row.totalAbsent}</TableCell>
											<TableCell>{row.totalLeave}</TableCell>
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

export default LeaveReport;
