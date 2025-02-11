import React, { useContext, useEffect, useState } from "react";
import Loader from "@/components/Loader";
import profile from "@/assets/Profile user.png";
import colors from "@/assets/styles/color";
import { FloorPlanContext } from "@/contexts/floorplan.context";
import axiosInstance from "@/utils/axiosInstance";
import "./style.css";
import { FormHelperText } from "@mui/material";

const MemberDetail = ({ handleNext }) => {
	const { bookingdetails, setBookingDetails, formErrors, validateMemeberDetails, selectedChairs, setCheckAvailability } = useContext(FloorPlanContext);
	const [isLoading, setIsLoading] = useState(false);
	const [imagePreview, setImagePreview] = useState(null); // image preview
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [loadingSearch, setLoadingSearch] = useState(false);
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setBookingDetails((prevDetails) => ({
			...prevDetails,
			[name]: value,
		}));
	};

	// Handle user input and search query
	const handleSearchChange = async (e) => {
		const query = e.target.value;
		setSearchQuery(query);
		setBookingDetails((prev) => ({ ...prev, name: query }));

		// Fetch search results
		if (query.length > 2) {
			setLoadingSearch(true);
			try {
				const response = await axiosInstance.get("search", {
					params: { query, type: bookingdetails.type === "individual" ? "user" : "company" },
				});
				setSearchResults(response.data.success ? response.data.results : []);
			} catch (error) {
				console.error("Search error:", error);
				setSearchResults([]);
			} finally {
				setLoadingSearch(false);
			}
		} else {
			setSearchResults([]);
		}
	};

	// Handle user selection from search results
	const handleSelectUser = async (user) => {
		console.log(user);

		setBookingDetails({
			...bookingdetails,
			name: user.name,
			email: user.email,
			phone_no: user.phone_no || "",
		});
		setSearchQuery(user.name);
		setSearchResults([]);
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setBookingDetails((prevDetails) => ({
				...prevDetails,
				profile_image: file, // Save image URL to profile_image
			}));
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result); // Set preview URL
				// Store the image URL in bookingDetails.profile_image
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async () => {
		const allChairs = Object.values(selectedChairs).flat();

		if (validateMemeberDetails()) {
			setErrors({});
			const newErrors = {};
			try {
				setIsLoading(true);

				const response = await axiosInstance.post("booking/check-availability", {
					chairs: allChairs,
					member: { name: bookingdetails.name, email: bookingdetails.email, type: bookingdetails.type === "individual" ? "user" : "company" },
				});

				if (response.data.success) {
					setCheckAvailability(response.data.data);
					updateTimeAndDuration(response.data.data); // Update time and duration based on availability
					handleNext();
				}
			} catch (error) {
				if (error.response.data.company_exists) newErrors.company_exists = error.response.data.company_exists;
				else if (error.response.data.type_exists) newErrors.type_exists = error.response.data.type_exists;

				setErrors(newErrors);
			} finally {
				setIsLoading(false);
			}
		}
	};

	const updateTimeAndDuration = (availabilityData) => {
		const { available_durations, available_time } = availabilityData;

		const { date, time } = extractDateAndTime(available_time);

		setBookingDetails((prevDetails) => ({
			...prevDetails,
			start_date: date,
			start_time: formatTimeForInput(time),
			time_slot: available_durations.length > 0 ? available_durations[0] : "day",
		}));
	};

	const extractDateAndTime = (availableTime) => {
		const [date, time] = availableTime.split(" ");
		return { date, time };
	};

	const formatTimeForInput = (time) => {
		const [hours, minutes] = time.split(":");
		return `${hours}:${minutes}`;
	};

	const totalSelectedChairs = Object.values(selectedChairs).flat().length;

	return (
		<>
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
				<h3 style={{ textAlign: "center", marginBottom: "20px" }}>
					<img src={profile} alt="Member Icon" style={{ width: "25px", height: "25px", marginRight: "10px", marginBottom: "5px", verticalAlign: "middle" }} /> Member Detail
				</h3>

				{isLoading && <Loader variant="B" />}

				{/* Name Field */}
				<div
					style={{
						maxWidth: "400px",
						margin: "0 auto",
						padding: 0,
						textAlign: "left",
					}}>
					<label
						style={{
							display: "block",
							marginBottom: "5px",
							fontWeight: "bold", // Optional: for better label visibility
							marginLeft: 0,
						}}>
						{bookingdetails.type === "individual" ? "Name" : "Company Name"}
					</label>
					<div style={{ position: "relative", marginBottom: "15px" }}>
						<input type="text" name="name" value={bookingdetails.name} onChange={handleSearchChange} style={{ width: "100%", padding: "10px", borderRadius: "5px", margin: 0, border: "1px solid #ccc" }} />
						{loadingSearch && <Loader variant="D" />}
						{searchResults.length > 0 && (
							<ul className="member-search-results">
								{searchResults.map((option) => (
									<li key={option.id} style={{ padding: "10px", cursor: "pointer" }} onClick={() => handleSelectUser(option)}>
										{option.name} <span style={{ color: "gray", fontSize: "0.875rem" }}> ({option.email})</span>
									</li>
								))}
							</ul>
						)}
						{formErrors.name && <span style={{ color: "red" }}>{formErrors.name}</span>}
						{errors.company_exists && <FormHelperText error>{errors.company_exists}</FormHelperText>}
					</div>

					{/* Email Field */}
					<label
						style={{
							display: "block",
							marginBottom: "5px",
							fontWeight: "bold",
						}}>
						{bookingdetails.type === "individual" ? "Email" : "Company Email"}
					</label>
					<div style={{ marginBottom: "15px" }}>
						<input
							type="email"
							name="email"
							value={bookingdetails.email}
							onChange={handleChange}
							style={{
								width: "100%",
								padding: "10px",
								borderRadius: "5px",
								border: "1px solid #ccc",
								boxSizing: "border-box",
								margin: 0,
							}}
						/>
						{formErrors.email && <span style={{ color: "red" }}>{formErrors.email}</span>}
					</div>

					{/* Phone Number Field */}
					<label
						style={{
							display: "block",
							marginBottom: "5px",
							fontWeight: "bold",
						}}>
						{bookingdetails.type === "individual" ? "Phone No" : "Company Phone No"}
					</label>
					<div style={{ marginBottom: "15px" }}>
						<input
							type="tel"
							name="phone_no"
							value={bookingdetails.phone_no}
							onChange={handleChange}
							style={{
								width: "100%",
								padding: "10px",
								borderRadius: "5px",
								border: "1px solid #ccc",
								boxSizing: "border-box",
								margin: 0,
							}}
						/>
						{formErrors.phone_no && <span style={{ color: "red" }}>{formErrors.phone_no}</span>}
					</div>

					{/* Individual/Company Dropdown */}
					<div style={{ marginBottom: "15px" }}>
						<label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Individual/Company</label>
						<select
							name="type"
							value={bookingdetails.type}
							onChange={handleChange}
							style={{
								width: "100%",
								padding: "10px",
								borderRadius: "5px",
								border: "1px solid #ccc",
								boxSizing: "border-box",
							}}>
							{totalSelectedChairs === 1 && <option value="individual">Individual</option>}
							<option value="company">Company</option>
						</select>
						{errors.type_exists && <FormHelperText error>{errors.type_exists}</FormHelperText>}
					</div>

					{/* Image Upload Field */}
					<label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>{bookingdetails.type === "individual" ? "Profile Picture" : "Company Logo"} (Optional)</label>
					<input
						type="file"
						accept="image/*"
						onChange={handleImageChange}
						style={{
							width: "100%",
							padding: "10px",
							borderRadius: "5px",
							border: "1px solid #ccc",
							boxSizing: "border-box",
							margin: 0,
						}}
					/>

					{/* Image Preview */}
					{imagePreview && (
						<div style={{ textAlign: "left", marginTop: "4px" }}>
							<img src={imagePreview} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }} />
						</div>
					)}

					<div style={{ textAlign: "right", marginTop: "20px" }}>
						<button
							type="button"
							style={{
								padding: "10px 20px",
								borderRadius: "5px",
								backgroundColor: colors.primary,
								color: "#fff",
								border: "none",
								fontSize: "16px",
								cursor: "pointer",
							}}
							onClick={handleSubmit}>
							Next
						</button>
					</div>
				</div>
			</form>
		</>
	);
};

export default MemberDetail;
