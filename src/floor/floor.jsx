import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import "./floor.css";
import { Chair } from "@mui/icons-material";
import { FloorPlanContext } from "../contexts/floorplan.context";
import Loader from "../components/Loader";

const FloorPlan = () => {
  const floorRef = useRef(null); // Reference for the floor container
  // Define tables with chairs

  const {isLoading,tables,selectedChairs,floorSize,setIsLoading,setTables,setSelectedChairs,setFloorSize} = useContext(FloorPlanContext);

  // Fetch floor and rooms data
  useEffect(() => {
    const fetchFloorPlanData = async () => {
      setIsLoading(true);
      try {
        const branchId = 1; // Use the actual branch ID here
        const floorId = 1; // Use the actual floor ID here

        const response = await axios.get(process.env.REACT_APP_BASE_API +`floor-plan?branch_id=${branchId}&floor_id=${floorId}`);

        if (response.data && Array.isArray(response.data.tables)) {
          setTables(response.data.tables);
        }
      } catch (error) {
        console.error("Error fetching floor plan data", error);
      } finally {
        setTimeout(() => {
          console.log(tables);

          setIsLoading(false);
        }, 500);
      }
    };

    fetchFloorPlanData();
  }, []);

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

    const chairIdentifier = `${tableId}${chairId}`;

    setSelectedChairs((prevSelected) => {
      const newSelected = { ...prevSelected };

      // Check if the tableId already has selected chairs
      if (!newSelected[tableId]) {
        newSelected[tableId] = [];
      }

      const tableSelectedChairs = newSelected[tableId];

      // If the chair is already selected, remove it
      const chairIndex = tableSelectedChairs.findIndex(
        (chair) => chair.id === chairId
      );
      if (chairIndex > -1) {
        tableSelectedChairs.splice(chairIndex, 1);
      } else {
        // If not selected, add it
        tableSelectedChairs.push(chairData);
      }

      return newSelected;
    });

    // Update chair color
    tables.forEach((table) => {
      if (table.id === tableId) {
        table.chairs.forEach((chair) => {
          if (chair.id === chairId) {
            chair.color = chair.color === "gray" ? "#ffb700" : "gray";
          }
        });
      }
    });
  };

  return (
    <>
      <div className="container position-relative">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="floor" ref={floorRef}>
            {tables.length > 0 &&
              tables.map(
                (table) =>
                  table.chairs.length > 0 &&
                  table.chairs.map((chair) => (
                    <Chair
                      className="chair"
                      key={`${table.id}${chair.id}`}
                      sx={{
                        color: chair.color,
                        position: "absolute",
                        top: `${(chair.position.y / 100) * floorSize.height}px`,
                        left: `${(chair.position.x / 100) * floorSize.width}px`,
                        transform: `rotate(${chair.rotation}deg)`,
                        cursor: "pointer",
                        fontSize: "30px",
                      }}
                      onClick={() => toggleChairColor(table.id, chair.id)
                      }
                    />
                  ))
              )}
          </div>
        )}
        {/* Display Selected Chairs */}
        {Object.entries(selectedChairs).length > 0 && (
          <div className="selected-chairs">
            <h3>Selected Chairs:</h3>
            <ul>
              {Object.entries(selectedChairs).map(([tableId, chairs]) => (
                chairs.map((chair) => (
                  <li key={chair.id}>{tableId}{chair.id}</li>
                ))
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default FloorPlan;
