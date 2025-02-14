import React, { useContext, useState } from "react";
import logo from "../../assets/logo.png";
import { IoIosMenu } from "react-icons/io";
import { FaRegBell } from "react-icons/fa6";
import SearchBar from "./searchBar";
import profile from "../../assets/profile.png";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import "./style.css";
import { Button } from "@mui/material";
import { AuthContext } from "../../contexts/AuthContext";
// import { Menu, MenuItem, Button } from "@mui/material";
// import { FaRegBell } from "react-icons/fa";
import { FileText, Building2, Building } from "lucide-react";

const TopNavbar = () => {
	const { user, logout } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpennotificationDrop, setisOpennotificationDrop] = useState(false);
  const openMyAcc = Boolean(anchorEl);
  const openNotifications = Boolean(isOpennotificationDrop);

	const handleOpenMyAccDr = (event) => {
		setAnchorEl(event.currentTarget);
	};

  const handleCloseMyAccDr = () => {
    setAnchorEl(null);
  };

  const handleOpennotificationsDr = () => {
    setisOpennotificationDrop(true)
  }

  const handleClosenotificationsDr = () => {
    setisOpennotificationDrop(false)
  }

  const notifications = [
    {
      icon: FileText,
      title: "Booking Confirmation",
      message: "Your booking for Desk #12 at Downtown Branch is confirmed for Jan 10, 2025, 9:00 AM",
      time: "2 min ago",
    },
    {
      icon: FileText,
      title: "Upcoming Booking Reminder",
      message: "Reminder: You have an upcoming booking for Meeting Room",
      time: "10 min ago",
    },
    {
      icon: Building2,
      title: "New Amenities Added",
      message: "*New* High-speed internet and ergonomic chairs are now available at Branch 1",
      time: "2 days ago",
    },
    {
      icon: Building,
      title: "Payment Reminder",
      message: "Payment overdue! Please complete payment for your monthly booking",
      time: "3 days ago",
    },
    {
      icon: Building,
      title: "Payment Reminder",
      message: "Payment overdue! Please complete payment for your monthly booking",
      time: "3 days ago",
    },
  ];

  return (
    <>
      <header className="d-flex align-items-center">
        <div className="container-fluid w-100">
          <div className="row d-flex align-items-center w-100">
            <div className="col-sm-2 part1">
              <img
                src={logo}
                style={{
                  width: "100px",
                  height: "50px",
                }}
              />
            </div>
            <div className="col-sm-3 d-flex align-items-center part2 pl-4">
              <Button className="square mr-3">
                <IoIosMenu />
              </Button>
              {/* <SearchBar /> */}
            </div>
            <div className="col-sm-7 d-flex align-items-center justify-content-end part-3">
              <div className="notifi position-relative">
                <Button className="square mr-3"
                  onClick={handleOpennotificationsDr}>
                  <FaRegBell />
                </Button>
                <Menu
                  anchorEl={isOpennotificationDrop}
                  className="notifications"
                  id="notifications"
                  open={openNotifications}
                  onClose={handleClosenotificationsDr}
                  onClick={handleClosenotificationsDr}
                  transformOrigin={{ horizontal: "left", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "top" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: "600", color: "#111827" }}>Notifications</h3>
                    <div style={{ backgroundColor: "#0A2156", padding: "0.5rem", borderRadius: "5px" }}>
                      <FaRegBell style={{ color: "white", fontSize: "16px" }} />
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div>
                    {notifications.map((notification, index) => (
                      <MenuItem key={index} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px" }}>
                        <notification.icon style={{ color: "#0A2156", width: "20px", height: "20px" }} />
                        <div style={{ flex: 1, padding: '0.2rem', maxWidth: '90%' }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: "500", fontSize: "14px", color: "#111827" }}>{notification.title}</span>
                            <span style={{ fontSize: "12px", color: "#6B7280" }}>{notification.time}</span>
                          </div>
                          <p style={{
                            fontSize: "13px",
                            color: "#4B5563",
                            marginTop: "5px",
                            marginBottom: "0",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            whiteSpace: "normal"
                          }}>{notification.message}</p>
                        </div>
                      </MenuItem>
                    ))}
                  </div>
                </Menu>
              </div>
              <div className="myAccWrapper">
                <Button className="myAcc d-flex align-items-center" onClick={handleOpenMyAccDr}>
                  <div className="userImg">
                    <span className="rounded-circle">
                      <img src={user.profile_image ? user.profile_image : profile} alt={user.name} />
                    </span>
                  </div>
                  <div className="userInfo">
                    <h4>{user.name}</h4>
                    <p className="mb-0">{user.email}</p>
                  </div>
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={openMyAcc}
                  onClose={handleCloseMyAccDr}
                  onClick={handleCloseMyAccDr}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
                  <MenuItem onClick={handleCloseMyAccDr}>
                    <ListItemIcon>
                      <PersonAdd fontSize="small" />
                    </ListItemIcon>
                    My Account
                  </MenuItem>
                  <MenuItem onClick={handleCloseMyAccDr}>
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
                  <MenuItem onClick={logout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default TopNavbar;
