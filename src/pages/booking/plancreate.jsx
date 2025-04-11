import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import TopNavbar from "../../components/topNavbar";
import Sidebar from "../../components/leftSideBar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Button, Snackbar, Alert } from "@mui/material";
import colors from "@/assets/styles/color";
import axiosInstance from "@/utils/axiosInstance";

const PlanCreate = () => {
	const { branch } = useParams();

	const [form, setForm] = useState({
		name: "",
		type: "monthly",
		price: 0,
		discount: 0,
		bookingHours: "",
		printingPapers: "",
	});
	const [errors, setErrors] = useState({});
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (field, value) => {
		setForm((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => ({ ...prev, [field]: "" }));
	};

	const validate = () => {
		const newErrors = {};
		if (!form.name.trim()) newErrors.name = "Name is required";
		if (!form.type) newErrors.type = "Type is required";
		if (!form.price || form.price <= 0) newErrors.price = "Price must be greater than 0";

		if (form.type === "monthly") {
			if (!form.bookingHours || isNaN(form.bookingHours) || Number(form.bookingHours) <= 0) {
				newErrors.bookingHours = "Booking Hours must be a number greater than 0";
			}
			if (!form.printingPapers || isNaN(form.printingPapers) || Number(form.printingPapers) <= 0) {
				newErrors.printingPapers = "Printing Papers must be a number greater than 0";
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validate()) return;

		setIsLoading(true);
		try {
			const payload = {
				name: form.name,
				type: form.type,
				price: form.price,
				discount: form.discount,
				...(form.type === "monthly" && {
					booking_hours: Number(form.bookingHours),
					printing_papers: Number(form.printingPapers),
				}),
			};

			const res = await axiosInstance.post("booking-plans", payload);
			if (res.data.success) {
				setSnackbar({ open: true, message: "Plan created successfully!", severity: "success" });
				setForm({ name: "", type: "monthly", price: 0, discount: 0, bookingHours: "", printingPapers: "" });
			} else {
				throw new Error("Failed to create plan");
			}
		} catch (err) {
			setSnackbar({ open: true, message: err.response?.data?.message || "Error occurred", severity: "error" });
		} finally {
			setIsLoading(false);
		}
	};

	const renderInput = (label, name, type = "text", placeholder = "", props = {}) => (
		<div className="col-12 mb-3">
			<label className="mb-1">{label}</label>
			<input type={type} className="form-control" placeholder={placeholder} value={form[name]} onChange={(e) => handleChange(name, type === "number" ? e.target.valueAsNumber : e.target.value)} {...props} />
			{errors[name] && <span className="text-danger">{errors[name]}</span>}
		</div>
	);

	return (
		<>
			<TopNavbar />
			<div className="main">
				<div className="sidebarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div className="d-flex justify-content-between align-items-center flex-wrap grid-margin py-4">
						<Link to={`/${branch}/branch/booking/plans`} className="d-flex align-items-center gap-2" style={{ textDecoration: "none", color: "black" }}>
							<ChevronLeftIcon fontSize="large" />
							<h3 className="mb-3 mb-md-0">Branch Plan Create</h3>
						</Link>
					</div>
					<div className="card shadow-sm mx-auto">
						<div className="card-body row">
							{renderInput("Name", "name", "text", "Name")}
							<div className="col-12 mb-3">
								<label className="mb-1">Type</label>
								<select className="form-control" value={form.type} onChange={(e) => handleChange("type", e.target.value)}>
									<option value="full_day">Full Day</option>
									<option value="monthly">Monthly</option>
								</select>
								{errors.type && <span className="text-danger">{errors.type}</span>}
							</div>
							{renderInput("Price", "price", "number", "Price")}
							{renderInput("Discount (%) - Optional", "discount", "number", "Discount", { min: 0 })}
							{form.type === "monthly" && (
								<>
									{renderInput("Booking Hours", "bookingHours", "number", "e.g. 160", { min: 1 })}
									{renderInput("Printing Papers", "printingPapers", "number", "e.g. 500", { min: 1 })}
								</>
							)}
							<div className="d-flex justify-content-end mt-4">
								<Button variant="contained" disabled={isLoading} onClick={handleSubmit} style={{ backgroundColor: colors.primary, color: "white" }}>
									Create Plan
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
				<Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">
					{snackbar.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default PlanCreate;
