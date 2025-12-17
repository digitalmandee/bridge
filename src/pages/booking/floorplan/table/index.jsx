import { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Select, MenuItem, FormControl, InputLabel, Snackbar, Alert, TableCell, CircularProgress, Table, TableBody, TableContainer, TableHead, TableRow, Paper, Pagination, Button } from "@mui/material";
import { Box } from "@mui/system";
import axiosInstance from "@/utils/axiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";
import DeleteTableModal from "./DeleteTableModal";

import MoveChairsModal from "../rooms/MoveChairsModal"; // Assuming similar structure if needed, but not used here
import colors from "@/assets/styles/color";
// Import other necessary components if missing

const TableManagement = () => {
	const navigate = useNavigate();
	const { branch } = useParams();

	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success",
	});

	const [isLoading, setIsLoading] = useState(false);
	const [tables, setTables] = useState([]);
	const [floors, setFloors] = useState([]);
	const [loadingFloors, setLoadingFloors] = useState(true);
	const [selectedOption, setSelectedOption] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	// Delete Modal State
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [tableToDelete, setTableToDelete] = useState(null);

	const handlePageChange = (event, value) => {
		setCurrentPage(value);
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	const fetchTables = async () => {
		if (!selectedOption) return;

		setIsLoading(true);
		try {
			const res = await axiosInstance.get("floor-plan/tables", {
				params: {
					floor_id: selectedOption,
				},
			});
			if (res.data.success) {
				const sorted = (res.data.tables || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
				setTables(sorted);
				setCurrentPage(1);
			}
		} catch (error) {
			console.error("Error fetching tables:", error);
			setSnackbar({
				open: true,
				message: "Failed to fetch tables.",
				severity: "error",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const fetchFloors = async () => {
		setLoadingFloors(true);
		try {
			const res = await axiosInstance.get("floor-plan/floor-plan-list");
			if (res.data.success) {
				setFloors(res.data.floors || []);
			}
		} catch (error) {
			console.error("Error fetching floors:", error);
		} finally {
			setLoadingFloors(false);
		}
	};

	useEffect(() => {
		fetchFloors();
	}, []);

	useEffect(() => {
		fetchTables();
	}, [selectedOption]);

	const handleOpenDeleteModal = (table) => {
		setTableToDelete(table);
		setDeleteModalOpen(true);
	};

	const handleCloseDeleteModal = () => {
		setDeleteModalOpen(false);
		setTableToDelete(null);
	};

	const handleDeleteSuccess = (message) => {
		fetchTables();
		setSnackbar({
			open: true,
			message: message || "Table deleted successfully!",
			severity: "success",
		});
	};

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
								<h3 style={{ margin: 0 }}>Tables</h3>
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
								<Button
									variant="contained"
									sx={{
										whiteSpace: "nowrap",
										px: 6,
										bgcolor: colors.primary,
										"&:hover": { bgcolor: colors.primary },
									}}
									onClick={() => navigate(`/${branch}/branch/floorplan/tables/create`)}>
									Create Table
								</Button>
							</Box>
						</div>
					</div>

					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow style={{ backgroundColor: "#fff2c6" }}>
									<TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
									<TableCell sx={{ fontWeight: "bold" }}>Table ID</TableCell>
									<TableCell sx={{ fontWeight: "bold" }}>Room Name</TableCell>
									<TableCell sx={{ fontWeight: "bold" }}>Table Name</TableCell>
									<TableCell sx={{ fontWeight: "bold" }}>Chairs</TableCell>
									<TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{isLoading ? (
									<TableRow>
										<TableCell colSpan={4} align="center">
											<CircularProgress sx={{ color: colors.primary }} />
										</TableCell>
									</TableRow>
								) : tables.length > 0 ? (
									tables.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((table, index) => (
										<TableRow key={table.id}>
											<TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
											<TableCell>{table.table_id}</TableCell>
											<TableCell>{table.room?.name || "N/A"}</TableCell>
											<TableCell>{table.name}</TableCell>
											<TableCell>{table.chairs_count || 0}</TableCell>
											<TableCell>
												<Button variant="outlined" size="small" color="error" onClick={() => handleOpenDeleteModal(table)}>
													Delete
												</Button>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={7} align="center">
											No tables found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>

					{tables.length > itemsPerPage && (
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								marginTop: "1rem",
							}}>
							<Pagination count={Math.ceil(tables.length / itemsPerPage)} page={currentPage} onChange={handlePageChange} color="primary" />
						</div>
					)}
				</div>
			</div>

			<Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
				<Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
					{snackbar.message}
				</Alert>
			</Snackbar>

			<DeleteTableModal open={deleteModalOpen} onClose={handleCloseDeleteModal} table={tableToDelete} floors={floors} onSuccess={handleDeleteSuccess} />
		</>
	);
};

export default TableManagement;
