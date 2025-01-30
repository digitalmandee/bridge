import React, { useContext, useState } from "react";
import TopNavbar from "../../components/topNavbar";
import Sidebar from "../../components/leftSideBar";
import Aseat from "../../assets/A-seat.png";
import Oseat from "../../assets/O-seat.png";
import datab from "../../assets/datab.png";
import { IoIosArrowDropright } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import GFloorPlan from "./floor/Gfloor/gfloor";
import FFloorPlan from "./floor/Ffloor/ffloor";
import colors from "../../assets/styles/color";

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { FloorPlanContext } from "../../contexts/floorplan.context";

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
  const { selectedChairs } = useContext(FloorPlanContext);

  const navigate = useNavigate();

  const handleNextClick = () => {
    navigate("/branch/booking"); // Navigate to the Booking screen
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState("G Floor"); // Default is Ground Floor

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleFloorSelection = (floor) => {
    console.log("Selected floor:", floor);
    setSelectedFloor(floor); // Update the selected floor
    setIsDropdownOpen(false); // Close the dropdown
  };

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
            }}
          >
            <h3 className="title">Floor Plan</h3>
            <button className="btn create-booking-btn" onClick={handleNextClick} disabled={selectedChairs.length === 0}>
              Next
              <span className="icon">
                <IoIosArrowDropright />
              </span>
            </button>
          </div>
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
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                marginBottom: "20px",
                gap: "3.5rem",
                // backgroundColor:'#000'
              }}
            >
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
                }}
              >
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
                }}
              >
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
                }}
              >
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
              }}
            >
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
                }}
              >
                <div>
                  <h6 style={{ color: "#888", marginBottom: "10px" }}>Available Seats</h6>
                  <h2 style={{ fontSize: "36px", color: "#000", margin: "0" }}>60</h2>
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
                  }}
                >
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
                }}
              >
                <div>
                  <h6 style={{ color: "#888", marginBottom: "10px" }}>Occupied Seats</h6>
                  <h2 style={{ fontSize: "36px", color: "#000", margin: "0" }}>45</h2>
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
                  }}
                >
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
                }}
              >
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
                  }}
                >
                  {selectedFloor} <span style={{ fontSize: "16px" }}>▼</span>
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
                    }}
                  >
                    <div
                      onClick={() => handleFloorSelection("G Floor")} // Handle ground floor selection
                      style={{
                        padding: "8px 10px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      G Floor
                    </div>
                    <div
                      onClick={() => handleFloorSelection("1st Floor")} // Handle first floor selection
                      style={{
                        padding: "8px 10px",
                        cursor: "pointer",
                      }}
                    >
                      1st Floor
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {selectedFloor === "G Floor" ? <GFloorPlan /> : <FFloorPlan />}
        </div>
      </div>
    </>
  );
};

export default Floorplan;
