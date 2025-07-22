import React, { useContext, useState } from "react";
import Loader from "@/components/Loader";
import profile from "@/assets/Profile user.png";
import colors from "@/assets/styles/color";
import { FloorPlanContext } from "@/contexts/floorplan.context";
import axiosInstance from "@/utils/axiosInstance";
import "./style.css";
import { Autocomplete, TextField } from "@mui/material";

const CategoryDetail = ({ handleNext,handlePrevious }) => {
	const { bookingdetails, setBookingDetails, formErrors, validateCategoryDetails } = useContext(FloorPlanContext);

	const industryOptions = ["IT", "Finance", "Healthcare", "Education"];

	const handleChange = (e) => {
		const { name, files, value } = e.target;

		setBookingDetails((prevDetails) => ({
			...prevDetails,
			[name]: files ? files[0] : value,
		}));
	};

	const handleSubmit = () => {
		if (validateCategoryDetails()) {
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
			<h3 style={{ textAlign: "center", marginBottom: "20px" }}>{bookingdetails.type === "individual" ? "Freelancer Details" : "Business Organization"}</h3>

			{/* Freelancer Form */}
			{bookingdetails.type === "individual" && (
				<>
					<div className="form-group">
						<label
							style={{
								display: "block",
								marginBottom: "5px",
								fontWeight: "bold", // Optional: for better label visibility
								marginLeft: 0,
							}}>
							LinkedIn Profile
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
				</>
			)}

			{/* Business Organization Form */}
			{bookingdetails.type === "company" && (
				<>
					<div className="form-group">
						<label
							style={{
								display: "block",
								marginBottom: "5px",
								fontWeight: "bold", // Optional: for better label visibility
								marginLeft: 0,
							}}>
							Company Name
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
							type="text"
							name="company_name"
							value={bookingdetails.company_name || ""}
							onChange={handleChange}
						/>
						{formErrors.company_name && <span className="error-text">{formErrors.company_name}</span>}
					</div>

					<div className="form-group">
						<label
							style={{
								display: "block",
								marginBottom: "5px",
								fontWeight: "bold", // Optional: for better label visibility
								marginLeft: 0,
							}}>
							Company Website
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
							name="company_website"
							value={bookingdetails.company_website || ""}
							onChange={handleChange}
						/>
						{formErrors.company_website && <span className="error-text">{formErrors.company_website}</span>}
					</div>

					<div className="form-group">
						<label
							style={{
								display: "block",
								marginBottom: "5px",
								fontWeight: "bold", // Optional: for better label visibility
								marginLeft: 0,
							}}>
							Industry
						</label>
						<Autocomplete
							freeSolo
							options={industryOptions}
							value={bookingdetails.industry || ""}
							onChange={(event, newValue) => {
								handleChange({
									target: {
										name: "industry",
										value: newValue || "",
									},
								});
							}}
							onInputChange={(event, newInputValue) => {
								handleChange({
									target: {
										name: "industry",
										value: newInputValue,
									},
								});
							}}
							renderInput={(params) => <TextField {...params} variant="outlined" fullWidth size="small" placeholder="Select Industry" />}
						/>
						{formErrors.industry && <span className="error-text">{formErrors.industry}</span>}
					</div>

					<div className="form-group">
						<label
							style={{
								display: "block",
								marginBottom: "5px",
								fontWeight: "bold", // Optional: for better label visibility
								marginLeft: 0,
							}}>
							Number of Employees
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
							name="employees"
							value={bookingdetails.employees || ""}
							onChange={handleChange}
						/>
						{formErrors.employees && <span className="error-text">{formErrors.employees}</span>}
					</div>

					<div className="form-group">
						<label
							style={{
								display: "block",
								marginBottom: "5px",
								fontWeight: "bold", // Optional: for better label visibility
								marginLeft: 0,
							}}>
							Company Address
						</label>
						<textarea
							style={{
								width: "100%",
								padding: "10px",
								borderRadius: "5px",
								border: "1px solid #ccc",
								boxSizing: "border-box",
								margin: 0,
							}}
							name="company_address"
							value={bookingdetails.company_address || ""}
							onChange={handleChange}></textarea>
					</div>
				</>
			)}
			<div className="form-group">
				<label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>KYB (File upload - PDF or Image)</label>
				<input style={{ width: "100%", marginLeft: 0, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} type="file" name="kyb_file" accept=".png,.jpg,.jpeg,.gif,.pdf" onChange={handleChange} />
				{formErrors.kyb_file && <span className="error-text">{formErrors.kyb_file}</span>}
			</div>

			{/* Submit Button */}
			<div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
				<button type="button" style={{ padding: "10px 20px", borderRadius: "5px", backgroundColor: "#ccc", color: "#333", border: "none", fontSize: "16px", cursor: "pointer" }} onClick={handlePrevious}>
					Back
				</button>
				<button type="button" style={{ padding: "10px 20px", borderRadius: "5px", backgroundColor: colors.primary, color: "#fff", border: "none", fontSize: "16px", cursor: "pointer" }} onClick={handleSubmit}>
					Next
				</button>
			</div>
		</form>
	);
};

export default CategoryDetail;
