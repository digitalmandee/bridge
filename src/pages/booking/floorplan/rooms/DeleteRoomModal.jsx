import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, FormControl, InputLabel, Select, MenuItem, Alert, Box, CircularProgress } from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";

const DeleteRoomModal = ({ open, onClose, room, floors, onSuccess }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);
	const [step, setStep] = useState("confirm"); // 'confirm', 'move', 'delete'

	// Move logic state
	const [targetFloorId, setTargetFloorId] = useState("");
	const [targetRooms, setTargetRooms] = useState([]);
	const [targetRoomId, setTargetRoomId] = useState("");

	// Target Tables state
	const [targetTables, setTargetTables] = useState([]);
	const [targetTableId, setTargetTableId] = useState("");
	const [loadingTargetTables, setLoadingTargetTables] = useState(false);

	const [loadingTargetRooms, setLoadingTargetRooms] = useState(false);

	const hasTables = room?.tables_count > 0;
	const hasChairs = room?.chairs_count > 0;

	useEffect(() => {
		if (open && room) {
			// Reset state
			setError(null);
			setTargetFloorId(room.floor_id); // Default to current floor
			setTargetRoomId("");
			setTargetRooms([]);
			setTargetTableId("");
			setTargetTables([]);

			// Determine initial step
			if (hasTables || hasChairs) {
				setStep("move");
				// Fetch rooms for default floor immediately
				fetchTargetRooms(room.floor_id);
			} else {
				setStep("confirm");
			}
		}
	}, [open, room]);

	useEffect(() => {
		if (targetFloorId && step === "move") {
			fetchTargetRooms(targetFloorId);
		}
	}, [targetFloorId]);

	useEffect(() => {
		if (targetRoomId && step === "move" && !hasTables && hasChairs) {
			// Only fetch tables if we are moving chairs explicitly
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
				// Filter out the room being deleted
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
			// Fetch tables for the specific floor and filter by room client-side if needed
			// Assuming getTables endpoint is typically 'floor-plan/tables'
			const res = await axiosInstance.get("floor-plan/tables", {
				params: { floor_id: targetFloorId },
			});

			if (res.data.success) {
				// Filter by room_id
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
				// Move Tables (and their chairs implicitly)
				const movePayload = {
					source_room_id: room.id,
					target_room_id: targetRoomId,
					move_all: true,
				};
				const moveRes = await axiosInstance.post("floor-plan/rooms/move-tables", movePayload);
				if (!moveRes.data.success) throw new Error(moveRes.data.message || "Failed to move tables.");
			} else if (hasChairs) {
				// Move Chairs only
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

			// 2. Delete Room
			const deleteRes = await axiosInstance.delete(`floor-plan/rooms/${room.id}`);
			if (deleteRes.data.success) {
				onSuccess("Contents moved and room deleted successfully.");
				onClose();
			} else {
				throw new Error(deleteRes.data.message || "Contents moved, but failed to delete room.");
			}
		} catch (err) {
			console.error(err);
			setError(err.message || "An error occurred during the process.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!room) return null;

	return (
		<Dialog open={open} onClose={() => !isSubmitting && onClose()} maxWidth="sm" fullWidth>
			<DialogTitle>{step === "move" ? (hasTables ? "Room has Tables" : "Room has Chairs") : "Confirm Deletion"}</DialogTitle>
			<DialogContent dividers>
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				{step === "confirm" && (
					<Typography>
						Are you sure you want to delete <strong>{room.name}</strong>? This action cannot be undone.
					</Typography>
				)}

				{step === "move" && (
					<Box>
						<Alert severity="warning" sx={{ mb: 2 }}>
							This room contains <strong>{hasTables ? `${room.tables_count} tables` : `${room.chairs_count} chairs`}</strong>. You must move them to another room before deleting.
						</Alert>
						<Typography variant="subtitle1" gutterBottom>
							Select a destination:
						</Typography>

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

						{/* Only show Table selection if we are moving CHAIRS (not tables) and targetRoom is selected */}
						{!hasTables && hasChairs && targetRoomId && (
							<FormControl fullWidth margin="normal" disabled={loadingTargetTables}>
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
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={isSubmitting}>
					Cancel
				</Button>

				{step === "confirm" ? (
					<Button onClick={handleDeleteOnly} color="error" variant="contained" disabled={isSubmitting}>
						{isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Delete Room"}
					</Button>
				) : (
					<Button onClick={handleMoveAndDelete} color="primary" variant="contained" disabled={isSubmitting || !targetRoomId}>
						{isSubmitting ? <CircularProgress size={24} color="inherit" /> : hasTables ? "Move Tables & Delete" : "Move Chairs & Delete"}
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
};

export default DeleteRoomModal;
