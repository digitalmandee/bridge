import React, { useEffect, useState } from "react";
import TopNavbar from "../../components/topNavbar";
import Sidebar from "../../components/leftSideBar";
import "bootstrap/dist/css/bootstrap.min.css";
import ChairIcon from "@mui/icons-material/Chair";
import { Box } from "@mui/material";
import colors from "../../assets/styles/color";
import axiosInstance from "@/utils/axiosInstance";
import { MdArrowBackIos } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const SeatCard = ({ seatNumber, userName, planName, status, location, floor, profile_image }) => {
	return (
		<div className="col-md-3 mb-4">
			<div className="card" style={{ position: "relative" }}>
				{/* Chair Icon Section */}
				<Box
					className="chair-container mb-2"
					sx={{
						textAlign: "center",
						marginTop: "20px",
					}}>
					{profile_image ? (
						<img src={import.meta.env.VITE_ASSET_API + profile_image} alt="image" style={{ width: "80px", height: "80px", borderRadius: "10px" }} />
					) : (
						<Box
							className="chair-icon"
							sx={{
								backgroundColor: colors.primary,
								padding: "15px",
								borderRadius: "10px",
								display: "inline-block",
							}}>
							<ChairIcon
								sx={{
									fontSize: 50,
									color: "white",
								}}
							/>
						</Box>
					)}
					<div
						className="chair-label"
						style={{
							marginTop: "5px",
							fontSize: "14px",
							color: "#555",
						}}>
						{seatNumber}
					</div>
				</Box>
				<div
					className="card-body text-center"
					style={{
						borderTop: "2px dotted #D8D8D8",
					}}>
					<h6 className="card-title">{userName}</h6>
					<div className="row text-center">
						<div className="col-6">
							<h6>{planName}</h6>
							<p className="mb-0 text-muted">Plan</p>
						</div>
						<div className="col-6">
							<h6>{status}</h6>
							<p className="mb-0 text-muted">Status</p>
						</div>
						<div className="col-6">
							<h6>{location}</h6>
							<p className="mb-0 text-muted">Location</p>
						</div>
						<div className="col-6">
							<h6>{floor}</h6>
							<p className="mb-0 text-muted">Floor</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const SeatsAllocation = () => {
	const navigate = useNavigate();
	const [seatData2, setSeatData2] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchFloorPlanData = async () => {
			setIsLoading(true);
			try {
				const response = await axiosInstance.get(`seat-allocations`);
				console.log(response.data.seats);

				if (response.data.success) {
					setSeatData2(response.data.seats);
				}
			} catch (error) {
				console.error("Error fetching floor plan data", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchFloorPlanData();
	}, []);

	return (
		<>
			<TopNavbar />
			<div className="main">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div style={{ display: "flex", flexDirection: "column" }}>
						<div className="d-flex align-items-center mt-4 mb-4">
							<div onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
								<MdArrowBackIos style={{ fontSize: "20px", marginRight: "1rem" }} />
							</div>
							<h4 style={{ margin: 0 }}>Seat Allocation</h4>
						</div>
						<div className="row">
							{seatData2.length > 0 ? (
								seatData2.map((booking) => (
									<div key={booking.booking_id} className="col-md-3 mb-4">
										<div className="card" style={{ position: "relative" }}>
											{/* Chair Icon Section */}
											<Box className="chair-container mb-2" sx={{ textAlign: "center", marginTop: "20px" }}>
												{booking?.user?.profile_image ? (
													<img src={import.meta.env.VITE_ASSET_API + booking?.user?.profile_image} alt="profile" style={{ width: "80px", height: "80px", borderRadius: "10px" }} />
												) : (
													<Box className="chair-icon" sx={{ backgroundColor: colors.primary, padding: "15px", borderRadius: "10px", display: "inline-block" }}>
														<ChairIcon sx={{ fontSize: 50, color: "white" }} />
													</Box>
												)}

												<div className="chair-label" style={{ marginTop: "5px", fontSize: "14px", color: "#555" }}>
													{booking?.name}
												</div>
											</Box>

											{/* Card Body Section */}
											<div className="card-body text-center" style={{ borderTop: "2px dotted #D8D8D8" }}>
												<h6 className="card-title">{booking?.user?.name}</h6>

												<div className="row text-center">
													<div className="col-6">
														<h6>{booking?.plan?.name}</h6>
														<p className="mb-0 text-muted">Plan</p>
													</div>
													<div className="col-6">
														<h6>Booked</h6>
														<p className="mb-0 text-muted">Status</p>
													</div>
													<div className="col-6">
														<h6>{booking?.branch?.name}</h6>
														<p className="mb-0 text-muted">Location</p>
													</div>
													<div className="col-6">
														<h6>{booking?.floor?.name}</h6>
														<p className="mb-0 text-muted">Floor</p>
													</div>
												</div>

												{/* Display total chairs count */}
												<div className="mt-3">
													<h6 style={{ color: "#555" }}>
														Total Chairs: <span className="text-primary">{booking.chairs?.length || 0}</span>
													</h6>
												</div>
											</div>
										</div>
									</div>
								))
							) : (
								<p>No seats found.</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default SeatsAllocation;
