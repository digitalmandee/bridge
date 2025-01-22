import React, { useState, useEffect, useRef } from "react";
import "./floor.css";
import { Chair } from "@mui/icons-material";

const FloorPlan = () => {
  const floorRef = useRef(null); // Reference for the floor container

  // Define tables with chairs
  const [tables, setTables] = useState([
    {
      id: "Chair",
      chairs: [
        { id: 1, position: { x: 18.2, y: 8.2 }, rotation: -45, color: "gray" },
        { id: 2, position: { x: 23.5, y: 10.5 }, rotation: 135, color: "gray" },
        { id: 3, position: { x: 16, y: 10.7 }, rotation: 225, color: "gray" },
       
        { id: 4, position: { x: 36.5, y: 8.2 }, rotation: -45, color: "gray" },
        { id: 5, position: { x: 41.5, y: 10.5 }, rotation: 135, color: "gray" },
        { id: 6, position: { x: 34, y: 10.7 }, rotation: 225, color: "gray" },

        { id: 7, position: { x: 15.7, y: 13.3 }, rotation: -45, color: "gray" },
        { id: 8, position: { x: 18.6, y: 15.6 }, rotation: 225, color: "gray" },
        { id: 9, position: { x: 23.1, y: 13.2 }, rotation: 45, color: "gray" },

        { id: 10, position: { x: 34, y: 13.3 }, rotation: -45, color: "gray" },
        { id: 11, position: { x: 36.7, y: 15.6 }, rotation: 225, color: "gray" },
        { id: 12, position: { x: 41.8, y: 13.3 }, rotation: 45, color: "gray" },



        { id: 13, position: { x: 67, y: 8.8 }, rotation: 0, color: "gray" },
        { id: 14, position: { x: 71, y: 8.8 }, rotation: 0, color: "gray" },
        { id: 15, position: { x: 75, y: 8.8 }, rotation: 0, color: "gray" },
        { id: 16, position: { x: 63, y: 10.3}, rotation: 270, color: "gray" },
        { id: 17, position: { x: 63, y: 12}, rotation: 270, color: "gray" },
        { id: 18, position: { x: 63, y: 13.7}, rotation: 270, color: "gray" },
        { id: 19, position: { x: 67, y: 15.3 }, rotation: 180, color: "gray" },
        { id: 20, position: { x: 71, y: 15.3 }, rotation: 180, color: "gray" },
        { id: 21, position: { x: 75, y: 15.3 }, rotation: 180, color: "gray" },
        { id: 22, position: { x: 80, y: 10.3}, rotation: 90, color: "gray" },
        { id: 23, position: { x: 80, y: 12}, rotation: 90, color: "gray" },
        { id: 24, position: { x: 80, y: 13.7 }, rotation: 90, color: "gray" },
        { id: 25, position: { x: 67, y: 18.5 }, rotation: 0, color: "gray" },
        { id: 26, position: { x: 71, y: 18.5 }, rotation: 0, color: "gray" },
        { id: 27, position: { x: 75, y: 18.5 }, rotation: 0, color: "gray" },
        { id: 28, position: { x: 63, y: 20.2}, rotation: 270, color: "gray" },
        { id: 29, position: { x: 63, y: 21.7}, rotation: 270, color: "gray" },
        { id: 30, position: { x: 63, y: 23.2}, rotation: 270, color: "gray" },
        { id: 31, position: { x: 67.3, y: 25 }, rotation: 180, color: "gray" },
        { id: 32, position: { x: 71.3, y: 25 }, rotation: 180, color: "gray" },
        { id: 33, position: { x: 75.3, y: 25 }, rotation: 180, color: "gray" },
        { id: 34, position: { x: 80.1, y: 20.2}, rotation: 90, color: "gray" },
        { id: 35, position: { x: 80.1, y: 21.7}, rotation: 90, color: "gray" },
        { id: 36, position: { x: 80.1, y: 23.2}, rotation: 90, color: "gray" },
        { id: 37, position: { x: 18, y: 19.8}, rotation: 0, color: "gray" },
        { id: 38, position: { x: 26, y: 19.8}, rotation: 0, color: "gray" },
        { id: 39, position: { x: 18, y: 23.8}, rotation: 180, color: "gray" },
        { id: 40, position: { x: 26, y: 23.8}, rotation: 180, color: "gray" },
        { id: 41, position: { x: 24.5, y: 27.8}, rotation: 0, color: "gray" },
        { id: 42, position: { x: 28, y: 40.5}, rotation: 90, color: "gray" },
        { id: 43, position: { x: 28, y: 43.5}, rotation: 90, color: "gray" },
        { id: 44, position: { x: 17.5, y: 40.5}, rotation: 270, color: "gray" },
        { id: 45, position: { x: 17.5, y: 43.5}, rotation: 270, color: "gray" },
        { id: 46, position: { x: 16.7, y: 47.7}, rotation: 0, color: "gray" },
        { id: 47, position: { x: 24.5, y: 47.7}, rotation: 0, color: "gray" },
        { id: 48, position: { x: 16.7, y: 51.6}, rotation: 180, color: "gray" },
        { id: 49, position: { x: 24.5, y: 51.6}, rotation: 180, color: "gray" },
        { id: 50, position: { x: 72, y: 45.7}, rotation: 180, color: "gray" },
        { id: 51, position: { x: 77, y: 45.7}, rotation: 180, color: "gray" },
        { id: 52, position: { x: 80.7, y: 46.8}, rotation: 270, color: "gray" },
        { id: 53, position: { x: 80.7, y: 48.3}, rotation: 270, color: "gray" },
        { id: 54, position: { x: 69.9, y: 51.3}, rotation: 0, color: "gray" },
        { id: 55, position: { x: 78, y: 51.3}, rotation: 0, color: "gray" },
        { id: 56, position: { x: 69.9, y: 55.3}, rotation: 180, color: "gray" },
        { id: 57, position: { x: 78, y: 55.3}, rotation: 180, color: "gray" },
        { id: 58, position: { x: 73, y: 61.3}, rotation: 0, color: "gray" },
        { id: 59, position: { x: 78, y: 61.3}, rotation: 0, color: "gray" },
        { id: 60, position: { x: 80.7, y: 60}, rotation: 270, color: "gray" },
        { id: 61, position: { x: 80.7, y: 58.5}, rotation: 270, color: "gray" },
      ],
    },
    {
      id: "Cabin",
      chairs: [
        { id: 1, position: { x: 16, y: 3 }, rotation: 200, color: "gray" },
        { id: 1, position: { x: 20, y: 3 }, rotation: 160, color: "gray" },
        { id: 2, position: { x: 30, y: 3 }, rotation: 160, color: "gray" },
        { id: 3, position: { x: 39, y: 3 }, rotation: 160, color: "gray" },
        { id: 4, position: { x: 52, y: 3 }, rotation: 160, color: "gray" },
        { id: 5, position: { x: 61, y: 3 }, rotation: 160, color: "gray" },
        { id: 6, position: { x: 70, y: 3 }, rotation: 160, color: "gray" },
        { id: 7, position: { x: 79, y: 3 }, rotation: 160, color: "gray" },
        { id: 8, position: { x: 74, y: 31.5 }, rotation: 40, color: "gray" },
        { id: 9, position: { x: 65, y: 31.5 }, rotation: 40, color: "gray" },
        { id: 10, position: { x: 57, y: 31.5 }, rotation: 40, color: "gray" },
      ]}
  ]);

  const [selectedChairs, setSelectedChairs] = useState([]);
  const [floorSize, setFloorSize] = useState({ width: 0, height: 0 });

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
    const chairIdentifier = `${tableId}${chairId}`;

    setSelectedChairs((prevSelected) => {
      const isSelected = prevSelected.includes(chairIdentifier);
      if (isSelected) {
        return prevSelected.filter((id) => id !== chairIdentifier);
      } else {
        return [...prevSelected, chairIdentifier];
      }
    });

    // Update chair color
    tables.forEach((table) => {
      table.chairs.forEach((chair) => {
        if (chair.id === chairId && table.id === tableId) {
          chair.color = chair.color === "gray" ? "#ffb700" : "gray";
        }
      });
    });
  };

  return (
    <>
    <div className="container">
      <div className="floor" ref={floorRef}>
        {tables.map((table) =>
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
              onClick={() => toggleChairColor(table.id, chair.id)}
            />
          ))
        )}
      </div>
      {/* Display Selected Chairs */}
      <div className="selected-chairs">
        <h3>Selected Chairs:</h3>
        <ul>
          {selectedChairs.map((chairId) => (
            <li key={chairId}>{chairId}</li>
          ))}
        </ul>
      </div>
    </div>
    </>
  );
};

export default FloorPlan;