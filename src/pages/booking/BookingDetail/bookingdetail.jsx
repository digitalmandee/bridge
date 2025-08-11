import React, { useContext, useEffect } from "react";
import booking from "../../../assets/Booking.png";
import colors from "../../../assets/styles/color";
import axios from "axios";
import { FloorPlanContext } from "../../../contexts/floorplan.context";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import axiosInstance from "@/utils/axiosInstance";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const BookingDetail = ({ handlePrevious, handleNext }) => {
	const { bookingdetails, setBookingDetails, formErrors, bookingPlans, setBookingPlans, validateBookingDetails, checkAvailability, selectedChairs } = useContext(FloorPlanContext);

	useEffect(() => {
		const fetchBookingPlanData = async () => {
			try {
				const response = await axiosInstance.get("booking-plans");

				console.log(response.data);

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
			handleNext();
		}
	};

	useEffect(() => {
		const selectedPlan = bookingPlans.find((plan) => plan.id == bookingdetails.selectedPlan);
		const planPrice = Number(selectedPlan?.price) || 0;
		let totalPrice = 0;
		let packageDetail = "";

		if (bookingdetails.duration === "monthly") {
			// const today = dayjs(bookingdetails.start_date).tz("Asia/Karachi").toDate();
			const today = new Date(bookingdetails.start_date);
			const currentYear = today.getFullYear();
			const currentMonth = today.getMonth();
			const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
			const remainingDays = lastDayOfMonth - today.getDate() + 1;

			const totalChairs = Object.values(selectedChairs).flat().length;

			if (remainingDays > 0) {
				const dailyRate = planPrice / lastDayOfMonth;
				let extraPricePerChair = 0;

				if (remainingDays <= 5) {
					extraPricePerChair = planPrice + dailyRate * remainingDays;
					packageDetail = `1 month, ${remainingDays} days`;
				} else {
					extraPricePerChair = dailyRate * remainingDays;
					packageDetail = `${remainingDays} days`;
				}

				totalPrice = (totalChairs * extraPricePerChair).toFixed(2);
			} else {
				totalPrice = (totalChairs * planPrice).toFixed(2);
				packageDetail = "1 month";
			}
		} else {
			const totalChairs = Object.values(selectedChairs).flat().length;
			totalPrice = (totalChairs * planPrice).toFixed(2);
			packageDetail = `Full Day`;
		}

		setBookingDetails((prevDetails) => ({
			...prevDetails,
			total_price: Math.round(totalPrice),
			package_detail: packageDetail,
		}));
	}, [bookingdetails.selectedPlan, bookingdetails.start_date]);

	const selectedPlan = bookingPlans.find((plan) => plan.id == bookingdetails.selectedPlan);

	const totalPrice = (plan) => {
		if (!plan) return bookingdetails.total_price;
		return plan.discount && plan.discount > 0 ? Math.round(parseInt(bookingdetails.total_price) - (parseInt(bookingdetails.total_price) * plan.discount) / 100) : bookingdetails.total_price;
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
							Start Date
						</label>
						{/* Added onChange handler to update start_date in booking details */}
						<input
							type="date"
							name="start_date"
							value={bookingdetails.start_date}
							onChange={handleChange}
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
							Start Time
						</label>
						<input
							type="time"
							name="start_time"
							value={bookingdetails.start_time}
							onChange={handleChange}
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

					<div style={{ marginBottom: "10px" }}>
						<label
							style={{
								display: "block",
								marginBottom: "5px",
								fontWeight: "400", // Optional: for better label visibility
								marginLeft: 0,
								color: "black",
							}}>
							Duration
						</label>
						<select
							name="duration"
							value={bookingdetails.duration}
							onChange={handleChange}
							style={{
								width: "100%",
								padding: "10px",
								borderRadius: "5px",
								border: "1px solid #ccc",
								boxSizing: "border-box", // Ensures padding doesn't mess with dimensions
								margin: 0,
							}}>
							<option value="full_day" disabled={!checkAvailability?.available_durations?.includes("full_day")}>
								Full Day
							</option>
							<option value="monthly">Monthly</option>
						</select>
					</div>
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
								Working Hours
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
										{duration === "day"
											? "Day (9AM to 5PM)"
											: duration === "night"
											? "Night (6PM to 8AM)"
											: duration === "full_day"
											? "Full Day"
											: duration
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
								.map((plan, index) => {
									const discountAmount = (plan.price * plan.discount) / 100;
									const discountedPrice = plan.price - discountAmount;
									return (
										<option key={plan.id} value={plan.id}>
											{plan.name} - Rs. {discountedPrice.toFixed(2)}
											{plan.discount > 0 ? ` (Rs. ${plan.price} - ${plan.discount}%)` : ""}
										</option>
									);
								})}
						</select>
						{formErrors.selectedPlan && <span style={{ color: "red" }}>{formErrors.selectedPlan}</span>}
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
							Cost of Memebership
						</label>
						<div
							style={{
								width: "100%",
								padding: "10px",
								borderRadius: "5px",
								border: "1px solid #ccc",
								boxSizing: "border-box", // Ensures padding doesn't mess with dimensions
								margin: 0,
							}}>
							{totalPrice(selectedPlan)}
						</div>
					</div>
					<div
						style={{
							// borderBottom: "1px solid #ddd",
							fontSize: "14px",
							color: "#333",
							marginBottom: "15px",
						}}>
						<label
							style={{
								display: "block",
								marginBottom: "5px",
								fontWeight: "400", // Optional: for better label visibility
								marginLeft: 0,
							}}>
							Admin Help
						</label>
						<textarea
							name="description"
							value={bookingdetails.description}
							onChange={(e) => setBookingDetails({ ...bookingdetails, description: e.target.value })}
							placeholder="Enter description..."
							style={{
								width: "100%",
								height: "70px",
								padding: "12px",
								fontSize: "14px",
								border: "1px solid rgb(181, 179, 179)",
								borderRadius: "4px",
								resize: "none",
							}}
						/>
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
