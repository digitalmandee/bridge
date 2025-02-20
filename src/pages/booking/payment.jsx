import React, { useContext, useState } from "react";
import cash from "@/assets/cash.png";
import payment from "@/assets/payment.png";
import Modal from "./modal";
import axios from "axios";
import { FloorPlanContext } from "@/contexts/floorplan.context";
import colors from "@/assets/styles/color";
import axiosInstance from "../../utils/axiosInstance";
import Loader from "@/components/Loader";

const Payment = () => {
	const { selectedChairs, selectedFloor, bookingPlans, bookingdetails, setBookingDetails } = useContext(FloorPlanContext);
	const [showModal, setShowModal] = useState(false);
	const [receiptFile, setReceiptFile] = useState(null); // uploaded file
	const [isLoading, setIsLoading] = useState(false);

	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		setReceiptFile(file);

		// Save file name in bookingdetails.receipt
		setBookingDetails((prevDetails) => ({
			...prevDetails,
			receipt: file.name, // Update receipt field
		}));
	};

	const handleConfirm = async () => {
		// Create a FormData object to send the image and other data
		const formData = new FormData();
		formData.append("branch_id", 1);
		formData.append("floor_id", selectedFloor);
		formData.append("profile_image", bookingdetails.profile_image); // Add the receipt file
		formData.append("receipt", receiptFile); // Add the receipt file
		formData.append("bookingdetails", JSON.stringify(bookingdetails));
		formData.append("selectedPlan", JSON.stringify(bookingPlans.find((plan) => plan.id == bookingdetails.selectedPlan)));
		formData.append(
			"selectedChairs",
			JSON.stringify(
				Object.values(selectedChairs)
					.flat()
					.map((chair) => chair.chair_id)
			)
		);
		setIsLoading(true);
		try {
			const res = await axiosInstance.post("booking/create", formData);
			if (res.data.success) {
				setShowModal(true); // Show the modal
			}
		} catch (error) {
			console.error("Error creating booking:", error.response.data);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = async () => {
		setShowModal(false);
	};

	return (
		<>
			<div
				style={{
					width: '100%',
					display: "flex",
					justifyContent: "center"
				}}>
				<div
					style={{
						// backgroundColor: "black",
						// padding: "20px",
						borderRadius: "10px",
						// boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
						width: "50%",
						marginLeft: '16rem',
					}}>
					<h3
						style={{
							textAlign: "center",
							marginBottom: "20px",
							fontFamily: "Nunito Sans, sans-serif",
							fontSize: "24px",
							fontWeight: "600",
						}}>
						Payment Details
					</h3>
					<div
						style={{
							display: "flex",
							backgroundColor: 'transparent',
							justifyContent: "space-between",
							// gap: "0.5rem",
							marginBottom: "20px",
						}}>
						<div style={{
							flex: 1,
							maxWidth: '213px',
							maxHeight: '144px',
							textAlign: "center",
							// padding: "10px",
							borderRadius: "10px",
							cursor: "pointer",
							backgroundColor: '#FFFFFF',
						}}
							className={`payment-methods ${bookingdetails.payment_method === "cash" ? "active" : ""}`}
							onClick={() =>
								setBookingDetails((prevDetails) => ({
									...prevDetails,
									payment_method: "cash", // Update receipt field
								}))
							}>
							<img src={cash} alt="Cash" style={{ width: "50px", marginBottom: "10px" }} />
							<p
								style={{
									font: "Nunito Sans",
									fontWeight: "500",
									fontSize: "24px",
								}}>
								Cash
							</p>
						</div>
						<div style={{
							flex: 1,
							maxWidth: '213px',
							maxHeight: '144px',
							textAlign: "center",
							// padding: "10px",
							borderRadius: "10px",
							cursor: "pointer",
							backgroundColor: '#FFFFFF',
						}}
							className={`payment-methods ${bookingdetails.payment_method === "bank" ? "active" : ""}`}
							onClick={() =>
								setBookingDetails((prevDetails) => ({
									...prevDetails,
									payment_method: "bank", // Update receipt field
								}))
							}>
							<img src={payment} alt="Bank Transfer" style={{ width: "50px", marginBottom: "10px" }} />
							<p
								style={{
									font: "Nunito Sans",
									fontWeight: "500",
									fontSize: "24px",
								}}>
								Bank Transfer
							</p>
						</div>
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							border: "1px solid #ccc",
							borderRadius: "5px",
							padding: "10px 10px",
							width: "100%",
							maxWidth: "400px",
							backgroundColor: "#fff",
							margin: "2rem 5rem",
						}}
						onClick={() => document.getElementById("receipt-upload").click()}>
						{/* Placeholder Text */}
						<span style={{ flex: 1, color: "#999" }}>Upload Receipt</span>

						{/* Upload Icon (Replace with an actual icon library if needed) */}
						<span style={{ marginLeft: "10px", cursor: "pointer" }}>📤</span>

						{/* Hidden File Input */}
						<input type="file" id="receipt-upload" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
						{receiptFile && <p style={{ marginTop: "10px" }}>Uploaded: {receiptFile.name}</p>}
					</div>
					<button
						style={{
							display: "block",
							width: '50%',
							margin: "0 auto",
							backgroundColor: colors.primary,
							color: "white",
							padding: "10px 20px",
							border: "none",
							borderRadius: "5px",
							fontSize: "16px",
						}}
						disabled={isLoading}
						onClick={handleConfirm}>
						{isLoading ? <Loader variant="D" /> : "Confirm"}
					</button>
					{showModal && <Modal handleClose={handleClose} />}
				</div>
				<div style={{
					width: '100%',
					maxWidth: '250px',
					marginTop: '3rem',
					marginLeft: '1rem',
					backgroundColor: '#fff',
					height: '40vh',
					// padding: '10px',
					borderRadius: '10px',
					boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'flex-start',
					overflowY: 'auto'
				}} className="scroll-container">

					{/* Scrollbar Styling */}
					<style>
						{`
      .scroll-container::-webkit-scrollbar {
        width: 6px;
        background: transparent; 
      }
      .scroll-container::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 10px;
      }
      .scroll-container::-webkit-scrollbar-thumb {
        background: #b3b3b3;
        border-radius: 4px;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
      }
      .scroll-container:hover::-webkit-scrollbar-thumb {
        opacity: 1;
      }
    `}
					</style>

					{/* Selected Chairs Section */}
					{Object.entries(selectedChairs).length > 0 && (
						<>
							{/* Header */}
							<div style={{
								background: "#002855",
								color: "white",
								fontSize: "16px",
								fontWeight: "bold",
								padding: "20px",
								textAlign: "center",
								borderTopLeftRadius: "10px",
								borderTopRightRadius: "10px"
							}}>
								Selected Chair
							</div>

							{/* Chair List */}
							<ul style={{ padding: "0", marginTop: "10px", listStyle: "none" }}>
								{Object.entries(selectedChairs).map(([tableId, chairs]) =>
									chairs.map((chair) => (
										<li key={chair.id} style={{
											// borderBottom: "1px solid #ddd",
											padding: "8px 0",
											fontSize: "14px",
											color: "#333"
										}}>
											<div style={{
												display: "flex",
												padding: '0 1rem',
												justifyContent: "space-between",
												fontWeight: "bold"
											}}>
												<span>Plan Name</span>
												<span>Plan Price</span>
											</div>
											<div style={{
												display: "flex",
												padding: '0 1rem',
												justifyContent: "space-between",
												marginTop: "5px",
												fontSize: "14px"
											}}>
												<span>{bookingPlans.find((plan) => plan.id == bookingdetails.selectedPlan)?.name}</span>
												<span>Rs. {bookingdetails.total_price}</span>
											</div>
											<div style={{
												borderBottom: "1px solid #ddd",
												margin: "8px 0"
											}}></div>
											<div style={{
												marginTop: "8px",
												padding: '0 1rem',
												fontSize: "14px",
												fontWeight:'bold',
											}}>
												<span style={{ fontWeight: "bold" }}>Plan Description</span>
												<p style={{ margin: "2px 0 0" }}>{bookingdetails.package_detail}</p>
											</div>
										</li>
									))
								)}
							</ul>
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default Payment;
