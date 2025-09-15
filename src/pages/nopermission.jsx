import React, { useContext } from "react";
import { Button, Typography } from "@mui/material";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { useNavigate } from "react-router-dom";
import colors from "../assets/styles/color";
import { AuthContext } from "@/contexts/AuthContext";
const NoPermission = () => {
	const navigate = useNavigate();

	return (
		<>
			<TopNavbar />
			<div className="main">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content d-flex flex-column align-items-center justify-content-center" style={{ height: "80vh" }}>
					<Typography variant="h4" fontWeight="bold">
						Access Denied
					</Typography>
					<Typography variant="body1" color="textSecondary" className="mt-2">
						You don’t have permission to access this page.
					</Typography>
					{/* <Button variant="contained" sx={{ bgcolor: colors.primary, "&:hover": { bgcolor: colors.primary } }} className="mt-3" onClick={() => navigate("/")}>
						Go Back
					</Button> */}
				</div>
			</div>
		</>
	);
};

export default NoPermission;
