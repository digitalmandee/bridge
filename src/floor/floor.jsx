import React, { useState, useEffect, useRef } from "react";
import "./floor.css";
import { Chair } from "@mui/icons-material";

const FloorPlan = () => {
  const floorRef = useRef(null); // Reference for the floor container

  // Define tables with chairs
  const [tables, setTables] = useState([
    {
      id: "A",
      chairs: [
        { id: 1, position: { x: 12, y: 3 }, rotation: 0, color: "gray" },
        { id: 2, position: { x: 15, y: 3 }, rotation: 0, color: "gray" },
        { id: 3, position: { x: 18, y: 3 }, rotation: 0, color: "gray" },
        { id: 4, position: { x: 12, y: 13 }, rotation: 180, color: "gray" },
        { id: 5, position: { x: 15, y: 13 }, rotation: 180, color: "gray" },
        { id: 6, position: { x: 18, y: 13 }, rotation: 180, color: "gray" },
        { id: 7, position: { x: 23.7, y: 8 }, rotation: 90, color: "gray" },
      ],
    },
    {
      id: "B",
      chairs: [
        { id: 1, position: { x: 14, y: 22.5 }, rotation: 0, color: "gray" },
        { id: 2, position: { x: 17, y: 22.5 }, rotation: 0, color: "gray" },
        { id: 3, position: { x: 20, y: 22.5 }, rotation: 0, color: "gray" },
        { id: 4, position: { x: 14, y: 32.5 }, rotation: 180, color: "gray" },
        { id: 5, position: { x: 17, y: 32.5 }, rotation: 180, color: "gray" },
        { id: 6, position: { x: 20, y: 32.5 }, rotation: 180, color: "gray" },
        { id: 7, position: { x: 25.3, y: 27 }, rotation: 90, color: "gray" },
      ],
    },
    {
      id: "C",
      chairs: [
        { id: 1, position: { x: 54.5, y: 3 }, rotation: 0, color: "gray" },
        { id: 2, position: { x: 50, y: 10 }, rotation: 270, color: "gray" },
        { id: 3, position: { x: 59.2, y: 10 }, rotation: 90, color: "gray" },
        { id: 4, position: { x: 54.5, y: 17 }, rotation: 180, color: "gray" },
      ],
    },
    {
      id: "D",
      chairs: [
        { id: 1, position: { x: 77.5, y: 3 }, rotation: 0, color: "gray" },
        { id: 2, position: { x: 81.2, y: 8.5 }, rotation: 90, color: "gray" },
        { id: 3, position: { x: 81.2, y: 14 }, rotation: 90, color: "gray" },
        { id: 4, position: { x: 81.2, y: 19.5 }, rotation: 90, color: "gray" },
        { id: 5, position: { x: 81.2, y: 25 }, rotation: 90, color: "gray" },
        { id: 6, position: { x: 81.2, y: 30.5 }, rotation: 90, color: "gray" },
        { id: 7, position: { x: 81.2, y: 36 }, rotation: 90, color: "gray" },
        { id: 8, position: { x: 81.2, y: 41.5 }, rotation: 90, color: "gray" },
        { id: 9, position: { x: 81.2, y: 47 }, rotation: 90, color: "gray" },
        { id: 10, position: { x: 73.8, y: 8.5 }, rotation: 270, color: "gray" },
        { id: 11, position: { x: 73.8, y: 14 }, rotation: 270, color: "gray" },
        { id: 12, position: { x: 73.8, y: 19.5 }, rotation: 270, color: "gray" },
        { id: 13, position: { x: 73.8, y: 25 }, rotation: 270, color: "gray" },
        { id: 14, position: { x: 73.8, y: 30.5 }, rotation: 270, color: "gray" },
        { id: 15, position: { x: 73.8, y: 36 }, rotation: 270, color: "gray" },
        { id: 16, position: { x: 73.8, y: 41.5 }, rotation: 270, color: "gray" },
        { id: 17, position: { x: 73.8, y: 47 }, rotation: 270, color: "gray" },
        { id: 18, position: { x: 77.5, y: 51.7 }, rotation: 180, color: "gray" },

      ],
    },
    {
      id: "E",
      chairs: [
        { id: 1, position: { x: 19, y: 72 }, rotation: 90, color: "gray" },
        { id: 2, position: { x: 19, y: 78 }, rotation: 90, color: "gray" },
        { id: 3, position: { x: 19, y: 84 }, rotation: 90, color: "gray" },

      ],
    },
    {
      id: "F",
      chairs: [
        { id: 1, position: { x: 31.5, y: 59 }, rotation: 0, color: "gray" },
        { id: 2, position: { x: 36.2, y: 66 }, rotation: 90, color: "gray" },
        { id: 3, position: { x: 27, y: 66 }, rotation: 270, color: "gray" },
        { id: 4, position: { x: 31.5, y: 72.5 }, rotation: 180, color: "gray" },

      ],
    },
    {
      id: "G",
      chairs: [
        { id: 1, position: { x: 31.5, y: 80 }, rotation: 0, color: "gray" },
        { id: 2, position: { x: 36.2, y: 87 }, rotation: 90, color: "gray" },
        { id: 3, position: { x: 27, y: 87 }, rotation: 270, color: "gray" },
        { id: 4, position: { x: 31.5, y: 93.5 }, rotation: 180, color: "gray" },

      ],
    },
    {
      id: "H",
      chairs: [
        { id: 1, position: { x: 63.6, y: 72 }, rotation: 90, color: "gray" },
        { id: 2, position: { x: 63.6, y: 78 }, rotation: 90, color: "gray" },
        { id: 3, position: { x: 63.6, y: 84 }, rotation: 90, color: "gray" },

      ],
    },
    {
      id: "I",
      chairs: [
        { id: 1, position: { x: 76, y: 59 }, rotation: 0, color: "gray" },
        { id: 2, position: { x: 80.7, y: 66 }, rotation: 90, color: "gray" },
        { id: 3, position: { x: 71.7, y: 66 }, rotation: 270, color: "gray" },
        { id: 4, position: { x: 76.5, y: 72.5 }, rotation: 180, color: "gray" },

      ],
    },
    {
      id: "J",
      chairs: [
        { id: 1, position: { x: 76, y: 80 }, rotation: 0, color: "gray" },
        { id: 2, position: { x: 80.7, y: 87 }, rotation: 90, color: "gray" },
        { id: 3, position: { x: 71.7, y: 87 }, rotation: 270, color: "gray" },
        { id: 4, position: { x: 76.5, y: 93.5 }, rotation: 180, color: "gray" },

      ],
    },
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