import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, FormControl, InputLabel, Select, MenuItem, Alert, Box, CircularProgress, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";

const DeleteTableModal = ({ open, onClose, table, floors, onSuccess }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);
	const [action, setAction] = useState("move"); // 'move' or 'delete_all'

	// Move logic state
	const [targetFloorId, setTargetFloorId] = useState("");
	const [targetRooms, setTargetRooms] = useState([]);
	const [targetRoomId, setTargetRoomId] = useState("");
	const [loadingTargetRooms, setLoadingTargetRooms] = useState(false);

	const hasChairs = table?.chairs_count > 0;

	useEffect(() => {
		if (open && table) {
			// Reset state
			setError(null);
			setAction("move");
			setTargetFloorId(table.floor_id); // Default to current floor
			setTargetRoomId("");
			setTargetRooms([]);

			if (hasChairs) {
				fetchTargetRooms(table.floor_id);
			}
		}
	}, [open, table]);

	useEffect(() => {
		if (targetFloorId && open) {
			fetchTargetRooms(targetFloorId);
		}
	}, [targetFloorId]);

	const fetchTargetRooms = async (floorId) => {
		setLoadingTargetRooms(true);
		try {
			const res = await axiosInstance.get("floor-plan/rooms", {
				params: { floor_id: floorId },
			});
			if (res.data.success) {
				setTargetRooms(res.data.rooms || []);
			}
		} catch (err) {
			console.error("Error fetching rooms:", err);
		} finally {
			setLoadingTargetRooms(false);
		}
	};

	const handleDeleteAll = async () => {
		setIsSubmitting(true);
		setError(null);
		try {
			const res = await axiosInstance.delete(`floor-plan/tables/${table.id}`);
			if (res.data.success) {
				onSuccess("Table deleted successfully.");
				onClose();
			} else {
				setError(res.data.message || "Failed to delete table.");
			}
		} catch (err) {
			setError(err.response?.data?.message || "An error occurred while deleting the table.");
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
			// 1. Move Chairs
			// We need to fetch chair IDs for this table first, OR use a bulk move endpoint if available.
			// The current `move-chairs` endpoint takes `chair_ids` array or `move_all` for a ROOM.
			// It doesn't seem to support "move all chairs from TABLE X".
			// Let's check `RoomController::moveChairs` signature again or `moveTables`.
			// Actually, we are moving CHAIRS from a TABLE.
			// Re-reading `RoomController.php`: `moveChairs` takes `chair_ids`, `source_room_id`.
			// It updates `room_id` and `floor_id`. It can take `target_table_id`.
			// BUT: We want to move chairs FROM a table.
			// If we use `Chair` model directly on backend it's easier, but we are on frontend.
			// We need to fetch chairs for this table first.

			// Fetch chairs for the table
			const chairRes = await axiosInstance.get("floor-plan/chairs", {
				params: {
					floor_id: table.floor_id,
					// api might support table_id filter or we filter client side
				},
			});

			let chairIds = [];
			if (chairRes.data.success) {
				const allChairs = chairRes.data.chairs || [];
				// Filter chairs belonging to this table
				chairIds = allChairs.filter((c) => c.table_id === table.id).map((c) => c.id);
			}

			if (chairIds.length > 0) {
				const movePayload = {
					source_room_id: table.room_id, // Chairs are in this room currently
					target_room_id: targetRoomId,
					chair_ids: chairIds,
					// target_table_id: ... optional if we want to move to another table
				};

				const moveRes = await axiosInstance.post("floor-plan/rooms/move-chairs", movePayload);
				if (!moveRes.data.success) throw new Error(moveRes.data.message || "Failed to move chairs.");
			}

			// 2. Delete Table
			await handleDeleteAll();
		} catch (err) {
			console.error(err);
			setError(err.message || "An error occurred during the process.");
			setIsSubmitting(false);
		}
	};

	if (!table) return null;

	return (
		<Dialog open={open} onClose={() => !isSubmitting && onClose()} maxWidth="sm" fullWidth>
			<DialogTitle>Delete Table: {table.name}</DialogTitle>
			<DialogContent dividers>
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				{!hasChairs ? (
					<Typography>Are you sure you want to delete this table? This action cannot be undone.</Typography>
				) : (
					<Box>
						<Alert severity="warning" sx={{ mb: 2 }}>
							This table has <strong>{table.chairs_count} chairs</strong>.
						</Alert>

						<Typography gutterBottom>What would you like to do with the chairs?</Typography>

						<RadioGroup value={action} onChange={(e) => setAction(e.target.value)} sx={{ mb: 2 }}>
							<FormControlLabel value="move" control={<Radio />} label="Move chairs to another room" />
							<FormControlLabel value="delete_all" control={<Radio color="error" />} label={<Typography color="error">Delete table AND chairs</Typography>} />
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
							</Box>
						)}

						{action === "delete_all" && (
							<Alert severity="error">
								Warning: <strong>{table.chairs_count} chairs</strong> will be permanently deleted along with the table.
							</Alert>
						)}
					</Box>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={isSubmitting}>
					Cancel
				</Button>

				{!hasChairs ? (
					<Button onClick={handleDeleteAll} color="error" variant="contained" disabled={isSubmitting}>
						{isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Delete Table"}
					</Button>
				) : (
					<Button onClick={action === "delete_all" ? handleDeleteAll : handleMoveAndDelete} color={action === "delete_all" ? "error" : "primary"} variant="contained" disabled={isSubmitting || (action === "move" && !targetRoomId)}>
						{isSubmitting ? <CircularProgress size={24} color="inherit" /> : action === "delete_all" ? "Delete All" : "Move & Delete"}
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
};

export default DeleteTableModal;
