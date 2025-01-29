import React, { useState, useEffect, useRef } from "react";
import "./floor.css";
import { Chair } from "@mui/icons-material";

const GFloorPlan = () => {
  console.log("Rendering Ground Floor");
  const floorRef = useRef(null); // Reference for the floor container

  // Define tables with chairs
  const [tables, setTables] = useState([
    {
      id: "Chair",
      chairs: [
        //Table1
        { id: 1, position: { x: 18.2, y: 8.5 }, rotation: -45, color: "gray" },
        { id: 2, position: { x: 23, y: 11 }, rotation: 135, color: "gray" },
        { id: 3, position: { x: 16, y: 11 }, rotation: 225, color: "gray" },
        //Table2
        { id: 4, position: { x: 36, y: 8.5 }, rotation: -45, color: "gray" },
        { id: 5, position: { x: 40.5, y: 11 }, rotation: 135, color: "gray" },
        { id: 6, position: { x: 34, y: 11.2 }, rotation: 225, color: "gray" },
        //Table3
        { id: 7, position: { x: 14.8, y: 13.8 }, rotation: -45, color: "gray" },
        { id: 8, position: { x: 18, y: 16 }, rotation: 225, color: "gray" },
        { id: 9, position: { x: 23.8, y: 13.5 }, rotation: 45, color: "gray" },
        //Table4
        { id: 10, position: { x: 33, y: 13.5 }, rotation: -45, color: "gray" },
        { id: 11, position: { x: 36.5, y: 15.8 }, rotation: 225, color: "gray" },
        { id: 12, position: { x: 42, y: 13.5 }, rotation: 45, color: "gray" },
        //Table5
        { id: 13, position: { x: 66, y: 8.7 }, rotation: 0, color: "gray" },
        { id: 14, position: { x: 70.5, y: 8.7 }, rotation: 0, color: "gray" },
        { id: 15, position: { x: 75, y: 8.7 }, rotation: 0, color: "gray" },

        { id: 16, position: { x: 61.5, y: 10 }, rotation: 270, color: "gray" },
        { id: 17, position: { x: 61.5, y: 12 }, rotation: 270, color: "gray" },
        { id: 18, position: { x: 61.5, y: 14 }, rotation: 270, color: "gray" },

        { id: 19, position: { x: 66, y: 15.3 }, rotation: 180, color: "gray" },
        { id: 20, position: { x: 70.5, y: 15.3 }, rotation: 180, color: "gray" },
        { id: 21, position: { x: 75, y: 15.3 }, rotation: 180, color: "gray" },

        { id: 22, position: { x: 79, y: 10 }, rotation: 90, color: "gray" },
        { id: 23, position: { x: 79, y: 12 }, rotation: 90, color: "gray" },
        { id: 24, position: { x: 79, y: 14 }, rotation: 90, color: "gray" },
        //Table 6
        { id: 25, position: { x: 69, y: 21 }, rotation: -45, color: "gray" },
        { id: 26, position: { x: 66.5, y: 23.5 }, rotation: 225, color: "gray" },
        { id: 27, position: { x: 73.5, y: 23.5 }, rotation: 135, color: "gray" },
//Table 7
        { id: 28, position: { x: 25, y: 21 }, rotation: -45, color: "gray" },
        { id: 29, position: { x: 22.2, y: 23.5 }, rotation: 225, color: "gray" },
        { id: 30, position: { x: 29.5, y: 23.5 }, rotation: 135, color: "gray" },
//Executive room chair
        { id: 31, position: { x: 24, y: 27.7 }, rotation: 0, color: "gray" },

        //Table8
        { id: 32, position: { x: 29, y: 41 }, rotation: 90, color: "gray" },
        { id: 33, position: { x: 29, y: 43.5 }, rotation: 90, color: "gray" },
        { id: 34, position: { x: 17.5, y: 41 }, rotation: 270, color: "gray" },
        { id: 35, position: { x: 17.5, y: 43.5 }, rotation: 270, color: "gray" },
//Table 9
        { id: 36, position: { x: 17, y: 47.4 }, rotation: 0, color: "gray" },
        { id: 37, position: { x: 24, y: 47.4 }, rotation: 0, color: "gray" },
        { id: 38, position: { x: 17, y: 51.5 }, rotation: 180, color: "gray" },
        { id: 39, position: { x: 24, y: 51.5 }, rotation: 180, color: "gray" },
//Table 10 meeting room
        { id: 40, position: { x: 68, y: 35.8 }, rotation: 0, color: "gray" },
        { id: 41, position: { x: 64, y: 35.8 }, rotation: 0, color: "gray" },
        { id: 42, position: { x: 60, y: 35.8 }, rotation: 0, color: "gray" },
        { id: 43, position: { x: 68, y: 39.4 }, rotation: 180, color: "gray" },
        { id: 44, position: { x: 64, y: 39.4 }, rotation: 180, color: "gray" },
        { id: 45, position: { x: 60, y: 39.4 }, rotation: 180, color: "gray" },
        { id: 46, position: { x: 56, y: 37.5 }, rotation: 270, color: "gray" },
        { id: 47, position: { x: 72.5, y: 37.5 }, rotation: 90, color: "gray" },
//small office
        { id: 48, position: { x: 83.2, y: 45.8 }, rotation: 270, color: "gray" },
        { id: 49, position: { x: 83.2, y: 48 }, rotation: 270, color: "gray" },
        { id: 50, position: { x: 71, y: 44 }, rotation: 180, color: "gray" },
        { id: 51, position: { x: 78, y: 44 }, rotation: 180, color: "gray" },
//office
        { id: 52, position: { x: 69, y: 50.9 }, rotation: 0, color: "gray" },
        { id: 53, position: { x: 78, y: 50.9 }, rotation: 0, color: "gray" },
        { id: 54, position: { x: 69, y: 55 }, rotation: 180, color: "gray" },
        { id: 55, position: { x: 78, y: 55 }, rotation: 180, color: "gray" },

        //small office
        { id: 56, position: { x: 84, y: 58 }, rotation: 270, color: "gray" },
        { id: 57, position: { x: 84, y: 60 }, rotation: 270, color: "gray" },
        { id: 58, position: { x: 75, y: 62.2 }, rotation: 0, color: "gray" },
        { id: 59, position: { x: 82, y: 62.2 }, rotation: 0, color: "gray" },
        //Table 15
        // { id: 60, position: { x: 84, y: 58 }, rotation: 270, color: "gray" },
        // { id: 61, position: { x: 84, y: 60 }, rotation: 270, color: "gray" },
      ],
    },
    {
      id: "Cabin",
      chairs: [
        { id: 1, position: { x: 16, y: 3 }, rotation: 200, color: "gray" },
        // { id: 1, position: { x: 20, y: 3 }, rotation: 160, color: "gray" },
        { id: 2, position: { x: 30, y: 3 }, rotation: 160, color: "gray" },
        { id: 3, position: { x: 39, y: 3 }, rotation: 160, color: "gray" },
        { id: 4, position: { x: 52, y: 3 }, rotation: 160, color: "gray" },
        { id: 5, position: { x: 61, y: 3 }, rotation: 160, color: "gray" },
        { id: 6, position: { x: 70, y: 3 }, rotation: 160, color: "gray" },
        { id: 7, position: { x: 79, y: 3 }, rotation: 160, color: "gray" },
        { id: 8, position: { x: 74, y: 31.5 }, rotation: 40, color: "gray" },
        { id: 9, position: { x: 65, y: 31.5 }, rotation: 40, color: "gray" },
        { id: 10, position: { x: 57, y: 31.5 }, rotation: 40, color: "gray" },
      ]
    }
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

export default GFloorPlan;