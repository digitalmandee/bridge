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

const TopNavbar = () => {
	const { user, logout } = useContext(AuthContext);

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleOpenMyAccDr = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleCloseMyAccDr = () => {
		setAnchorEl(null);
	};

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
							<SearchBar />
						</div>
						<div className="col-sm-7 d-flex align-items-center justify-content-end part-3">
							<div className="notifi">
								<Button className="square mr-3">
									<FaRegBell />
								</Button>
							</div>
							<div className="myAccWrapper">
								<Button className="myAcc d-flex align-items-center" onClick={handleOpenMyAccDr}>
									<div className="userImg">
										<span className="rounded-circle">
											<img src={user.profile_image ? import.meta.env.VITE_ASSET_API + user.profile_image : profile} alt={user.name} />
										</span>
									</div>
									<div className="userInfo">
										<h4>{user.name}</h4>
										<p className="mb-0">{user.email}</p>
									</div>
								</Button>
								<Menu anchorEl={anchorEl} id="account-menu" open={open} onClose={handleCloseMyAccDr} onClick={handleCloseMyAccDr} transformOrigin={{ horizontal: "right", vertical: "top" }} anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
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
