import React, { useEffect, useState, useRef } from "react";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";
import user from "@/assets/user2.png";
import axios from "axios";

const AddStaff = () => {
	const navigate = useNavigate();
	const fileInputRef = useRef(null);
	const [avaiablePrintingQuota, setAvaiablePrintingQuota] = useState(0);
	const [avaiableBookingQuota, setAvaiableBookingQuota] = useState(0);
	const [bookingSeats, setBookingSeats] = useState([]);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phoneNo, setPhoneNO] = useState("");
	const [password, setPassword] = useState("");
	const [printingPaper, setPrintingPaper] = useState(0);
	const [bookingQuota, setBookingQuota] = useState(0);
	const [seatNo, setSeatNo] = useState("");
	const [designation, setDesignation] = useState("");
	const [date, setDate] = useState(new Date());
	const [address, setAddress] = useState("");
	const [profileImage, setProfileImage] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [errors, setErrors] = useState({});

	useEffect(() => {
		const fetchStaffData = async () => {
			try {
				const res = await axios.get(import.meta.env.VITE_BASE_API + "company/dashboard/staff", {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("authToken")}`,
						"Content-Type": "application/json",
					},
				});
				setAvaiablePrintingQuota(res.data.printingQuota);
				setAvaiableBookingQuota(Number(res.data.bookingQuota));
				setBookingSeats(res.data.chairs);
			} catch (error) {
				console.log(error.response.data);
			} finally {
				setIsLoading(false);
			}
		};
		fetchStaffData();
	}, []);

	const formatDate = (date) => {
		const options = { year: "numeric", month: "numeric", day: "numeric" };
		return new Date(date).toLocaleDateString("en-GB", options);
	};

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setProfileImage(URL.createObjectURL(file)); // Set image preview
		}
	};

	const handleSubmit = async () => {
		// Clear previous errors
		setErrors({});

		// Check for required fields
		const newErrors = {};

		if (!name) newErrors.name = "Name is required";
		if (!email) newErrors.email = "Email is required";
		if (!password) newErrors.password = "Password is required";
		if (!bookingQuota) newErrors.bookingQuota = "Booking quota is required";
		if (!printingPaper) newErrors.printingPaper = "Printing paper is required";
		if (!seatNo) newErrors.seatNo = "Seat selection is required";

		// Check if printingPaper exceeds available quota
		if (printingPaper > avaiablePrintingQuota) {
			newErrors.printingPaper = `Printing paper exceeds available quota of ${avaiablePrintingQuota}`;
		}

		// Check if bookingQuota exceeds available quota
		if (bookingQuota > avaiableBookingQuota) {
			newErrors.bookingQuota = `Booking quota exceeds available quota of ${avaiableBookingQuota}`;
		}

		// If there are errors, set the errors state and return
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		// Example for saving to backend
		try {
			const formData = new FormData();
			formData.append("name", name);
			formData.append("email", email);
			formData.append("phone_no", phoneNo);
			formData.append("password", password);
			formData.append("printing_quota", printingPaper);
			formData.append("booking_quota", bookingQuota);
			formData.append("seatNo", seatNo);
			formData.append("designation", designation);
			formData.append("date", formatDate(date));
			formData.append("address", address);

			// If profile image is selected, add it to FormData
			if (profileImage) {
				formData.append("profile_image", profileImage);
			}

			const res = await axios.post(import.meta.env.VITE_BASE_API + "company/staff/create", formData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("authToken")}`,
					"Content-Type": "multipart/form-data",
				},
			});

			// If the response indicates success
			if (res.data.success) {
				console.log("Staff created successfully");

				// Subtract the used quotas
				setAvaiableBookingQuota(avaiableBookingQuota - bookingQuota);
				setAvaiablePrintingQuota(avaiablePrintingQuota - printingPaper);

				// Remove the seat from the bookingSeats array based on seatNo
				setBookingSeats((prevSeats) => prevSeats.filter((seat) => seat.id != seatNo));

				// Optional: Redirect to staff management page or show success message
				navigate("/company/staff/management");
			} else {
				console.log("Error in staff creation:", res.data.message);
			}
		} catch (error) {
			if (error.response?.data?.errors.email) {
				console.log("Error:", error.response?.data || error.message);
				newErrors.email = error.response.data.errors.email[0];
			} else if (error.response?.data?.errors.booking_quota) {
				newErrors.booking_quota = error.response.data.errors.booking_quota[0];
			} else if (error.response?.data?.errors.printing_quota) {
				newErrors.printing_quota = error.response.data.errors.printing_quota[0];
			}
			if (Object.keys(newErrors).length > 0) {
				setErrors(newErrors);
				return;
			}
		}
	};

	return (
		<>
			<TopNavbar />
			<div className="main">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					{/* Back Arrow */}
					<div
						style={{
							paddingTop: "1rem",
							display: "flex",
							alignItems: "center",
							marginBottom: "20px",
							cursor: "pointer",
						}}>
						<div onClick={() => navigate(-1)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
							<MdArrowBackIos style={{ fontSize: "20px", marginRight: "10px" }} />
						</div>
						<h2 style={{ margin: 0 }}>Add Staff</h2>
					</div>
					<div
						style={{
							maxWidth: "90%",
							margin: "0 auto",
							padding: "20px",
							borderRadius: "10px",
							backgroundColor: "#F9FAFB",
							boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
						}}>
						{/* Form Container */}
						<div style={{ display: "flex", gap: "20px" }}>
							{/* Left Column */}
							<div
								style={{
									flex: "1",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
								}}>
								{/* Profile Picture */}
								<div
									style={{
										display: "flex",
										justifyContent: "center",
										marginBottom: "20px",
									}}>
									<div
										style={{
											width: "100px",
											height: "100px",
											borderRadius: "50%",
											backgroundColor: "#E5E7EB",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											position: "relative",
										}}>
										<img
											src={profileImage || user}
											alt="Profile"
											style={{
												width: profileImage ? "100px" : "40px",
												height: profileImage ? "100px" : "40px",
												borderRadius: profileImage ? "50%" : "",
											}}
										/>
										<div
											onClick={() => fileInputRef.current.click()}
											style={{
												position: "absolute",
												bottom: "0.1px",
												right: "5px",
												backgroundColor: "#0D2B4E",
												color: "white",
												borderRadius: "50%",
												padding: "5px",
												cursor: "pointer",
											}}>
											📷
										</div>
									</div>
								</div>
								<input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageUpload} />

								{/* Input Fields */}
								<div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
									{[
										{ label: "Name", placeholder: "Enter full name", value: name, setter: setName, error: errors.name },
										{ label: "Email", placeholder: "Enter email", value: email, setter: setEmail, error: errors.email },
										{ label: "Phone Number", placeholder: "e.g. 03333333333", value: phoneNo, setter: setPhoneNO },
										{ label: "Password", placeholder: "Enter your password", type: "password", value: password, setter: setPassword, error: errors.password },
									].map((field, index) => (
										<div key={index} style={{ marginBottom: "10px" }}>
											<span
												style={{
													display: "block",
													fontWeight: "bold",
													marginBottom: "5px",
												}}>
												{field.label}
											</span>
											<input
												type={field.type || "text"}
												placeholder={field.placeholder}
												value={field.value}
												onChange={(e) => field.setter(e.target.value)}
												style={{
													width: "100%",
													padding: "10px",
													margin: "0",
													border: "1px solid #D1D5DB",
													borderRadius: "5px",
												}}
											/>
											{field.error && <span style={{ color: "red", fontSize: "12px" }}>{field.error}</span>}
										</div>
									))}
								</div>
							</div>

							{/* Right Column */}
							<div
								style={{
									flex: "1",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
								}}>
								<div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
									{/* Form Fields */}
									<div style={{ marginBottom: "10px" }}>
										<span
											style={{
												display: "block",
												fontWeight: "bold",
												marginBottom: "5px",
											}}>
											Printing Papers
										</span>
										<input
											type="number"
											value={printingPaper}
											onChange={(e) => setPrintingPaper(e.target.value)}
											placeholder="Enter Printing Papers"
											style={{
												width: "100%",
												margin: "0",
												padding: "10px",
												border: "1px solid #D1D5DB",
												borderRadius: "5px",
											}}
										/>
										{errors.printingPaper && <span style={{ color: "red", fontSize: "12px" }}>{errors.printingPaper}</span>}
									</div>
									<div style={{ marginBottom: "10px" }}>
										<span
											style={{
												display: "block",
												fontWeight: "bold",
												marginBottom: "5px",
											}}>
											Booking Hours
										</span>
										<input
											type="number"
											value={bookingQuota}
											onChange={(e) => setBookingQuota(e.target.value)}
											placeholder="Enter Booking Hours"
											style={{
												width: "100%",
												margin: "0",
												padding: "10px",
												border: "1px solid #D1D5DB",
												borderRadius: "5px",
											}}
										/>
										{errors.bookingQuota && <span style={{ color: "red", fontSize: "12px" }}>{errors.bookingQuota}</span>}
									</div>
									<div style={{ marginBottom: "10px" }}>
										<span
											style={{
												display: "block",
												fontWeight: "bold",
												marginBottom: "5px",
											}}>
											Seat No
										</span>
										<select
											value={seatNo}
											onChange={(e) => setSeatNo(e.target.value)}
											style={{
												width: "100%",
												padding: "10px",
												border: "1px solid #D1D5DB",
												borderRadius: "5px",
											}}>
											<option value="">Select Seat</option>
											{bookingSeats.length > 0 &&
												bookingSeats.map((seat, index) => (
													<option key={index} value={seat.id}>
														{seat.table_id}
														{seat.chair_id}
													</option>
												))}
										</select>
										{errors.seatNo && <span style={{ color: "red", fontSize: "12px" }}>{errors.seatNo}</span>}
									</div>

									{/* Other Inputs */}
									{[
										{ label: "Designation", placeholder: "Enter your designation", value: designation, setter: setDesignation },
										{ label: "Date Joined", placeholder: "Jan/10/2025", value: formatDate(date), setter: setDate },
										{ label: "Address", placeholder: "", value: address, setter: setAddress },
									].map((field, index) => (
										<div key={index} style={{ marginBottom: "10px" }}>
											<span
												style={{
													display: "block",
													fontWeight: "bold",
													marginBottom: "5px",
												}}>
												{field.label}
											</span>
											<input
												type="text"
												placeholder={field.placeholder}
												value={field.value}
												onChange={(e) => field.setter(e.target.value)}
												style={{
													width: "100%",
													margin: "0",
													padding: "10px",
													border: "1px solid #D1D5DB",
													borderRadius: "5px",
												}}
											/>
										</div>
									))}
								</div>
							</div>
						</div>

						<div
							style={{
								textAlign: "center",
								marginTop: "10px",
								marginBottom: "1rem",
							}}>
							{/* Save Button */}
							<button
								style={{
									width: "40%",
									padding: "12px",
									backgroundColor: "#0D2B4E",
									color: "white",
									border: "none",
									borderRadius: "5px",
									fontSize: "16px",
									cursor: "pointer",
									marginTop: "10px",
								}}
								onClick={handleSubmit}>
								Save
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default AddStaff;
