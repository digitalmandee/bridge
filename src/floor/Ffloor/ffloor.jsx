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
        //Table1 (12 chairs on left side)
        { id: 1, position: { x: 20, y: 9.6 }, rotation: 0, color: "gray" },
        { id: 2, position: { x: 24.5, y: 9.6 }, rotation: 0, color: "gray" },
        { id: 3, position: { x: 29, y: 9.6 }, rotation: 0, color: "gray" },

        { id: 4, position: { x: 16, y: 11 }, rotation: 270, color: "gray" },
        { id: 5, position: { x: 16, y: 12.9 }, rotation: 270, color: "gray" },
        { id: 6, position: { x: 16, y: 14.8 }, rotation: 270, color: "gray" },
        
        { id: 7, position: { x: 20, y: 16.2 }, rotation: 180, color: "gray" },
        { id: 8, position: { x: 24.5, y: 16.2 }, rotation: 180, color: "gray" },
        { id: 9, position: { x: 29, y: 16.2 }, rotation: 180, color: "gray" },

        { id: 10, position: { x: 32.5, y: 11 }, rotation: 90, color: "gray" },
        { id: 11, position: { x: 32.5 , y: 12.9 }, rotation: 90, color: "gray" },
        { id: 12, position: { x: 32.5, y: 14.8 }, rotation: 90, color: "gray" },

//Table 2 (2 chairs only)
        { id: 13, position: { x: 41, y: 11.3 }, rotation: 0, color: "gray" },
        { id: 14, position: { x: 41, y: 15 }, rotation: 180, color: "gray" },

        //Table 3 (top right side)
        { id: 15, position: { x: 68, y: 5.2 }, rotation: 180, color: "gray" },
        { id: 16, position: { x: 72, y: 5.2}, rotation: 180, color: "gray" },
        { id: 17, position: { x: 76, y: 5.2}, rotation: 180, color: "gray" },

//Table 4 (12 chairs on right side)
        { id: 18, position: { x: 57.8, y: 10.5}, rotation: 270, color: "gray" },
        { id: 19, position: { x: 57.8, y: 12.2 }, rotation: 270, color: "gray" },
        { id: 20, position: { x: 57.8, y: 14 }, rotation: 270, color: "gray" },

        { id: 21, position: { x: 62, y: 15.4 }, rotation: 180, color: "gray" },
        { id: 22, position: { x: 66.5, y: 15.4}, rotation: 180, color: "gray" },
        { id: 23, position: { x: 71, y: 15.4}, rotation: 180, color: "gray" },

        { id: 24, position: { x: 75, y: 10.5 }, rotation: 90, color: "gray" },
        { id: 25, position: { x: 75, y: 12.2 }, rotation: 90, color: "gray" },
        { id: 26, position: { x: 75, y: 14 }, rotation: 90, color: "gray" },

        { id: 27, position: { x: 62, y: 9 }, rotation: 0, color: "gray" },
        { id: 28, position: { x: 66.5, y: 9}, rotation: 0, color: "gray" },
        { id: 29, position: { x: 71, y: 9}, rotation: 0, color: "gray" },

        //Table 5 (right side)
        { id: 30, position: { x: 59, y: 22}, rotation: 290, color: "gray" },
        { id: 31, position: { x: 64.5, y: 25.7 }, rotation: 180, color: "gray" },
        { id: 32, position: { x: 73.5, y: 25.5 }, rotation: 120, color: "gray" },
        { id: 33, position: { x: 69.8, y: 22 }, rotation: 50, color: "gray" },
        { id: 34, position: { x: 64.3, y: 19.5}, rotation: 0, color: "gray" },

        //Table 6 (left side)
        { id: 35, position: { x: 15.3, y: 21}, rotation: -60, color: "gray" },
        { id: 36, position: { x: 24.5, y: 20.5}, rotation: 0, color: "gray" },
        { id: 37, position: { x: 18.5, y: 24}, rotation: 230, color: "gray" },
        { id: 38, position: { x: 30, y: 24}, rotation: 120, color: "gray" },

        //Table 7 (left side)
        { id: 39, position: { x: 22, y: 29.5}, rotation: -40, color: "gray" },
        { id: 40, position: { x: 31, y: 31.5}, rotation: 100, color: "gray" },
        { id: 41, position: { x: 21.5, y: 33.5}, rotation: 210, color: "gray" },

//Table 8 (left side)
        { id: 42, position: { x: 28.5, y: 39}, rotation: 90, color: "gray" },
        { id: 43, position: { x: 28.5, y: 41.5}, rotation: 90, color: "gray" },
        { id: 44, position: { x: 18, y: 39}, rotation: 270, color: "gray" },
        { id: 45, position: { x: 18, y: 41.5}, rotation: 270, color: "gray" },

        //Table 9 (left side)
        { id: 46, position: { x: 18, y: 49}, rotation: 180, color: "gray" },
        { id: 47, position: { x: 25, y: 49}, rotation: 180, color: "gray" },
        { id: 48, position: { x: 18, y: 45}, rotation: 0, color: "gray" },
        { id: 49, position: { x: 25, y: 45}, rotation: 0, color: "gray" },

        //Table 10 (right side bar)
        { id: 50, position: { x: 54.5, y: 43}, rotation: 90, color: "gray" },
        { id: 51, position: { x: 54.5, y: 45}, rotation: 90, color: "gray" },
        { id: 52, position: { x: 54.5, y: 47}, rotation: 90, color: "gray" },

        //Table 11 (right side small office 1)
        { id: 53, position: { x: 67, y: 42.5}, rotation: 180, color: "gray" },
        { id: 54, position: { x: 73, y: 42.5}, rotation: 180, color: "gray" },
        { id: 55, position: { x: 77.5, y: 44}, rotation: 270, color: "gray" },
        { id: 56, position: { x: 77.5, y: 46}, rotation: 270, color: "gray" },

        //Table 12 (right side)
        { id: 57, position: { x: 69, y: 49}, rotation: 0, color: "gray" },
        { id: 58, position: { x: 76, y: 49}, rotation: 0, color: "gray" },
        { id: 59, position: { x: 69, y: 53}, rotation: 180, color: "gray" },
        { id: 60, position: { x: 76, y: 53}, rotation: 180, color: "gray" },

        //Table 13 (small office 2)
        { id: 61, position: { x: 73, y: 59}, rotation: 0, color: "gray" },
        { id: 62, position: { x: 67, y: 59}, rotation: 0, color: "gray" },
        { id: 63, position: { x: 77.5, y: 56}, rotation: 270, color: "gray" },
        { id: 64, position: { x: 77.5, y: 58}, rotation: 270, color: "gray" },

        // { id: 65, position: { x: 69, y: 53}, rotation: 180, color: "gray" },
        // { id: 66, position: { x: 77, y: 53}, rotation: 180, color: "gray" },
        //Table 11
        // { id: 67, position: { x: 73, y: 59}, rotation: 0, color: "gray" },
        // { id: 68, position: { x: 67, y: 59}, rotation: 0, color: "gray" },
        // { id: 69, position: { x: 77.5, y: 56}, rotation: 270, color: "gray" },
        // { id: 70, position: { x: 77.5, y: 58}, rotation: 270, color: "gray" },
      ],
    },
    {
      id: "Cabin",
      chairs: [
        { id: 1, position: { x: 19, y: 4 }, rotation: 0, color: "gray" },
        { id: 2, position: { x: 29, y: 4 }, rotation: 0, color: "gray" },
        { id: 3, position: { x: 38, y: 4 }, rotation: 0, color: "gray" },
        { id: 4, position: { x: 47, y: 5 }, rotation: 90, color: "gray" },
        { id: 5, position: { x: 47, y: 9 }, rotation: 90, color: "gray" },
        { id: 6, position: { x: 47, y: 12 }, rotation: 90, color: "gray" },
        { id: 7, position: { x: 47, y: 15 }, rotation: 90, color: "gray" },
        { id: 8, position: { x: 69, y: 32.3 }, rotation: 0, color: "gray" },
        { id: 9, position: { x: 62, y: 32.3 }, rotation: 0, color: "gray" },
        { id: 10, position: { x: 53, y: 32.3 }, rotation: 0, color: "gray" },
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
