import React, { useContext, useEffect } from "react";
import booking from "../../../assets/Booking.png";
import colors from "../../../assets/styles/color";
import axios from "axios";
import { FloorPlanContext } from "../../../contexts/floorplan.context";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";

const BookingDetail = ({ handlePrevious, handleNext }) => {
	const { bookingdetails, setBookingDetails, formErrors, bookingPlans, setBookingPlans, validateBookingDetails, checkAvailability, selectedChairs } = useContext(FloorPlanContext);

	useEffect(() => {
		const fetchBookingPlanData = async () => {
			try {
				const response = await axios.get(`${import.meta.env.VITE_BASE_API}booking-plans`, {
					headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}`, "Content-Type": "application/json" },
				});

				if (response.data && Array.isArray(response.data.data)) {
					setBookingPlans(response.data.data);
				}
			} catch (error) {
				console.error("Error fetching booking plan data", error);
			}
		};

		fetchBookingPlanData();
	}, [setBookingPlans]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "duration") {
			setBookingDetails((prevDetails) => ({
				...prevDetails,
				[name]: value,
				selectedPlan: null,
			}));
		} else {
			setBookingDetails((prevDetails) => ({
				...prevDetails,
				[name]: value,
			}));
		}
	};

	const handleSubmit = () => {
		if (validateBookingDetails()) {
			const selectedPlan = bookingPlans.find((plan) => plan.id == bookingdetails.selectedPlan);
			const planPrice = Number(selectedPlan?.price) || 0;
			let totalPrice = 0;
			let packageDetail = "";

			if (bookingdetails.duration === "monthly") {
				const today = new Date();
				const currentYear = today.getFullYear();
				const currentMonth = today.getMonth();
				const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
				const remainingDays = lastDayOfMonth - today.getDate();

				// Count total selected chairs
				const totalChairs = Object.values(selectedChairs).flat().length;

				if (remainingDays > 0) {
					const dailyRate = planPrice / lastDayOfMonth;
					let extraPricePerChair = 0;

					if (remainingDays <= 5) {
						// If remaining days are ≤ 5, add full month + extra days price
						extraPricePerChair = planPrice + dailyRate * remainingDays;
						packageDetail = `1 month, ${remainingDays} days`;
					} else {
						// If remaining days > 5, charge only for those days
						extraPricePerChair = dailyRate * remainingDays;
						packageDetail = `${remainingDays} days`;
					}

					totalPrice = (totalChairs * extraPricePerChair).toFixed(2);
				} else {
					// If there are no extra days, charge for only 1 full month
					totalPrice = (totalChairs * planPrice).toFixed(2);
					packageDetail = "1 month";
				}
			} else {
				// Count total selected chairs
				const totalChairs = Object.values(selectedChairs).flat().length;

				totalPrice = (totalChairs * planPrice).toFixed(2);
				packageDetail = `Full Day`;
			}

			setBookingDetails((prevDetails) => ({
				...prevDetails,
				total_price: totalPrice,
				package_detail: packageDetail,
			}));

			handleNext();
		}
	};

	return (
		<>
			<div
				style={{
					backgroundColor: "#fff",
					padding: "20px",
					borderRadius: "10px",
					boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
					width: "50%",
					// maxWidth: "400px",
					margin: "0 auto",
					marginBottom: "1rem",
				}}>
				<h3
					style={{
						textAlign: "center",
						marginBottom: "20px",
						fontFamily: "Nunito Sans, sans-serif",
						fontSize: "24px",
						fontWeight: "600",
					}}>
					<img src={booking} alt="Booking Icon" style={{ width: "25px", height: "25px", marginRight: "10px", marginBottom: "5px", verticalAlign: "middle" }} /> Booking Detail
				</h3>

				<div
					style={{
						maxWidth: "400px",
						margin: "0 auto",
						padding: 0,
						textAlign: "left",
					}}>
					{/* Date Field */}
					<div style={{ marginBottom: "15px" }}>
						<label
							style={{
								display: "block",
								marginBottom: "5px",
								fontWeight: "400", // Optional: for better label visibility
								marginLeft: 0,
							}}>
							Date
						</label>
						<input
							type="date"
							name="start_date"
							value={bookingdetails.start_date}
							readOnly // Make the date field read-only so the user cannot change it
							style={{
								width: "100%",
								padding: "10px",
								borderRadius: "5px",
								border: "1px solid #ccc",
								boxSizing: "border-box", // Ensures padding doesn't mess with dimensions
								margin: 0,
							}}
						/>
					</div>

					{/* Time Field */}
					<div style={{ marginBottom: "15px" }}>
						<label
							style={{
								display: "block",
								marginBottom: "5px",
								fontWeight: "400", // Optional: for better label visibility
								marginLeft: 0,
							}}>
							Time
						</label>
						<input
							type="time"
							name="start_time"
							value={bookingdetails.start_time}
							readOnly // Make the time field read-only so the user cannot change it
							style={{
								width: "100%",
								padding: "10px",
								borderRadius: "5px",
								border: "1px solid #ccc",
								boxSizing: "border-box", // Ensures padding doesn't mess with dimensions
								margin: 0,
							}}
						/>
					</div>

					<FormControl>
						<FormLabel
							id="duration-change"
							sx={{
								display: "block",
								marginBottom: "5px",
								fontWeight: "400", // Optional: for better label visibility
								marginLeft: 0,
								color: "black",
							}}>
							Duration
						</FormLabel>
						<RadioGroup row aria-labelledby="duration-change" name="duration" value={bookingdetails.duration} onChange={handleChange}>
							<FormControlLabel value="full_day" control={<Radio />} label="Full Day" disabled={!checkAvailability?.available_durations?.includes("full_day")} />
							<FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
						</RadioGroup>
					</FormControl>

					{/* Duration Field */}
					{bookingdetails.duration === "monthly" && (
						<div style={{ marginBottom: "10px" }}>
							<label
								style={{
									display: "block",
									marginBottom: "5px",
									fontWeight: "400", // Optional: for better label visibility
									marginLeft: 0,
								}}>
								Select Booking Time
							</label>
							<select
								name="time_slot"
								value={bookingdetails.time_slot}
								onChange={handleChange}
								style={{
									width: "100%",
									padding: "10px",
									borderRadius: "5px",
									border: "1px solid #ccc",
									boxSizing: "border-box", // Ensures padding doesn't mess with dimensions
									margin: 0,
								}}>
								{checkAvailability?.available_durations?.map((duration) => (
									<option key={duration} value={duration}>
										{duration
											.split("_")
											.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
											.join(" ")}
									</option>
								))}
							</select>
						</div>
					)}

					{/* Select Plan Field */}
					<div style={{ marginBottom: "10px" }}>
						<label
							style={{
								display: "block",
								marginBottom: "5px",
								fontWeight: "400", // Optional: for better label visibility
								marginLeft: 0,
							}}>
							Select Plan
						</label>
						<select
							name="selectedPlan"
							value={bookingdetails.selectedPlan}
							onChange={handleChange}
							style={{
								width: "100%",
								padding: "10px",
								borderRadius: "5px",
								border: "1px solid #ccc",
								boxSizing: "border-box", // Ensures padding doesn't mess with dimensions
								margin: 0,
							}}>
							<option value="">-- Select a Plan --</option>
							{bookingPlans
								.filter((plan) => plan.type === bookingdetails.duration)
								.map((plan, index) => (
									<option key={plan.id} value={plan.id}>
										{plan.name} - Rs. {plan.price}
									</option>
								))}
						</select>
						{formErrors.selectedPlan && <span style={{ color: "red" }}>{formErrors.selectedPlan}</span>}
					</div>

					{/* Buttons */}
					<div style={{ display: "flex", justifyContent: "space-between", width: "50%" }}>
						<button
							type="button"
							style={{
								padding: "10px 20px",
								borderRadius: "5px",
								backgroundColor: "#ccc",
								color: "#000",
								border: "none",
								fontSize: "16px",
								cursor: "pointer",
							}}
							onClick={handlePrevious}>
							Cancel
						</button>
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
			</div>
		</>
	);
};

export default BookingDetail;
