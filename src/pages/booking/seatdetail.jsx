import React, { useContext, useState } from "react";
import profile from "@/assets/Profile user.png";
import colors from "@/assets/styles/color";
import { FloorPlanContext } from "@/contexts/floorplan.context";
import axiosInstance from "@/utils/axiosInstance";
import "./style.css";

const SeatDetail = ({ handleNext }) => {
	const { bookingdetails, setBookingDetails, formErrors, validateCatgeoryDetails } = useContext(FloorPlanContext);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setBookingDetails((prevDetails) => ({
			...prevDetails,
			[name]: value,
		}));
	};

	const handleSubmit = () => {
		if (validateCatgeoryDetails()) {
			handleNext();
		}
	};

	return (
		<form
			style={{
				backgroundColor: "#fff",
				padding: "20px",
				borderRadius: "10px",
				boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
				width: "50%",
				margin: "0 auto",
				marginBottom: "1rem",
				position: "relative",
			}}>
			<h3 style={{ textAlign: "center", marginBottom: "20px" }}>Space Allocation</h3>

			{/*	Form */}
			<div className="form-group">
				<label
					style={{
						display: "block",
						marginBottom: "5px",
						fontWeight: "bold", // Optional: for better label visibility
						marginLeft: 0,
					}}>
					Desk Type
				</label>
				<select
					name="industry"
					style={{
						width: "100%",
						padding: "10px",
						borderRadius: "5px",
						border: "1px solid #ccc",
						boxSizing: "border-box",
					}}
					value={bookingdetails.industry || ""}
					onChange={handleChange}>
					<option value="">Select Desk type</option>
				</select>
			</div>

			<div className="form-group">
				<label
					style={{
						display: "block",
						marginBottom: "5px",
						fontWeight: "bold", // Optional: for better label visibility
						marginLeft: 0,
					}}>
					Number of Desk
				</label>
				<input
					style={{
						width: "100%",
						padding: "10px",
						borderRadius: "5px",
						border: "1px solid #ccc",
						boxSizing: "border-box",
						margin: 0,
					}}
					type="number"
					name="linkedin"
					value={bookingdetails.linkedin || ""}
					onChange={handleChange}
				/>
				{formErrors.linkedin && <span className="error-text">{formErrors.linkedin}</span>}
			</div>

			<div className="form-group">
				<label
					style={{
						display: "block",
						marginBottom: "5px",
						fontWeight: "bold", // Optional: for better label visibility
						marginLeft: 0,
					}}>
					Facebook Profile
				</label>
				<input
					style={{
						width: "100%",
						padding: "10px",
						borderRadius: "5px",
						border: "1px solid #ccc",
						boxSizing: "border-box",
						margin: 0,
					}}
					type="url"
					name="facebook"
					value={bookingdetails.facebook || ""}
					onChange={handleChange}
				/>
				{formErrors.facebook && <span className="error-text">{formErrors.facebook}</span>}
			</div>

			<div className="form-group">
				<label
					style={{
						display: "block",
						marginBottom: "5px",
						fontWeight: "bold", // Optional: for better label visibility
						marginLeft: 0,
					}}>
					Freelance Website
				</label>
				<input
					style={{
						width: "100%",
						padding: "10px",
						borderRadius: "5px",
						border: "1px solid #ccc",
						boxSizing: "border-box",
						margin: 0,
					}}
					type="url"
					name="freelance_site"
					value={bookingdetails.freelance_site || ""}
					onChange={handleChange}
				/>
				{formErrors.freelance_site && <span className="error-text">{formErrors.freelance_site}</span>}
			</div>

			{/* Submit Button */}
			<div style={{ textAlign: "right", marginTop: "20px" }}>
				<button type="button" style={{ padding: "10px 20px", borderRadius: "5px", backgroundColor: colors.primary, color: "#fff", border: "none", fontSize: "16px", cursor: "pointer" }} onClick={handleSubmit}>
					Next
				</button>
			</div>
		</form>
	);
};

export default SeatDetail;
