import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox, FormControlLabel, Select, MenuItem, FormControl, InputLabel, CircularProgress, Box, Typography, Grid, Alert } from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";

const MoveChairsModal = ({ open, onClose, sourceRoom, floors, onMoveSuccess }) => {
	const [chairs, setChairs] = useState([]);
	const [loadingChairs, setLoadingChairs] = useState(false);
	const [selectedChairIds, setSelectedChairIds] = useState([]);
	const [targetFloorId, setTargetFloorId] = useState("");
	const [targetRooms, setTargetRooms] = useState([]);
	const [targetRoomId, setTargetRoomId] = useState("");

	// New: Target Table State
	const [targetTables, setTargetTables] = useState([]);
	const [targetTableId, setTargetTableId] = useState("");
	const [loadingTargetTables, setLoadingTargetTables] = useState(false);

	const [loadingTargetRooms, setLoadingTargetRooms] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (open && sourceRoom) {
			fetchChairs();
			setTargetFloorId(sourceRoom.floor_id);
			setTargetRoomId("");
			setTargetTableId(""); // Reset table
			setSelectedChairIds([]);
			setTargetTables([]); // Reset tables
			setError(null);
		}
	}, [open, sourceRoom]);

	useEffect(() => {
		if (targetFloorId) {
			fetchTargetRooms(targetFloorId);
		} else {
			setTargetRooms([]);
		}
	}, [targetFloorId]);

	// New: Fetch tables when target room changes
	useEffect(() => {
		if (targetRoomId) {
			fetchTargetTables(targetRoomId);
		} else {
			setTargetTables([]);
			setTargetTableId("");
		}
	}, [targetRoomId]);

	const fetchChairs = async () => {
		setLoadingChairs(true);
		try {
			const res = await axiosInstance.get("floor-plan/chairs", {
				params: {
					floor_id: sourceRoom.floor_id,
					room_id: sourceRoom.id,
				},
			});
			if (res.data.success) {
				setChairs(res.data.chairs || []);
			}
		} catch (err) {
			console.error("Error fetching chairs:", err);
			setError("Failed to load chairs.");
		} finally {
			setLoadingChairs(false);
		}
	};

	const fetchTargetRooms = async (floorId) => {
		setLoadingTargetRooms(true);
		try {
			const res = await axiosInstance.get("floor-plan/rooms", {
				params: { floor_id: floorId },
			});
			if (res.data.success) {
				let rooms = res.data.rooms || [];
				if (floorId === sourceRoom.floor_id) {
					rooms = rooms.filter((r) => r.id !== sourceRoom.id);
				}
				setTargetRooms(rooms);
			}
		} catch (err) {
			console.error("Error fetching target rooms:", err);
		} finally {
			setLoadingTargetRooms(false);
		}
	};

	const fetchTargetTables = async (roomId) => {
		setLoadingTargetTables(true);
		try {
			const res = await axiosInstance.get("floor-plan/tables", {
				params: { floor_id: targetFloorId },
			});
			if (res.data.success) {
				const tables = (res.data.tables || []).filter((t) => t.room_id == roomId);
				setTargetTables(tables);
			}
		} catch (err) {
			console.error("Error fetching tables:", err);
		} finally {
			setLoadingTargetTables(false);
		}
	};

	const handleSelectAll = (e) => {
		if (e.target.checked) {
			setSelectedChairIds(chairs.map((c) => c.id));
		} else {
			setSelectedChairIds([]);
		}
	};

	const handleSelectChair = (id) => {
		setSelectedChairIds((prev) => {
			if (prev.includes(id)) {
				return prev.filter((cid) => cid !== id);
			} else {
				return [...prev, id];
			}
		});
	};

	const handleSubmit = async () => {
		if (!targetRoomId) {
			setError("Please select a target room.");
			return;
		}

		if (!targetTableId) {
			setError("Please select a destination table.");
			return;
		}

		const moveAll = selectedChairIds.length === chairs.length && chairs.length > 0;

		if (selectedChairIds.length === 0) {
			setError("Please select at least one chair to move.");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			const payload = {
				source_room_id: sourceRoom.id,
				target_room_id: targetRoomId,
				move_all: moveAll,
			};

			if (!moveAll) {
				payload.chair_ids = selectedChairIds;
			}

			// target_table_id is now required by frontend logic, though backend might allow nullable.
			// We enforce it here as per user request.
			payload.target_table_id = targetTableId;

			const res = await axiosInstance.post("floor-plan/rooms/move-chairs", payload);
			if (res.data.success) {
				onMoveSuccess && onMoveSuccess();
				onClose();
			} else {
				setError(res.data.message || "Failed to move chairs.");
			}
		} catch (err) {
			console.error("Error moving chairs:", err);
			setError(err.response?.data?.message || "An error occurred while moving chairs.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const isAllSelected = chairs.length > 0 && selectedChairIds.length === chairs.length;

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle>Move Chairs from {sourceRoom?.name}</DialogTitle>
			<DialogContent dividers>
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				<Grid container spacing={2} sx={{ mb: 3 }}>
					<Grid item xs={12} sm={6}>
						<FormControl fullWidth>
							<InputLabel>Destination Floor</InputLabel>
							<Select value={targetFloorId} label="Destination Floor" onChange={(e) => setTargetFloorId(e.target.value)}>
								{floors.map((floor) => (
									<MenuItem key={floor.id} value={floor.id}>
										{floor.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6}>
						<FormControl fullWidth disabled={!targetFloorId || loadingTargetRooms}>
							<InputLabel>Destination Room</InputLabel>
							<Select value={targetRoomId} label="Destination Room" onChange={(e) => setTargetRoomId(e.target.value)}>
								{loadingTargetRooms ? (
									<MenuItem disabled>Loading...</MenuItem>
								) : targetRooms.length === 0 ? (
									<MenuItem disabled>No other rooms available</MenuItem>
								) : (
									targetRooms.map((room) => (
										<MenuItem key={room.id} value={room.id}>
											{room.name}
										</MenuItem>
									))
								)}
							</Select>
						</FormControl>
					</Grid>
					{/* Destination Table */}
					<Grid item xs={12} sm={6}>
						<FormControl fullWidth disabled={!targetRoomId || loadingTargetTables} required>
							<InputLabel>Destination Table</InputLabel>
							<Select value={targetTableId} label="Destination Table" onChange={(e) => setTargetTableId(e.target.value)}>
								{loadingTargetTables ? (
									<MenuItem disabled>Loading...</MenuItem>
								) : targetTables.length === 0 ? (
									<MenuItem disabled>No tables available</MenuItem>
								) : (
									targetTables.map((table) => (
										<MenuItem key={table.id} value={table.id}>
											{table.table_id || table.name || `Table #${table.id}`}
										</MenuItem>
									))
								)}
							</Select>
						</FormControl>
					</Grid>
				</Grid>

				<Box sx={{ mb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
					<Typography variant="subtitle1">
						Select Chairs to Move ({selectedChairIds.length}/{chairs.length})
					</Typography>
					<FormControlLabel control={<Checkbox checked={isAllSelected} onChange={handleSelectAll} />} label="Select All" />
				</Box>

				{loadingChairs ? (
					<Box display="flex" justifyContent="center" p={3}>
						<CircularProgress />
					</Box>
				) : chairs.length === 0 ? (
					<Typography color="textSecondary" align="center">
						No chairs found in this room.
					</Typography>
				) : (
					<Box sx={{ maxHeight: 300, overflowY: "auto", border: "1px solid #e0e0e0", borderRadius: 1, p: 2 }}>
						<Grid container spacing={1}>
							{chairs.map((chair) => (
								<Grid item xs={6} sm={4} md={3} key={chair.id}>
									<FormControlLabel
										control={<Checkbox checked={selectedChairIds.includes(chair.id)} onChange={() => handleSelectChair(chair.id)} size="small" />}
										label={`Chair ${chair.chair_id}` || `ID: ${chair.id}`}
										sx={{
											"& .MuiFormControlLabel-label": { fontSize: "0.875rem" },
											width: "100%",
										}}
									/>
								</Grid>
							))}
						</Grid>
					</Box>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={isSubmitting}>
					Cancel
				</Button>
				<Button onClick={handleSubmit} variant="contained" disabled={isSubmitting || selectedChairIds.length === 0 || !targetRoomId || !targetTableId}>
					{isSubmitting ? "Moving..." : "Move Chairs"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default MoveChairsModal;
