import React, { useContext, useEffect, useState } from "react";
import TopNavbar from "@/components/superadmin/topNavbar";
import Sidebar from "@/components/superadmin/leftSideBar";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, MenuItem, Select, CircularProgress } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "@/utils/axiosInstance";
import { AuthContext } from "@/contexts/SuperContext";
import { FileText } from "lucide-react";

const BranchManagement = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	const [branches, setBranches] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(10);

	const getBranches = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get("branches", {
				params: { page, limit },
			});
			console.log(res.data);

			setBranches(res.data.branches.data);
			setTotalPages(res.data.last_page);
		} catch (error) {
			console.error("Error fetching branches:", error.response);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getBranches(currentPage);
	}, [currentPage, limit]);

	return (
		<>
			<TopNavbar />
			<div className="main d-flex">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div className="container-fluid py-4">
						{/* Header */}
						<div className="row mb-4 align-items-center">
							<div className="col-auto ">
								<Typography variant="h4" className="mb-0 ms-2">
									Branches
								</Typography>
							</div>
						</div>

						{/* Filters and Search */}
						<div className="row mb-4 align-items-center">
							<div className="col-md-4">
								<TextField
									fullWidth
									size="small"
									placeholder="Search"
									InputProps={{
										startAdornment: <SearchIcon sx={{ color: "#64748B", mr: 1 }} />,
									}}
								/>
							</div>
						</div>

						{/* Table */}
						<TableContainer component={Paper} sx={{ boxShadow: "none" }}>
							{isLoading ? (
								<Box display="flex" justifyContent="center" alignItems="center" p={3}>
									<CircularProgress sx={{ color: "#0F172A" }} />
								</Box>
							) : (
								<Table>
									<TableHead sx={{ bgcolor: "#F8FAFC" }}>
										<TableRow>
											<TableCell>ID</TableCell>
											<TableCell>User Name</TableCell>
											<TableCell>Email</TableCell>
											<TableCell>Branch Name</TableCell>
											<TableCell>Branch Location</TableCell>
											<TableCell>Floor</TableCell>
											<TableCell>Room</TableCell>
											<TableCell>Seats</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{branches.length > 0 ? (
											branches.map((branche, i) => (
												<TableRow key={i}>
													<TableCell>{branche.id}</TableCell>
													<TableCell>{branche.username}</TableCell>
													<TableCell>{branche.email}</TableCell>
													<TableCell>{branche.name}</TableCell>
													<TableCell>{branche.location}</TableCell>
													<TableCell>{branche.floors}</TableCell>
													<TableCell>{branche.rooms}</TableCell>
													<TableCell>{branche.seats}</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell colSpan={7} align="center">
													No branches found.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							)}
						</TableContainer>

						{/* Pagination */}
						<Box display="flex" justifyContent="center" mt={3} gap={1}>
							<Button variant="outlined" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
								Previous
							</Button>
							{[...Array(totalPages)].map((_, index) => (
								<Button key={index} variant={currentPage === index + 1 ? "contained" : "outlined"} sx={currentPage === index + 1 ? { bgcolor: "#0F172A" } : {}} onClick={() => setCurrentPage(index + 1)}>
									{index + 1}
								</Button>
							))}
							<Button variant="outlined" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>
								Next
							</Button>
							<Select value={limit} onChange={(e) => setLimit(e.target.value)} size="small" sx={{ minWidth: 80 }}>
								<MenuItem value={5}>5</MenuItem>
								<MenuItem value={10}>10</MenuItem>
								<MenuItem value={20}>20</MenuItem>
							</Select>
						</Box>
					</div>
				</div>
			</div>
		</>
	);
};

export default BranchManagement;
