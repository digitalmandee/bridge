import { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Select, MenuItem, FormControl, InputLabel, Snackbar, Alert, TableCell, CircularProgress, Table, TableBody, TableContainer, TableHead, TableRow, Paper, Pagination, Button } from "@mui/material";
import { Box } from "@mui/system";
import axiosInstance from "@/utils/axiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";
import colors from "@/assets/styles/color";
import MoveChairsModal from "./MoveChairsModal";

import DeleteRoomModal from "./DeleteRoomModal";
import MoveTablesModal from "./MoveTablesModal";

const RoomManagement = () => {
	const navigate = useNavigate();
	const { branch } = useParams();

	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success",
	});

	const [isLoading, setIsLoading] = useState(false);
	const [rooms, setRooms] = useState([]);
	const [floors, setFloors] = useState([]);
	const [loadingFloors, setLoadingFloors] = useState(true);
	const [selectedOption, setSelectedOption] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	// Move Modal State
	const [moveModalOpen, setMoveModalOpen] = useState(false);
	const [roomToMove, setRoomToMove] = useState(null);

	// Move Tables Modal State
	const [moveTablesModalOpen, setMoveTablesModalOpen] = useState(false);
	const [roomToMoveTables, setRoomToMoveTables] = useState(null);

	// Delete Modal State
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [roomToDelete, setRoomToDelete] = useState(null);

	const handlePageChange = (event, value) => {
		setCurrentPage(value);
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	const fetchRooms = async () => {
		if (!selectedOption) return;

		setIsLoading(true);
		try {
			const res = await axiosInstance.get("floor-plan/rooms", {
				params: {
					floor_id: selectedOption,
				},
			});
			if (res.data.success) {
				const sorted = res.data.rooms.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
				setRooms(sorted);
				setCurrentPage(1);
			}
		} catch (error) {
			console.error("Error fetching rooms:", error);
			setSnackbar({
				open: true,
				message: "Failed to fetch rooms.",
				severity: "error",
			});
		} finally {
			setIsLoading(false);
		}
	};
	console.log("rooms", rooms);

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
		fetchRooms();
	}, [selectedOption]);

	const handleOpenMoveModal = (room) => {
		setRoomToMove(room);
		setMoveModalOpen(true);
	};

	const handleCloseMoveModal = () => {
		setMoveModalOpen(false);
		setRoomToMove(null);
	};

	const handleMoveSuccess = () => {
		fetchRooms();
		setSnackbar({
			open: true,
			message: "Moved successfully!",
			severity: "success",
		});
	};

	// Move Tables Handlers
	const handleOpenMoveTablesModal = (room) => {
		setRoomToMoveTables(room);
		setMoveTablesModalOpen(true);
	};

	const handleCloseMoveTablesModal = () => {
		setMoveTablesModalOpen(false);
		setRoomToMoveTables(null);
	};

	// Delete Handlers
	const handleOpenDeleteModal = (room) => {
		setRoomToDelete(room);
		setDeleteModalOpen(true);
	};

	const handleCloseDeleteModal = () => {
		setDeleteModalOpen(false);
		setRoomToDelete(null);
	};

	const handleDeleteSuccess = (message) => {
		fetchRooms();
		setSnackbar({
			open: true,
			message: message || "Room deleted successfully!",
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
								<h3 style={{ margin: 0 }}>Rooms</h3>
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
									onClick={() => navigate(`/${branch}/branch/floorplan/rooms/create`)}>
									Create Room
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
									<TableCell sx={{ fontWeight: "bold" }}>Room ID</TableCell>
									<TableCell sx={{ fontWeight: "bold" }}>Room Name</TableCell>
									<TableCell sx={{ fontWeight: "bold" }}>Tables</TableCell>
									<TableCell sx={{ fontWeight: "bold" }}>Chairs</TableCell>
									<TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{isLoading ? (
									<TableRow>
										<TableCell colSpan={7} align="center">
											<CircularProgress sx={{ color: colors.primary }} />
										</TableCell>
									</TableRow>
								) : rooms.length > 0 ? (
									rooms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((room, index) => (
										<TableRow key={room.id}>
											<TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
											<TableCell>{room.floor.name}</TableCell>
											<TableCell>{room.room_id}</TableCell>
											<TableCell>{room.name}</TableCell>
											<TableCell>{room.tables_count || 0}</TableCell>
											<TableCell>{room.chairs_count || 0}</TableCell>
											<TableCell>
												<Box display="flex" gap={1}>
													<Button variant="outlined" size="small" color="primary" onClick={() => handleOpenMoveTablesModal(room)}>
														Move Tables
													</Button>
													<Button variant="outlined" size="small" color="primary" onClick={() => handleOpenMoveModal(room)}>
														Move Chairs
													</Button>
													<Button variant="outlined" size="small" color="error" onClick={() => handleOpenDeleteModal(room)}>
														Delete
													</Button>
												</Box>
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={7} align="center">
											No rooms found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>

					{rooms.length > itemsPerPage && (
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								marginTop: "1rem",
							}}>
							<Pagination count={Math.ceil(rooms.length / itemsPerPage)} page={currentPage} onChange={handlePageChange} color="primary" />
						</div>
					)}
				</div>
			</div>

			<Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
				<Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
					{snackbar.message}
				</Alert>
			</Snackbar>

			<MoveChairsModal open={moveModalOpen} onClose={handleCloseMoveModal} sourceRoom={roomToMove} floors={floors} onMoveSuccess={handleMoveSuccess} />

			<MoveTablesModal open={moveTablesModalOpen} onClose={handleCloseMoveTablesModal} sourceRoom={roomToMoveTables} floors={floors} onMoveSuccess={handleMoveSuccess} />

			<DeleteRoomModal open={deleteModalOpen} onClose={handleCloseDeleteModal} room={roomToDelete} floors={floors} onSuccess={handleDeleteSuccess} />
		</>
	);
};

export default RoomManagement;
