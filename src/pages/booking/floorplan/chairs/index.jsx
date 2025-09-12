import { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Select, MenuItem, FormControl, InputLabel, Snackbar, Alert, TableCell, CircularProgress, Table, TableBody, TableContainer, TableHead, TableRow, Paper, Pagination, Button } from "@mui/material";
import { Box } from "@mui/system";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "@/utils/axiosInstance";
import colors from "@/assets/styles/color";

const Management = () => {
	const navigate = useNavigate();
	const { branch } = useParams();

	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [selectedOption, setSelectedOption] = useState("");
	const [applications, setApplications] = useState([]);
	const [floors, setFloors] = useState([]);
	const [error, setError] = useState("");
	const [loadingFloors, setLoadingFloors] = useState(true);

	// Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const handlePageChange = (event, value) => {
		setCurrentPage(value);
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	useEffect(() => {
		const fetchFloors = async () => {
			try {
				const response = await axiosInstance.get("floor-plan/floor-plan-list");
				setFloors(response.data.floors || []);
			} catch (err) {
				setError("An error occurred while fetching floors.");
				console.error(err);
			} finally {
				setLoadingFloors(false);
			}
		};

		fetchFloors();
	}, []);

	const fetchChairs = async () => {
		if (!selectedOption) return;

		setIsLoading(true);
		try {
			const res = await axiosInstance.get("floor-plan/chairs", {
				params: {
					floor_id: selectedOption,
				},
			});

			if (res.data.success) {
				setApplications(res.data.chairs);
				setCurrentPage(1); // Reset to first page
			}
		} catch (error) {
			console.error("Error fetching chairs:", error);
			setSnackbar({
				open: true,
				message: "Failed to fetch chairs.",
				severity: "error",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteChair = async (chairId) => {
		if (!window.confirm("Are you sure you want to delete this chair?")) return;

		try {
			const res = await axiosInstance.delete(`floor-plan/chairs/${chairId}`);
			if (res.data.success) {
				setSnackbar({ open: true, message: res.data.message, severity: "success" });
				fetchChairs(); // refresh list
			}
		} catch (err) {
			let msg = "Failed to delete chair.";
			if (err.response && err.response.data?.message) msg = err.response.data.message;
			setSnackbar({ open: true, message: msg, severity: "error" });
		}
	};

	useEffect(() => {
		fetchChairs();
	}, [selectedOption]);

	return (
		<>
			<TopNavbar />
			<div className="main">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>

				<div className="content">
					<div className="row mb-4 align-items-center">
						<div className="col">
							<div
								style={{
									paddingTop: "1rem",
									display: "flex",
									alignItems: "center",
									marginBottom: "20px",
								}}>
								<div
									onClick={() => navigate(-1)}
									style={{
										cursor: "pointer",
										marginTop: "5px",
										display: "flex",
										alignItems: "center",
									}}>
									<MdArrowBackIos style={{ fontSize: "20px" }} />
								</div>
								<h3 style={{ margin: 0 }}>Chairs</h3>
							</div>
						</div>
						<div className="col-auto">
							<Box display="flex" gap={2}>
								<FormControl fullWidth sx={{ minWidth: 150 }}>
									<InputLabel>Select Floor</InputLabel>
									<Select value={selectedOption} label="Select Floor" onChange={(e) => setSelectedOption(e.target.value)}>
										{loadingFloors ? (
											<MenuItem disabled>Loading floors...</MenuItem>
										) : (
											floors.map((floor) => (
												<MenuItem key={floor.id} value={floor.id}>
													{floor.name}
												</MenuItem>
											))
										)}
									</Select>
								</FormControl>
								<Button variant="contained" sx={{ whiteSpace: "nowrap", px: 6, bgcolor: colors.primary, "&:hover": { bgcolor: colors.primary } }} onClick={() => navigate(`/${branch}/branch/floorplan/chairs/create`)}>
									Create Chair
								</Button>
							</Box>
						</div>
					</div>

					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow style={{ backgroundColor: "#fff2c6" }}>
									<TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
									<TableCell sx={{ fontWeight: "bold" }}>Floor</TableCell>
									<TableCell sx={{ fontWeight: "bold" }}>Chair</TableCell>
									<TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
									<TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{isLoading ? (
									<TableRow>
										<TableCell colSpan={4} align="center">
											<CircularProgress sx={{ color: "#FFCC16" }} />
										</TableCell>
									</TableRow>
								) : applications.length > 0 ? (
									applications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((application, index) => (
										<TableRow key={application.id}>
											<TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
											<TableCell>{application.floor.name}</TableCell>
											<TableCell>
												{application.table.table_id}-{application.chair_id}
											</TableCell>
											<TableCell>
												<span
													style={{
														display: "inline-block",
														padding: "4px 10px",
														fontSize: "12px",
														fontWeight: "600",
														color: "#fff",
														backgroundColor: application.time_slot === "available" ? "green" : application.time_slot === "day" ? application.color : application.time_slot === "night" ? application.color : application.time_slot === "full_day" ? application.color : application.color || "#999",
														borderRadius: "9999px",
														textTransform: "capitalize",
														textDecoration: "none",
														border: "none",
														lineHeight: "1",
														verticalAlign: "middle",
													}}>
													{application.time_slot?.replaceAll("_", " ")}
												</span>
											</TableCell>
											<TableCell>
												<Button variant="outlined" color="error" size="small" onClick={() => handleDeleteChair(application.id)}>
													Delete
												</Button>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={4} align="center">
											No chairs found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>

					{/* Pagination */}
					{applications.length > itemsPerPage && (
						<div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
							<Pagination count={Math.ceil(applications.length / itemsPerPage)} page={currentPage} onChange={handlePageChange} color="primary" />
						</div>
					)}
				</div>
			</div>

			<Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
				<Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
					{snackbar.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default Management;
