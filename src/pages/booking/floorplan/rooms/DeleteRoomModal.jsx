import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, FormControl, InputLabel, Select, MenuItem, Alert, Box, CircularProgress, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";

const DeleteRoomModal = ({ open, onClose, room, floors, onSuccess }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);
	const [action, setAction] = useState("move"); // 'move' or 'delete_all'

	// Move logic state
	const [targetFloorId, setTargetFloorId] = useState("");
	const [targetRooms, setTargetRooms] = useState([]);
	const [targetRoomId, setTargetRoomId] = useState("");

	// Target Tables state (for moving chairs only)
	const [targetTables, setTargetTables] = useState([]);
	const [targetTableId, setTargetTableId] = useState("");
	const [loadingTargetTables, setLoadingTargetTables] = useState(false);
	const [loadingTargetRooms, setLoadingTargetRooms] = useState(false);

	const hasTables = room?.tables_count > 0;
	const hasChairs = room?.chairs_count > 0;
	const hasContents = hasTables || hasChairs;

	useEffect(() => {
		if (open && room) {
			// Reset state
			setError(null);
			setAction("move");
			setTargetFloorId(room.floor_id);
			setTargetRoomId("");
			setTargetRooms([]);
			setTargetTableId("");
			setTargetTables([]);

			if (hasContents) {
				fetchTargetRooms(room.floor_id);
			}
		}
	}, [open, room]);

	useEffect(() => {
		if (targetFloorId && open && hasContents) {
			fetchTargetRooms(targetFloorId);
		}
	}, [targetFloorId]);

	useEffect(() => {
		if (targetRoomId && action === "move" && !hasTables && hasChairs) {
			fetchTargetTables(targetRoomId);
		} else {
			setTargetTables([]);
		}
	}, [targetRoomId]);

	const fetchTargetRooms = async (floorId) => {
		setLoadingTargetRooms(true);
		try {
			const res = await axiosInstance.get("floor-plan/rooms", {
				params: { floor_id: floorId },
			});
			if (res.data.success) {
				const filteredRooms = (res.data.rooms || []).filter((r) => r.id !== room.id);
				setTargetRooms(filteredRooms);
			}
		} catch (err) {
			console.error("Error fetching available rooms:", err);
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
			console.error("Error fetching target tables:", err);
		} finally {
			setLoadingTargetTables(false);
		}
	};

	const handleDeleteOnly = async () => {
		setIsSubmitting(true);
		setError(null);
		try {
			const res = await axiosInstance.delete(`floor-plan/rooms/${room.id}`);
			if (res.data.success) {
				onSuccess("Room deleted successfully.");
				onClose();
			} else {
				setError(res.data.message || "Failed to delete room.");
			}
		} catch (err) {
			setError(err.response?.data?.message || "An error occurred while deleting the room.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleMoveAndDelete = async () => {
		if (!targetRoomId) {
			setError("Please select a target room.");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			if (hasTables) {
				// Move Tables
				const movePayload = {
					source_room_id: room.id,
					target_room_id: targetRoomId,
					move_all: true,
				};
				const moveRes = await axiosInstance.post("floor-plan/rooms/move-tables", movePayload);
				if (!moveRes.data.success) throw new Error(moveRes.data.message || "Failed to move tables.");
			} else if (hasChairs) {
				// Move Chairs
				const movePayload = {
					source_room_id: room.id,
					target_room_id: targetRoomId,
					move_all: true,
				};
				if (targetTableId) {
					movePayload.target_table_id = targetTableId;
				}

				const moveRes = await axiosInstance.post("floor-plan/rooms/move-chairs", movePayload);
				if (!moveRes.data.success) throw new Error(moveRes.data.message || "Failed to move chairs.");
			}

			// After moving, call delete.
			await handleDeleteOnly();
		} catch (err) {
			console.error(err);
			setError(err.message || "An error occurred during the process.");
			setIsSubmitting(false);
		}
	};

	if (!room) return null;

	return (
		<Dialog open={open} onClose={() => !isSubmitting && onClose()} maxWidth="sm" fullWidth>
			<DialogTitle>{hasContents ? (hasTables ? "Room has Tables" : "Room has Chairs") : "Confirm Deletion"}</DialogTitle>
			<DialogContent dividers>
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				{!hasContents ? (
					<Typography>
						Are you sure you want to delete <strong>{room.name}</strong>? This action cannot be undone.
					</Typography>
				) : (
					<Box>
						<Alert severity="warning" sx={{ mb: 2 }}>
							This room contains <strong>{hasTables ? `${room.tables_count} tables` : `${room.chairs_count} chairs`}</strong>.
						</Alert>

						<Typography gutterBottom>What would you like to do with the contents?</Typography>

						<RadioGroup value={action} onChange={(e) => setAction(e.target.value)} sx={{ mb: 2 }}>
							<FormControlLabel value="move" control={<Radio />} label="Move contents to another room" />
							<FormControlLabel value="delete_all" control={<Radio color="error" />} label={<Typography color="error">Delete room AND contents</Typography>} />
						</RadioGroup>

						{action === "move" && (
							<Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
								<Typography variant="subtitle2" gutterBottom>
									Move to:
								</Typography>
								<FormControl fullWidth margin="dense">
									<InputLabel>Destination Floor</InputLabel>
									<Select value={targetFloorId} label="Destination Floor" onChange={(e) => setTargetFloorId(e.target.value)}>
										{floors.map((floor) => (
											<MenuItem key={floor.id} value={floor.id}>
												{floor.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>

								<FormControl fullWidth margin="dense" disabled={!targetFloorId || loadingTargetRooms}>
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

								{!hasTables && hasChairs && targetRoomId && (
									<FormControl fullWidth margin="dense" disabled={loadingTargetTables}>
										<InputLabel>Assign to Table (Optional)</InputLabel>
										<Select value={targetTableId} label="Assign to Table (Optional)" onChange={(e) => setTargetTableId(e.target.value)}>
											<MenuItem value="">
												<em>None (Unassigned)</em>
											</MenuItem>
											{loadingTargetTables ? (
												<MenuItem disabled>Loading...</MenuItem>
											) : targetTables.length === 0 ? (
												<MenuItem disabled>No tables in this room</MenuItem>
											) : (
												targetTables.map((t) => (
													<MenuItem key={t.id} value={t.id}>
														{t.name}
													</MenuItem>
												))
											)}
										</Select>
									</FormControl>
								)}
							</Box>
						)}

						{action === "delete_all" && (
							<Alert severity="error">
								Warning: <strong>{hasTables ? `${room.tables_count} tables` : `${room.chairs_count} chairs`}</strong> will also be permanently deleted.
							</Alert>
						)}
					</Box>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={isSubmitting}>
					Cancel
				</Button>

				{!hasContents ? (
					<Button onClick={handleDeleteOnly} color="error" variant="contained" disabled={isSubmitting}>
						{isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Delete Room"}
					</Button>
				) : (
					<Button onClick={action === "delete_all" ? handleDeleteOnly : handleMoveAndDelete} color={action === "delete_all" ? "error" : "primary"} variant="contained" disabled={isSubmitting || (action === "move" && !targetRoomId)}>
						{isSubmitting ? <CircularProgress size={24} color="inherit" /> : action === "delete_all" ? "Delete All" : "Move & Delete"}
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
};

export default DeleteRoomModal;
