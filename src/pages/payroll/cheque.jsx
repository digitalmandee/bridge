import React, { useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "bootstrap/dist/css/bootstrap.min.css";

const ManageCheque = () => {
	const navigate = useNavigate();
	const { branch } = useParams();
	const [month, setMonth] = useState("February");
	const [year, setYear] = useState("2025");

	// Sample data
	const chequeData = [
		{ id: "01", name: "Gladys", amount: 10000, chequeNumber: "220232304204" },
		{ id: "02", name: "Gladys", amount: 10000, chequeNumber: "220232304204" },
	];

	// Calculate total
	const totalAmount = chequeData.reduce((sum, item) => sum + item.amount, 0);

	return (
		<>
			<TopNavbar />
			<div className="main d-flex">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div style={{ padding: "1rem" }}>
						{/* Header */}
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								// pt: 5,
							}}>
							<Box sx={{ display: "flex", alignItems: "center" }}>
								<div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
									<MdArrowBackIos style={{ fontSize: "20px", marginRight: "10px" }} />
								</div>
								<Typography variant="h5" component="h1" sx={{ fontWeight: "bold" }}>
									Manage Cheque
								</Typography>
							</Box>

							<Box sx={{ display: "flex", gap: 2 }}>
								{/* Month Dropdown */}
								<FormControl sx={{ minWidth: 120 }}>
									<InputLabel id="month-label" size="small">
										Month
									</InputLabel>
									<Select labelId="month-label" value={month} label="Month" onChange={(e) => setMonth(e.target.value)} size="small">
										<MenuItem value="January">January</MenuItem>
										<MenuItem value="February">February</MenuItem>
										<MenuItem value="March">March</MenuItem>
										<MenuItem value="April">April</MenuItem>
										<MenuItem value="May">May</MenuItem>
										<MenuItem value="June">June</MenuItem>
										<MenuItem value="July">July</MenuItem>
										<MenuItem value="August">August</MenuItem>
										<MenuItem value="September">September</MenuItem>
										<MenuItem value="October">October</MenuItem>
										<MenuItem value="November">November</MenuItem>
										<MenuItem value="December">December</MenuItem>
									</Select>
								</FormControl>

								{/* Year Dropdown */}
								<FormControl sx={{ minWidth: 120 }}>
									<InputLabel id="year-label" size="small">
										Year
									</InputLabel>
									<Select labelId="year-label" value={year} label="Year" onChange={(e) => setYear(e.target.value)} size="small">
										<MenuItem value="2023">2023</MenuItem>
										<MenuItem value="2024">2024</MenuItem>
										<MenuItem value="2025">2025</MenuItem>
										<MenuItem value="2026">2026</MenuItem>
									</Select>
								</FormControl>

								{/* Create Button */}
								<Button
									variant="contained"
									sx={{
										bgcolor: "#0a2e52",
										"&:hover": { bgcolor: "#0a2e52cc" },
										minWidth: "100px",
									}}
									onClick={() => navigate(`/${branch}/branch/payroll/cheque/create`)}>
									Create
								</Button>
							</Box>
						</Box>

						{/* Table */}
						<TableContainer
							style={{
								marginTop: "2rem",
								backgroundColor: "white",
								borderRadius: "10px",
							}}>
							<Table sx={{ minWidth: 650 }}>
								<TableHead>
									<TableRow sx={{ backgroundColor: "#e9f0f8" }}>
										<TableCell sx={{ fontWeight: "medium", color: "#444" }}>#</TableCell>
										<TableCell sx={{ fontWeight: "medium", color: "#444" }}>Employ Name</TableCell>
										<TableCell sx={{ fontWeight: "medium", color: "#444" }}>Amount</TableCell>
										<TableCell sx={{ fontWeight: "medium", color: "#444" }}>Cheque Number</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{chequeData.map((row) => (
										<TableRow key={row.id}>
											<TableCell>{row.id}</TableCell>
											<TableCell>{row.name}</TableCell>
											<TableCell>{row.amount.toLocaleString()}</TableCell>
											<TableCell>{row.chequeNumber}</TableCell>
										</TableRow>
									))}
									<TableRow>
										<TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
										<TableCell sx={{ fontWeight: "bold" }}>{chequeData.length}</TableCell>
										<TableCell sx={{ fontWeight: "bold" }}>{totalAmount.toLocaleString()}</TableCell>
										<TableCell></TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>
					</div>
				</div>
			</div>
		</>
	);
};

export default ManageCheque;
