import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert, CircularProgress, Box } from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";

const EditTableModal = ({ open, onClose, table, onSuccess }) => {
	const [formData, setFormData] = useState({
		table_id: "",
		name: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);
	const [validationErrors, setValidationErrors] = useState({});

	useEffect(() => {
		if (open && table) {
			setFormData({
				table_id: table.table_id || "",
				name: table.name || "",
			});
			setError(null);
			setValidationErrors({});
		}
	}, [open, table]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// Clear specific validation error on change
		if (validationErrors[name]) {
			setValidationErrors((prev) => ({ ...prev, [name]: null }));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);
		setValidationErrors({});

		try {
			const res = await axiosInstance.put(`floor-plan/tables/${table.id}`, formData);
			if (res.data.success) {
				onSuccess("Table updated successfully.");
				onClose();
			} else {
				// Handle backend validation errors that might come as 200 OK with success: false (though typically 422)
				setError(res.data.message || "Failed to update table.");
			}
		} catch (err) {
			if (err.response && err.response.status === 422) {
				setValidationErrors(err.response.data.errors || {});
				setError("Please check the fields.");
			} else {
				setError(err.response?.data?.message || "An error occurred while updating the table.");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!table) return null;

	return (
		<Dialog open={open} onClose={() => !isSubmitting && onClose()} maxWidth="sm" fullWidth>
			<DialogTitle>Edit Table</DialogTitle>
			<form onSubmit={handleSubmit}>
				<DialogContent dividers>
					{error && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}

					<Box mb={2}>
						<TextField fullWidth label="Table ID (Short Code)" name="table_id" value={formData.table_id} onChange={handleChange} error={!!validationErrors.table_id} helperText={validationErrors.table_id ? validationErrors.table_id[0] : "Max 10 characters. Must be unique for this floor."} disabled={isSubmitting} inputProps={{ maxLength: 10 }} />
					</Box>

					<Box mb={2}>
						<TextField fullWidth label="Table Name" name="name" value={formData.name} onChange={handleChange} error={!!validationErrors.name} helperText={validationErrors.name && validationErrors.name[0]} disabled={isSubmitting} />
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

export default EditTableModal;
