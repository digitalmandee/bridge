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
        { id: 1, position: { x: 16, y: 8 }, rotation: 270, color: "gray" },
        { id: 2, position: { x: 27, y: 11 }, rotation: 90, color: "gray" },
        { id: 3, position: { x: 16, y: 11 }, rotation: 270, color: "gray" },
        { id: 4, position: { x: 27, y: 8 }, rotation: 90, color: "gray" },
//Table 2
        { id: 5, position: { x: 39, y: 8 }, rotation: 270, color: "gray" },
        { id: 6, position: { x: 39, y: 10 }, rotation: 270, color: "gray" },
        { id: 7, position: { x: 39, y: 12 }, rotation: 270, color: "gray" },
        { id: 8, position: { x: 39, y: 14 }, rotation: 270, color: "gray" },
//Table 3
        { id: 9, position: { x: 16, y: 14 }, rotation: 270, color: "gray" },
        { id: 10, position: { x: 16, y: 17 }, rotation: 270, color: "gray" },
        { id: 11, position: { x: 26, y: 17 }, rotation: 90, color: "gray" },
        { id: 12, position: { x: 26, y: 14 }, rotation: 90, color: "gray" },

        //DED Chairs
        { id: 13, position: { x: 68, y: 4.2 }, rotation: 180, color: "gray" },
        { id: 14, position: { x: 72.2, y: 4.2 }, rotation: 180, color: "gray" },
        { id: 15, position: { x: 76.5, y: 4.2 }, rotation: 180, color: "gray" },
//Table 4 (12 chairs)
        { id: 16, position: { x: 62, y: 8 }, rotation: 0, color: "gray" },
        { id: 17, position: { x: 66.5, y: 8 }, rotation: 0, color: "gray" },
        { id: 18, position: { x: 71, y: 8 }, rotation: 0, color: "gray" },

        { id: 19, position: { x: 57.8, y: 9.5 }, rotation: 270, color: "gray" },
        { id: 20, position: { x: 57.8, y: 11.2 }, rotation: 270, color: "gray" },
        { id: 21, position: { x: 57.8, y: 13 }, rotation: 270, color: "gray" },

        { id: 22, position: { x: 75, y: 9.5 }, rotation: 90, color: "gray" },
        { id: 23, position: { x: 75, y: 11.3 }, rotation: 90, color: "gray" },
        { id: 24, position: { x: 75, y: 13 }, rotation: 90, color: "gray" },
        
        { id: 25, position: { x: 62, y: 14.8 }, rotation: 180, color: "gray" },
        { id: 26, position: { x: 66.5, y: 14.8 }, rotation: 180, color: "gray" },
        { id: 27, position: { x: 71, y: 14.8 }, rotation: 180, color: "gray" },
//Table 7
        { id: 28, position: { x: 15, y: 20.2 }, rotation: -56, color: "gray" },
        { id: 29, position: { x: 18.5, y: 23.2 }, rotation: 225, color: "gray" },
        { id: 30, position: { x: 30, y: 23.2 }, rotation: 135, color: "gray" },
        { id: 31, position: { x: 24, y: 20 }, rotation: 0, color: "gray" },

        //Executive office chair
        { id: 32, position: { x: 25, y: 27 }, rotation: 0, color: "gray" },
        //Table 8 (1 executive)
        { id: 33, position: { x: 29, y: 38.5 }, rotation: 90, color: "gray" },
        { id: 34, position: { x: 17.5, y: 38.5 }, rotation: 270, color: "gray" },
        { id: 35, position: { x: 17.5, y: 41 }, rotation: 270, color: "gray" },
        { id: 36, position: { x: 29, y: 41 }, rotation: 90, color: "gray" },
//Table 9 (1 executive)
        { id: 37, position: { x: 24, y: 44.5 }, rotation: 0, color: "gray" },
        { id: 38, position: { x: 17, y: 48.5 }, rotation: 180, color: "gray" },
        { id: 39, position: { x: 24, y: 48.5 }, rotation: 180, color: "gray" },
        { id: 40, position: { x: 17, y: 44.5 }, rotation: 0, color: "gray" },
        //Table 10 (12 chairs)
        { id: 41, position: { x: 62, y: 18.5 }, rotation: 0, color: "gray" },
        { id: 42, position: { x: 66.5, y: 18.5 }, rotation: 0, color: "gray" },
        { id: 43, position: { x: 71, y: 18.5 }, rotation: 0, color: "gray" },

        { id: 44, position: { x: 57.8, y: 20 }, rotation: 270, color: "gray" },
        { id: 45, position: { x: 57.8, y: 21.8 }, rotation: 270, color: "gray" },
        { id: 46, position: { x: 57.8, y: 23.6 }, rotation: 270, color: "gray" },

        { id: 47, position: { x: 75, y: 20 }, rotation: 90, color: "gray" },
        { id: 48, position: { x: 75, y: 21.8 }, rotation: 90, color: "gray" },
        { id: 49, position: { x: 75, y: 23.6 }, rotation: 90, color: "gray" },

        { id: 50, position: { x: 62, y: 25 }, rotation: 180, color: "gray" },
        { id: 51, position: { x: 66.5, y: 25 }, rotation: 180, color: "gray" },
        { id: 52, position: { x: 71, y: 25 }, rotation: 180, color: "gray" },

        //Table11 DED
        { id: 53, position: { x: 54.5, y: 42.2 }, rotation: 90, color: "gray" },
        { id: 54, position: { x: 54.5, y: 44 }, rotation: 90, color: "gray" },
        { id: 55, position: { x: 54.5, y: 46 }, rotation: 90, color: "gray" },
        { id: 56, position: { x: 54.5, y: 48 }, rotation: 90, color: "gray" },

//Table 12 small office 1
        { id: 57, position: { x: 67, y: 43 }, rotation: 180, color: "gray" },
        { id: 58, position: { x: 72, y: 43 }, rotation: 180, color: "gray" },
        { id: 59, position: { x: 74.5, y: 44.2 }, rotation: 270, color: "gray" },
        { id: 60, position: { x: 74.5, y: 45.9 }, rotation: 270, color: "gray" },

//Table 13 
        { id: 61, position: { x: 69, y: 48.5 }, rotation: 0, color: "gray" },
        { id: 62, position: { x: 75, y: 48.5 }, rotation: 0, color: "gray" },
        { id: 63, position: { x: 69, y: 52.7 }, rotation: 180, color: "gray" },
        { id: 64, position: { x: 75, y: 52.7 }, rotation: 180, color: "gray" },

        //Table 14 small office 2
        { id: 65, position: { x: 73.5, y: 55 }, rotation: 270, color: "gray" },
        { id: 66, position: { x: 73.5, y: 57 }, rotation: 270, color: "gray" },
        { id: 67, position: { x: 67, y: 58.6 }, rotation: 0, color: "gray" },
        { id: 68, position: { x: 72, y: 58.6 }, rotation: 0, color: "gray" },
      ],
    },
    {
      id: "Cabin",
      chairs: [
        { id: 1, position: { x: 15, y: 4 }, rotation: 180, color: "gray" },
        // { id: 1, position: { x: 20, y: 3 }, rotation: 160, color: "gray" },
        { id: 2, position: { x: 23, y: 4 }, rotation: 180, color: "gray" },
        { id: 3, position: { x: 31, y: 4 }, rotation: 180, color: "gray" },
        { id: 4, position: { x: 40, y: 4 }, rotation: 180, color: "gray" },
        { id: 5, position: { x: 50, y: 3.5 }, rotation: 180, color: "gray" },
        { id: 6, position: { x: 46.5, y: 8 }, rotation: 90, color: "gray" },
        { id: 7, position: { x: 46.5, y: 11 }, rotation: 90, color: "gray" },
        { id: 8, position: { x: 47, y: 14.5 }, rotation: 90, color: "gray" },
        { id: 9, position: { x: 69.5, y: 31.5 }, rotation: 0, color: "gray" },
        { id: 10, position: { x: 62, y: 31.5 }, rotation: 0, color: "gray" },
        { id: 11, position: { x: 54, y: 31.5 }, rotation: 0, color: "gray" },
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