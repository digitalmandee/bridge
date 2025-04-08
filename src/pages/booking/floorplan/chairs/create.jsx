import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { Box } from "@mui/system";
import { Alert, Button, FormControl, InputLabel, MenuItem, Select, Snackbar, Typography } from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";

const CreateChair = () => {
	const [floors, setFloors] = useState([]);
	const [rooms, setRooms] = useState([]);
	const [tables, setTables] = useState([]);

	const [selectedFloor, setSelectedFloor] = useState("");
	const [selectedRoom, setSelectedRoom] = useState("");
	const [selectedTable, setSelectedTable] = useState("");

	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

	const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

	// Fetch floors on mount
	useEffect(() => {
		axiosInstance.get("floor-plan/floors").then((res) => {
			setFloors(res.data.floors); // Assuming the response is structured as { success: true, floors: [...] }
		});
	}, []);

	// Fetch rooms and tables when floor changes
	useEffect(() => {
		if (selectedFloor) {
			axiosInstance
				.get(`floor-plan/${selectedFloor}/rooms`) // Get rooms for the selected floor
				.then((res) => {
					setRooms(res.data.floor.rooms || []); // Assuming the response has the structure `{ success: true, floor: { rooms: [...] } }`
					setSelectedRoom(""); // Reset room selection
					setTables([]); // Reset tables
					setSelectedTable(""); // Reset table selection
				});
		}
	}, [selectedFloor]);

	// Fetch tables when room changes
	useEffect(() => {
		if (selectedRoom) {
			const floorData = rooms.find((room) => room.id === selectedRoom);
			// const roomData = floorData?.rooms.find((room) => room.id === selectedRoom);
			setTables(floorData?.tables || []); // Set tables related to the selected room
			setSelectedTable(""); // Reset table selection
		}
	}, [selectedRoom, floors, selectedFloor]);

	const handleSubmit = () => {
		if (!selectedTable) {
			setSnackbar({ open: true, message: "Please select a table", severity: "error" });
			return;
		}

		axiosInstance
			.post("floor-plan/chairs", { floor_id: selectedFloor, room_id: selectedRoom, table_id: selectedTable })
			.then(() => {
				setSnackbar({ open: true, message: "Chair created successfully", severity: "success" });
			})
			.catch(() => {
				setSnackbar({ open: true, message: "Failed to create chair", severity: "error" });
			});
	};

	return (
		<>
			<TopNavbar />
			<div className="main">
				<div className="sidebarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<Box className="page-content" p={2}>
						<Box className="d-flex justify-content-between align-items-center flex-wrap" mb={3}>
							<Typography variant="h5">Create Chair</Typography>
						</Box>

						<Box display="flex" flexDirection="column" gap={2} maxWidth={400}>
							<FormControl fullWidth>
								<InputLabel>Floor</InputLabel>
								<Select value={selectedFloor} label="Floor" onChange={(e) => setSelectedFloor(e.target.value)}>
									{floors &&
										floors.map((floor) => (
											<MenuItem key={floor.id} value={floor.id}>
												{floor.name}
											</MenuItem>
										))}
								</Select>
							</FormControl>

							<FormControl fullWidth disabled={!rooms.length}>
								<InputLabel>Room</InputLabel>
								<Select value={selectedRoom} label="Room" onChange={(e) => setSelectedRoom(e.target.value)}>
									{rooms &&
										rooms.map((room) => (
											<MenuItem key={room.id} value={room.id}>
												{room.name}
											</MenuItem>
										))}
								</Select>
							</FormControl>

							<FormControl fullWidth disabled={!tables.length}>
								<InputLabel>Table</InputLabel>
								<Select value={selectedTable} label="Table" onChange={(e) => setSelectedTable(e.target.value)}>
									{tables &&
										tables.map((table) => (
											<MenuItem key={table.id} value={table.id}>
												Table {table.table_id}
											</MenuItem>
										))}
								</Select>
							</FormControl>

							<Button variant="contained" color="primary" onClick={handleSubmit} disabled={!selectedTable}>
								Create Chair
							</Button>
						</Box>
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
