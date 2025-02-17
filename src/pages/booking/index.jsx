import React, { useContext, useEffect, useState } from "react";
import TopNavbar from "../../components/topNavbar";
import Sidebar from "../../components/leftSideBar";
import MemberDetail from "./memberdetail";
import BookingDetail from "./BookingDetail/bookingdetail";
import Payment from "./payment";
import { useNavigate } from "react-router-dom";
import { FloorPlanContext } from "../../contexts/floorplan.context";
import { FaCheck } from "react-icons/fa";
// import './style.css';
const Booking = () => {
	const navigate = useNavigate();

	const { selectedChairs } = useContext(FloorPlanContext);

	const [currentStep, setCurrentStep] = useState(1);
	const [paymentMethod, setPaymentMethod] = useState(null);
	const [receipt, setReceipt] = useState(null);

	const handleNext = () => setCurrentStep((prev) => prev + 1);
	const handlePrevious = () => setCurrentStep((prev) => prev - 1);

	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		setReceipt(file ? file.name : null);
	};

	const getHeadingText = () => {
		if (currentStep === 1) return "Member Detail";
		if (currentStep === 2) return "Booking Detail";
		if (currentStep === 3) return "Payment";
		return "";
	};

	useEffect(() => {
		if (Object.entries(selectedChairs).length === 0) return navigate("/branch/floorplan");
	}, []);

	// const handleConfirm = () => {
	//     if (!paymentMethod || !receipt) {
	//         alert("Please select a payment method and upload a receipt.");
	//         return;
	//     }
	//     alert(`Payment confirmed with ${paymentMethod} and receipt uploaded.`);
	// };

	const steps = [
		{ id: 1, label: "Step 1" },
		{ id: 2, label: "Step 2" },
		{ id: 3, label: "Step 3" },
	];


	return (
		<>
			<TopNavbar />
			<div className="main">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div //stepper-container
						style={{
							width: "100%",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							backgroundColor: "transparent",
							padding: "20px 0",
						}}>
						<div //step-heading
							style={{
								width: "100%",
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								marginBottom: "20px",
							}}>
							<h2
								style={{
									font: "Nunito Sans",
									fontWeight: "500",
									fontSize: "30px",
								}}>
								{getHeadingText()}
							</h2>
							{/* <h3 style={{ color: "#888" }}>
                                Today <span style={{ color: "#007bff" }}>03 Aug 2024</span>
                            </h3> */}
						</div>
						<div //stepper
							style={{
								// width: "50%",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								marginBottom: "20px",
								gap: '30px',
							}}>
							{steps.map((step, index) => (
								<div key={step.id} style={{
									display: "flex",
									// width:'30%',
									// flexDirection: "column",
									alignItems: "center",
									// textAlign: "center",
								}}>
									<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
										<div style={{
											width: "40px",
											height: "40px",
											borderRadius: "50%",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											fontWeight: "bold",
											fontSize: "16px",
											color: "white",
											backgroundColor: currentStep > step.id ? "#002855" : currentStep === step.id ? "#002855" : "#ccc",
											cursor: "pointer",
											position:'relative',
											zIndex:2
										}}
											onClick={() => setCurrentStep(step.id)}
										>
											{currentStep > step.id ? <FaCheck size={14} /> : step.id}
										</div>
										<p style={{ marginTop: "5px", fontSize: "14px", fontWeight: "500", textAlign: "center", minWidth: '60px' }}>{step.label}</p>
									</div>
									{index < steps.length - 1 && (
										<div
											style={{
												width: "120px",
												height: "3px",
												backgroundColor: currentStep > step.id ? "#002855" : "#ccc",
												position: "relative",
												top:'-20px',
												left:'10px',
												zIndex:'1'
											}}
										/>
									)}

								</div>
							))}
						</div>
					</div>
					{currentStep === 1 && <MemberDetail handleNext={handleNext} />}
					{currentStep === 2 && <BookingDetail handleNext={handleNext} handlePrevious={handlePrevious} />}
					{currentStep === 3 && <Payment />}
				</div>
			</div >
		</>
	);
};

export default Booking;
