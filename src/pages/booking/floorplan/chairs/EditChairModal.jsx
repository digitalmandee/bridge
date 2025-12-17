import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert, CircularProgress, Box, Typography } from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";

const EditChairModal = ({ open, onClose, chair, onSuccess }) => {
	const [formData, setFormData] = useState({
		positionx: "",
		positiony: "",
		rotation: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (open && chair) {
			setFormData({
				positionx: chair.position?.x ?? chair.positionx ?? 0,
				positiony: chair.position?.y ?? chair.positiony ?? 0,
				rotation: chair.rotation ?? 0,
			});
			setError(null);
		}
	}, [open, chair]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			const res = await axiosInstance.put(`floor-plan/chairs/${chair.id}`, formData);
			if (res.data.success) {
				onSuccess("Chair updated successfully.");
				onClose();
			} else {
				setError(res.data.message || "Failed to update chair.");
			}
		} catch (err) {
			console.error(err);
			setError(err.response?.data?.message || "An error occurred while updating the chair.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!chair) return null;

	return (
		<Dialog open={open} onClose={() => !isSubmitting && onClose()} maxWidth="sm" fullWidth>
			<DialogTitle>
				Edit Chair Position
				<Typography variant="subtitle1" color="textSecondary" sx={{ mt: 1, fontWeight: "medium" }}>
					{chair.floor?.name} &nbsp;|&nbsp; Table: {chair.table?.table_id} &nbsp;|&nbsp; Chair: {chair.chair_id}
				</Typography>
			</DialogTitle>
			<form onSubmit={handleSubmit}>
				<DialogContent dividers>
					{error && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}

					<Box display="flex" gap={2} mb={2}>
						<TextField fullWidth label="Position X" name="positionx" type="number" value={formData.positionx} onChange={handleChange} disabled={isSubmitting} />
						<TextField fullWidth label="Position Y" name="positiony" type="number" value={formData.positiony} onChange={handleChange} disabled={isSubmitting} />
					</Box>

					<Box mb={2}>
						<TextField fullWidth label="Rotation (0-360)" name="rotation" type="number" value={formData.rotation} onChange={handleChange} disabled={isSubmitting} inputProps={{ min: 0, max: 360 }} />
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} disabled={isSubmitting}>
						Cancel
					</Button>
					<Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
						{isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default EditChairModal;
