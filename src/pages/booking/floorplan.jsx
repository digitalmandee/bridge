import React, { useContext, useEffect, useState } from "react";
import TopNavbar from "../../components/topNavbar";
import Sidebar from "../../components/leftSideBar";
import Aseat from "../../assets/A-seat.png";
import Oseat from "../../assets/O-seat.png";
import datab from "../../assets/datab.png";
import { IoIosArrowDropright } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import GFloorPlan from "./floor/Gfloor/gfloor";
import FFloorPlan from "./floor/Ffloor/ffloor";
import colors from "../../assets/styles/color";
import { PieChart, Pie, Cell } from "recharts";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { FloorPlanContext } from "../../contexts/floorplan.context";
import axios from "axios";
import axiosInstance from "@/utils/axiosInstance";
import { Box, Button, TextField } from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const chartData = {
	labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
	datasets: [
		{
			label: "Total Sale",
			data: [35000, 28000, 32000, 30000, 35000, 28000, 38000, 25000],
			backgroundColor: "#FFB800",
			barThickness: 20,
			borderRadius: 4,
		},
	],
};

const chartOptions = {
	responsive: true,
	plugins: {
		legend: {
			display: false,
		},
		title: {
			display: true,
			text: "Total Sale",
			align: "start",
			font: {
				size: 16,
				weight: "bold",
			},
			padding: {
				bottom: 30,
			},
		},
	},
	scales: {
		y: {
			beginAtZero: true,
			grid: {
				drawBorder: false,
			},
			ticks: {
				maxTicksLimit: 5,
			},
		},
		x: {
			grid: {
				display: false,
			},
		},
	},
};

const floorPlanData = {
	labels: ["Available", "Occupied"],
	datasets: [
		{
			data: [32, 14],
			backgroundColor: ["#4285F4", "#34A853"],
			borderWidth: 0,
		},
	],
};

const floorPlanOptions = {
	cutout: "70%",
	plugins: {
		legend: {
			position: "bottom",
		},
	},
};

const Floorplan = () => {
	const { tables, selectedChairs, selectedFloor, setIsLoading, setTables, setSelectedChairs, setSelectedFloor, totalAvailableChairs, totalOccupiedChairs, setTotalAvailableChairs, setTotalOccupiedChairs, setBookingDetails } = useContext(FloorPlanContext);

	const navigate = useNavigate();
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");
	const handleClear = () => {
		setFromDate("");
		setToDate("");
	};
	const { branch } = useParams();
	const totalSelectedChairs = Object.values(selectedChairs).flat().length;

	const handleNextClick = () => {
		navigate(`/${branch}/branch/booking`); // Navigate to the Booking screen
		setBookingDetails((prevDetails) => ({ ...prevDetails, type: totalSelectedChairs > 1 ? "company" : "individual" })), [totalSelectedChairs];
	};

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};

	const handleFloorSelection = (floor) => {
		setSelectedFloor(floor); // Update the selected floor
		setIsDropdownOpen(false); // Close the dropdown
	};

	// Fetch floor and rooms data
	useEffect(() => {
		setSelectedChairs([]);
		const fetchFloorPlanData = async () => {
			// setIsLoading(true);
			try {
				const response = await axiosInstance.get(`floor-plan?floor_id=${selectedFloor}&from_date=${fromDate}&to_date=${toDate}`);
				if (response.data && Array.isArray(response.data.tables)) {
					setTotalAvailableChairs(response.data.totalAvailableChairs);
					setTotalOccupiedChairs(response.data.totalOccupiedChairs);
					setTables(response.data.tables);
				}
			} catch (error) {
				if (selectedFloor === 2) {
					setTables([
						{
							id: "A",
							name: "Table A",
							chairs: [
								{
									floor_id: 2,
									room_id: 2,
									table_id: 1,
									chair_id: 1,
									id: 1,
									position: {
										x: 15,
										y: 5.5,
									},
									rotation: 0,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 1,
									chair_id: 2,
									id: 2,
									position: {
										x: 19,
										y: 5.5,
									},
									rotation: 0,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 1,
									chair_id: 3,
									id: 3,
									position: {
										x: 23,
										y: 5.5,
									},
									rotation: 0,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 1,
									chair_id: 4,
									id: 4,
									position: {
										x: 15,
										y: 10.2,
									},
									rotation: 180,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 1,
									chair_id: 5,
									id: 5,
									position: {
										x: 19,
										y: 10.2,
									},
									rotation: 180,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 1,
									chair_id: 6,
									id: 6,
									position: {
										x: 23,
										y: 10.2,
									},
									rotation: 180,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 1,
									chair_id: 7,
									id: 7,
									position: {
										x: 31,
										y: 7.8,
									},
									rotation: 90,
									color: "gray",
									time_slot: "available",
								},
							],
						},
						{
							id: "B",
							name: "Table B",
							chairs: [
								{
									floor_id: 2,
									room_id: 2,
									table_id: 2,
									chair_id: 1,
									id: 1,
									position: {
										x: 17,
										y: 14.5,
									},
									rotation: 0,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 2,
									chair_id: 2,
									id: 2,
									position: {
										x: 21,
										y: 14.5,
									},
									rotation: 0,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 2,
									chair_id: 3,
									id: 3,
									position: {
										x: 25,
										y: 14.5,
									},
									rotation: 0,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 2,
									chair_id: 4,
									id: 4,
									position: {
										x: 17,
										y: 19.1,
									},
									rotation: 180,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 2,
									chair_id: 5,
									id: 5,
									position: {
										x: 21,
										y: 19.1,
									},
									rotation: 180,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 2,
									chair_id: 6,
									id: 6,
									position: {
										x: 25,
										y: 19.1,
									},
									rotation: 180,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 2,
									chair_id: 7,
									id: 7,
									position: {
										x: 32.5,
										y: 17,
									},
									rotation: 90,
									color: "gray",
									time_slot: "available",
								},
							],
						},
						{
							id: "C",
							name: "Table C",
							chairs: [
								{
									floor_id: 2,
									room_id: 2,
									table_id: 3,
									chair_id: 1,
									id: 1,
									position: {
										x: 46.5,
										y: 13,
									},
									rotation: -90,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 3,
									chair_id: 2,
									id: 2,
									position: {
										x: 46.5,
										y: 10,
									},
									rotation: 270,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 3,
									chair_id: 3,
									id: 3,
									position: {
										x: 55.5,
										y: 10,
									},
									rotation: 90,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 3,
									chair_id: 4,
									id: 4,
									position: {
										x: 55.5,
										y: 13,
									},
									rotation: 90,
									color: "gray",
									time_slot: "available",
								},
							],
						},
						{
							id: "D",
							name: "Table D",
							chairs: [
								{
									floor_id: 2,
									room_id: 2,
									table_id: 4,
									chair_id: 1,
									id: 1,
									position: {
										x: 70,
										y: 5.5,
									},
									rotation: -90,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 4,
									chair_id: 2,
									id: 2,
									position: {
										x: 70,
										y: 7.8,
									},
									rotation: -90,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 4,
									chair_id: 3,
									id: 3,
									position: {
										x: 70,
										y: 10,
									},
									rotation: -90,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 4,
									chair_id: 4,
									id: 4,
									position: {
										x: 70,
										y: 12.2,
									},
									rotation: -90,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 4,
									chair_id: 5,
									id: 5,
									position: {
										x: 70,
										y: 14.5,
									},
									rotation: -90,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 4,
									chair_id: 6,
									id: 6,
									position: {
										x: 80,
										y: 5.5,
									},
									rotation: 90,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 4,
									chair_id: 7,
									id: 7,
									position: {
										x: 80,
										y: 7.8,
									},
									rotation: 90,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 4,
									chair_id: 8,
									id: 8,
									position: {
										x: 80,
										y: 10,
									},
									rotation: 90,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 4,
									chair_id: 9,
									id: 9,
									position: {
										x: 80,
										y: 12.2,
									},
									rotation: 90,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 4,
									chair_id: 10,
									id: 10,
									position: {
										x: 80,
										y: 14.5,
									},
									rotation: 90,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 4,
									chair_id: 11,
									id: 11,
									position: {
										x: 75,
										y: 19,
									},
									rotation: 180,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 4,
									chair_id: 13,
									id: 12,
									position: {
										x: 71,
										y: 24,
									},
									rotation: 180,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 4,
									chair_id: 14,
									id: 13,
									position: {
										x: 77,
										y: 24,
									},
									rotation: 180,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 4,
									chair_id: 16,
									id: 14,
									position: {
										x: 71,
										y: 27.5,
									},
									rotation: 0,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 4,
									chair_id: 17,
									id: 15,
									position: {
										x: 77.5,
										y: 27.5,
									},
									rotation: 0,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 4,
									chair_id: 20,
									id: 16,
									position: {
										x: 77.5,
										y: 33.5,
									},
									rotation: 180,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 4,
									chair_id: 21,
									id: 17,
									position: {
										x: 71,
										y: 33.5,
									},
									rotation: 180,
									color: "gray",
									time_slot: "available",
								},
								
								{
									floor_id: 2,
									room_id: 2,
									table_id: 4,
									chair_id: 24,
									id: 18,
									position: {
										x: 71,
										y: 36.5,
									},
									rotation: 0,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 4,
									chair_id: 23,
									id: 19,
									position: {
										x: 77.5,
										y: 36.5,
									},
									rotation: 0,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 4,
									chair_id: 26,
									id: 20,
									position: {
										x: 64.5,
										y: 34.5,
									},
									rotation: 180,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 4,
									chair_id: 25,
									id: 21,
									position: {
										x: 64.5,
										y: 32.5,
									},
									rotation: 180,
									color: "gray",
									time_slot: "available",
								},
							],
						},
						{
							id: "E",
							name: "Table E",
							chairs: [
								{
									floor_id: 2,
									room_id: 2,
									table_id: 5,
									chair_id: 1,
									id: 1,
									position: {
										x: 30,
										y: 54.3,
									},
									rotation: 82,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 5,
									chair_id: 2,
									id: 2,
									position: {
										x: 31,
										y: 58,
									},
									rotation: 82,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 5,
									chair_id: 3,
									id: 3,
									position: {
										x: 32,
										y: 62,
									},
									rotation: 82,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 5,
									chair_id: 4,
									id: 4,
									position: {
										x: 33,
										y: 65,
									},
									rotation: 82,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 5,
									chair_id: 5,
									id: 5,
									position: {
										x: 34,
										y: 69,
									},
									rotation: 82,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 5,
									chair_id: 6,
									id: 6,
									position: {
										x: 35,
										y: 73,
									},
									rotation: 82,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 5,
									chair_id: 7,
									id: 7,
									position: {
										x: 36,
										y: 77,
									},
									rotation: 82,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 5,
									chair_id: 8,
									id: 8,
									position: {
										x: 37,
										y: 80.5,
									},
									rotation: 82,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 5,
									chair_id: 9,
									id: 9,
									position: {
										x: 38,
										y: 84,
									},
									rotation: 82,
									color: "gray",
									time_slot: "available",
								},
								{
									floor_id: 2,
									room_id: 2,
									table_id: 5,
									chair_id: 10,
									id: 10,
									position: {
										x: 43,
										y: 86.3,
									},
									rotation: 0,
									color: "gray",
									time_slot: "available",
								},
							],
						},
					]);
				}
				console.error("Error fetching floor plan data", error);
			} finally {
				setTimeout(() => setIsLoading(false), 500);
			}
		};

		if (selectedFloor) {
			fetchFloorPlanData();
		}
	}, [selectedFloor, fromDate, toDate]);

	const data = [
		{ name: "Available", value: 40, color: "#B0B0B0" }, // Grey
		{ name: "24 HOUR", value: 15, color: "#FFD700" }, // Yellow
		{ name: "Day", value: 20, color: "#FFA500" }, // Orange
		{ name: "Night", value: 25, color: "#6A5ACD" }, // Blue
	];

	return (
		<>
			<TopNavbar />
			<div className="main">
				<div className="sidebarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div
						style={{
							padding: "10px",
							display: "flex",
							width: "100%",
							/* flex-direction: column; */
							justifyContent: "space-between",
							alignItems: "center",
							backgroundColor: "transparent",
						}}>
						<h3 className="title">Floor Plan</h3>
						<Box display="flex" gap={2} alignItems="center">
							<TextField label="From Date" type="date" size="small" InputLabelProps={{ shrink: true }} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
							<TextField label="To Date" type="date" size="small" InputLabelProps={{ shrink: true }} value={toDate} onChange={(e) => setToDate(e.target.value)} />

							<Button variant="outlined" color="secondary" onClick={handleClear}>
								Clear
							</Button>
						</Box>
						<button className="btn create-booking-btn" onClick={handleNextClick} disabled={Object.entries(selectedChairs).length === 0}>
							Next
							<span className="icon">
								<IoIosArrowDropright />
							</span>
						</button>
					</div>
					{/* <div style={{
						display: 'flex',
						width:'100%',
					}}> */}
					<div
						style={{
							backgroundColor: "transparent",
							padding: "10px",
							width: "70%",
							/* margin-left: 1rem; */
							marginBottom: "0.5rem",
							/* margin: 2 auto; */
							display: "flex",
							flexDirection: "column",
							/* align-items: center; */
							/* justify-content: center; */
							/* text-align: center; */
						}}>
						<div
							style={{
								display: "flex",
								justifyContent: "flex-start",
								alignItems: "center",
								marginBottom: "20px",
								gap: "3.5rem",
								// backgroundColor:'#000'
							}}>
							<button
								style={{
									backgroundColor: colors.primary,
									color: "white",
									border: "none",
									borderRadius: "5px",
									width: "30%",
									padding: "10px 10px",
									fontSize: "14px",
									fontWeight: "bold",
									cursor: "pointer",
									boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
								}}>
								View Seats Allocation
							</button>

							{/* View Booking Request Button */}
							<button
								style={{
									backgroundColor: colors.primary,
									color: "white",
									border: "none",
									borderRadius: "5px",
									width: "30%",
									padding: "10px 10px",
									fontSize: "14px",
									fontWeight: "bold",
									cursor: "pointer",
									boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
								}}>
								View Booking Request
							</button>
							<button
								style={{
									backgroundColor: colors.primary,
									color: "white",
									border: "none",
									borderRadius: "5px",
									width: "20%",
									padding: "10px 10px",
									fontSize: "14px",
									fontWeight: "bold",
									cursor: "pointer",
									boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
								}}>
								Select Floor
							</button>
						</div>

						{/* Cards Section */}
						<div
							style={{
								display: "flex",
								justifyContent: "flex-start",
								alignItems: "center",
								marginBottom: "20px",
								// gap:'3.5rem',
								gap: "1.2rem",
								// backgroundColor:'black',
							}}>
							{/* Available Seats Card */}
							<div
								style={{
									backgroundColor: "white",
									borderRadius: "10px",
									padding: "20px",
									display: "flex",
									justifyContent: "space-between",
									// flex: '1',
									width: "35%",
									height: "20%",
									boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
									textAlign: "center",
								}}>
								<div>
									<h6 style={{ color: "#888", marginBottom: "10px" }}>Available Seats</h6>
									<h2 style={{ fontSize: "36px", color: "#000", margin: "0" }}>{totalAvailableChairs}</h2>
								</div>
								<div
									style={{
										width: "50px",
										height: "50px",
										backgroundColor: "#425af5",
										borderRadius: "10px",
										// margin: '0',
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "white",
									}}>
									<img src={Aseat} alt="" />
									{/* <span role="img" aria-label="seat">
                    🪑
                  </span> */}
								</div>
							</div>

							{/* Occupied Seats Card */}
							<div
								style={{
									backgroundColor: "white",
									borderRadius: "10px",
									padding: "20px",
									display: "flex",
									justifyContent: "space-between",
									// flex: '1',
									width: "35%",
									height: "20%",
									boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
									textAlign: "center",
								}}>
								<div>
									<h6 style={{ color: "#888", marginBottom: "10px" }}>Occupied Seats</h6>
									<h2 style={{ fontSize: "36px", color: "#000", margin: "0" }}>{totalOccupiedChairs}</h2>
								</div>
								<div
									style={{
										width: "50px",
										height: "50px",
										backgroundColor: "#00c853",
										borderRadius: "10px",
										// margin: '20px auto 0',
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "white",
									}}>
									<img src={Oseat} alt="" />
								</div>
							</div>

							{/* Floor Selector */}
							<div
								style={{
									width: "20.5%",
									backgroundColor: "white",
									borderRadius: "10px",
									padding: "20px",
									boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
									textAlign: "center",
									position: "relative",
									display: "flex",
									flexDirection: "column",
									justifyContent: "flex-start",
									height: "110px",
								}}>
								{/* Image Section */}
								<img
									src={datab}
									alt="Floor image"
									style={{
										alignSelf: "center",
										marginBottom: "auto",
									}}
								/>

								{/* Button Section */}
								<button
									onClick={toggleDropdown} // Toggle dropdown on button click
									style={{
										backgroundColor: "transparent",
										width: "100%",
										color: "#000",
										border: "none",
										marginTop: "15px",
										borderRadius: "10px",
										fontSize: "16px",
										fontWeight: "400",
										cursor: "pointer",
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between", // Add space between text and icon
									}}>
									{selectedFloor === 1 ? "G Floor" : selectedFloor === 2 ? "1st Floor" : "Select Floor"}
									<span style={{ fontSize: "16px" }}>▼</span>
									{/* {selectedFloor == 1 ? "G Floor" : "1st Floor"} <span style={{ fontSize: "16px" }}>▼</span> */}
								</button>

								{/* Dropdown Section */}
								{isDropdownOpen && (
									<div
										style={{
											marginTop: "10px",
											backgroundColor: "white",
											border: "1px solid #ddd",
											borderRadius: "5px",
											boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
											padding: "5px",
											textAlign: "left",
											position: "absolute",
											zIndex: 1,
											top: "100%",
											left: "0",
											width: "100%",
										}}>
										<div
											onClick={() => handleFloorSelection(1)} // Handle ground floor selection
											style={{
												padding: "8px 10px",
												cursor: "pointer",
												borderBottom: "1px solid #eee",
												backgroundColor: selectedFloor === 1 ? "#f0f0f0" : "white",
											}}>
											G Floor
										</div>
										<div
											onClick={() => handleFloorSelection(2)}
											style={{
												padding: "8px 10px",
												cursor: "pointer",
												backgroundColor: selectedFloor === 2 ? "#f0f0f0" : "white",
											}}>
											1st Floor
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
					{selectedFloor === 1 && <GFloorPlan />}
					{selectedFloor === 2 && <FFloorPlan />}
					{/* {selectedFloor === 1 ? <GFloorPlan /> : <FFloorPlan />} */}
				</div>
			</div>
		</>
	);
};

export default Floorplan;
