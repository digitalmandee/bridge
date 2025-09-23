import React, { useContext, useEffect, useState } from "react";
import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";
import axios from "axios";
import NewInvestorEntry from "./NewEntry";
import TopNavbar from "@/components/superadmin/topNavbar";
import Sidebar from "@/components/superadmin/leftSideBar";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosInstance from "@/utils/axiosInstance";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "@/contexts/SuperContext";
import colors from "@/assets/styles/color";

const InvestorDashboard = () => {
	const { branch } = useParams();

	const { userRole } = useContext(AuthContext);

	const navigate = useNavigate();

	const [stats, setStats] = useState(null);
	const [isInvestor, setIsInvestor] = useState(false);
	const [showForm, setShowForm] = useState(false);

	const fetchStats = async () => {
		try {
			const res = await axiosInstance.get("investor/investor-dashboard");
			if (res.data.message === "Not an investor") {
				setIsInvestor(false);
			} else {
				setIsInvestor(true);
				setStats(res.data);
			}
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchStats();
	}, []);

	if (!stats) return <p>Loading...</p>;

	const barData = {
		labels: stats.months,
		datasets: [
			{ label: "Investment", data: stats.investment, backgroundColor: "#FFC107" },
			{ label: "Expenses", data: stats.expenses, backgroundColor: "#FF5722" },
			{ label: "Profit", data: stats.profit, backgroundColor: "#03A9F4" },
		],
	};

	const pieData = {
		labels: ["Investor Share", "Equity Share"],
		datasets: [
			{
				data: [stats.totalShares, stats.equityShare],
				backgroundColor: ["#FFC107", "#03A9F4"],
			},
		],
	};

	return (
		<>
			<TopNavbar />
			<div className="main d-flex">
				<div className="sideBarWrapper">
					<Sidebar />
				</div>
				<div className="content">
					<div className="container-fluid p-4">
						{/* {!showForm && ( */}
						<Grid container justifyContent="space-between" alignItems="center">
							<Typography variant="h5">Investor Dashboard</Typography>
							{userRole === "superadmin" && (
								<Button onClick={() => navigate("/" + branch + "/branch/investor/new-entry")} variant="contained" sx={{ bgcolor: colors.primary, "&:hover": { bgcolor: colors.primary } }}>
									{showForm ? "Close Form" : "New Investment"}
								</Button>
							)}
						</Grid>
						{/* )} */}

						{!showForm && (
							<>
								<Grid container spacing={2} className="mt-3">
									<Grid item xs={12} sm={6} md={3}>
										<Card>
											<CardContent>
												<Typography>Total Investment</Typography>
												<Typography>{stats.totalInvestment} PKR</Typography>
											</CardContent>
										</Card>
									</Grid>
									<Grid item xs={12} sm={6} md={3}>
										<Card>
											<CardContent>
												<Typography>Total Profit</Typography>
												<Typography>{stats.totalProfit} PKR</Typography>
											</CardContent>
										</Card>
									</Grid>
									<Grid item xs={12} sm={6} md={3}>
										<Card>
											<CardContent>
												<Typography>Branch Income</Typography>
												<Typography>{stats.branchIncome} PKR</Typography>
											</CardContent>
										</Card>
									</Grid>
									<Grid item xs={12} sm={6} md={3}>
										<Card>
											<CardContent>
												<Typography>Total Shares</Typography>
												<Typography>{stats.totalShares}%</Typography>
											</CardContent>
										</Card>
									</Grid>
								</Grid>

								<Grid container spacing={2} className="mt-3">
									<Grid item xs={12} md={8}>
										<Card>
											<CardContent>
												<Typography>Monthly Revenue</Typography>
												<Bar data={barData} />
											</CardContent>
										</Card>
									</Grid>
									<Grid item xs={12} md={4}>
										<Card>
											<CardContent>
												<Typography>Shares Distribution</Typography>
												<Pie data={pieData} />
											</CardContent>
										</Card>
									</Grid>
								</Grid>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default InvestorDashboard;
