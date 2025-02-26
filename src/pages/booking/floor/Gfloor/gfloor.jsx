import React, { useState, useEffect, useRef, useContext } from "react";
import "./floor.css";
import { Chair } from "@mui/icons-material";
import Loader from "../../../../components/Loader";
import axios from "axios";
import { FloorPlanContext } from "../../../../contexts/floorplan.context";

const GFloorPlan = () => {
	const floorRef = useRef(null); // Reference for the floor container
	const [prevChairDuration, setPrevChairDuration] = useState("");
	// Define tables with chairs

	const { isLoading, tables, selectedChairs, floorSize, setIsLoading, setTables, setSelectedChairs, setFloorSize } = useContext(FloorPlanContext);

	// Update floor size on resize
	useEffect(() => {
		const updateFloorSize = () => {
			if (floorRef.current) {
				setFloorSize({
					width: floorRef.current.offsetWidth,
					height: floorRef.current.offsetHeight,
				});
			}
		};

		updateFloorSize();
		window.addEventListener("resize", updateFloorSize);

		return () => {
			window.removeEventListener("resize", updateFloorSize);
		};
	}, []);

	// Toggle chair and selection
	const toggleChairColor = (tableId, chairId) => {
		// Find the selected table and chair
		const chairData = tables.find((table) => table.id === tableId)?.chairs.find((chair) => chair.id === chairId);
		if (!chairData) return; // If no chair found, return

		// Clone the previous state to avoid mutation
		const newSelected = { ...selectedChairs };

		// Initialize the array for this tableId if it doesn't exist
		if (!newSelected[tableId]) {
			newSelected[tableId] = [];
		}

		const tableSelectedChairs = newSelected[tableId];

		// Check if the chair is already selected
		const chairIndex = tableSelectedChairs.findIndex((chair) => chair.id === chairId);

		if (chairIndex > -1) {
			// If the chair is found, remove it
			tableSelectedChairs.splice(chairIndex, 1);
		} else {
			// Otherwise, add the chair
			tableSelectedChairs.push(chairData);
		}

		// If the table has no chairs, remove the table from the state
		if (tableSelectedChairs.length === 0) {
			delete newSelected[tableId];
		}

		// Return a new object for state with the updated chairs for the specific tableId
		setSelectedChairs({ ...newSelected });

		// Update chair color
		tables.forEach((table) => {
			if (table.id === tableId) {
				table.chairs.forEach((chair) => {
					if (chair.id === chairId) {
						chair.activeColor = chair.activeColor ? "" : "#ffb700";
					}
				});
			}
		});
	};
	return (
		<>
			<div className="container">
				{isLoading ? (
					<Loader />
				) : (
					<div className="floor" ref={floorRef}>
						{tables.length > 0 &&
							tables.map((table) =>
								table.chairs.length > 0
									? table.chairs.map((chair) => (
										<Chair
											className="chair"
											key={`${table.id}${chair.id}`}
											sx={{
												color: chair.activeColor ? chair.activeColor : chair.color,
												position: "absolute",
												top: `${(chair.position.y / 100) * floorSize.height}px`,
												left: `${(chair.position.x / 100) * floorSize.width}px`,
												transform: `rotate(${chair.rotation}deg)`,
												cursor: chair.time_slot === "full_day" ? "not-allowed" : "pointer",
												fontSize: "30px",
											}}
											onClick={() =>
												chair.time_slot !== "full_day" && toggleChairColor(table.id, chair.id)
											}
										/>
									))
									: null
							)}
					</div>
				)}

				{/* Display Selected Chairs */}
				<div
					style={{
						marginLeft: "1rem",
						width: "100%", // Adjust width as needed
						maxWidth: "250px", // Set max width
						height: "200px", // Set max height to enable scrolling
						backgroundColor: "white", // White background
						borderRadius: "0.5rem", // Rounded corners
						padding: "0", // Remove padding
						boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Optional shadow
						overflow: "hidden", // Enable vertical scrolling
						border: "1px solid #ddd",
					}}
				>
					<h4
						style={{
							background: "#0D2B4E",
							color: "white",
							margin: 0,
							padding: "0.75rem",
							borderTopLeftRadius: "0.5rem",
							borderTopRightRadius: "0.5rem",
							textAlign: "center",
						}}
					>
						Selected Items:
					</h4>

					{Object.entries(selectedChairs).length > 0 && (
						<div
							style={{
								display: "flex",
								flexWrap: "wrap",
								gap: "8px",
								padding: "0.5rem",
								overflowY: "auto",
								maxHeight: "150px",
								scrollbarWidth: "none",
								msOverflowStyle: "none",
							}}
							className="hide-scrollbar"
						>
							{Object.entries(selectedChairs).map(([tableId, chairs]) =>
								chairs.map((chair) => (
									<div
										key={`${tableId}-${chair.id}`}
										style={{
											padding: "5px 10px",
											background: "#E3F2FD", // Light blue for contrast
											borderRadius: "5px",
											fontSize: "14px",
											fontWeight:'bold',
											whiteSpace: "nowrap", // Prevents breaking inside the box
										}}
									>
										{tableId} - {chair.id}
									</div>
								))
							)}
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default GFloorPlan;
