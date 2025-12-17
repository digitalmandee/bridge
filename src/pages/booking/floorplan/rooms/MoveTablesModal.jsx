import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, CircularProgress, Box, Alert } from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";

const MoveTablesModal = ({ open, onClose, sourceRoom, floors, onMoveSuccess }) => {
	const [tables, setTables] = useState([]);
	const [selectedTableIds, setSelectedTableIds] = useState([]);
	const [selectAll, setSelectAll] = useState(false);

	// Target Selection
	const [targetFloorId, setTargetFloorId] = useState("");
	const [targetRooms, setTargetRooms] = useState([]);
	const [targetRoomId, setTargetRoomId] = useState("");

	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [loadingTargetRooms, setLoadingTargetRooms] = useState(false);

	useEffect(() => {
		if (open) {
			setSelectedTableIds([]);
			setTargetFloorId("");
			setTargetRoomId("");
			setTargetRooms([]);
			setSelectAll(false);
			if (sourceRoom) {
				setTargetFloorId(sourceRoom.floor_id);
			}
		}
	}, [open, sourceRoom]);

	useEffect(() => {
		if (sourceRoom && open) {
			fetchTables();
		}
	}, [sourceRoom, open]);

	useEffect(() => {
		if (targetFloorId) {
			fetchTargetRooms(targetFloorId);
		} else {
			setTargetRooms([]);
		}
	}, [targetFloorId]);

	const fetchTables = async () => {
		if (!sourceRoom) return;
		setIsLoading(true);
		try {
			// Need to ensure there is an endpoint to fetch tables for a specific room.
			// Assuming `floor-plan/tables?room_id=...` works or creating logic to handle it.
			// Looking at previous exploration, Filter logic might be client side if API doesn't filter.
			// Let's assume typical behavior first.
			const res = await axiosInstance.get(`floor-plan/tables`, {
				params: {
					room_id: sourceRoom.id,
				},
			});

			if (res.data.success) {
				// If API returns all for floor, we filter. If API supports room_id, it returns specific.
				// To be safe against "returns all for floor", filter by room_id client side too.
				const roomTables = (res.data.tables || []).filter((t) => t.room_id === sourceRoom.id);
				setTables(roomTables);
			}
		} catch (error) {
			console.error("Error fetching tables:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchTargetRooms = async (floorId) => {
		setLoadingTargetRooms(true);
		try {
			const res = await axiosInstance.get("floor-plan/rooms", {
				params: { floor_id: floorId },
			});
			if (res.data.success) {
				const filtered = (res.data.rooms || []).filter((r) => r.id !== sourceRoom.id);
				setTargetRooms(filtered);
			}
		} catch (err) {
			console.error("Error fetching rooms:", err);
		} finally {
			setLoadingTargetRooms(false);
		}
	};

	const handleSelectAll = (checked) => {
		setSelectAll(checked);
		if (checked) {
			setSelectedTableIds(tables.map((t) => t.id));
		} else {
			setSelectedTableIds([]);
		}
	};

	const handleSelectTable = (id) => {
		const newSelected = selectedTableIds.includes(id) ? selectedTableIds.filter((tid) => tid !== id) : [...selectedTableIds, id];

		setSelectedTableIds(newSelected);
		setSelectAll(newSelected.length === tables.length);
	};

	const handleSubmit = async () => {
		if (!targetRoomId) {
			return;
		}
		if (!selectAll && selectedTableIds.length === 0) {
			return;
		}

		setIsSubmitting(true);
		try {
			const payload = {
				source_room_id: sourceRoom.id,
				target_room_id: targetRoomId,
				move_all: selectAll,
			};

			if (!selectAll) {
				payload.table_ids = selectedTableIds;
			}

			const res = await axiosInstance.post("floor-plan/rooms/move-tables", payload);
			if (res.data.success) {
				onMoveSuccess();
				onClose();
			}
		} catch (error) {
			console.error("Error moving tables:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onClose={() => !isSubmitting && onClose()} maxWidth="md" fullWidth>
			<DialogTitle>Move Tables from {sourceRoom?.name}</DialogTitle>
			<DialogContent dividers>
				{/* 1. Target Selection */}
				<Box mb={3}>
					<FormControl fullWidth margin="normal">
						<InputLabel>Destination Floor</InputLabel>
						<Select value={targetFloorId} label="Destination Floor" onChange={(e) => setTargetFloorId(e.target.value)}>
							{floors.map((floor) => (
								<MenuItem key={floor.id} value={floor.id}>
									{floor.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl fullWidth margin="normal" disabled={!targetFloorId || loadingTargetRooms}>
						<InputLabel>Destination Room</InputLabel>
						<Select value={targetRoomId} label="Destination Room" onChange={(e) => setTargetRoomId(e.target.value)}>
							{loadingTargetRooms ? (
								<MenuItem disabled>Loading...</MenuItem>
							) : targetRooms.length === 0 ? (
								<MenuItem disabled>No available rooms</MenuItem>
							) : (
								targetRooms.map((r) => (
									<MenuItem key={r.id} value={r.id}>
										{r.name}
									</MenuItem>
								))
							)}
						</Select>
					</FormControl>
				</Box>

				{/* 2. Table Selection */}
				<Box>
					<Alert severity="info" sx={{ mb: 2 }}>
						Note: Moving tables will automatically move all chairs associated with them to the new room.
					</Alert>

					<Box display="flex" alignItems="center" mb={1} justifyContent="space-between">
						<strong>Select Tables</strong>
						<Checkbox checked={selectAll} onChange={(e) => handleSelectAll(e.target.checked)} disabled={isLoading || tables.length === 0} />
					</Box>
					{isLoading ? (
						<CircularProgress size={20} />
					) : tables.length === 0 ? (
						<Box color="text.secondary">No tables found in this room.</Box>
					) : (
						<Box sx={{ maxHeight: 300, overflowY: "auto", border: "1px solid #eee", borderRadius: 1 }}>
							{tables.map((table) => (
								<Box
									key={table.id}
									sx={{
										p: 1,
										borderBottom: "1px solid #f0f0f0",
										display: "flex",
										alignItems: "center",
										"&:hover": { bgcolor: "#f9f9f9" },
									}}>
									<Checkbox checked={selectedTableIds.includes(table.id)} onChange={() => handleSelectTable(table.id)} />
									<ListItemText primary={table.table_id || table.name || `Table #${table.id}`} />
								</Box>
							))}
						</Box>
					)}
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={isSubmitting}>
					Cancel
				</Button>
				<Button onClick={handleSubmit} variant="contained" disabled={isSubmitting || !targetRoomId || (!selectAll && selectedTableIds.length === 0)}>
					{isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Move Tables"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default MoveTablesModal;
