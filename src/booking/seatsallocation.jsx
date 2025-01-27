import React, { useState } from 'react'
import TopNavbar from '../topNavbar/index'
import Sidebar from '../leftSideBar'
import "bootstrap/dist/css/bootstrap.min.css";
import ChairIcon from "@mui/icons-material/Chair";
import MoreVertIcon from "@mui/icons-material/MoreVert"; // Three-dot icon
import { Menu, MenuItem, IconButton, Box } from "@mui/material";

const SeatCard = ({ seatNumber, branchName, occupancy, status, location, floor }) => {
    const [anchorEl, setAnchorEl] = useState(null);
  
    // Handle opening the menu
    const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    // Handle closing the menu
    const handleMenuClose = () => {
      setAnchorEl(null);
    };
  
    return (
      <div className="col-md-3 mb-4">
        <div className="card" style={{ position: "relative" }}>
          {/* Three-dot Menu Button */}
          <IconButton
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
          </IconButton>
          <Menu
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
          </Menu>
  
          {/* Chair Icon Section */}
          <Box
            className="chair-container mb-2"
            sx={{
              textAlign: "center",
              marginTop: "40px", // Adjust to center vertically
            }}
          >
            <Box
              className="chair-icon"
              sx={{
                backgroundColor: "#0D2B4E",
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
            <div
              className="chair-label"
              style={{
                marginTop: "5px",
                fontSize: "14px",
                color: "#555",
              }}
            >
              R1-D4
            </div>
          </Box>
  
          <div
            className="card-body text-center"
            style={{
              borderTop: "2px dotted #D8D8D8",
            }}
          >
            <h6 className="card-title">{seatNumber}</h6>
            <p className="text-muted">{branchName}</p>
            <div className="row text-center">
              <div className="col-6">
                <h6>{occupancy}</h6>
                <p className="mb-0 text-muted">Occupancy</p>
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

    const seatData = [
        {
          seatNumber: "User Name",
          branchName: "Guldberg Branch Lahore",
          occupancy: 'Plan',
          status: "Duration",
          location: "Occupied",
          floor: "Floor",
        },
        {
          seatNumber: "User Name",
          branchName: "Guldberg Branch Lahore",
          occupancy: 'Plan',
          status: "Duration",
          location: "Occupied",
          floor: "Floor",
        },
        {
          seatNumber: "User Name",
          branchName: "Guldberg Branch Lahore",
          occupancy: 'Plan',
          status: "Duration",
          location: "Occupied",
          floor: "Floor",
        },
      ];


    return (
        <>
            <TopNavbar />
            <div className='main'>
                <div className='sideBarWrapper'>
                    <Sidebar />
                </div>
                <div className='content'>
                    <div style={{
                        display:'flex',
                        flexDirection:'column'
                    }}>
                        <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
                            <h3>Seats Allocation</h3>
                        </div>
                        <div className="row">
                            {seatData.map((seat, index) => (
                                <SeatCard
                                    key={index}
                                    seatNumber={seat.seatNumber}
                                    branchName={seat.branchName}
                                    occupancy={seat.occupancy}
                                    status={seat.status}
                                    location={seat.location}
                                    floor={seat.floor}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SeatsAllocation