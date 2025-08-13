import React, { useEffect, useState } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Pagination, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Snackbar, Alert, IconButton } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import axiosInstance from "@/utils/axiosInstance";
import colors from "@/assets/styles/color";

const Kitchen = () => {
	const navigate = useNavigate();
	const [kitchens, setKitchens] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit] = useState(10);
	const [open, setOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deleteKitchenId, setDeleteKitchenId] = useState(null);
	const [editKitchen, setEditKitchen] = useState(null);

	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [photo, setPhoto] = useState(null);
	const [photoPreview, setPhotoPreview] = useState("");

	const [error, setError] = useState({ name: "", price: "" });
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success",
	});

	useEffect(() => {
		fetchKitchens(currentPage);
	}, [currentPage]);

	const fetchKitchens = async (page = 1) => {
		setIsLoading(true);
		try {
			const res = await axiosInstance.get("kitchens", { params: { page, limit } });
			if (res.data.success) {
				const kitchensData = res.data.kitchens.data.map((kitchen) => ({
					...kitchen,
					price: Number(kitchen.price),
				}));
				setKitchens(kitchensData);
				setTotalPages(res.data.kitchens.last_page);
				setCurrentPage(res.data.kitchens.current_page);
			} else {
				throw new Error("API response unsuccessful");
			}
		} catch (error) {
			console.error("Error fetching kitchens:", error);
			setSnackbar({ open: true, message: "Error fetching kitchens!", severity: "error" });
		} finally {
			setIsLoading(false);
		}
	};

	const handleOpen = (kitchen = null) => {
		if (kitchen) {
			setEditKitchen(kitchen);
			setName(kitchen.name);
			setPrice(kitchen.price.toString());
			setPhotoPreview(kitchen.photo ? import.meta.env.VITE_ASSET_API + kitchen.photo : "");
		} else {
			setEditKitchen(null);
			setName("");
			setPrice("");
			setPhoto(null);
			setPhotoPreview("");
		}
		setError({ name: "", price: "" });
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setError({ name: "", price: "" });
		setName("");
		setPrice("");
		setPhoto(null);
		setPhotoPreview("");
	};

	const validateForm = () => {
		const newError = { name: "", price: "" };
		let isValid = true;

		if (!name.trim()) {
			newError.name = "Kitchen name is required";
			isValid = false;
		}
		if (!price.trim()) {
			newError.price = "Price is required";
			isValid = false;
		} else if (isNaN(price) || Number(price) <= 0) {
			newError.price = "Price must be a positive number";
			isValid = false;
		}

		setError(newError);
		return isValid;
	};

	const handlePhotoChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setPhoto(file);
			setPhotoPreview(URL.createObjectURL(file));
		}
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		setIsSaving(true);
		try {
			const formData = new FormData();
			formData.append("name", name);
			formData.append("price", Number(price));
			if (photo) formData.append("photo", photo);

			if (editKitchen) {
				await axiosInstance.post(`kitchens/${editKitchen.id}?_method=PUT`, formData, {
					headers: { "Content-Type": "multipart/form-data" },
				});
				setSnackbar({ open: true, message: "Kitchen updated successfully!", severity: "success" });
			} else {
				await axiosInstance.post("kitchens", formData, {
					headers: { "Content-Type": "multipart/form-data" },
				});
				setSnackbar({ open: true, message: "Kitchen added successfully!", severity: "success" });
			}

			fetchKitchens();
			handleClose();
		} catch (error) {
			console.error("Error saving kitchen:", error);
			setSnackbar({ open: true, message: "Error saving kitchen!", severity: "error" });
		} finally {
			setIsSaving(false);
		}
	};

	const openDeleteDialog = (kitchenId) => {
		setDeleteKitchenId(kitchenId);
		setDeleteDialogOpen(true);
	};

	const closeDeleteDialog = () => {
		setDeleteDialogOpen(false);
		setDeleteKitchenId(null);
	};

	const handleDelete = async () => {
		try {
			await axiosInstance.delete(`kitchens/${deleteKitchenId}`);
			setSnackbar({ open: true, message: "Kitchen deleted successfully!", severity: "success" });
			fetchKitchens();
		} catch (error) {
			console.error("Error deleting kitchen:", error);
			setSnackbar({ open: true, message: "Error deleting kitchen!", severity: "error" });
		} finally {
			closeDeleteDialog();
		}
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	return (
		<>
			<TopNavbar />
			<div className="main d-flex">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div className="container-fluid py-4">
						{/* Header */}
						<div className="row mb-4 align-items-center">
							<div className="col-auto d-flex align-items-center">
								<div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
									<MdArrowBackIos style={{ fontSize: "20px" }} />
								</div>
								<Typography variant="h5" className="mb-0 ms-2" style={{ fontSize: "30px", color: "#202224" }}>
									Products and Services
								</Typography>
							</div>
							<div className="col-auto ms-auto">
								<Button variant="contained" sx={{ bgcolor: colors.primary, borderRadius: "10px", "&:hover": { bgcolor: colors.primary } }} onClick={() => handleOpen()}>
									New Kitchen
								</Button>
							</div>
						</div>

						{/* Table */}
						<TableContainer component={Paper} sx={{ boxShadow: "none" }}>
							<Table>
								<TableHead sx={{ bgcolor: "#F8FAFC" }}>
									<TableRow>
										<TableCell>Photo</TableCell>
										<TableCell>Items</TableCell>
										<TableCell>Price</TableCell>
										<TableCell>Action</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{isLoading ? (
										<TableRow>
											<TableCell colSpan={4} align="center">
												<CircularProgress sx={{ color: "#0F172A" }} />
											</TableCell>
										</TableRow>
									) : kitchens.length > 0 ? (
										kitchens.map((kitchen) => (
											<TableRow key={kitchen.id}>
												<TableCell>{kitchen.photo ? <img src={import.meta.env.VITE_ASSET_API + kitchen.photo} alt="kitchen" width="60" height="60" style={{ borderRadius: 8 }} /> : "No Photo"}</TableCell>
												<TableCell>{kitchen.name}</TableCell>
												<TableCell>Rs. {Number(kitchen.price).toFixed(2)}</TableCell>
												<TableCell>
													<Button onClick={() => handleOpen(kitchen)} color="primary">
														Edit
													</Button>
													<Button onClick={() => openDeleteDialog(kitchen.id)} color="secondary">
														Delete
													</Button>
												</TableCell>
											</TableRow>
										))
									) : (
										<TableRow>
											<TableCell colSpan={4} align="center">
												No kitchens found.
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>

						{/* Pagination */}
						<div className="d-flex justify-content-end mt-4">
							<Pagination count={totalPages} page={currentPage} onChange={(e, page) => setCurrentPage(page)} shape="rounded" />
						</div>
					</div>
				</div>
			</div>

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteDialogOpen} onClose={closeDeleteDialog} maxWidth="xs" fullWidth>
				<DialogTitle>Confirm Delete</DialogTitle>
				<DialogContent>Are you sure you want to delete this kitchen?</DialogContent>
				<DialogActions>
					<Button onClick={closeDeleteDialog} color="secondary">
						Cancel
					</Button>
					<Button onClick={handleDelete} variant="contained" color="error">
						Delete
					</Button>
				</DialogActions>
			</Dialog>

			{/* Add/Edit Kitchen Modal */}
			<Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
				<DialogTitle>{editKitchen ? "Edit Kitchen" : "New Kitchen"}</DialogTitle>
				<DialogContent>
					<TextField fullWidth label="Kitchen Items" variant="outlined" margin="normal" value={name} onChange={(e) => setName(e.target.value)} error={!!error.name} helperText={error.name} />
					<TextField fullWidth label="Price" variant="outlined" margin="normal" type="number" value={price} onChange={(e) => setPrice(e.target.value)} error={!!error.price} helperText={error.price} inputProps={{ min: "0", step: "0.01" }} />

					{/* Photo Upload */}
					<div style={{ marginTop: 16 }}>
						<Button variant="outlined" component="label" startIcon={<PhotoCamera />}>
							{photo ? "Change Photo" : "Upload Photo"}
							<input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
						</Button>
						{photoPreview && (
							<div style={{ marginTop: 10 }}>
								<img src={photoPreview} alt="preview" style={{ width: "100%", maxHeight: 200, borderRadius: 8, objectFit: "cover" }} />
							</div>
						)}
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="secondary">
						Cancel
					</Button>
					<Button sx={{ bgcolor: colors.primary }} onClick={handleSubmit} variant="contained" disabled={isSaving}>
						{isSaving ? <CircularProgress size={24} color="inherit" /> : editKitchen ? "Update" : "Save"}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Snackbar */}
			<Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
				<Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
					{snackbar.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default Kitchen;
