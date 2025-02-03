import React, { useEffect, useState } from "react";
import TopNavbar from "../../components/topNavbar";
import Sidebar from "../../components/leftSideBar";
import "bootstrap/dist/css/bootstrap.min.css";
import ChairIcon from "@mui/icons-material/Chair";
import { Menu, MenuItem, IconButton, Box } from "@mui/material";
import colors from "../../assets/styles/color";
import axios from "axios";

const SeatCard = ({ seatNumber, userName, planName, status, location, floor, profile_image }) => {
  return (
    <div className="col-md-3 mb-4">
      <div className="card" style={{ position: "relative" }}>
        {/* Three-dot Menu Button */}
        {/* <IconButton
          onClick={handleMenuOpen}
          aria-label="menu"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 1,
          }}
        >
          <MoreVertIcon />
        </IconButton> */}
        {/* <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            style: {
              boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <MenuItem onClick={() => alert("Edit clicked!")}>Edit</MenuItem>
          <MenuItem onClick={() => alert("Delete clicked!")}>Delete</MenuItem>
        </Menu> */}

        {/* Chair Icon Section */}
        <Box
          className="chair-container mb-2"
          sx={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          {profile_image ? (
            <img src={import.meta.env.VITE_ASSET_API + profile_image} alt="image" style={{ width: "80px", height: "80px", borderRadius: "10px" }} />
          ) : (
            <Box
              className="chair-icon"
              sx={{
                backgroundColor: colors.primary,
                padding: "15px",
                borderRadius: "10px",
                display: "inline-block",
              }}
            >
              <ChairIcon
                sx={{
                  fontSize: 50,
                  color: "white",
                }}
              />
            </Box>
          )}
          <div
            className="chair-label"
            style={{
              marginTop: "5px",
              fontSize: "14px",
              color: "#555",
            }}
          >
            {seatNumber}
          </div>
        </Box>
        <div
          className="card-body text-center"
          style={{
            borderTop: "2px dotted #D8D8D8",
          }}
        >
          <h6 className="card-title">{userName}</h6>
          <div className="row text-center">
            <div className="col-6">
              <h6>{planName}</h6>
              <p className="mb-0 text-muted">Plan</p>
            </div>
            <div className="col-6">
              <h6>{status}</h6>
              <p className="mb-0 text-muted">Status</p>
            </div>
            <div className="col-6">
              <h6>{location}</h6>
              <p className="mb-0 text-muted">Location</p>
            </div>
            <div className="col-6">
              <h6>{floor}</h6>
              <p className="mb-0 text-muted">Floor</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SeatsAllocation = () => {
  const [seatData2, setSeatData2] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFloorPlanData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(import.meta.env.VITE_BASE_API + `seat-allocations`, { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}`, "Content-Type": "application/json" } });
        console.log(response.data.seats);

        if (response.data.success) {
          setSeatData2(response.data.seats);
        }
      } catch (error) {
        console.error("Error fetching floor plan data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFloorPlanData();
  }, []);

  return (
    <>
      <TopNavbar />
      <div className="main">
        <div className="sideBarWrapper">
          <Sidebar />
        </div>
        <div className="content">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
              <h3>Seats Allocation</h3>
            </div>
            <div className="row">
              {seatData2.length > 0 ? (
                seatData2.map((seat) =>
                  seat.chairs.map((chair) => (
                    <SeatCard
                      key={chair.id}
                      seatNumber={`${chair.room.name}-${chair.table_name}${chair.id}`} // Use table_name for prefixing
                      userName={seat.name}
                      planName={seat.plan.name}
                      status={"Booked"}
                      location={seat.branch.location}
                      floor={seat.floor.name}
                      profile_image={seat.user.profile_image}
                    />
                  ))
                )
              ) : (
                <p>No seats found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeatsAllocation;
