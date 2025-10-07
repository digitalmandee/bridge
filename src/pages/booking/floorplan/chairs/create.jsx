import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { Box } from "@mui/system";
import { Alert, Button, FormControl, InputLabel, MenuItem, Select, Snackbar, Typography, Paper, CircularProgress } from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import { MdArrowBackIos } from "react-icons/md";

const CreateChair = () => {
	const { branch } = useParams();

	const [floors, setFloors] = useState([]);
	const [rooms, setRooms] = useState([]);
	const [tables, setTables] = useState([]);

	const [selectedFloor, setSelectedFloor] = useState("");
	const [selectedRoom, setSelectedRoom] = useState("");
	const [selectedTable, setSelectedTable] = useState("");

	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingData, setIsLoadingData] = useState(false); // one shared loader

	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
	const navigate = useNavigate();
	const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

	useEffect(() => {
		setIsLoadingData(true);
		axiosInstance
			.get("floor-plan/floors")
			.then((res) => {
				setFloors(res.data.floors || []);
			})
			.finally(() => setIsLoadingData(false));
	}, []);

	useEffect(() => {
		if (selectedFloor) {
			setIsLoadingData(true);
			axiosInstance
				.get(`floor-plan/${selectedFloor}/rooms`)
				.then((res) => {
					setRooms(res.data.floor.rooms || []);
					setSelectedRoom("");
					setTables([]);
					setSelectedTable("");
				})
				.finally(() => setIsLoadingData(false));
		}
	}, [selectedFloor]);

	useEffect(() => {
		if (selectedRoom) {
			const roomData = rooms.find((room) => room.id === selectedRoom);
			setTables(roomData?.tables || []);
			setSelectedTable("");
		}
	}, [selectedRoom]);

	const handleSubmit = () => {
		if (!selectedTable) {
			setSnackbar({ open: true, message: "Please select a table", severity: "error" });
			return;
		}
		setIsLoading(true);

		axiosInstance
			.post("floor-plan/chairs", {
				floor_id: selectedFloor,
				room_id: selectedRoom,
				table_id: selectedTable,
			})
			.then(() => {
				setSnackbar({ open: true, message: "Chair created successfully", severity: "success" });
				setTimeout(() => navigate(`/${branch}/branch/floorplan`), 1200);
			})
			.catch(() => {
				setSnackbar({ open: true, message: "Failed to create chair", severity: "error" });
			})
			.finally(() => setIsLoading(false));
	};

	const isCreateDisabled = !selectedTable || isLoading || isLoadingData;

	return (
		<>
			<TopNavbar />
			<div className="main">
				<div className="sidebarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<Box className="page-content" p={1}>
						<Box className="d-flex justify-content-between align-items-center flex-wrap" mb={3}>
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
									<MdArrowBackIos style={{ fontSize: "20px", marginRight:'1rem' }} />
								</div>
								<h3 style={{ margin: 0 }}>Create Chair</h3>
							</div>
						</Box>

						<Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
							{isLoadingData && (
								<Box display="flex" justifyContent="center" my={2}>
									<CircularProgress />
								</Box>
							)}

							<Box display="flex" flexDirection="column" gap={3}>
								<FormControl fullWidth disabled={isLoadingData}>
									<InputLabel>Floor</InputLabel>
									<Select value={selectedFloor} label="Floor" onChange={(e) => setSelectedFloor(e.target.value)}>
										{floors.map((floor) => (
											<MenuItem key={floor.id} value={floor.id}>
												{floor.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>

								<FormControl fullWidth disabled={!rooms.length || isLoadingData}>
									<InputLabel>Room</InputLabel>
									<Select value={selectedRoom} label="Room" onChange={(e) => setSelectedRoom(e.target.value)}>
										{rooms.map((room) => (
											<MenuItem key={room.id} value={room.id}>
												{room.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>

								<FormControl fullWidth disabled={!tables.length || isLoadingData}>
									<InputLabel>Table</InputLabel>
									<Select value={selectedTable} label="Table" onChange={(e) => setSelectedTable(e.target.value)}>
										{tables.map((table) => (
											<MenuItem key={table.id} value={table.id}>
												Table {table.table_id}
											</MenuItem>
										))}
									</Select>
								</FormControl>

								<Button variant="contained" color="primary" onClick={handleSubmit} disabled={isCreateDisabled}>
									{isLoading ? "Creating..." : "Create Chair"}
								</Button>
							</Box>
						</Paper>
					</Box>
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

export default CreateChair;
