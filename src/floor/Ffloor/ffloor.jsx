import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { Chair } from "@mui/icons-material";

const FFloorPlan = () => {
  console.log("Rendering First Floor");
  const floorRef = useRef(null);
  
  const [tables, setTables] = useState([
    {
      id: "Chair",
      chairs: [
        //Table1
        { id: 1, position: { x: 18, y: 9.2 }, rotation: -45, color: "gray" },
        { id: 2, position: { x: 23.5, y: 12 }, rotation: 135, color: "gray" },
        { id: 3, position: { x: 15, y: 12 }, rotation: 225, color: "gray" },
       //Table2
        { id: 4, position: { x: 36, y: 9.1 }, rotation: -45, color: "gray" },
        { id: 5, position: { x: 42, y: 11.5 }, rotation: 135, color: "gray" },
        { id: 6, position: { x: 32.7, y: 12 }, rotation: 225, color: "gray" },
        //Table3
        { id: 7, position: { x: 15.5, y: 14.5 }, rotation: -45, color: "gray" },
        { id: 8, position: { x: 18, y: 17.4 }, rotation: 225, color: "gray" },
        { id: 9, position: { x: 24, y: 14.5 }, rotation: 45, color: "gray" },
//Table4
        { id: 10, position: { x: 33, y: 14.5 }, rotation: -45, color: "gray" },
        { id: 11, position: { x: 36 , y: 17 }, rotation: 225, color: "gray" },
        { id: 12, position: { x: 41, y: 14.5 }, rotation: 45, color: "gray" },
//Table 5
        { id: 13, position: { x: 65.5, y: 9.6 }, rotation: 0, color: "gray" },
        { id: 14, position: { x: 70.5, y: 9.6 }, rotation: 0, color: "gray" },
        { id: 15, position: { x: 75.5, y: 9.6 }, rotation: 0, color: "gray" },

        { id: 16, position: { x: 61, y: 11.2}, rotation: 270, color: "gray" },
        { id: 17, position: { x: 61, y: 13}, rotation: 270, color: "gray" },
        { id: 18, position: { x: 61, y: 14.8}, rotation: 270, color: "gray" },

        { id: 19, position: { x: 65.5, y: 16.8 }, rotation: 180, color: "gray" },
        { id: 20, position: { x: 70.5, y: 16.8 }, rotation: 180, color: "gray" },
        { id: 21, position: { x: 75.5, y: 16.8 }, rotation: 180, color: "gray" },

        { id: 22, position: { x: 79, y: 11.2}, rotation: 90, color: "gray" },
        { id: 23, position: { x: 79, y: 13}, rotation: 90, color: "gray" },
        { id: 24, position: { x: 79, y: 14.8 }, rotation: 90, color: "gray" },
//Table 6
        { id: 25, position: { x: 65.5, y: 19.6 }, rotation: 0, color: "gray" },
        { id: 26, position: { x: 70.5, y: 19.6 }, rotation: 0, color: "gray" },
        { id: 27, position: { x: 75.5, y: 19.6 }, rotation: 0, color: "gray" },

        { id: 28, position: { x: 61, y: 21.2}, rotation: 270, color: "gray" },
        { id: 29, position: { x: 61, y: 23}, rotation: 270, color: "gray" },
        { id: 30, position: { x: 61, y: 24.8}, rotation: 270, color: "gray" },

        { id: 31, position: { x: 65.5, y: 26.8 }, rotation: 180, color: "gray" },
        { id: 32, position: { x: 70.5, y: 26.8 }, rotation: 180, color: "gray" },
        { id: 33, position: { x: 75.5, y: 26.8 }, rotation: 180, color: "gray" },

        { id: 34, position: { x: 79, y: 21.2}, rotation: 90, color: "gray" },
        { id: 35, position: { x: 79, y: 23}, rotation: 90, color: "gray" },
        { id: 36, position: { x: 79, y: 24.8}, rotation: 90, color: "gray" },
//Table 7
        { id: 37, position: { x: 18, y: 21}, rotation: 0, color: "gray" },
        { id: 38, position: { x: 26, y: 21}, rotation: 0, color: "gray" },
        { id: 39, position: { x: 18, y: 25.5}, rotation: 180, color: "gray" },
        { id: 40, position: { x: 26, y: 25.5}, rotation: 180, color: "gray" },
        //Table 8 
        { id: 41, position: { x: 25.5, y: 33}, rotation: 0, color: "gray" },
        { id: 42, position: { x: 32.5, y: 35}, rotation: 90, color: "gray" },
        { id: 43, position: { x: 32.5, y: 37.2}, rotation: 90, color: "gray" },
        { id: 44, position: { x: 32.5, y: 39.5}, rotation: 90, color: "gray" },
        { id: 45, position: { x: 32.5, y: 41.5}, rotation: 90, color: "gray" },
        { id: 46, position: { x: 32.5, y: 45}, rotation: 90, color: "gray" },
        { id: 47, position: { x: 32.5, y: 47.5}, rotation: 90, color: "gray" },
        { id: 48, position: { x: 32.5, y: 50}, rotation: 90, color: "gray" },
        { id: 49, position: { x: 32.5, y: 52.5}, rotation: 90, color: "gray" },
        { id: 50, position: { x: 25.5, y: 54.3}, rotation: 180, color: "gray" },
        { id: 51, position: { x: 17.5, y: 52.5}, rotation: 270, color: "gray" },
        { id: 52, position: { x: 17.5, y: 50}, rotation: 270, color: "gray" },
        { id: 53, position: { x: 17.5, y: 47.5}, rotation: 270, color: "gray" },
        { id: 54, position: { x: 17.5, y: 45}, rotation: 270, color: "gray" },
        { id: 55, position: { x: 17.5, y: 41.5}, rotation: 270, color: "gray" },
        { id: 56, position: { x: 17.5, y: 39.5}, rotation: 270, color: "gray" },
        { id: 57, position: { x: 17.5, y: 37.2}, rotation: 270, color: "gray" },
        { id: 58, position: { x: 17.5, y: 35}, rotation: 270, color: "gray" },
        //Table 9
        { id: 59, position: { x: 73, y: 46.2}, rotation: 180, color: "gray" },
        { id: 60, position: { x: 79, y: 46.2}, rotation: 180, color: "gray" },
        { id: 61, position: { x: 83.2, y: 48}, rotation: 270, color: "gray" },
        { id: 62, position: { x: 83.2, y: 50}, rotation: 270, color: "gray" },

        //Table 10
        { id: 63, position: { x: 69, y: 53.2}, rotation: 0, color: "gray" },
        { id: 64, position: { x: 77, y: 53.2}, rotation: 0, color: "gray" },
        { id: 65, position: { x: 69, y: 57.5}, rotation: 180, color: "gray" },
        { id: 66, position: { x: 77, y: 57.5}, rotation: 180, color: "gray" },
        //Table 11
        { id: 67, position: { x: 81, y: 64.9}, rotation: 0, color: "gray" },
        { id: 68, position: { x: 74, y: 64.9}, rotation: 0, color: "gray" },
        { id: 69, position: { x: 83.5, y: 61}, rotation: 270, color: "gray" },
        { id: 70, position: { x: 83.5, y: 63}, rotation: 270, color: "gray" },
      ],
    },
    {
      id: "Cabin",
      chairs: [
        { id: 1, position: { x: 17, y: 4 }, rotation: 200, color: "gray" },
        { id: 2, position: { x: 30, y: 4 }, rotation: 160, color: "gray" },
        { id: 3, position: { x: 39, y: 4 }, rotation: 160, color: "gray" },
        { id: 4, position: { x: 52, y: 4 }, rotation: 160, color: "gray" },
        { id: 5, position: { x: 61, y: 4 }, rotation: 160, color: "gray" },
        { id: 6, position: { x: 70, y: 4 }, rotation: 160, color: "gray" },
        { id: 7, position: { x: 79, y: 4 }, rotation: 160, color: "gray" },
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
        <div className="floor1" ref={floorRef}>
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
  )
}

export default FFloorPlan
