import React, { useState, useEffect, useRef, useContext } from "react";
import "./style.css";
import { Chair } from "@mui/icons-material";
import Loader from "../../../../components/Loader";

import { FloorPlanContext } from "../../../../contexts/floorplan.context";

const FFloorPlan = () => {
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

    const chairIdentifier = `${tableId}${chairId}`;

    setSelectedChairs((prevSelected) => {
      const newSelected = { ...prevSelected };

      // Check if the tableId already has selected chairs
      if (!newSelected[tableId]) {
        newSelected[tableId] = [];
      }

      const tableSelectedChairs = newSelected[tableId];

      // If the chair is already selected, remove it
      const chairIndex = tableSelectedChairs.findIndex((chair) => chair.id === chairId);
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
          <div className="floor1" ref={floorRef}>
            {tables.length > 0 &&
              tables.map(
                (table) =>
                  table.chairs.length > 0 &&
                  table.chairs.map((chair) => (
                    <Chair
                      className="chair"
                      key={`${table.id}${chair.id}`}
                      sx={{
                        color: chair.activeColor ? chair.activeColor : chair.color,
                        position: "absolute",
                        top: `${(chair.position.y / 100) * floorSize.height}px`,
                        left: `${(chair.position.x / 100) * floorSize.width}px`,
                        transform: `rotate(${chair.rotation}deg)`,
                        cursor: chair.duration === "24" ? "not-allowed" : "pointer",
                        fontSize: "30px",
                      }}
                      onClick={() => chair.duration != "24" && toggleChairColor(table.id, chair.id)}
                    />
                  ))
              )}
          </div>
        )}
        {/* Display Selected Chairs */}
        <div className="selected-chairs">
          <h3>Selected Chairs:</h3>
          {Object.entries(selectedChairs).length > 0 && (
            <ul>
              {Object.entries(selectedChairs).map(([tableId, chairs]) =>
                chairs.map((chair) => (
                  <li key={chair.id}>
                    {chair.chair_id}
                    {tableId}
                    {chair.id}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default FFloorPlan;
