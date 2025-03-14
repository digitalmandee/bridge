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
			setIsLoading(true);
			try {
				// const response = await axiosInstance.get(`floor-plan?floor_id=${selectedFloor}`);

				// if (response.data && Array.isArray(response.data.tables)) 
				// 	{
				// 	setTotalAvailableChairs(response.data.totalAvailableChairs);
				// 	setTotalOccupiedChairs(response.data.totalOccupiedChairs);
				// 	setTables(response.data.tables);
				// }
				setTotalAvailableChairs();
				setTotalOccupiedChairs();
				setTables([
					{
						"id": "A",
						"name": "Table A",
						"chairs": [
							{
								"floor_id": 1,
								"room_id": 1,
								"table_id": 1,
								"chair_id": 1,
								"id": 1,
								"position": {
									"x": 15,
									"y": 5.5
								},
								"rotation": 0,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 1,
								"table_id": 1,
								"chair_id": 2,
								"id": 2,
								"position": {
									"x": 19,
									"y": 5.5
								},
								"rotation": 0,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 1,
								"table_id": 1,
								"chair_id": 3,
								"id": 3,
								"position": {
									"x": 23,
									"y": 5.5
								},
								"rotation": 0,
								"color": "#F59E0B",
								"time_slot": "day"
							},
							{
								"floor_id": 1,
								"room_id": 1,
								"table_id": 1,
								"chair_id": 4,
								"id": 4,
								"position": {
									"x": 15,
									"y": 10.2
								},
								"rotation": 180,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 1,
								"table_id": 1,
								"chair_id": 5,
								"id": 5,
								"position": {
									"x": 19,
									"y": 10.2
								},
								"rotation": 180,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 1,
								"table_id": 1,
								"chair_id": 6,
								"id": 6,
								"position": {
									"x": 23,
									"y": 10.2
								},
								"rotation": 180,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 1,
								"table_id": 1,
								"chair_id": 7,
								"id": 7,
								"position": {
									"x": 31,
									"y": 7.8
								},
								"rotation": 90,
								"color": "gray",
								"time_slot": "available"
							}
						]
					},
					{
						"id": "B",
						"name": "Table B",
						"chairs": [
							{
								"floor_id": 1,
								"room_id": 2,
								"table_id": 2,
								"chair_id": 8,
								"id": 1,
								"position": {
									"x": 17,
									"y": 14.5
								},
								"rotation": 0,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 2,
								"table_id": 2,
								"chair_id": 9,
								"id": 2,
								"position": {
									"x": 21,
									"y": 14.5
								},
								"rotation": 0,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 2,
								"table_id": 2,
								"chair_id": 10,
								"id": 3,
								"position": {
									"x": 25,
									"y": 14.5
								},
								"rotation": 0,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 2,
								"table_id": 2,
								"chair_id": 11,
								"id": 4,
								"position": {
									"x": 17,
									"y": 19.1
								},
								"rotation": 180,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 2,
								"table_id": 2,
								"chair_id": 12,
								"id": 5,
								"position": {
									"x": 21,
									"y": 19.1
								},
								"rotation": 180,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 2,
								"table_id": 2,
								"chair_id": 13,
								"id": 6,
								"position": {
									"x": 25,
									"y": 19.1
								},
								"rotation": 180,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 2,
								"table_id": 2,
								"chair_id": 14,
								"id": 7,
								"position": {
									"x": 32.5,
									"y": 17
								},
								"rotation": 90,
								"color": "gray",
								"time_slot": "available"
							}
						]
					},
					{
						"id": "C",
						"name": "Table C",
						"chairs": [
							{
								"floor_id": 1,
								"room_id": 3,
								"table_id": 3,
								"chair_id": 15,
								"id": 1,
								"position": {
									"x": 46.5,
									"y": 13
								},
								"rotation": -90,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 3,
								"table_id": 3,
								"chair_id": 16,
								"id": 2,
								"position": {
									"x": 46.5,
									"y": 10
								},
								"rotation": 270,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 3,
								"table_id": 3,
								"chair_id": 17,
								"id": 3,
								"position": {
									"x": 55.5,
									"y": 10
								},
								"rotation": 90,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 3,
								"table_id": 3,
								"chair_id": 18,
								"id": 4,
								"position": {
									"x": 55.5,
									"y": 13
								},
								"rotation": 90,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 3,
								"table_id": 3,
								"chair_id": 19,
								"id": 5,
								"position": {
									"x": 51,
									"y": 15
								},
								"rotation": 180,
								"color": "gray",
								"time_slot": "available"
							}
						]
					},
					{
						"id": "D",
						"name": "Table D",
						"chairs": [
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 20,
								"id": 1,
								"position": {
									"x": 70,
									"y": 5.5
								},
								"rotation": -90,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 21,
								"id": 2,
								"position": {
									"x": 70,
									"y": 7.8
								},
								"rotation": -90,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 22,
								"id": 3,
								"position": {
									"x": 70,
									"y": 10
								},
								"rotation": -90,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 23,
								"id": 4,
								"position": {
									"x": 70,
									"y": 12.2
								},
								"rotation": -90,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 24,
								"id": 5,
								"position": {
									"x": 70,
									"y": 14.5
								},
								"rotation": -90,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 25,
								"id": 6,
								"position": {
									"x": 80,
									"y": 5.5
								},
								"rotation": 90,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 26,
								"id": 7,
								"position": {
									"x": 80,
									"y": 7.8
								},
								"rotation": 90,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 27,
								"id": 8,
								"position": {
									"x": 80,
									"y": 10
								},
								"rotation": 90,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 28,
								"id": 9,
								"position": {
									"x": 80,
									"y": 12.2
								},
								"rotation": 90,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 29,
								"id": 10,
								"position": {
									"x": 80,
									"y": 14.5
								},
								"rotation": 90,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 30,
								"id": 11,
								"position": {
									"x": 75,
									"y": 19
								},
								"rotation": 180,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 31,
								"id": 12,
								"position": {
									"x": 65,
									"y": 24
								},
								"rotation": 180,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 32,
								"id": 13,
								"position": {
									"x": 71,
									"y": 24
								},
								"rotation": 180,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 32,
								"id": 14,
								"position": {
									"x": 77,
									"y": 24
								},
								"rotation": 180,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 33,
								"id": 15,
								"position": {
									"x": 83,
									"y": 24
								},
								"rotation": 180,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 34,
								"id": 16,
								"position": {
									"x": 71,
									"y": 27.5
								},
								"rotation": 0,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 35,
								"id": 17,
								"position": {
									"x": 77.5,
									"y": 27.5
								},
								"rotation": 0,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 36,
								"id": 18,
								"position": {
									"x": 84,
									"y": 27.5
								},
								"rotation": 0,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 36,
								"id": 19,
								"position": {
									"x": 84,
									"y": 33.5
								},
								"rotation": 180,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 36,
								"id": 20,
								"position": {
									"x": 77.5,
									"y": 33.5
								},
								"rotation": 180,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 36,
								"id": 21,
								"position": {
									"x": 71,
									"y": 33.5
								},
								"rotation": 180,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 36,
								"id": 22,
								"position": {
									"x": 84,
									"y": 36.5
								},
								"rotation": 0,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 36,
								"id": 23,
								"position": {
									"x": 77.5,
									"y": 36.5
								},
								"rotation": 0,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 36,
								"id": 24,
								"position": {
									"x": 71,
									"y": 36.5
								},
								"rotation": 0,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 36,
								"id": 25,
								"position": {
									"x": 84,
									"y": 42.5
								},
								"rotation": 180,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 36,
								"id": 26,
								"position": {
									"x": 77.5,
									"y": 42.5
								},
								"rotation": 180,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 4,
								"table_id": 4,
								"chair_id": 36,
								"id": 27,
								"position": {
									"x": 71,
									"y": 42.5
								},
								"rotation": 180,
								"color": "gray",
								"time_slot": "available"
							}
						]
					},
					{
						"id": "E",
						"name": "Table E",
						"chairs": [
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 5,
								"chair_id": 37,
								"id": 1,
								"position": {
									"x": 30,
									"y": 54.3
								},
								"rotation": 82,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 5,
								"chair_id": 38,
								"id": 2,
								"position": {
									"x": 31,
									"y": 58
								},
								"rotation": 82,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 5,
								"chair_id": 39,
								"id": 3,
								"position": {
									"x": 32,
									"y": 62
								},
								"rotation": 82,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 5,
								"chair_id": 39,
								"id": 4,
								"position": {
									"x": 33,
									"y": 65
								},
								"rotation": 82,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 5,
								"chair_id": 39,
								"id": 5,
								"position": {
									"x": 34,
									"y": 69
								},
								"rotation": 82,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 5,
								"chair_id": 39,
								"id": 6,
								"position": {
									"x": 35,
									"y": 73
								},
								"rotation": 82,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 5,
								"chair_id": 39,
								"id": 7,
								"position": {
									"x": 36,
									"y": 77
								},
								"rotation": 82,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 5,
								"chair_id": 39,
								"id": 8,
								"position": {
									"x": 37,
									"y": 80.5
								},
								"rotation": 82,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 5,
								"chair_id": 39,
								"id": 9,
								"position": {
									"x": 38,
									"y": 84
								},
								"rotation": 82,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 5,
								"chair_id": 39,
								"id": 10,
								"position": {
									"x": 43,
									"y": 86.3
								},
								"rotation": 0,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 5,
								"chair_id": 39,
								"id": 11,
								"position": {
									"x": 51,
									"y": 86.3
								},
								"rotation": 0,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 5,
								"chair_id": 39,
								"id": 12,
								"position": {
									"x": 59,
									"y": 86.3
								},
								"rotation": 0,
								"color": "gray",
								"time_slot": "available"
							}
						]
					},
					{
						"id": "F",
						"name": "Table F",
						"chairs": [
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 6,
								"chair_id": 40,
								"id": 1,
								"position": {
									"x": 38.5,
									"y": 55
								},
								"rotation": -90,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 6,
								"chair_id": 41,
								"id": 2,
								"position": {
									"x": 38.5,
									"y": 58.3
								},
								"rotation": -90,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 6,
								"chair_id": 42,
								"id": 3,
								"position": {
									"x": 38.5,
									"y": 62
								},
								"rotation": -90,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 6,
								"chair_id": 43,
								"id": 4,
								"position": {
									"x": 38.5,
									"y": 65
								},
								"rotation": -90,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 6,
								"chair_id": 43,
								"id": 5,
								"position": {
									"x": 50,
									"y": 65
								},
								"rotation": 90,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 6,
								"chair_id": 43,
								"id": 6,
								"position": {
									"x": 50,
									"y": 61.5
								},
								"rotation": 90,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 6,
								"chair_id": 43,
								"id": 7,
								"position": {
									"x": 50,
									"y": 58
								},
								"rotation": 90,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 6,
								"chair_id": 43,
								"id": 8,
								"position": {
									"x": 50,
									"y": 55
								},
								"rotation": 90,
								"color": "gray",
								"time_slot": "available"
							}
						]
					},
					{
						"id": "G",
						"name": "Table G",
						"chairs": [
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 7,
								"chair_id": 44,
								"id": 1,
								"position": {
									"x": 58,
									"y": 52
								},
								"rotation": -90,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 7,
								"chair_id": 45,
								"id": 2,
								"position": {
									"x": 58,
									"y": 55
								},
								"rotation": -90,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 7,
								"chair_id": 46,
								"id": 3,
								"position": {
									"x": 58,
									"y": 58
								},
								"rotation": -90,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 7,
								"chair_id": 47,
								"id": 4,
								"position": {
									"x": 58,
									"y": 61.5
								},
								"rotation": -90,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 5,
								"table_id": 7,
								"chair_id": 47,
								"id": 5,
								"position": {
									"x": 58,
									"y": 65
								},
								"rotation": -90,
								"color": "gray",
								"time_slot": "available"
							}
						]
					},
					{
						"id": "H",
						"name": "Table H",
						"chairs": [
							{
								"floor_id": 1,
								"room_id": 6,
								"table_id": 8,
								"chair_id": 48,
								"id": 1,
								"position": {
									"x": 60,
									"y": 68
								},
								"rotation": 0,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 6,
								"table_id": 8,
								"chair_id": 49,
								"id": 2,
								"position": {
									"x": 54,
									"y": 68
								},
								"rotation": 0,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 6,
								"table_id": 8,
								"chair_id": 50,
								"id": 3,
								"position": {
									"x": 43,
									"y": 68
								},
								"rotation": 0,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 6,
								"table_id": 8,
								"chair_id": 50,
								"id": 4,
								"position": {
									"x": 43,
									"y": 74
								},
								"rotation": 180,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 6,
								"table_id": 8,
								"chair_id": 50,
								"id": 5,
								"position": {
									"x": 54,
									"y": 74
								},
								"rotation": 180,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 6,
								"table_id": 8,
								"chair_id": 50,
								"id": 6,
								"position": {
									"x": 60,
									"y": 74
								},
								"rotation": 180,
								"color": "gray",
								"time_slot": "available"
							}
						]
					},
					{
						"id": "I",
						"name": "Table I",
						"chairs": [
							{
								"floor_id": 1,
								"room_id": 6,
								"table_id": 9,
								"chair_id": 51,
								"id": 1,
								"position": {
									"x": 47,
									"y": 77
								},
								"rotation": 0,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 6,
								"table_id": 9,
								"chair_id": 52,
								"id": 2,
								"position": {
									"x": 54,
									"y": 77
								},
								"rotation": 0,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 6,
								"table_id": 9,
								"chair_id": 53,
								"id": 3,
								"position": {
									"x": 60,
									"y": 77
								},
								"rotation": 0,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 6,
								"table_id": 9,
								"chair_id": 54,
								"id": 4,
								"position": {
									"x": 60,
									"y": 83
								},
								"rotation": 180,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 6,
								"table_id": 9,
								"chair_id": 54,
								"id": 5,
								"position": {
									"x": 54,
									"y": 83
								},
								"rotation": 180,
								"color": "gray",
								"time_slot": "available"
							},
							{
								"floor_id": 1,
								"room_id": 6,
								"table_id": 9,
								"chair_id": 54,
								"id": 6,
								"position": {
									"x": 47,
									"y": 83
								},
								"rotation": 180,
								"color": "gray",
								"time_slot": "available"
							}
						]
					},
					// {
					// 	"id": "J",
					// 	"name": "Table J",
					// 	"chairs": [
					// 		{
					// 			"floor_id": 1,
					// 			"room_id": 6,
					// 			"table_id": 10,
					// 			"chair_id": 55,
					// 			"id": 1,
					// 			"position": {
					// 				"x": 76,
					// 				"y": 80
					// 			},
					// 			"rotation": 0,
					// 			"color": "gray",
					// 			"time_slot": "available"
					// 		},
					// 		{
					// 			"floor_id": 1,
					// 			"room_id": 6,
					// 			"table_id": 10,
					// 			"chair_id": 56,
					// 			"id": 2,
					// 			"position": {
					// 				"x": 81,
					// 				"y": 87
					// 			},
					// 			"rotation": 90,
					// 			"color": "gray",
					// 			"time_slot": "available"
					// 		},
					// 		{
					// 			"floor_id": 1,
					// 			"room_id": 6,
					// 			"table_id": 10,
					// 			"chair_id": 57,
					// 			"id": 3,
					// 			"position": {
					// 				"x": 72,
					// 				"y": 87
					// 			},
					// 			"rotation": 270,
					// 			"color": "gray",
					// 			"time_slot": "available"
					// 		},
					// 		{
					// 			"floor_id": 1,
					// 			"room_id": 6,
					// 			"table_id": 10,
					// 			"chair_id": 58,
					// 			"id": 4,
					// 			"position": {
					// 				"x": 77,
					// 				"y": 94
					// 			},
					// 			"rotation": 180,
					// 			"color": "gray",
					// 			"time_slot": "available"
					// 		}
					// 	]
					// }
				],);
			} catch (error) {
				console.error("Error fetching floor plan data", error);
			} finally {
				setTimeout(() => {
					setIsLoading(false);
				}, 500);
			}

		};

		fetchFloorPlanData();
	}, [selectedFloor]);

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
									// height: '10%',
									backgroundColor: "white",
									borderRadius: "10px",
									padding: "20px",
									// flex: '1',
									boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
									textAlign: "center",
									position: "relative",
									display: "flex",
									flexDirection: "column",
									justifyContent: "flex-start",
									height: "110px",
									// overflow:'hidden'
								}}>
								{/* Image Section */}
								<img
									src={datab}
									alt="Floor image"
									style={{
										alignSelf: "center",
										marginBottom: "auto",
										// height:'45px',
										// width:'45px'
									}}
								/>

								{/* Button Section */}
								<button
									onClick={toggleDropdown} // Toggle dropdown on button click
									style={{
										backgroundColor: "transparent",
										width: "100%",
										// marginTop: '15px', // Add margin between image and button
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
										// padding: '10px 15px', // Add padding for better look
									}}>
									{selectedFloor == 1 ? "G Floor" : "1st Floor"} <span style={{ fontSize: "16px" }}>▼</span>
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
											}}>
											G Floor
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
					{/* Pie Chart */}
					{/* <div
							style={{
								width: "350px",
								height: "333px",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								backgroundColor: "#ffffff",
								borderRadius: "10px",
								boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
								padding: "1rem",
							}}
						>
							<PieChart width={200} height={200}>
								<Pie
									data={data}
									dataKey="value"
									cx="50%"
									cy="50%"
									outerRadius={80}
									innerRadius={50}
									fill="#8884d8"
									label={false}
								>
									{data.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
							<p style={{ fontSize: "18px", fontWeight: "bold", marginTop: "-15px" }}>
								Total Seats
							</p>
							<p style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "10px" }}>
								100
							</p>
							<div style={{ display: "flex", gap: "15px", marginTop: "5px" }}>
								{data.map((item) => (
									<div key={item.name} style={{ display: "flex", alignItems: "center" }}>
										<span
											style={{
												width: "12px",
												height: "12px",
												backgroundColor: item.color,
												borderRadius: "50%",
												display: "inline-block",
												marginRight: "5px",
											}}
										></span>
										<span style={{ fontSize: "12px" }}>{item.name}</span>
									</div>
								))}
							</div>
						</div> */}
					{/* </div> */}
					{selectedFloor === 1 ? <GFloorPlan /> : <FFloorPlan />}
				</div>
			</div>
		</>
	);
};

export default Floorplan;
