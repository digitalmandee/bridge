import React from "react";
import { Link, useParams } from "react-router-dom";
import TopNavbar from "@/components/topNavbar";
import Sidebar from "@/components/leftSideBar";
import { Box, Card, Typography, Grid } from "@mui/material";
import WidgetsIcon from "@mui/icons-material/Widgets";
import colors from "@/assets/styles/color";

const kitchenItems = [
	{
		id: 1,
		title: "Products and Services",
		count: 10,
		icon: <WidgetsIcon sx={{ fontSize: "60px" }} />,
		link: "/branch/products-and-services",
	},
];

const Settings = () => {
	const { branch } = useParams();

	return (
		<>
			<TopNavbar />
			<div className="main d-flex">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div className="container-fluid py-4">
						<Typography variant="h4" fontWeight="bold" mb={2}>
							Settings
						</Typography>
						<Grid container spacing={2}>
							{kitchenItems.map((item) => (
								<Grid item xs={12} sm={6} md={3} lg={4} key={item.id}>
									<Link to={"/" + branch + item.link} style={{ textDecoration: "none", color: "black" }}>
										<Card
											variant="outlined"
											sx={{
												borderRadius: 2,
												textAlign: "center",
												px: 2,
												py: 4,
												position: "relative",
												cursor: "pointer",
												transition: "0.3s",
												"&:hover": { boxShadow: 3 },
												color: "inherit",
											}}>
											<Box mt={1} mb={1}>
												{item.icon}
											</Box>
											<Typography variant="h6" fontWeight="bold">
												{item.title}
											</Typography>
										</Card>
									</Link>
								</Grid>
							))}
						</Grid>
					</div>
				</div>
			</div>
		</>
	);
};

export default Settings;
