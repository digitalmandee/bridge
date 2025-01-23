import React, { useEffect, useState } from "react";
import TopNavbar from "../topNavbar";
import Sidebar from "../leftSideBar";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { Settings } from "@mui/icons-material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const BookingPlans = () => {
  const [bookingPlans, setBookingPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenMyAccDr = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMyAccDr = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchBookingPlanData = async () => {
      setIsLoading(true);
      try {
        const branchId = 1;
        const response = await axios.get(`${process.env.REACT_APP_BASE_API}booking-plans?branch_id=${branchId}`);

        if (response.data && Array.isArray(response.data.data)) {
          setBookingPlans(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching booking plan data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingPlanData();
  }, []);

  return (
    <>
      <TopNavbar />
      <div className="main">
        <div className="sidebarWrapper">
          <Sidebar />
        </div>
        <div className="content">
          <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin py-4">
            <div>
              <h3>Price Plan</h3>
            </div>
            <Link
              to={"/booking/plans/create"}
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                backgroundColor: "#f5b500",
                color: "#fff",
                border: "none",
                fontSize: "16px",
                cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Add Plan
            </Link>
          </div>
          <div className="row card col-md-12">
            <table className="table table-responsive">
              <thead>
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Fees</th>
                  <th className="p-3 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? "Loading..."
                  : bookingPlans.map((plan, index) => (
                      <tr key={index}>
                        <td className="px-3">{plan.name}</td>
                        <td className="px-3">{plan.type}</td>
                        <td className="px-3">Rs. {plan.price}</td>
                        <td className="d-flex justify-content-end">
                          <Button className="myAcc d-flex align-items-center" onClick={handleOpenMyAccDr}>
                            <div className="userInfo">
                                Actions
                            </div>
                          </Button>
                          <Menu
                            anchorEl={anchorEl}
                            open={open}
                            id="account-menu"
                            onClose={handleCloseMyAccDr}
                            onClick={handleCloseMyAccDr}
                            transformOrigin={{
                              horizontal: "right",
                              vertical: "top",
                            }}
                            anchorOrigin={{
                              horizontal: "right",
                              vertical: "bottom",
                            }}
                          >
                            <MenuItem onClick={handleCloseMyAccDr}>
                              <ListItemIcon>
                                <EditIcon fontSize="small" />
                              </ListItemIcon>
                              Edit
                            </MenuItem>
                            <MenuItem onClick={handleCloseMyAccDr}>
                              <ListItemIcon>
                                <DeleteIcon fontSize="small" />
                              </ListItemIcon>
                              Delete
                            </MenuItem>
                          </Menu>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingPlans;
