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
import EditChairModal from "./EditChairModal";

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

	// Filter by Table
	const [tables, setTables] = useState([]);
	const [selectedTable, setSelectedTable] = useState("all");
	const [loadingTables, setLoadingTables] = useState(false);

	// Edit Modal
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [chairToEdit, setChairToEdit] = useState(null);

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
				const floorsData = response.data.floors || [];
				setFloors(floorsData);

				// Auto-select first floor
				if (floorsData.length > 0) {
					setSelectedOption(floorsData[0].id);
				}
			} catch (err) {
				setError("An error occurred while fetching floors.");
				console.error(err);
			} finally {
				setLoadingFloors(false);
			}
		};

		fetchFloors();
	}, []);

	// Fetch tables when floor changes
	useEffect(() => {
		if (!selectedOption) {
			setTables([]);
			return;
		}

		setLoadingTables(true);
		axiosInstance
			.get("floor-plan/tables", { params: { floor_id: selectedOption } })
			.then((res) => {
				setTables(res.data.tables || []);
				setSelectedTable("all"); // Reset table filter
			})
			.catch((err) => console.error("Failed to fetch tables", err))
			.finally(() => setLoadingTables(false));
	}, [selectedOption]);

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

	const handleChairClick = async (chair) => {
		try {
			const newStatus = chair.status === "active" ? "inactive" : "active";

			// Update the flat list for table view
			// Actually, applications is a list of chairs in this view, not tables (based on fetchChairs logic: setApplications(res.data.chairs))
			// Wait, previous logic: setApplications(res.data.chairs)
			// So applications is an array of CHAIRS.

			const updatedChairs = applications.map((c) => (c.id === chair.id ? { ...c, status: newStatus } : c));
			setApplications(updatedChairs);

			const res = await axiosInstance.put(`floor-plan/chairs/${chair.id}`, {
				status: newStatus,
			});

			if (res.data.success) {
				setSnackbar({ open: true, message: `Chair marked as ${newStatus}`, severity: "success" });
			} else {
				throw new Error("Failed to update");
			}
		} catch (error) {
			console.error("Error updating chair status:", error);
			setSnackbar({ open: true, message: "Failed to update chair status.", severity: "error" });
			fetchChairs(); // Revert
		}
	};

	useEffect(() => {
		fetchChairs();
	}, [selectedOption]);

	const handleOpenEditModal = (chair) => {
		setChairToEdit(chair);
		setEditModalOpen(true);
	};

	const handleEditSuccess = (msg) => {
		setSnackbar({ open: true, message: msg, severity: "success" });
		fetchChairs();
	};

	// Filtered chairs based on table selection
	const filteredChairs = selectedTable === "all" ? applications : applications.filter((chair) => chair.table?.id === selectedTable);

	const selectedFloorName = floors.find((f) => f.id === selectedOption)?.name;

	return (
		<>
			<TopNavbar />
			<div className="main">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>

				<div className="content" style={{ padding: 10 }}>
					<div className="row mb-4 align-items-center">
						<div className="col">
							<div
								style={{
									paddingTop: "1rem",
									display: "flex",
									alignItems: "center",
									marginBottom: "20px",
								}}>
								<div onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
									<MdArrowBackIos style={{ fontSize: "20px", marginRight: "1rem" }} />
								</div>
								<h3 style={{ margin: 0 }}>Chairs</h3>
							</div>
						</div>
						<div className="col-auto">
							<Box display="flex" gap={2}>
								<FormControl
									fullWidth
									sx={{
										minWidth: 150,
										"& .MuiInputBase-root": {
											height: 40,
										},
									}}>
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

								{/* Table Filter */}
								<FormControl
									fullWidth
									sx={{
										minWidth: 150,
										"& .MuiInputBase-root": {
											height: 40,
										},
									}}>
									<InputLabel>Filter Table</InputLabel>
									<Select value={selectedTable} label="Filter Table" onChange={(e) => setSelectedTable(e.target.value)} disabled={!selectedOption || loadingTables}>
										<MenuItem value="all">All Tables</MenuItem>
										{tables.map((table) => (
											<MenuItem key={table.id} value={table.id}>
												{table.name} ({table.table_id})
											</MenuItem>
										))}
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
									<TableCell sx={{ fontWeight: "bold" }}>Time Slot</TableCell>
									<TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
									<TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{isLoading ? (
									<TableRow>
										<TableCell colSpan={6} align="center">
											<CircularProgress sx={{ color: "#FFCC16" }} />
										</TableCell>
									</TableRow>
								) : filteredChairs.length > 0 ? (
									filteredChairs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((application, index) => (
										<TableRow key={application.id}>
											<TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
											<TableCell>{application.floor?.name}</TableCell>
											<TableCell>
												{application.table?.table_id}-{application.chair_id}
											</TableCell>
											<TableCell>
												<span
													style={{
														display: "inline-block",
														padding: "4px 10px",
														fontSize: "12px",
														fontWeight: "600",
														color: "#fff",
														backgroundColor: application.time_slot === "available" ? "green" : application.time_slot === "day" || application.time_slot === "night" ? "#FFB800" : "#6A5ACD", // Placeholder colors
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
												<span
													style={{
														color: application.status === "active" ? "green" : "red",
														fontWeight: "bold",
														textTransform: "capitalize",
													}}>
													{application.status}
												</span>
											</TableCell>
											<TableCell>
												<Button variant="outlined" size="small" onClick={() => handleOpenEditModal(application)} sx={{ marginRight: 1 }}>
													Edit
												</Button>
												<Button variant="outlined" size="small" onClick={() => handleChairClick(application)} sx={{ marginRight: 1 }}>
													{application.status === "active" ? "Deactivate" : "Activate"}
												</Button>
												<Button variant="outlined" color="error" size="small" onClick={() => handleDeleteChair(application.id)}>
													Delete
												</Button>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={6} align="center">
											No chairs found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>

					{/* Pagination */}
					{filteredChairs.length > itemsPerPage && (
						<div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
							<Pagination count={Math.ceil(filteredChairs.length / itemsPerPage)} page={currentPage} onChange={handlePageChange} color="primary" />
						</div>
					)}
				</div>
			</div>

			<EditChairModal open={editModalOpen} onClose={() => setEditModalOpen(false)} chair={chairToEdit} onSuccess={handleEditSuccess} />

			<Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
				<Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
					{snackbar.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default Management;
